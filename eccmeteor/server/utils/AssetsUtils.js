/*
	获取相关资源工具类
*/
AssetsUtils = {};
Object.defineProperty(AssetsUtils,"getLanguage",{
	value:function(){
		return EJSON.parse(Assets.getText("language/Language.js"))
	}
});