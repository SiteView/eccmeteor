/*
*配置默认参数
*/
EccMeteorGlobelConfigure={
	LoggerSetting:{
		dateformat:"yyyy-MM-dd hh",//配置日志文件名采用通用的日期格式化模式
    	method4Server:"log2terminal",//设置默认服务端的日志记录方式 [log2txt,log2terminal]
    	method4Client:"log2Console",//设置客户端控制台打印格式
    	logRate:true  //日志是否分级显示(waring,error,normal分文件记录) 默认为true
	}
}