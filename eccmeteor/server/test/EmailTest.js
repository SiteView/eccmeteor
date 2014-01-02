EmailTest = function(){};

Object.defineProperty(EmailTest,"send",{
	value:function(){
		//emailSetting["dowhat"]="EmailTest";
		console.log("00")
		var robj = process.sv_univ({
			'dowhat' : 'WriteIniFileString',
			'filename' : "TXTTemplate.ini",
			'user' : "default",
			'section' : 'SMS',
			"key" : "ww",
			"value" : "中文"
		}, 2);
		console.log("11")
		if(!robj.isok(0)){
			console.log(robj.estr(0));
		}
		var fmap = robj.fmap(0);
		console.log(fmap);
		
	}
})