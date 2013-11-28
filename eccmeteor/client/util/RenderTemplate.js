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
*代理弹窗的modal("hide")
*接收一个Jquery选择器
*/
Object.defineProperty(RenderTemplate,"hide",{
	value:function(selector){
		var modal = $(selector);
		modal.on("hidden",function(){
			modal.parent("div").remove();
		});
		modal.modal("hide");
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
	}
});
//===========================
//父节点为div存在的情况下,Tempalte 
//已经包含所有的modal,modal-head,modal-body,modal-head.
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
	}
});

/*
*代理弹窗的modal("hide")
*接收一个Tempalte实例
*/
Object.defineProperty(RenderTemplate,"hideParents",{
	value:function(t){
		var modal = $(t.find("div.modal"));
		modal.on("hidden",function(){
			modal.parent("div").empty();
		});
		modal.modal("hide");
	}
});