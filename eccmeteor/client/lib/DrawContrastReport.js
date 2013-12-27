
DrawContrastReport = function(){}
//获取相关数据
Object.defineProperty(DrawContrastReport,"getDate",{
	value:function(monitorId,startTime,endTime,fn){
		Meteor.call(SvseMonitorDao.AGENT,"getMonitorReportData",[monitorId,startTime,endTime,"sv_primary,sv_drawimage"],function (err,result){
			if(err){
				fn({status:false,msg:err})
				return;
			}
			fn({status:true,content:result});
			console.log(result);
		});
		
	}
})

//拼接时间
Object.defineProperty(DrawContrastReport,"buildTime",{
	value:function(obj){
		return obj.year + "-" + obj.month + "-" +  obj.day+ " " +obj.hour + ":" +obj.minute+":"+obj.second;
	}
})

/*
//数据为空时画图
Object.defineProperty(DrawContrastReport,"drawEmptyLine",{
	value:function(originalData,startTime,endTime,fn){
		var label = originalData.lable;
		var width = 560;
		var height = 350;
		var dateformate = (endTime.getTime() - startTime.getTime())/1000 > 3600*24*2 
							? "%m-%d %H:%M"
							: "%H:%M";
		var xAxisTicks  = 5; //x数轴的段数
		var yAxisTicks  = 12; //y轴的段数
		var margin = {
			top : 20,
			left : 50
		};

		var isXAxisAction = dateformate.length > 5 ? true : false;//x轴是否需要做变动？
		var xAxisRotate =   isXAxisAction ? -25 : 0; //x轴 坐标标签旋转角度
		var xAxisAnchor = "middle";//x轴 坐标标签对齐方式
		margin.top = this.isXAxisAction ? 70 : 40;
		//var el = window.document.querySelector('#dataviz-container');

		var svg = d3.select("#ContrastDetailData")
					.append("div")
					.attr("class", "moresvg")
					.append('svg:svg')
					.attr('width', width)
					.attr('height', height);
		svg.append('g')
			.attr("transform", "translate("+(margin.left+1)+","+margin.top+ ")")
			.append("clipPath") //Make a new clipPath
			.attr("id", "lineArea") //Assign an ID 添加一个可渲染元素的区域
			.append("rect") //Within the clipPath, create a new rect
			.attr("width", width - margin.left)
			.attr("height",height - margin.top);

		var xScale = d3.time.scale()
			.domain([startTime,endTime])
			.range([margin.left, width-margin.left])
			.nice();

		var yExtent = [0,1];
	
		var yScale = d3.scale.linear()
			.domain(yExtent)
			.range([height-margin.top,margin.top])
			.nice();
		//辅助线
		svg.append('g')
			.attr("clip-path", "url(#lineArea)")
			.selectAll("line.horizontalGrid")
			.data(yScale.ticks(yAxisTicks)).enter()
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

		svg.append("g")
			.append("text")
			.attr('font-size',12)
	        .attr('fill',"#3a87ad")
	        .attr('transform','translate(0,10)')
			.text(label);
	}
})
*/
//画图
Object.defineProperty(DrawContrastReport,"drawLine",{
	value:function(originalData,startTime,endTime){
		var data = originalData.data ; //画图数据数组
		// if(data.length === 0){
			// this.drawEmptyLine(originalData,startTime,endTime);
			// return;
		// }
		var Xcoordinate =  "time"; //X坐标的属性
		var Ycoordinate = "date";//Y坐标的属性
		var label = originalData.lable;
		var width = 650;
		var height = 300;
		//判断时间间隔 大于2天
		var dateformate = (endTime.getTime() - startTime.getTime())/1000 > 3600*24*2 
							? "%m-%d %H:%M"
							: "%H:%M";
		var isXAxisAction = dateformate.length > 5 ? true : false;//x轴是否需要做变动？
		var xAxisRotate =   isXAxisAction ? -25 : 0; //x轴 坐标标签旋转角度
		var xAxisAnchor = "middle";//x轴 坐标标签对齐方式
		var xAxisTicks  = 12; //x数轴的段数
		var yAxisTicks  = 12; //y轴的段数

		var margin = {
			top : 20,
			left : 50
		};
		margin.top = this.isXAxisAction ? 70 : 40;
		//var el = window.document.querySelector('#dataviz-container');
		var svg = d3.select("#drowContrast")
					.append("div")
					.attr("class", "moresvg")
					.append('svg:svg')
					.attr('width', width)
					.attr('height', height)

		svg.append('g')
			.attr("transform", "translate("+(margin.left+1)+","+margin.top+ ")")
			.append("clipPath") //Make a new clipPath
			.attr("id", "lineArea") //Assign an ID 添加一个可渲染元素的区域
			.append("rect") //Within the clipPath, create a new rect
			.attr("width", width - margin.left)
			.attr("height",height - margin.top);

		var xScale = d3.time.scale()
			.domain([startTime,endTime])
			.range([margin.left, width-margin.left])
			.nice();

		var yExtent = [originalData.min,originalData.max]
	//	var yExtent = [0,originalData.max]
		//判断Y轴方向的所有数据是否相同，如果相同则则设置区间为0-最大，否则取 最小值和最大值区间
		yExtent = yExtent[0] === yExtent[1] ? [0,yExtent[0]] : yExtent;

		var yScale = d3.scale.linear()
			.domain(yExtent)
			.range([height-margin.top,margin.top])
			.nice();
		//辅助线
		svg.append('g')
			.attr("clip-path", "url(#lineArea)")
			.selectAll("line.horizontalGrid")
			.data(yScale.ticks(yAxisTicks)).enter()
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
        
        ExponentialRegression.exp(data,Ycoordinate);
        //曲线计算
		var line = d3.svg.line()
			.x(function (d) {
				return xScale(d[Xcoordinate]);
			})
			.y(function (d) {
				return yScale(d[Ycoordinate]);
			});

		//趋势线
		var trendLine = d3.svg.line()
			.x(function (d) {
				return xScale(d[Xcoordinate]);
			})
			.y(function (d) {
				return yScale(d["_exp_trend"]);
			});
		//正常曲线
		svg.append('g')
			.attr("clip-path", "url(#lineArea)")
			.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);
		//趋势曲线
		svg.append('g')
			.attr("clip-path", "url(#lineArea)")
			.append("path")
			.datum(data)
			.attr("class", "trendLine")
			.attr("d", trendLine);

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

		svg.append("g")
			.append("text")
			.attr('font-size',12)
	        .attr('fill',"#3a87ad")
	        .attr('transform','translate(0,10)')
			.text(label);
	}
});

/*	Object.defineProperty(DrawContrastReport,"draw",{
		value:function(imageData,st,et){
			var length = imageData.length;
			for(var i = 0; i < length; i++){
				if(imageData[i].drawimage === "1"){
					this.drawLine(imageData[i],st,et);
				}
			}
			//return window.document.innerHTML;
		}
	})
*/
Object.defineProperty(DrawContrastReport,"draw",{
	value:function(imageData,st,et){
		var length = imageData.length;
		for(var i = 0; i < length; i++){
			if(imageData[i].drawimage === "1"){
				this.drawLine(imageData[i],st,et);
			}
		}
		//return window.document.innerHTML;
	}
})
