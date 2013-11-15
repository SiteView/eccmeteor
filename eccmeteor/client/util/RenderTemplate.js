RenderTemplate = {};

/*
*渲染模板到选择器
* selector:jquery选择器.制定模板渲染结果的位置
* template:模板名称
* context:模板上下文环境
*/
Object.defineProperty(RenderTemplate,"renderIn",{
	value:function(selector,template,context){
		$(selector).empty().html(Meteor.render(function(){
			return Template[template](context);
		}));
	}
});
/*
*清空模板
*/
Object.defineProperty(RenderTemplate,"destroy",{
	value:function(selector){
		$(selector).empty();
		$(selector).removeAttr("tabindex").removeAttr("style").removeAttr("aria-hidden");
	}
})

/*
*代理弹窗的modal("hide")
*接收一个Jquery选择器
*/
Object.defineProperty(RenderTemplate,"hide",{
	value:function(selector){
		$(selector).modal("hide");
		$(selector).empty();
	}
});

/*
*代理弹窗的modal("show")
*接收一个Jquery选择器
*/
Object.defineProperty(RenderTemplate,"show",{
	value:function(selector,template,context){
		var _self = this;
		$(selector).empty().html(Meteor.render(function(){
			return Template[template](context);
		}));
		$(selector).modal("show");
		$(selector).on("hidden",function(){
			$(selector).unbind('hidden')
			console.log("destroy "+selector);
			_self.destroy(selector);

		});
	}
});