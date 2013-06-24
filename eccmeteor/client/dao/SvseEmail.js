SvseEmailDao = {
	"getEmailList" : function(){
		return SvseEmailList.find({}).fetch();
	},
	"addEmailAddress":function(addressname,address,fn){
		Meteor.call("svWriteEmailAddressIniFileSectionString",addressname,address,function(err,result){
			var addressresult = result[addressname];
			SvseEmailList.insert(addressresult,function(err,r_id){
				if(err){
					SystemLogger(err,-1);
				}else{
					fn();
				}
			})
		});
	},
	"setEmailBasicSetting":function(setting,fn){
		Meteor.call("svWriteEmailIniFileSectionString",setting,function(err,result){
			if(!err) fn();
		});
	},
	"getEmailById" : function(id){
		return SvseEmailList.findOne({nIndex:id});
	},
	"updateEmailAddress":function(addressname,address,fn){
		Meteor.call("svWriteEmailAddressIniFileSectionString",addressname,address,function(err,result){
			var addressresult = result[addressname];
			var s_id = SvseEmailList.findOne({nIndex:addressname})._id;
			console.log("s_id is " + s_id);
			console.log("addressresult is ");
			console.log(addressresult);
			SvseEmailList.update(s_id,{$set:addressresult},function(err){
				if(!err) fn();
				if(err) console.log(err)
			})
		});
	},
	"deleteEmailAddressByIds":function(ids){
		Meteor.call("svDeleteEmailAddressIniFileSection",ids,function(err,result){
			if(result){
				var idArr = ids.split(",");
				
			}
		});
	}
}