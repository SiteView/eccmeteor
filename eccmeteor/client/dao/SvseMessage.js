SvseMessageDao = {

	//获取短信集合列表
	"getMessageList": function(){
		return SvseMessageList.find({nIndex:{$exists:true}}).fetch();
	},
}