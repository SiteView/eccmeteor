Template.multilanguage.rendered = function(){
	var languages = LanguageModel.getLanguageKinds();
	$("#multi-language").empty();
	for(index in languages){
		var li = $("<li></li>");
		var a = $("<a tabindex='-1' href='#' name='"+languages[index][0]+"'>"+languages[index][1]+"</a>");
		li.append(a);
		$("#multi-language").append(li)
	}

}
Template.multilanguage.events = {
	"click #multi-language li a" : function(e){
		Session.set("language",e.currentTarget.name);
	}
}

Template.userLogging.events({
    "click a[data-action='logout']":function(){
    	Meteor.Router.to("/");
    }
});
