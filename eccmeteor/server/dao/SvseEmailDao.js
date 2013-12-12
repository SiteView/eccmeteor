SvseEmailDaoOnServer = {
	"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	"sync":function(){
		SyncFunction.SyncEmailList();
	},
	"addEmailAddress":function(addressname,address){
		var result = SvseMethodsOnServer.svWriteEmailAddressIniFileSectionString(addressname,address);
		if(!result){
			var msg = "SvseEmailDaoOnServer's addEmailAddress  add " + addressname +" faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		var addressresult = result[addressname];
		SvseEmailList.insert(addressresult,function(err,r_id){
			if(err){
				Log4js.error(err);
				throw new Meteor.Error(500,err);
			}
		})
	},
	"updateEmailAddress":function(addressname,address){
		var result = SvseMethodsOnServer.svWriteEmailAddressIniFileSectionString(addressname,address);
		if(!result){
			var msg = "SvseEmailDaoOnServer's addEmailAddress  update " + addressname +" faild";
			Log4js.error(msg,-1);
			throw new Meteor.Error(500,msg);
		}
		var addressresult = result[addressname];
		var s_id = SvseEmailList.findOne({nIndex:addressname})._id;
		console.log("s_id is " + s_id);
		console.log("addressresult is ");
		console.log(addressresult);
		SvseEmailList.update(s_id,{$set:addressresult},function(err){
			if(err){
				Log4js.error(err);
				throw new Meteor.Error(500,err);
			}
		})
	},
	"setEmailBasicSetting":function(setting){
		var result = SvseMethodsOnServer.svWriteEmailIniFileSectionString(setting);
		if(!result){
			var msg = "SvseEmailDaoOnServer's setEmailBasicSetting faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		return SvseEmailDaoOnServer.getReturn(true);
	},
	"deleteEmailAddressByIds" : function(ids){
		var address = ids.join();
		var result = SvseMethodsOnServer.svDeleteEmailAddressIniFileSection(address);
		if(!result){
			var msg = "SvseEmailDaoOnServer's deleteEmailAddressByIds"+ids+" faild";
			Log4js.error(msg);
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
				Log4js.error(msg);
			}
		}
		return SvseEmailDaoOnServer.getReturn(true,1);
	},
	"getEmailTemplates" : function(){
		return SvseMethodsOnServer.svGetEmailTemplates();
	},
	//邮件测试
	"emailTest":function(emailSetting){
		var result = SvseMethodsOnServer.svEmailTest(emailSetting);
		if(!result){
			var msg = "SvseEmailDaoOnServer's EmailTest faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		return SvseEmailDaoOnServer.getReturn(true);
	}
}