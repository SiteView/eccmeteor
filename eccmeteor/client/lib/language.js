/*‌‌
   Type：  Modify ‌‌
   Author： huyinghuan
   Date:2013-11-04 13:55 星期一
   Content: 修改语言集合为后台定义模式。
*/
LanguageModel = {};
/**
使用
LanguageModel.getLanguage().link
接收一个参数,制定需要调用二级模块. 默认为不设置.
	Demo: LanguageModel.getLanguage("warnerrulemodel").emailwarner
*/
Object.defineProperty(LanguageModel,"getLanaguage",{
	value:function(modul,key){
		var language =  SvseLanguage.findOne({name:Session.get("language")});
		if(!language){
			return "";
		}
		if(!modul)
			return language["value"];
		if(typeof key === "undefined")
			return language["value"][modul];
		return language["value"][modul][key];
	}
});
/*
	获取所有的语言种类,
	参数status：
		如果参数为true，则返回语言的种类类型对象数组，否则返回所有的语言json数组对象
*/
Object.defineProperty(LanguageModel,"getLanguages",{
	value:function(status){
		var languages = SvseLanguage.find().fetch();
		if(!status){
			return languages;
		}
		var types = [];
		for(index in languages){
			var obj = {};
			obj.name = languages[index]["name"];
			obj.value = languages[index]["value"]._language
			types.push(obj);
		}
		return types;
	}
})
