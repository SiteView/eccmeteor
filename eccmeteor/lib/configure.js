/*
*配置默认参数
*/
EccMeteorGlobelConfigure={
	LoggerSetting:{
		dateformat:"yyyy-MM-dd",//配置日志文件名采用通用的日期格式化模式
    	method4Server:"log2txt",//设置默认服务端的日志记录方式 [log2txt,log2terminal]
    	method4Client:"log2Console",//设置客户端控制台打印格式
    	logRate:true,  //日志是否分级显示(waring,error,normal分文件记录) 默认为true
    //	logDir:"/home/ec/log"  //设置录log存储位置  如果没有进行设置，则记录在meteor工程目录下的log文件夹中
	}
}