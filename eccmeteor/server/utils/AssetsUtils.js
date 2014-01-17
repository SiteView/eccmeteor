/*
	获取相关资源工具类
*/
var fs = EccSystem.require("fs");
var path = EccSystem.require("path");
AssetsUtils =function(){};
Object.defineProperty(AssetsUtils,"getLanguages",{
	value:function(){
		var dir = path.join(EccSystem.getRootPath(), 'private', 'language');
		var lists = fs.readdirSync(dir);
		var languages  = [];
		for(index in lists){
			var p = "language/"+lists[index];
			languages.push(EJSON.parse(Assets.getText(p)));
		}
		return languages;
	}
});
/*
*获取开发相关配置
*/
Object.defineProperty(AssetsUtils,"getDevConfig",{
	value:function(name){
		var dev = EJSON.parse(Assets.getText("development.json"));
		return dev[name];
	}
});

/*
*获取初始化 设备模板时使用的操作系统类型的 相关数据
*/
Object.defineProperty(AssetsUtils,"getEntityTemplateOsType",{
	value:function(){
		return EJSON.parse(Assets.getText("oscmd.json"));
	}
});

/*
	获取测试对象
*/
Object.defineProperty(AssetsUtils,"getTestObjects",{
	value:function(){
		var dir ='test/test.json';
		return EJSON.parse(Assets.getText(dir));
	}
});

/*
	获取报表的HTML模板
*/
Object.defineProperty(AssetsUtils,"getReportTemplate",{
	value:function(filename){
		var dir = 'report/'+filename;
		return Assets.getText(dir);
	}
});
