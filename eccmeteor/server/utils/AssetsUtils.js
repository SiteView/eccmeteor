/*
	获取相关资源工具类
*/
AssetsUtils = {};
Object.defineProperty(AssetsUtils,"getLanguages",{
	value:function(){
		var fs = EccSystem.require("fs");
		var path = EccSystem.require("path");
		var dir = path.join(EccSystem.getRootPath(), 'private', 'language');
		var lists = fs.readdirSync(dir);
		var languages  = [];
		for(index in lists){
			var p = path.join("language",lists[index]);
			languages.push(EJSON.parse(Assets.getText(p)));
		}
		return languages;
	}
});