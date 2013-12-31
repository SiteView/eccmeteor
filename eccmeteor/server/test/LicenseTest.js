LicenseTest = function(){};
Object.defineProperty(LicenseTest,"test",{
	value:function(){
		var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"general.ini",
			"user":"default","section":"license"}, 0);
		if(!robj.isok(0)){
			Log4js.error(robj.estr(0),-1);
			return;
		}
		var fmap= robj.fmap(0);
		console.log(svDecryptOne("QeeG4IeeQN7NeOzN"));
		console.log(svDecryptOne("KIQNczz41J44G1Je"));
		console.log(EJSON.stringify(fmap));
	}
});
