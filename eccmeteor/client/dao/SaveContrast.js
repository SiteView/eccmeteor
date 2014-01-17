SvseContrastDao = {
// 检查操作时是否勾选对象
   "checkContrastresultlistSelect":function(getContrastListSelectAll){
     if(getContrastListSelectAll == ""){
       Message.info("检查操作时是否勾选对象");
       return;
     }
    },
	"getContrastById":function(id){
	return SvseContrastlist.findOne({nIndex:id});
	},
	// 根据时间段获取实时数据
	getMonitorReportData : function(id,beginDate,endDate,fn){
		Meteor.call(SvseMonitorDao.AGENT,"getMonitorReportData",[id,beginDate,endDate],function (err,result){
			if(err){
				fn({status:false,msg:err})
				return;
			}
			fn({status:true,content:result});
		});
	}
 }
