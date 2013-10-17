/**信息弹窗工具类
	使用方法:
	Message.error("这是错误提示");
	此方法会弹出一个看见窗体
	参数依次为:
	content:需要显示的文本内容  type:String
	setting:设置 type:Object 属性如下：
		time:3   窗体显示的时间,如：经过3秒后窗体自动关闭,若不指定则表示需要用户自己关闭. 默认为用户自己动作触发关闭 type:Int  单位:秒
		align:"center"  文本对齐方式 ,默认选项"center" ,可选选项:left|center|right

*/
Message = {
	error:function(content){
		var html = Meteor.render(function(){
			return Template.AlerBox({
				type:"error",
				content:content
			});
		})
		$("#MessageBoxModal").empty().append(html);
		$("#MessageBoxModal").modal("show");
	},
	warn:function(content){
		//block
		var html = Meteor.render(function(){
			return Template.AlerBox({
				type:"block",
				content:content
			});
		})
		$("#MessageBoxModal").empty().append(html);
		$("#MessageBoxModal").modal("show");
	},
	info:function(content){
		var html = Meteor.render(function(){
			return Template.AlerBox({
				type:"info",
				content:content
			});
		})
		$("#MessageBoxModal").empty().append(html);
		$("#MessageBoxModal").modal("show");
	}
}

