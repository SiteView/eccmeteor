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
	"deleteTaskByIds":function(ids,fn){
		Meteor.call(SvseTaskDao.AGENT,"deleteTaskByIds",[ids],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
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