Language = new Meteor.Collection();
Deps.autorun(function (c) {
	var language = [
		{
			name : "EN_US",
			value:{
				username:"username",
				password:"password"
			}
		},
		{
			name : "ZH_CN",
			value : {
				username:"用户名",
				password:"密码"
			}
		}
	];
	if(Language.find().fetch().length)
		Language.remove({});
	for(index in language){
		Language.insert(language[index]);
	}
	c.stop();
});
