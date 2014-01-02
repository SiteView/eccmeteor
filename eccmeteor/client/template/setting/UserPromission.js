Template.UserPromission.events({
	"click button#cancel":function(e,t){
		RenderTemplate.hideParents(t);
	},
	"click button#save" :function(e,t){
		UserPromissionAction.userPromissionSave(e,t,this);
	}
});

Template.UserPromission.rendered = function(){
	//init tree
	UserPromissionAction.initTree(this);

	//get promission date and set them into Session
	UserPromissionAction.initPromissionData(this);
	
	//choose the profile's node own user  
	UserPromissionAction.initChooseTreeNode(this);

}