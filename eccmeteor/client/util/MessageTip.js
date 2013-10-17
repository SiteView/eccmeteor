MessageTip = {
	error:function(content){
		return Meteor.render(function(){
			return Template.MessageTip({
				type:"error",
				content:content
			});
		})
	},
	warn:function(content){
		return Meteor.render(function(){
			return Template.MessageTip({
				type:"block",
				content:content
			});
		})
	},
	info:function(content){
		return Meteor.render(function(){
			return Template.MessageTip({
				type:"info",
				content:content
			});
		})
	}
}