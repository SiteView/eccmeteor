StatisticalListTest = function(){};


Object.defineProperty(StatisticalListTest,"testGetAlllist",{
	value:function(){
		var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"reportset.ini",
			"user":"default","sections":"default"}, 0);
		if(!robj.isok(0)){}
		var fmap= robj.fmap(0);
		Log4js.log(fmap);
	}
});

Object.defineProperty(StatisticalListTest,"testGetOneSection",{
	value:function(){
		var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"reportset.ini",
			"user":"default","sections":"1388991923544"}, 0);
		if(!robj.isok(0)){}
		var fmap= robj.fmap(0);
		Log4js.log(fmap);
	}
});

Object.defineProperty(StatisticalListTest,"test",{
	value:function(){
	//	StatisticalListTest.testGetAlllist();
		StatisticalListTest.testGetOneSection();
	}
});
/**  testGetAlllist
{
	"1388991923544":{
		"Deny":"No",
		"Descript":"",
		"EmailSend":"",
		"EndTime":"0:00",
		"Generate":"0",
		"Graphic":"No",
		"GroupRight":"1.9.8.1.1.1,1.9.8.1.1.2,1.9.8.1.1.3,1.9.8.1.1.4,1.9.8.1.1.5,1.9.8.1.1.6,1.9.8.1.2.1,1.9.8.1.2.2,1.9.8.1.2.3,1.9.8.1.2.4,1.9.8.1.2.5,1.9.9.1.1,1.9.9.1.3,1.9.9.1.4,1.9.9.1.5,1.9.9.1.6,1.9.9.1.7,1.9.5.1,1.9.5.2,1.9.6.3,1.9.6.4,1.9.10.1,1.9.10.2,1.9.10.3,1.9.10.4,1.9.10.5,1.9.13.1,1.9.13.2,",
		"ListAlert":"Yes",
		"ListDanger":"No",
		"ListError":"No",
		"MonitorNumber":"28",
		"Parameter":"No",
		"Period":"Day",
		"Title":"ll|1388991923544",
		"WeekEndTime":"0",
		"creatTime":"2014-01-06 15:05:23",
		"fileType":"html"
	},
	"1388991939747":{
		"Deny":"No",
		"Descript":"",
		"EmailSend":"",
		"EndTime":"0:00",
		"Generate":"0",
		"Graphic":"No",
		"GroupRight":"1.9.8.1.1.1,1.9.8.1.1.2,1.9.8.1.1.3,1.9.8.1.1.4,1.9.8.1.1.5,1.9.8.1.1.6,1.9.8.1.2.1,1.9.8.1.2.2,1.9.8.1.2.3,1.9.8.1.2.4,1.9.8.1.2.5,1.9.9.1.1,1.9.9.1.3,1.9.9.1.4,1.9.9.1.5,1.9.9.1.6,1.9.9.1.7,1.9.5.1,1.9.5.2,1.9.6.3,1.9.6.4,1.9.10.1,1.9.10.2,1.9.10.3,1.9.10.4,1.9.10.5,1.9.13.1,1.9.13.2,1.30.1,1.33.1,",
		"ListAlert":"Yes",
		"ListDanger":"No",
		"ListError":"No",
		"MonitorNumber":"30",
		"Parameter":"No",
		"Period":"Day",
		"Title":"khjk|1388991939747",
		"WeekEndTime":"0",
		"creatTime":"2014-01-06 15:05:39",
		"fileType":"html"
	},
	"return":{
		"return":"true"
	}
}

{
	"1388991923544":{
		"Deny":"No","Descript":"",
		"EmailSend":"","EndTime":"0:00",
		"Generate":"0","Graphic":"No",
		"GroupRight":"1.9.8.1.1.1,1.9.8.1.1.2,1.9.8.1.1.3,1.9.8.1.1.4,1.9.8.1.1.5,1.9.8.1.1.6,1.9.8.1.2.1,1.9.8.1.2.2,1.9.8.1.2.3,1.9.8.1.2.4,1.9.8.1.2.5,1.9.9.1.1,1.9.9.1.3,1.9.9.1.4,1.9.9.1.5,1.9.9.1.6,1.9.9.1.7,1.9.5.1,1.9.5.2,1.9.6.3,1.9.6.4,1.9.10.1,1.9.10.2,1.9.10.3,1.9.10.4,1.9.10.5,1.9.13.1,1.9.13.2,",
		"ListAlert":"Yes","ListDanger":"No",
		"ListError":"No","MonitorNumber":"28",
		"Parameter":"No","Period":"Day",
		"Title":"ll|1388991923544","WeekEndTime":"0",
		"creatTime":"2014-01-06 15:05:23","fileType":"html"
	},
	"return":{
		"return":"true"
	}
}
*/