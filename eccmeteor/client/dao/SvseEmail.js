SvseEmailDao = {
	"getEmailList" : function(){
		return SvseEmailList.find({}).fetch();
	}
}