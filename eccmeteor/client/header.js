Template.multilanguage.rendered = function(){
	var languages = Language.find().fetch();
	for(index in languages){
		var li = $("<li></li>");
		var a = $("<a tabindex='-1' href='#' name='"+languages[index].name+"'>"+languages[index].value._language+"</a>");
		li.append(a);
		$("#multi-language").append(li)
	}
}
Template.multilanguage.events = {
	"click #multi-language li a" : function(e){
		Session.set("language",e.target.name);
	}
}