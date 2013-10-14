SvseStatisticalOnServer = {
	"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	"sync":function(){
		SyncFunction.SyncStatisticalList();
	},
	"addStatistical":function(addressname,address){
		var result = SvseMethodsOnServer.svWriteStatisticalIniFileSectionString(addressname,address);
		if(!result){
			var msg = "SvseStatisticalOnServer's addStatistical  add " + addressname +" faild";
			SystemLogger.log(msg,-1);
			throw new Meteor.Error(500,msg);
		}
		var addressresult = result[addressname];
		SvseStatisticalresultlist.insert(addressresult,function(err,r_id){
			if(err){
				SystemLogger(err,-1);
				throw new Meteor.Error(500,err);
			}
		})
	},
	"updateEmailAddress":function(addressname,address){
		var result = SvseMethodsOnServer.svWriteEmailAddressIniFileSectionString(addressname,address);
		if(!result){
			var msg = "SvseEmailDaoOnServer's addEmailAddress  update " + addressname +" faild";
			SystemLogger.log(msg,-1);
			throw new Meteor.Error(500,msg);
		}
		var addressresult = result[addressname];
		var s_id = SvseEmailList.findOne({nIndex:addressname})._id;
		console.log("s_id is " + s_id);
		console.log("addressresult is ");
		console.log(addressresult);
		SvseEmailList.update(s_id,{$set:addressresult},function(err){
			if(err){
				SystemLogger(err,-1);
				throw new Meteor.Error(500,err);
			}
		})
	},
	"setEmailBasicSetting":function(setting){
		var result = SvseMethodsOnServer.svWriteEmailIniFileSectionString(setting);
		if(!result){
			var msg = "SvseEmailDaoOnServer's setEmailBasicSetting faild";
			SystemLogger.log(msg,-1);
			throw new Meteor.Error(500,msg);
		}
		return SvseEmailDaoOnServer.getReturn(true);
	},
	"deleteEmailAddressByIds" : function(ids){
		var address = ids.join();
		var result = SvseMethodsOnServer.svDeleteEmailAddressIniFileSection(address);
		if(!result){
			var msg = "SvseEmailDaoOnServer's deleteEmailAddressByIds"+ids+" faild";
			SystemLogger.log(msg,-1);
			throw new Meteor.Error(500,msg);
		}
		for(index in ids){
			SvseEmailList.remove(SvseEmailList.findOne({nIndex:ids[index]})._id);
		}
		return SvseEmailDaoOnServer.getReturn(true);
	},
	"updateEmailAddressStatus":function(ids,status){
		var count = 0;
		for(index in ids){
			var id = ids[index];
			var result = SvseMethodsOnServer.svWriteEmailAddressStatusInitFilesection(id,status);
			if(result){
				SvseEmailList.update(SvseEmailList.findOne({nIndex:id})._id,{$set:{"bCheck":status}});
				count = count+1;
			}else{
				var msg = "SvseEmailDaoOnServer's updateEmailAddressStatus "+index+" faild";
				SystemLogger.log(msg,-1);
			}
		}
		return SvseEmailDaoOnServer.getReturn(true,1);
	},
	"getEmailTemplates" : function(){
		return SvseMethodsOnServer.svGetEmailTemplates();
	}
}