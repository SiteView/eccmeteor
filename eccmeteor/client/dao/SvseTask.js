SvseTaskDao = {
	"AGENT":"SvseTaskDaoAgent",
	//增加一条任务计划信息
/*	
		"addtaskabsolute":function(addressname,address,fn){
		console.log("SvseTaskDao client addtaskabsolute");
		Meteor.call(SvseTaskDao.AGENT,'addtaskabsolute',[addressname,address],function(err,result){	
			console.log(result);
			if(err){
				SystemLogger(err);				
				fn({status:false,msg:err})
			}else{
				if(result && !result[status]){ // 无权限
					SystemLogger(err);
					fn(result);
				}else{
					fn({status:true})
				}
			}
		});
	},
*/	
	"addtaskabsolute":function(address){
		SvseTask.insert(address);
		var result =(SvseTask.insert(address))._id; 
		console.log(result);
	},
	"getAllTaskNames":function(){
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