Language = new Meteor.Collection();
Session.setDefault("language",navigator.language.toLocaleUpperCase())
Deps.autorun(function (c) {
	var language = [
		{
			name : "EN-US",
			value:{
				_language : "English",
				save : "Save",
				cancel : "Cancel",
				username:"username",
				password:"password",
				home : "HOME",
				link : "LINK"
			}
		},
		{
			name : "ZH-CN",
			value : {
				_language:"中文",
				save : "保存",
				cancel : "取消",
				username:"用户名",
				password:"密码",
				home : "首页",
				link : "链接"
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

/**
使用
LanguageModel.getLanguage().link
*/
LanguageModel = {
	getLanaguage : function(){
		return Language.findOne({name:Session.get("language")})["value"];
	}
}
