/**
提示信息类Dom对象
1.可用函数：error,warn,info
	获取一个html的字符串对象并插入指定的dom元素中
error(content[,setting])
参数说明:
	content:信息内容 ,类型：string ,必需
	setting:其他设置,类型 ：object，可选
		align:对齐方式,可选选项:left|center|right, 可选  默认为 left
		selector:css或者jquery元素选择器，当存在此值时，生产的字符将插入这个Dom对象;类型：string  可选;
		replace: 当selector存在时该参数有意义。为true时表示替换该selector元素的内容，否则插入到元素末尾;类型：bool；可选，默认为false
		close: 是否可以被用户关闭 ,true:是,false否 ;默认为true  可选
		id:为该提示信息div添加id ,可选.
返回值：html字符串
使用：
		MessageTip.info("hello world",{selector:"body div#hello",replace:true,close:false,id:"a1"},);
	或者
		MessageTip.info("hello world");
2 可用函数：close
  关闭指定提示信息
   id:在error|warn|info时设置的id
使用:
	MessageTip.close("id");
**/
MessageTip = {
	prefix:"_MESSAGETIOIDS_",
	getContent:function(content,type,setting){
		var contentObj = {
			align:"left",
			close:true,
			type:type,
			id:false,
			content:content,
		}
		var _setting = {
			selector:false,
			replace:false,	
		}
		if(setting && typeof(setting) === "object"){
			contentObj.id = setting.id ? MessageTip.prefix+id:false;
			if(setting.align && !!setting.align.match("^(left|right|center)$")){
				contentObj.align = setting.align;
			};
			contentObj.close = typeof(setting.close) === "undefined" ? true:!!setting.close;
			_setting.selector = typeof(setting.selector) === "string" ?  setting.selector : false;
			_setting.replace = !!setting.replace;
		}

		var html = Meteor.render(function(){
			return Template.MessageTip(contentObj);
		});

		if(_setting.selector){
			if(_setting.replace){
				$(_setting.selector).empty().html(html);
			}else{
				$(_setting.selector).append(html);
			}
		}
		return html;
	},
	error:function(content,setting){
		return MessageTip.getContent(content,"error",setting);
	},
	warn:function(content,setting){
		return MessageTip.getContent(content,"block",setting);
	},
	info:function(content,setting){
		return MessageTip.getContent(content,"info",setting);
	},
	success:function(content,setting){
		return MessageTip.getContent(content,"success",setting);
	},
	close:function(id){
		var sid = "#"+MessageTip.prefix + id
		$(sid).alert('close');
	}
}