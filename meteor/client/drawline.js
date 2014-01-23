//小报告 线性画图
DrawMonitorModuleLine = function(){};

Object.defineProperty(DrawMonitorModuleLine,"draw",{
	value:function(data,selector){
		
		var Xcoordinate =  "date"; //X坐标的属性
		var Ycoordinate = "value";//Y坐标的属性

		var yExtent = this.getYExtent(data);//Y 数轴范围
		//var xExtent = this.getXExtent(imageData,Xcoordinate);//X 数轴范围  已经传进来不用计算

		var label = "CPU"

		var width = 750;
		var height = 380;
		var xExtent = [data[data.length-1].date,data[0].date];
		var dateformate = this.getDateFormat();
		
		var isXAxisAction = dateformate.length > 8 ? true : false;//x轴是否需要做变动？
		var xAxisRotate = isXAxisAction ? -30 : 0; //x轴 坐标标签旋转角度
		var xAxisAnchor = "middle";//x轴 坐标标签对齐方式
		var xAxisTicks  = 10; //x数轴的段数
		var yAxisTicks  = 12; //y轴的段数

		var margin = {
			top : 20,
			left : 50
		};
		margin.top = isXAxisAction ? 40 : 20;
		//clear all
	//	d3.select(selector).text('');

		var svg = d3.select(selector)
			.attr("width", width )
			.attr("height", height);

		if(d3.select("clipPath#lineArea").empty()){
			svg.append('g')
				.attr("transform", "translate("+(margin.left+1)+","+margin.top+ ")")
				.append("clipPath") //Make a new clipPath
				.attr("id", "lineArea") //Assign an ID 添加一个可渲染元素的区域
				.append("rect") //Within the clipPath, create a new rect
				.attr("width", width - margin.left)
				.attr("height",height - margin.top);
		}
		if(d3.select("text#label").empty()){
			d3.select(selector).append("g")
				.append("text")
				.attr("id","label")
				.attr('font-size',12)
		        .attr('fill',"#3a87ad")
		        .attr('transform','translate(0,10)')
		}
		d3.select("text#label").text(label);
		

		var xScale = d3.time.scale()
			.domain(xExtent)
			.range([margin.left,width-margin.left])
			.nice();

		var yScale = d3.scale.linear()
			.domain(yExtent)
			.range([height-margin.top,margin.top])
			.nice();
		/*
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
       	*/





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
			.datum(data)
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
	}
});


Object.defineProperty(DrawMonitorModuleLine,"getYExtent",{
	value:function(data){
		var yExtent = d3.extent(data,function(d){
			return d.value;
		});
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

Object.defineProperty(DrawMonitorModuleLine,"dynamicDraw",{
	value:function(data,seletor){
		if(!data.length){
			return;
		}
		var Xcoordinate =  "recordDate"; //1 //X坐标的属性
	//	var Xcoordinate =  "time" //2
		var Ycoordinate = "value";//Y坐标的属性

		var yExtent = this.getYExtent(data);//Y 数轴范围
		var xExtent = [data[data.length-1][Xcoordinate],data[0][Xcoordinate]];
		var label = "CPU",width = 750,height = 380;
		var dateformate = "%H:%M",isXAxisAction = false;//x轴是否需要做变动？
		var xAxisRotate = isXAxisAction ? -30 : 0; //x轴 坐标标签旋转角度
		var xAxisAnchor = "middle";//x轴 坐标标签对齐方式
		var xAxisTicks  = 10,yAxisTicks=12; //x,y数轴的段数

		var margin = {
			top : 20,
			left : 50
		};
		margin.top = isXAxisAction ? 40 : 20;

		var graph = d3.select(seletor)
			.attr("width", width )
			.attr("height", height);
		//1.
		var xScale = d3.time.scale()
			.domain(xExtent)
			.range([margin.left,width-margin.left])
			.nice();
		
		
		/*2
		var xScale = d3.scale.linear()
			.domain(xExtent)
			.range([0,width-margin.left]);
		*/
		var yScale = d3.scale.linear()
			.domain(yExtent)
			.range([height-margin.top,margin.top])
			.nice();
			

		var line = d3.svg.line()
			.x(function (d) {
				return xScale(d[Xcoordinate]);
			})
			.y(function (d) {
				return yScale(d[Ycoordinate]);
			})
			.interpolate("linear");
		/*
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
		*/
		if(d3.select("path#initPathId").empty()){
			graph.append("svg:path").attr("id","initPathId").attr("d", line(data));
		}else{
			
			graph.selectAll("path")
				.data([data]) // set the new data
				.attr("transform", "translate(" + xScale(data[data.length-1]) + ")") // set the transform to the right by x(1) pixels (6 for the scale we've set) to hide the new value
				.attr("d", line) // apply the new data values ... but the new value is hidden at this point off the right of the canvas
				.transition() // start a transition to bring the new value into view
				.ease("linear")
				.duration(2000) // for this demo we want a continual slide so set this to the same as the setInterval amount below
				.attr("transform", "translate(" + xScale(data[data.length-2]) + ")"); // animate a slide to the left back to x(0) pixels to reveal the new value
			/*
			graph.selectAll("path")
					.data([data]) // set the new data
					.attr("d", line); // apply the new data values
			*/
		}
		
	//	graph.selectAll("path").data([data]).enter().append("svg:path").attr("d", line)
	/*
		graph.selectAll("path")
					.data([data]) // set the new data
					.attr("transform", "translate(" + xScale(data[0]) + ")") // set the transform to the right by x(1) pixels (6 for the scale we've set) to hide the new value
					.attr("d", line) // apply the new data values ... but the new value is hidden at this point off the right of the canvas
					.transition() // start a transition to bring the new value into view
					.ease("linear")
					.duration(1000) // for this demo we want a continual slide so set this to the same as the setInterval amount below
					.attr("transform", "translate(" + xScale(data[1]) + ")"); // animate a slide to the left back to x(0) pixels to reveal the new value
	*/
	}
});