Template.UserPromission.events({
	"click button#cancel":function(e,t){
		RenderTemplate.hideParents(t);
	},
	"click button#save" :function(e,t){
		console.log("save");
	}
});

Template.UserPromission.rendered = function(){
	//init tree
	UserSettingPromissionAction.initTree(this);

	//get promission date and set them into Session
	UserSettingPromissionAction.initPromissionDate(this);
	
	//choose the profile's node own user  
	UserSettingPromissionAction.initChooseTreeNode(this)
}