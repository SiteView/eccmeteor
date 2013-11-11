/*
	Type：add
	Author：huyinghuan
	Date:2013-11-04 14:43
	Content:增加获取应用根目录的方法  getRootPath
*/
EccSystem = {};
Object.defineProperty(EccSystem,"require",{
	value:function(modulname){
		return Npm.require(modulname);
	}
});
/*
	此方法获取应用的根目录。
	只接受一个参数。参数为更目录下的一个文件或者文件夹名.
	注意:不能是多重文件夹或者文件如：/hello/a.ini,因为涉及到不同系统直接文件路劲表示方法不一致问题。将导致平台移植时出现错误;
*/
Object.defineProperty(EccSystem,"getRootPath",{
	value:function(filename){
		var cwd = process.cwd();
		var dir =cwd.substr(0,cwd.indexOf(".meteor"));
		if(filename){
			var path = EccSystem.require("path");
			var dir = path.join(EccSystem.getRootPath(), filename);
		}	
		return dir;
	}
});
/*
	忽略系统相关性,拼接目录
*/
Object.defineProperty(EccSystem,"joinPath",{
	value:function(){
		var path = EccSystem.require("path");
		return path.join.apply(null,arguments);
	}
})