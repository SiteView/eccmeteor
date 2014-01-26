SvseTaskDao = {
	"AGENT":"SvseTaskDaoAgent",
	//增加一条任务计划信息

		"addtaskabsolute":function(address,fn){
		console.log("SvseTaskDao client addtaskabsolute");
		SvseTask.insert(address);
		Meteor.call(SvseTaskDao.AGENT,'addtaskabsolute',[address],function(err,result){	
			console.log(result);
			if(err){
				fn({status:false,msg:err});
			}else{
				fn(result);
			}
		});
	},
	"updatetask":function(address,fn){
		 // var name = address.sv_name;
		 // console.log(name);
		 // console.log(address);
		// SvseTask.update(SvseTask.findOne({sv_name:name}).sv_name,{$set:address});
		Meteor.call(SvseTaskDao.AGENT,'updatetask',[address],function(err,result){
		console.log(address);
		console.log(result);
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				if(result && !result[status]){ // 无权限
					Log4js.error(err);
					fn(result);
				}else{
					console.log(result);
					fn({status:true})
				}
			}
		});
	},
	"deleteTaskByIds":function(ids,fn){
		Meteor.call(SvseTaskDao.AGENT,"deleteTaskByIds",[ids],function(err,result){
			if(err){
			console.log("11111111");
				SystemLogger(err);
				fn({status:false,msg:err})
			console.log("11111111");
			}else{
				fn(result);
			console.log("2222222");
			}
		});
	},
	//根据id从数据集里获取一条任务计划的记录
	"getTaskById" : function(id){
	return SvseTask.findOne({sv_name:id});
	},
/*		
	"addtaskabsolute":function(address){
		SvseTask.insert(address);
		var result =(SvseTask.insert(address))._id; 
		console.log(result);
	},
*/	"getAllTaskNames":function(){
		return SvseTask.find().fetch();
		
	},
	"getTaskNameByType":function(type){
		var tasks = SvseTask.find({Type:type}).fetch();
		var names = [];
		names.push("");
		for(index in tasks){
			names.push(tasks[index]["sv_name"]);
		}
		return names;
	}
}