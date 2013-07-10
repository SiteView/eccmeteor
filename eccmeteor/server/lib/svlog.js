/*
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

//调试开关，0:任何调试信息不显示，1：一般信息，2：详细信息， 3：极详细用于错误调试
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

//监测器模板数据
var mon_tpls_id= Array();


/**
 * 格式化 Date 为时间字符串<br/>
 * dateFormat (new Date (), "%Y-%m-%d %H:%M:%S", false);  返回 2012-05-18 05:37:21 <br/>
 * 非法 date 则返回 NaN-aN-aN aN:aN:aN
 */
 
 /*
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
 * str1 与 str2 的毫秒差（距1970年的毫秒数），前者更大则结果>0 <br/>
 * 2012-05-18 05:37:21
 */
 
 /*
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
 * 分解 dstr 成字段
 */
 /*
function split_dstr(mon){
	if(mon===undefined)
		return mon;
	var status= mon['status'];
	var id= mon['id'];
	var dstr= mon['dstr'];
	
	if(dstr===undefined)
		return mon;
	if(id===undefined)
		return mon;	
	if(status!=='ok' && status!=='warning' && status!=='error')
		return mon;	
	
	var info= monitorinfo[id];
	if(info===undefined)
		return mon;
	var sv_monitortype= info['sv_monitortype'];
	if(sv_monitortype===undefined)
		return mon;
	var tpl= mon_tpls_id[sv_monitortype]; 
	if(tpl===undefined)
		return mon;

//	 split,  1.9.14.1 , ok , 包成功率(%)=100.00, 数据往返时间(ms)=0.00, 状态值(200表示成功 300表示出错)=200.00,
//	 name,  packetsGoodPercent , 包成功率(%) , 1
//	 name,  roundTripTime , 数据往返时间(ms) , 2
//	 name,  status , 状态值(200表示成功 300表示出错) , 3
//	console.log(' split,  '+id+' , '+status+' , '+dstr);
	
	var len= dstr.length;
	if(len>1){
		if(dstr.charAt(len-1)==='.')
			dstr= dstr.substring(0, len-1);
	}
	var str= dstr;
	for(var i=1; i<=50; i++){
		var item= tpl['ReturnItem_'+i];
		if(item===undefined)
			break;
		var name= item['sv_name'];
		var label= item['sv_label'];
		if(name===undefined || label===undefined)
			break;
		
		label= label + '=';
		var end= str.length;
		var index = str.indexOf(label);
		if (index < 0)
			break;
		var index2 = str.indexOf(',');
		if(index2<0)
			index2= end;
		
		var value = str.substring(index + label.length, index2);
		str= str.substring(index2+1);
		mon[name]= value;
		
//		console.log(' name/value:  '+name+'/'+value+'  , '+label+' , '+i);
	}
	return mon;
}


/**
 * 构造查询参数 dowhat
 */
 /*
function buildWhat(id, begin_date, end_date){
	var what;
	if(begin_date === undefined){
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
			'end_year' : end_date.getFullYear(),
			'end_month' : end_date.getMonth()+1,
			'end_day' : end_date.getDate(),
			'end_hour' : end_date.getHours(),
			'end_minute' : end_date.getMinutes(),
			'end_second' : end_date.getSeconds(),			
		};
	}
	else{
		what = {
			'dowhat' : 'QueryRecordsByTime',
			'id' : id,
			'begin_year' : begin_date.getFullYear(),
			'begin_month' : begin_date.getMonth()+1,
			'begin_day' : begin_date.getDate(),
			'begin_hour' : begin_date.getHours(),
			'begin_minute' : begin_date.getMinutes(),
			'begin_second' : begin_date.getSeconds(),
			'end_year' : end_date.getFullYear(),
			'end_month' : end_date.getMonth()+1,
			'end_day' : end_date.getDate(),
			'end_hour' : end_date.getHours(),
			'end_minute' : end_date.getMinutes(),
			'end_second' : end_date.getSeconds(),
		};
	}
	return what;
}

/**
 * 插入数据到 mongodb
 */
 /*
function insertlog(id, robj, collection){
	if (robj.isok() !== true)
		return 0;
	var fmap = robj.fmap(0);
//	if(debug>0)	
//		console.log(' to transfer log: '+id);		
	
	var logcount= 0;
	var logs= Array();
	var key= true; //取出第一个 key
	do{
		key= robj.nextkey(key,0); //取出下一个 key
		if(key!==false){
			logcount++;				
			var one = {
				'id' : id,
				'creat_time' : fmap[key]['creat_time'],
				'dstr' : fmap[key]['dstr'],
				'status' : fmap[key]['record_status'],
			};				
			logs.push( split_dstr(one) );
		}
	}while(key!==false);		
	//插入logs
	collection.insert(logs, function(error, docs) {
		if (error) {
			console.log(error);
		}
	});
	return logcount;		
}

/**
 * 遇到超多log 监测器的特殊处理机制
 */
 /*
function queryTooBigLog(id, robj, collection){
	if(debug>1)
		console.log('svlog queryTooBigLog: '+ id +' ...');	
	var fmap = robj.fmap(0);
	if(fmap===undefined)
		return undefined;
//	if(debug>0)	
//		console.log(' to transfer log: '+id);		
	
	var latest= undefined;
	var oldest= undefined;
	var key= true; //取出第一个 key
	do{
		key= robj.nextkey(key,0); //取出下一个 key
		if(key!==undefined && key!==false && fmap[key]!==undefined){
			if(latest===undefined)
				latest= fmap[key]['creat_time'];
			oldest= fmap[key]['creat_time'];
		}
	}while(key!==false);
	if(debug>1)
		console.log('svlog queryTooBigLog: '+ id + ' ,oldest/latest: '+ oldest+' / '+latest);
	
	//取得合理时间区段
	var diff= dateDiff(latest, oldest);
	if(diff===undefined)
		return undefined;
	var distance= diff/2;
	
	//分时间区段查询数据
	var logcount= 0;
	var stop= Date.parse(latest);
	if(stop===undefined)
		return undefined;
	var begin= stop- 2*365*24*3600*1000;	
	do{
		var end= begin + distance;
		
		//调用后台，取得  ecc 中的log
		var count;
		var what= buildWhat(id, new Date(begin), new Date(end));
		var robj = process.sv_forest(what, 0);
		if (robj.isok() === true) {
			count= insertlog(id, robj, collection);
			logcount += count;			
		} else if(debug>0){
			console.log(' !!! failed to QueryRecordsByTime: '+ id + '  ,begin_time:' +begin_time + '  ,estr: ' + robj.estr()+ ' .svlog.');		
		}
		if(debug>1)
			console.log('svlog queryTooBigLog: '+ id + ' , begin/end: '+ dateFormat(new Date(begin))+ ' / '+ dateFormat(new Date(end)) + ' , count:'+count);		
		
		//重置查询区段
		begin= end;
	}while(begin<stop);
	
	return logcount;	
}


/**
 * 取得 ecc 中的log，并插入
 */
 /*
function querylog(id, begin_time, collection) {
	var what;
	if(begin_time === undefined){
		// 数据库中还没有对应 id 的 log，从最早开始查log
		what = buildWhat(id, undefined, new Date());
	}
	else{
		var p = Date.parse(begin_time); 
		if (p === 'NaN')
			return undefined;
		var begin= new Date(p);
		what = buildWhat(id, begin, new Date());
	}
	//调用后台，取得  ecc 中的log
	var robj = process.sv_forest(what, 0);
	if (robj.isok() === true) {
		return insertlog(id, robj, collection);	
	} else {
		var estr= robj.estr();
		if(estr){
			var index = estr.indexOf("为防止数据过大，强行退出查询");
			if(index>0){
				return queryTooBigLog(id, robj, collection);
			}
		}
		if(debug>0)	
			console.log(' !!! failed to QueryRecordsByTime: '+ id + '  ,begin_time:' +begin_time + '  ,estr: ' + robj.estr()+ ' .svlog.');		
	}
	return undefined;
};

/**
 * 计算监测器运行周期
 */
 /*
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
 /*
function checkUpdate(qtime, qid, collection) {
	var mon= monitors[qid];
	if(mon===undefined)
	{
		console.log('monitors[' + qid + '] undefined. svlog.');
		return;
	}
	var creat_time = mon['creat_time'];
	
	var freq;
	if(ids[qid] && qtime){
		freq= ids[qid]['freq'];
		var diff= dateDiff(creat_time, qtime); 		
		
//		if(qid==='1.9.14.1')
//			console.log(qtime+' , ' + creat_time + " ,qid: " + qid + " freq: " + freq);
		
		if(freq<=diff){
			// 有可能缺了若干个监测周期的 log
			if(ids[qid]['qtime']===undefined)
				ids[qid]['qtime']= qtime;
			else if(dateDiff(qtime, ids[qid]['qtime'])>0)
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
			
			if (freq>diff && diff>30000) {
				// GetTreeData得到的新 log 时间比 mongodb 中最新 log 的时间还要新，且小于监测周期，则直接更新log		
				mon= split_dstr(mon);
				collection.insert( mon, function(error, docs) {
					if (error) {
						console.log(error);
					}
				});
				if(debug>1)
					console.log('svlog update log id: '+ qid+ "  qtime: " + qtime + "    creat_time: " + creat_time);				
			}
		}
	}
}

/**
 * 连接数据库，检查更新
 */
 /*
var update = function(error, client) {
	if (error)
		throw error;	
	var collection = new mongodb.Collection(client, 'svlog');
	//尝试创建索引
	collection.ensureIndex({"creat_time":1}, {background:true, w:1}, callback);	
	collection.ensureIndex({"id":1}, {background:true, w:1}, callback);
	collection.ensureIndex({"id":1,"creat_time":1}, {unique:true, background:true, dropDups:true, w:1}, callback);
	
	//调试信息，需要导入的监测器数量
	trans['num']= 0;		
	ids= Array();
	var allids= Array();
	for (index in forest) {
		var mon = forest[index];
		//只处理监测器
		if (mon["type"] === "monitor") {
			var sv_id= mon.sv_id;
			var creat_time= mon['creat_time'];
			var dstr= mon.dstr;
			var status= mon.status;
//			creat_time= creat_time.replace("2010", "2012");  //测试代码，用于模拟产生新的监测数据
//			if(sv_id==='1.26.20.172')
//				console.log("sv_id/creat_time/dstr/status: " + sv_id + " , " + creat_time + " , "+dstr + ',' + status);
			
			//非法格式返回NaN
			var date= Date.parse(creat_time);
			if(date==='NaN')
				continue;
			if(dstr===undefined || dstr==='' || status===undefined || status==='null')
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
			trans['num']++;
		
			var mtype, freqency;
			if (monitorinfo[sv_id]) {
				mtype = monitorinfo[sv_id]['MonitorType'];
				freqency = getFreq( monitorinfo[sv_id]['MonitorFrequency'] );
				if(freqency<=300000){
					freqency+=60000;
				}else{
					freqency*=1.2;
				}
//				console.log("sv_id: " + sv_id + " , " + freqency + " , "+mtype + ',' + monitorinfo[sv_id]['sv_monitortype']);
			}
			ids[sv_id] = {
				'id' : sv_id,
				'mtype' : mtype,
				'freq' : freqency,
				'qtime' : undefined,
			};
			var ci = cache_items[sv_id];
			if(ci===undefined || ci['qtime']===undefined){
				allids.push(sv_id);
			}
//			console.log("one: " + one + " ids: " + ids[sv_id]['freq']);
		}
	}
//	console.log(allids);
	
	if(debug>0)
		console.log('svlog update ... (' + 'debug: ' + debug + ')');
	
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
				if(cache_items[citem]===undefined)
					continue;
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
			//清除该监测器的缓存
			cache_items[id]= undefined;
			
			if(debug>2)	
				console.log(' svlog transfering '+id+'  ...');
			//只要 querylog 了新的，就需要刷新缓存数据
			use_cache_items= false;
			
			tindex++;
			var checktime= check['qtime'];
			var logcount= querylog(id, checktime, collection);
			if(debug>0)	
				console.log(' svlog transferred '+logcount+' logs: '+id+'  from '+ checktime +' , ' + tindex + '/' + trans['num'] + ' at '+ dateFormat(new Date()) );			
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
			console.log('svlog '+ run_count++ + 'th update is done.');	
		db.close();
		is_updating= false;
	});
};


/**
 * 定时重复执行的任务
 */
 /*
var repeatJob = function() {
	if(is_updating || !can_run)
		return;
	is_updating= true;
	
	if(debug>0)	
		console.log('\nsvlog repeatJob(' + repeat_time + 's), '+ dateFormat(new Date()));
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
		
//		-- 1.23.10.1.1 (NO:1) --
//	     needtype = monitor
//	     sv_monitortype = 5		
		robj = process.sv_univ({
			'dowhat' : 'QueryInfo',
			'needkey' : 'sv_monitortype',
		}, 0); 
		if (robj.isok() === true) {
			var qinfo = robj.fmap(0);
			for(qid in qinfo){
				monitorinfo[qid]['sv_monitortype']= qinfo[qid]['sv_monitortype'];
			}
		}		
		
		//连接数据库，检查更新
		db.open(update);		
	} else {
		if(debug>0)	
			console.log(' !!! failed to GetTreeData. svlog.');
	}
};
//db.open(update);
//console.log('dateDiff, ' + dateDiff('2012-05-18 05:37:21','2012-05-18 05:32:21'));


/**
 * 取得监测器模板数据
 */
 /*
function setMonTpls(){
//	mon_tpls_id;
	var robj;
	for(var i=1; i<1000; i++){
		robj = process.sv_univ({
			'dowhat' : 'GetMonitorTemplet',
			'id' : i,
		}, 0); 
		if (robj.isok() === true) {
			mon_tpls_id[i]= robj.fmap(0);
		}		
	}
//	--------
//	-- AdvanceParameterItem_1 (NO:1) --
//	-- ParameterItem_1 (NO:4) --
//	-- ParameterItem_2 (NO:5) --
//	-- ReturnItem_1 (NO:6) --
//	     sv_baseline = 1
//	     sv_drawimage = 1
//	     sv_drawmeasure = 1
//	     sv_drawtable = 1
//	     sv_label = 包成功率(%)
//	     sv_name = packetsGoodPercent
//	     sv_primary = 1
//	     sv_type = Float
//	     sv_unit = (%)
//	-- ReturnItem_2 (NO:7) --
//	     sv_label = 数据往返时间(ms)
//	     sv_name = roundTripTime
//	     sv_type = Float
//	-- ReturnItem_3 (NO:8) --
//	     sv_label = 状态值(200表示成功 300表示出错)
//	     sv_name = status
//	     sv_type = Float
//	     sv_unit =
//	-- error (NO:9) --
//	-- good (NO:10) --
//	-- property (NO:11) --
//	     sv_class = Ping
//	     sv_description = 监测Ping指定服务器状况
//	     sv_dll = msping.dll
//	     sv_func = PING
//	     sv_helplink = javascript:shelp2('monitor_ping.htm')
//	     sv_id = 5
//	     sv_label = Ping
//	     sv_name = Ping
//	-- return (NO:12) --
//	     id = 5
//	     return = true
//	-- warning (NO:13) --	

}

/**
 * 调试用的方法
 */
 /*
function dbReIndex(){
	db.open(function(error, client) {
		if (error)
			throw error;	
		console.log('\n svlog mongodb reindex ... '+ dateFormat(new Date()));
		var collection = new mongodb.Collection(client, 'svlog');
		collection.reIndex(function(err, result) {
			collection.indexInformation(function(err, indexInformation) {
				console.log(' svlog mongodb reindex is done!  '+ dateFormat(new Date()));
	            db.close();
	          });			
			});
		});	
}

/**
 * 删除log，调试用的方法
 */
 /*
function removeLine(){
	db.open(function(error, client) {
		if (error)
			throw error;	
		console.log('\n svlog mongodb remove line, '+ dateFormat(new Date()));
		var collection = new mongodb.Collection(client, 'svlog');
		
//		var line= {'id':'1.9.14.1'};
//		var line= {'id':'1.9.14.1','creat_time':'2010-02-26 14:11:37'};
		var line= {'id':'1.9.14.1','creat_time': {$gt:'2010-02-26 10:11:37'} };
		
		collection.remove(line, function(err, result) {
			db.close();
			});
		});		
}

if(can_run){
	//sv的初始化
	process.sv_init();	
	setMonTpls();
}else{
//	removeLine();
//	dbReIndex();	
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
*/