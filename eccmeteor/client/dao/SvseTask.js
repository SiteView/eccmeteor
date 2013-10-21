SvseTaskDao = {
	"getAllTaskNames":function(){
		var tasks = SvseTask.find().fetch();
		var names = [];
		names.push("");
		for(index in tasks){
			names.push(tasks[index]["sv_name"]);
		}
		return names;
	}
}