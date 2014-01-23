var d3 = Meteor.require("d3");
var Jsdom = Meteor.require("jsdom");
 //统计报告
DrawStatiscsReport = function(){}

Object.defineProperty(DrawStatiscsReport,"_option",{
	value:{
		htmlTemplate:"StatisticsReportGraphicMonitoring.html",
		CssTemplate:["StatisticsReportGraphicMonitoring.css"]
	},
	writable:true
});

//数据为空时画图
Object.defineProperty(DrawStatiscsReport,"drawEmptyLine",{
	value:function(window,originalData,dateExtent){
		var startTime =  dateExtent[0];
		var endTime = dateExtent[1];
		var label = originalData.lable;
		var width = 600;
		var height = 300;
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
		var el = window.document.querySelector('#content');

		var svg = d3.select(el)
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
			.domain(startTime,endTime)
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
});


//画图
Object.defineProperty(DrawStatiscsReport,"drawLine",{
	value:function(window,originalData,dateExtent){
		var data = originalData.data ; //画图数据数组
		if(data.length === 0){
			this.drawEmptyLine(window,originalData,dateExtent);
			return;
		}
		var Xcoordinate =  "time"; //X坐标的属性
		var Ycoordinate = "data";//Y坐标的属性
		var label = originalData.lable;
		var width = 600;
		var height = 300;
		//判断时间间隔 大于2天
		var dateformate = (dateExtent[0].getTime() - dateExtent[1].getTime())/1000 > 3600*24*2 
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
		var el = window.document.querySelector('#content');

		var svg = d3.select(el)
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
			.domain(dateExtent)
			.range([margin.left, width-margin.left])
			.nice();

		var yExtent = [+originalData.min,+originalData.max]
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
        
     
        //曲线计算
		var line = d3.svg.line()
			.x(function (d) {
				return xScale(d[Xcoordinate]);
			})
			.y(function (d) {
				return yScale(d[Ycoordinate]);
			});

	
		//正常曲线
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

		svg.append("g")
			.append("text")
			.attr('font-size',12)
	        .attr('fill',"#3a87ad")
	        .attr('transform','translate(0,10)')
			.text(label);
	}
});

Object.defineProperty(DrawStatiscsReport,"draw",{
	value:function(imageData,dateExtent){
		var htmlStub = HtmlTemplate.render(this._option.htmlTemplate);
		var document = Jsdom.jsdom(htmlStub,null,{
			features : {
				FetchExternalResources : ['css'],
			 	QuerySelector : true
			}
		});
	    Css.addStyle(this._option.CssTemplate,document);//添加css文件
		var window = document.parentWindow;

		var length = imageData.length;
		for(var i = 0; i < length; i++){
			this.drawLine(window,imageData[i],dateExtent);
		}
		return window.document.innerHTML;
	}
});