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
//===========================父节点为div的情况  
/*
*代理弹窗的modal("show") 
*接收一个Jquery选择器
*/
Object.defineProperty(RenderTemplate,"showParents",{
	value:function(selector,template,context){
		var _self = this;
		$(selector).empty().html(Meteor.render(function(){
			return Template[template](context);
		}));
		var modal = $(selector).children("div:first");
		modal.modal("show");
		modal.on("hidden",function(){
			modal.unbind('hidden')
			_self.destroyParents(selector);
		});
	}
});

/*
*清空模板
*/
Object.defineProperty(RenderTemplate,"destroyParents",{
	value:function(selector){
		$(selector).empty();
	}
})

/*
*代理弹窗的modal("hide")
*接收一个Tempalte实例
*/
Object.defineProperty(RenderTemplate,"hideParents",{
	value:function(t){
		$(t.find("div.modal")).modal("hide");
	}
});