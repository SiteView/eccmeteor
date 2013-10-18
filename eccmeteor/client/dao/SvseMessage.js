SvseMessageDao = {
	"AGENT":"svseMessageDaoAgent",
	//获取短信集合列表
	"getMessageList": function(){
		return SvseMessageList.find({_id:{$exists:true}}).fetch();
	},
	//添加短信信息
	"addMessage":function(messagename,message,fn){
		Meteor.call(SvseMessageDao.AGENT,'addMessage',[messagename,message],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				if(result && !reult[status]){ // 无权限
					SystemLogger(err);
					fn(result);
				}else{
					fn({status:true})
				}
			}
		});
	},
}