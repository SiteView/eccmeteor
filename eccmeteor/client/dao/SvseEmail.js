SvseEmailDao = {
	"getEmailList" : function(){
		return SvseEmailList.find({}).fetch();
	},
	"addEmailAddress":function(addressname,address,fn){
		Meteor.call("svWriteEmailIniFileSectionString",addressname,address,function(err,result){
			var addressresult = result[addressname];
			SvseEmailList.insert(addressresult,function(err,r_id){
				if(err){
					SystemLogger(err,-1);
				}else{
					fn();
				}
			})
		});
	}
}