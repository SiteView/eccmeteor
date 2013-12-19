//小报告画图
DrawMonitorModuleLine = function(){};
Object.defineProperty(DrawMonitorModuleLine,"clear",{
	value:function(seleor){
		//....
	}
})

Object.defineProperty(DrawMonitorModuleLine,"draw",{
	value:function(data,selector,setting){
		var imageData = null;
		for(var i = 0; i < data.length; i++){
			if(data[i].primary == "1" && data[i].drawimage == "1"){
				imageData = data[i];
				break;
			}
		}
		if(imageData == null){
			this.clear(selector);
			return;
		}
		if(imageData.length === 0){
			this.drawEmptyLine(imageData,selector,setting);
			return;
		}
	}
});

Object.defineProperty(DrawMonitorModuleLine,"drawEmptyLine",{
	value:function(data,selector,setting){
		//...
	}
});