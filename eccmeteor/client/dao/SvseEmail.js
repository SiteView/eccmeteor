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
	}
}