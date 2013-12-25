Template.UserPromission.events({
	"click button#cancel":function(e,t){
		RenderTemplate.hideParents(t);
	},
	"click button#save" :function(e,t){
		console.log("save");
	}
});