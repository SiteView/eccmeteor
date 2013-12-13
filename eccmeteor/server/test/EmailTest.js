EmailTest = function(){};

Object.defineProperty(EmailTest,"send",{
	value:function(){
		//emailSetting["dowhat"]="EmailTest";
		var robj = process.sv_univ({
			"dowhat":"EmailTest",
			"mailServer":"smtp.qq.com",
			"mailFrom":"1960670772@qq.com",
			"mailTo":"1960670772@qq.com",
			"user":"1960670772@qq.com",
			"password":"0723qing",
			"subject":"smtp.qq.com",
			"content":"hello"
		},0);
		
		if(!robj.isok(0)){
			console.log(robj.estr(0));
		}
		var fmap = robj.fmap(0);
		console.log(fmap)
		return fmap;
	}
})