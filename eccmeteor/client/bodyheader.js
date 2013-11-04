Template.multilanguage.rendered = function(){
	var languages = LanguageModel.getLanguages(true);
	for(index in languages){
		var li = $("<li></li>");
		var a = $("<a tabindex='-1' href='#' name='"+languages[index].name+"'>"+languages[index].value+"</a>");
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
        Meteor.logout();
        Session.set("MoitorContentTreeRendered",false);
    }
});
