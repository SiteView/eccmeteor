(function svlog_NameSpace() { //简易的名空间机制，避免全局变量污染

//开发阶段的开关，是否启动本程序的  “自动增量导入log到mongodb” 的功能 
var can_run= false;


var mongodb;
if (typeof(Meteor) !== 'undefined' && Meteor.isServer){
	mongodb = __meteor_bootstrap__.require('mongodb');  
}else{	
	mongodb = require('mongodb');  
}

var server = new mongodb.Server("127.0.0.1", 3002, {});
var db= new mongodb.Db('meteor', server, {w:1});

//调试开关，0:任何调试信息不显示，1：一般信息，2：详细信息
var debug=2;
//重复运行的秒间隔
var repeat_time= 30;

//GetTreeData取得的原始数据
var forest= Array();
//处理后的监测器数据
var monitors= Array();//process.sv_object().fmap();
//监测器信息
var monitorinfo= Array();
//用于更新的监测器id
var ids= Array();
//运行计次
var run_count= 1;
//正在更新吗
var is_updating= false;
//调试信息，需要导入的监测器数量
var trans= Array();
//缓存的 mongodb 中每条监测器的最新时间
var cache_items= Array();
//可否使用缓存
var use_cache_items= false;


/**
 * 格式化 Date 为时间字符串<br/>
 * dateFormat (new Date (), "%Y-%m-%d %H:%M:%S", false);  返回 2012-05-18 05:37:21 <br/>
 * 非法 date 则返回 NaN-aN-aN aN:aN:aN
 */
function dateFormat(date, fstr, utc) {
	fstr = arguments[2]?arguments[2]:"%Y-%m-%d %H:%M:%S";
	utc = arguments[3]?arguments[3]:false;
	utc = utc ? 'getUTC' : 'get';
	return fstr.replace(/%[YmdHMS]/g, function(m) {
		switch (m) {
		case '%Y':
			return date[utc + 'FullYear'](); // no leading zeros required
		case '%m':
			m = 1 + date[utc + 'Month']();
			break;
		case '%d':
			m = date[utc + 'Date']();
			break;
		case '%H':
			m = date[utc + 'Hours']();
			break;
		case '%M':
			m = date[utc + 'Minutes']();
			break;
		case '%S':
			m = date[utc + 'Seconds']();
			break;
		default:
			return m.slice(1); // unknown code, remove %
		}
		// add leading zero if required
		return ('0' + m).slice(-2);
	});
}

/**
 * 是否 str1 的时间（距1970年的秒数）更大<br/>
 * 2012-05-18 05:37:21
 */
function dateDiff(str1, str2) {
	var d1 = Date.parse(str1); // 非法格式则返回NaN
	if (d1 === 'NaN')
		return undefined;
	var d2 = Date.parse(str2); // 非法格式则返回NaN
	if (d2 === 'NaN')
		return undefined;

	return (d1 - d2);
}

var read = function(error, client) {
	if (error)
		throw error;
	var collection = new mongodb.Collection(client, 'svlog');

	collection.find({}, {
		limit : 2
	}).toArray(function(err, docs) {
		console.dir(docs);
	});
};

var callback = function(error, docs) {
	if (error)
		throw error;	
	// collection.count(function(err, count) {
	// test.assertEquals(1, count);
	// });

	// // Locate all the entries using find
	// collection.find().toArray(function(err, results) {
	// test.assertEquals(1, results.length);
	// test.assertTrue(results[0].a === 2);
	//
	// // Let's close the db
	// client.close();
	// });
};

/**
 * 取得 ecc 中的log，并插入
 */
function querylog(id, begin_time, collection) {
	var d= new Date();
	var what;
	if(begin_time === undefined){
		// 数据库中还没有对应 id 的 log，从最早开始查log
		what = {
			'dowhat' : 'QueryRecordsByTime',
			'id' : id,
			'begin_year' : '1970',
			'begin_month' : '1',
			'begin_day' : '1',
			'begin_hour' : '0',
			'begin_minute' : '0',
			'begin_second' : '1',
			'end_year' : d.getFullYear(),
			'end_month' : d.getMonth()+1,
			'end_day' : d.getDate(),
			'end_hour' : d.getHours(),
			'end_minute' : d.getMinutes(),
			'end_second' : d.getSeconds(),			
		};
	}
	else{
		var p = Date.parse(begin_time); 
		if (p === 'NaN')
			return undefined;
		var begin= new Date(p);
		what = {
			'dowhat' : 'QueryRecordsByTime',
			'id' : id,
			'begin_year' : begin.getFullYear(),
			'begin_month' : begin.getMonth()+1,
			'begin_day' : begin.getDate(),
			'begin_hour' : begin.getHours(),
			'begin_minute' : begin.getMinutes(),
			'begin_second' : begin.getSeconds(),
			'end_year' : d.getFullYear(),
			'end_month' : d.getMonth()+1,
			'end_day' : d.getDate(),
			'end_hour' : d.getHours(),
			'end_minute' : d.getMinutes(),
			'end_second' : d.getSeconds(),
		};
	}
	var robj = process.sv_forest(what, 0);
	if (robj.isok() === true) {
		var fmap = robj.fmap(0);
//		if(debug>0)	
//			console.log(' to transfer log: '+id);		
		
		var logcount= 0;
		var logs= Array();
		var key= true; //取出第一个 key
		do{
			key= robj.nextkey(key,0); //取出下一个 key
			if(key!=false){
				logcount++;				
				var one = {
					'id' : id,
					'creat_time' : fmap[key]['creat_time'],
					'dstr' : fmap[key]['dstr'],
					'status' : fmap[key]['record_status'],
				};				
				logs.push( one );
			}
		}while(key!=false);		
		//插入logs
		collection.insert(logs, function(error, docs) {
			if (error) {
				console.log(error);
			}
		});
		return logcount;	
	} else {
		if(debug>0)	
			console.log(' !!! failed to QueryRecordsByTime: '+ id + '  begin_time:' +begin_time);		
	}
	return undefined;
};

/**
 * 计算监测器运行周期
 */
function getFreq(str) {
	var index = str.indexOf("分钟");
	if (index > 0) {
		var f = str.substring(0, index);
		return f * 60 * 1000;
	} else {
		index = str.indexOf("小时");
		if (index > 0) {
			var f = str.substring(0, index);
			return f * 60 * 60 * 1000;
		}
	}
	return undefined;
}

/**
 * 对比已有数据，检查是否需要更新
 */
function checkUpdate(qtime, qid, collection) {
	var mon= monitors[qid];
	if(mon===undefined)
	{
		console.log('monitors[' + qid + '] undefined');
		return;
	}
	var creat_time = mon['creat_time'];
	
	var freq;
	if(ids[qid] && qtime){
		freq= ids[qid]['freq'];
		var diff= dateDiff(creat_time, qtime); 			
//		console.log(trans['num']+ " ,qid: " + qid + " freq: " + freq);
		
		
		if(freq<=diff){
			// 有可能缺了若干个监测周期的 log
			ids[qid]['qtime']= qtime;
		}else{
			//刷新缓存数据
			cache_items[qid] = {
				'qid' : qid,
				'qtime' : creat_time,
			};
			//不需要去 ecc 中查 log
			ids[qid]= undefined;
			trans['num']--;
			
			if (freq>diff && diff>0) {
				// GetTreeData得到的新 log 时间比 mongodb 中最新 log 的时间还要新，且小于监测周期，则直接更新log			
				collection.insert(mon, function(error, docs) {
					if (error) {
						console.log(error);
					}
				});
				if(debug>1)
					console.log('update log id: '+ qid+ "  qtime: " + qtime + "    creat_time: " + creat_time);				
			}			
		}
	}
}

/**
 * 连接数据库，检查更新
 */
var update = function(error, client) {
	if (error)
		throw error;	
	var collection = new mongodb.Collection(client, 'svlog');
	//尝试创建索引
	collection.ensureIndex({"creat_time":1}, {background:true, w:1}, callback);	
	collection.ensureIndex({"id":1}, {background:true, w:1}, callback);
	collection.ensureIndex({"id":1,"creat_time":1}, {unique:true, background:true, dropDups:true, w:1}, callback);
	
	ids= Array();
	var allids= Array();
	for (index in forest) {
		var mon = forest[index];
		//只处理监测器
		if (mon["type"] === "monitor") {
			var sv_id= mon.sv_id;
			var creat_time= mon['creat_time'];
			var dstr= mon.dstr;
//			creat_time= creat_time.replace("2010", "2012");  //测试代码，用于模拟产生新的监测数据
			
			//非法格式返回NaN
			var date= Date.parse(creat_time);
			if(date==='NaN')
				continue;
			if(dstr===undefined)
				continue;
//			var t=  dateFormat(new Date(date));	
			
			var one ={
					'id' : sv_id,
					'creat_time' : creat_time,
					'dstr' : dstr,
					'status' : mon.status,
//					'status_disable' : mon.status_disable,
				};
			monitors[sv_id] = one;
		
			var mtype, freqency;
			if (monitorinfo[sv_id]) {
				mtype = monitorinfo[sv_id]['MonitorType'];
				freqency = getFreq( monitorinfo[sv_id]['MonitorFrequency'] );
//				console.log("sv_id: " + sv_id + " , " + freq + " , "+mtype);
			}
			ids[sv_id] = {
				'id' : sv_id,
				'mtype' : mtype,
				'freq' : freqency,
				'qtime' : undefined,
			};
			allids.push(sv_id);
//			console.log("one: " + one + " ids: " + ids[sv_id]['freq']);
		}
	}
//	console.log(allids);
	
	if(debug>0)
		console.log('update ... (' + 'debug: ' + debug + ')');
	//调试信息，需要导入的监测器数量
	trans= Array();
	trans['num']=allids.length;	
	
//	var stream = collection.find({'id':'1.9.14.1'}).sort({ "creat_time":-1 }).stream();
	var stream;
	if(use_cache_items===false){
		//创建缓存数据
		use_cache_items= true;
		stream = collection.find({'id':{ $in:allids }}).sort({ "creat_time":-1 }).stream();
		stream.on("data", function(item) {
			var qtime = item['creat_time'];
			var qid = item['id'];
			checkUpdate(qtime, qid, collection);
		});	
	}else{		
		stream = collection.find().limit(1).stream();
		stream.on("data", function(item) {
		});			
	}

	stream.on("end", function(item) {
		if(use_cache_items===true){
			//已经有缓存数据，使用并刷新			
			for( citem in cache_items ){
				var qtime = cache_items[citem]['qtime'];
				var qid = cache_items[citem]['qid'];	
				checkUpdate(qtime, qid, collection);				
			}		
		}
		
		var tindex= 0;
		for (id in ids) {
			var check = ids[id];
			//已经更新过了，就continue
			if (check === undefined)
				continue; 
			
			//只要 querylog 了新的，就需要刷新缓存数据
			use_cache_items= false;
			
			tindex++;
			var checktime= check['qtime'];
			var logcount= querylog(id, checktime, collection);
			if(debug>0 && logcount)	
				console.log(' transferred '+logcount+' logs: '+id+'  from '+ checktime +' , ' + tindex + '/' + trans['num'] + ' at '+ dateFormat(new Date()) );			
//			break; //测试代码，可以每次只导入一个监测器的历史数据

//			// 测试代码，数据库中还没有对应 id 的 log，以下代码只是插入最新的一条log			
//			if(checktime === undefined){
//				var mon = monitors[id];
//				collection.insert(mon, function(error, docs) {
//					if (error) {
//					console.log(error);
//					}
//				});
//				if(debug>1)				
//					console.log('new log id: ' + id + "   creat_time: " + mon['creat_time']);
//			}
//			else{
//				// 有可能缺了若干个监测周期的 log，从checktime开始查log
//				console.log(id+ ' qtime in mongo: '+ checktime);
//			}
		}

	});

	stream.on("error", function(error) {
		if (error) {
			console.log(error);
		}
		db.close();
	});
	
	// 关闭数据库连接		
	stream.on("close", function() {
		if(debug>0)		
			console.log(run_count++ + 'th update is done.');	
		db.close();
		is_updating= false;
	});
};


/**
 * 定时重复执行的任务
 */
var repeatJob = function() {
	if(is_updating || !can_run)
		return;
	is_updating= true;
	
	if(debug>0)	
		console.log('\nrepeatJob(' + repeat_time + 's), '+ dateFormat(new Date()));
	forest= Array();
	monitors= Array();
	monitorinfo= Array();
	ids= Array();
	var robj = process.sv_forest({
		'dowhat' : 'GetTreeData',
		'parentid' : 'default',
		'onlySon' : 'false'
	}, 0);
	if (robj.isok() === true) {
		// 取得树的数据
		forest = robj.fmap(0);
		
		// 取得监测器信息
		// -- 1.23.11.3.1 (NO:6) --
		// MonitorFrequency = 5分钟 （分钟，小时）
		// MonitorType = Ping （不会重复，可以反查）
		robj = process.sv_univ({
			'dowhat' : 'QueryAllMonitorInfo'
		}, 0); 
		if (robj.isok() === true) {
			monitorinfo = robj.fmap(0);
		}
		
		//连接数据库，检查更新
		db.open(update);		
	} else {
		if(debug>0)	
			console.log(' !!! failed to GetTreeData.');
	}
};
//db.open(update);
//console.log('dateDiff, ' + dateDiff('2012-05-18 05:37:21','2012-05-18 05:32:21'));

if(can_run){
	//sv的初始化
	process.sv_init();	
}

//最初运行一次
repeatJob();
//指定时间后重复运行
(function runrun() {
	setTimeout(function do_it() {
		repeatJob();
		runrun();
	}, repeat_time * 1000);
}());


}());//end of 名空间