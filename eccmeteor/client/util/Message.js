var setContent = function(content,type,setting){
		var selector = "#MessageBoxModal";
		if(type === "close"){
			$(selector).modal("hide");
			return;
		}
		Log4js[type](content);
		type = type === "warn" ? "block" : type;//转成相应样式
		var obj = {
			align:"left",
			time:0,
			type:type,
			content:content
		};
		if(!setting){
			var html = Meteor.render(function(){
					return Template.AlerBox(obj);
				})
			$(selector).empty().append(html);
			$(selector).modal("show");
			return;
		}
		if(typeof(setting.time) === "number")
			obj.time = setting.time ;
		if(typeof(setting.align)== "string" && !!setting.align.match("^(left|center|right)$")){
			obj.align = setting.align
		}
		var html = Meteor.render(function(){
					return Template.AlerBox(obj);
				})
			console.log("4");
		$(selector).empty().append(html);
		$(selector).modal("show");
		console.log(obj.time);
		if(obj.time){
  			Meteor.setTimeout(Message.close,obj.time*1000);
		}
	}
/**信息弹窗工具类
1. error | warn | info | success
	使用方法:
	Message.error("这是错误提示");
	此方法会弹出一个看见窗体
	参数依次为:
	content:需要显示的文本内容   ----------参数类型:String  必需
	setting:设置 属性如下：      ---------参数类型:Object  可选
		time:3   窗体显示的时间,如：经过3秒后窗体自动关闭,若不指定则表示需要用户自己关闭. 默认为用户自己动作触发关闭 type:Int  单位:秒 为0时手动触发
		align:"center"  文本对齐方式 ,默认选项"left" ,可选选项:left|center|right
	用法如下：(测试的时候可以直接在浏览器的console运行)
	Message.info("hello word",{align:"center",time:1})
2. close
	手动强制关闭弹窗
*/
/**调整对象。避免不必要的函数暴露。**/
Message = {};
Object.defineProperties(Message,{
  "info":{
    "value":function(content,setting){
		setContent(content,"info",setting);
	},
    "writable": false,
    "enumerable": false,
    "configurable": false
  },
  "warn":{
    "value":function(content,setting){
		setContent(content,"warn",setting);
	}
  },
  "error":{
    "value":function(content,setting){
		setContent(content,"error",setting);
	}
  },
  "close":{
  	"value":function(){
		setContent(null,"close");
  	}
  },
  "success":{
  	"value":function(){
  		setContent(content,"success",setting);
  	}
  }
});