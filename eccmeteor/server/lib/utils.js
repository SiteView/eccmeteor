// /home/ec/logtest/log/ss/
var fs = EccSystem.require('fs'); 
var path = EccSystem.require('path');
ServerUtils ={
	/*
	*创建文件夹,使用时，第二个参数忽略
	*/
	mkdir:function(dirpath,dirname){
		//判断是否是第一次调用
		if(typeof dirname === "undefined"){ 
			if(fs.existsSync(dirpath)){
				return;
			}else{
				ServerUtils.mkdir(dirpath,path.dirname(dirpath));
			}
		}else{
			//判断第二个参数是否正常，避免调用时传入错误参数
			if(dirname !== path.dirname(dirpath)){ 
				ServerUtils.mkdir(dirpath);
				return;
			}
			if(fs.existsSync(dirname)){
				fs.mkdirSync(dirpath)
			}else{
				ServerUtils.mkdir(dirname,path.dirname(dirname));
				fs.mkdirSync(dirpath);
			}
		}
	}
}