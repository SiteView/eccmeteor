RenderTemplate = {};

/*
*渲染模板到选择器
* selector:jquery选择器.制定模板渲染结果的位置 string.
* template:模板名称 string
* context:模板上下文环境 object
* isReactive:是否依赖 活性数据源变化而变化. boolean .default : false;
* for example :
	假如Template的实例TestRender
	  	通过isReactive=false来实现:
			那么TestRender无法使用render，events等事件句柄。
				也就是说它仅作为一个html纯文本内容.无法依赖活性数据源.如:Session等。
				它的渲染 不会 导致其他Template重绘。
	  	通过isReactive=true 来实现:
	  		那么就可以像普通的Template对象那样拥有rendered，events等句柄。并可以依赖活性数据源.
	  		 	它的渲染 可能 会 导致其他Template重绘。
*/
Object.defineProperty(RenderTemplate,"renderIn",{
	value:function(selector,template,context,isReactive){
		var html = "";
		if(isReactive){
			html = Meteor.render(function(){
				return Template[template](context);
			});
		}else{
			html = Template[template](context);
		}
		$(selector).empty().html(html);
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
* selector:jquery选择器.制定模板渲染结果的位置 string.
* template:模板名称 string
* context:模板上下文环境 object
* isReactive:是否依赖 活性数据源变化而变化. boolean .default : true;
*/
Object.defineProperty(RenderTemplate,"showParents",{
	value:function(selector,template,context,isReactive){
		var _self = this;
		var html = "";
		if(typeof isReactive === "undefined"){
			isReactive = true;
		}
		if(isReactive){
			html = Meteor.render(function(){
				return Template[template](context);
			});
		}else{
			html = Template[template](context);
		}
		$(selector).empty().html(html);
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
		modal.modal("hide");
		var remove = function(){
			modal.remove()
		}
		modal.on("hidden",function(){
			Meteor.setTimeout(remove,1000);
		});
	}
});