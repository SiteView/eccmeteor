//小报告 线性画图
DrawMonitorModuleLine = function(){};
Object.defineProperty(DrawMonitorModuleLine,"clear",{
	value:function(selector){
		$(selector).empty();	
		d3.select(selector)
			.attr("height",150)
			.append("g")
			.append("text")
			.attr("x","50%")
			.attr("y","50%")
			.text("暂无数据")
			.style("text-anchor", "middle");	
		}
})

Object.defineProperty(DrawMonitorModuleLine,"draw",{
	value:function(data,selector,setting,xExtent){
		var originalData = null;
		for(var i = 0; i < data.length; i++){
			if(data[i].primary == "1" && data[i].drawimage == "1"){
				originalData = data[i];
				break;
			}
		}
		if(originalData == null){
			this.clear(selector);
			return;
		}
		var imageData = originalData.data;
		if(imageData.length === 0){
			this.drawEmptyLine(originalData,selector,setting);
			return;
		}
		var Xcoordinate =  "time"; //X坐标的属性
		var Ycoordinate = "date";//Y坐标的属性

		var yExtent = this.getYExtent(originalData);//Y 数轴范围
		//var xExtent = this.getXExtent(imageData,Xcoordinate);//X 数轴范围  已经传进来不用计算

		var label = originalData.lable;
		var width = setting.width  ? setting.width :750;
		var height = setting.height ? setting.height : 380;

		var dateformate = this.getDateFormat(xExtent);
		

		var isXAxisAction = dateformate.length > 8 ? true : false;//x轴是否需要做变动？
		var xAxisRotate = isXAxisAction ? -30 : 0; //x轴 坐标标签旋转角度
		var xAxisAnchor = "middle";//x轴 坐标标签对齐方式
		var xAxisTicks  = 12; //x数轴的段数
		var yAxisTicks  = 12; //y轴的段数

		var margin = {
			top : 20,
			left : 50
		};
		margin.top = isXAxisAction ? 40 : 20;
		//clear all
		d3.select(selector).text('');

		var svg = d3.select(selector)
			.attr("width", width )
			.attr("height", height);

		svg.append('g')
			.attr("transform", "translate("+(margin.left+1)+","+margin.top+ ")")
			.append("clipPath") //Make a new clipPath
			.attr("id", "lineArea") //Assign an ID 添加一个可渲染元素的区域
			.append("rect") //Within the clipPath, create a new rect
			.attr("width", width - margin.left)
			.attr("height",height - margin.top);

		var xScale = d3.time.scale()
			.domain(xExtent)
			.range([margin.left,width-margin.left])
			.nice();

		var yScale = d3.scale.linear()
			.domain(yExtent)
			.range([height-margin.top,margin.top])
			.nice();
		//辅助线
		svg.append('g')
			.attr("clip-path", "url(#lineArea)")
			.selectAll("line.horizontalGrid")
			.data(yScale.ticks(yAxisTicks/2)).enter()
    		.append("line")
        	.attr({
	            "class":"horizontalGrid",
	            "x1" : margin.left,
	            "x2" : width,
	            "y1" : function(d){ return yScale(d);},
	            "y2" : function(d){ return yScale(d);},
	            "fill" : "none",
	            "shape-rendering" : "crispEdges",
	            "stroke" : "lightgrey",
	            "opcity":0.7,
	            "stroke-width" : "1px"
       		});
        //曲线计算
		var line = d3.svg.line()
			.x(function (d) {
				return xScale(d[Xcoordinate]);
			})
			.y(function (d) {
				return yScale(d[Ycoordinate]);
			});

		svg.append('g')
			.attr("clip-path", "url(#lineArea)")
			.append("path")
			.datum(imageData)
			.attr("class", "line")
			.attr("d", line);

		var xAxis = d3.svg.axis()
			.scale(xScale)
			.ticks(xAxisTicks)
			.orient("bottom")
			.tickFormat(d3.time.format(dateformate));//"%H:%M"this.dateformate
			
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.ticks(yAxisTicks)
			.orient("left");

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (height-margin.top) + ")")
		.call(xAxis)
		.selectAll("text")
			.attr('transform','rotate('+xAxisRotate+')')
     		.style("text-anchor", xAxisAnchor)
     		.attr("dx",isXAxisAction ? "-20px" : "0");
		svg.append("g")
		.attr("transform", "translate("+margin.left+",0)")
		.attr("class", "axis")
		.call(yAxis);


		d3.select(selector).append("g")
		.append("text")
		.attr('font-size',12)
        .attr('fill',"#3a87ad")
        .attr('transform','translate(0,10)')
		.text(label);
	}
});

Object.defineProperty(DrawMonitorModuleLine,"drawEmptyLine",{
	value:function(data,selector,setting){
		//...
	}
});

Object.defineProperty(DrawMonitorModuleLine,"getYExtent",{
	value:function(data){
		var yExtent = [+data.min,+data.max];
		//判断Y轴方向的所有数据是否相同，如果相同则则设置区间为0-最大，否则取 最小值和最大值区间
		yExtent = yExtent[0] === yExtent[1] ? [0,yExtent[0]] : yExtent;
		if( yExtent[0] === yExtent[1] && yExtent[0] == 0){
			yExtent = [0,1];
		}
		return yExtent;
	}
});

Object.defineProperty(DrawMonitorModuleLine,"getDateFormat",{
	value:function(timeExtent){
		var second = (timeExtent[1].getTime() - timeExtent[0].getTime())/1000;
		var day = Math.ceil(second / (3600*24));
		if(day < 3){
			return "%H:%M";
		}else if(day < 31){
			return "%d %H:%M"
		}else{
			return "%m-%d %H:%M"
		}
	}
});