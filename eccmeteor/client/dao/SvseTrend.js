SvseTrendDao = {
	"AGENT":"SvseTrendDaoAgent",
	"getTrendList":function(id,type,fn){
		Meteor.call(SvseTrendDao.AGENT,'getTrendList',[id,type],function(err,result){
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
	}	
/*
	getTrendList : function(fn){
		Meteor.call(SvseTrendDao.AGENT,"getTrendList",[],fn);
	},	
*/
}