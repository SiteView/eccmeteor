var d3 = Meteor.require("d3");
var Jsdom = Meteor.require("jsdom");


DrawTimeContrastReport = function(){};

Object.defineProperty(DrawTimeContrastReport,"_option",{
	value:{
		htmlTemplate:"TimeContrastReport.html",
		CssTemplate:["TrendReport.css","table.css"]
	},
	writable:true
});

Object.defineProperty(DrawTimeContrastReport,"setOption",{
	value:function(template,css){
		this._option.htmlTemplate = template;
		this._option.css = css;
	}
});


Object.defineProperty(DrawTimeContrastReport,"getPrimaryKey",{
	value:function(monitorId){
		return SvseMonitorTemplateDaoOnServer.getReportDataPrimaryKey(monitorId);
	}
});

//获取相关数据
Object.defineProperty(DrawTimeContrastReport,"getMonitorRecords",{
	value:function(monitorId,timeArray){
		var r1 = SvseMonitorDaoOnServer.getMonitorReportData(monitorId,timeArray[0],timeArray[1]);
		var r2 = SvseMonitorDaoOnServer.getMonitorReportData(monitorId,timeArray[2],timeArray[3]);
		var t1 = this.buildTime(timeArray[0]) +"~"+ this.buildTime(timeArray[1]);
		var t2 = this.buildTime(timeArray[2]) +"~"+ this.buildTime(timeArray[3]);
		var result = [{
			result:r1,
			time:t1
		},{
			result:r2,
			time:t2
		}];
		return result;
	}
});
//数据为空时画图
Object.defineProperty(DrawTimeContrastReport,"drawEmptyLine",{
	value:function(window,originalData,startTime,endTime){
		var label = originalData.lable;
		var width = 800;
		var height = 450;
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
		var el = window.document.querySelector('#dataviz-container');

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
Object.defineProperty(DrawTimeContrastReport,"drawLine",{
	value:function(window,originalData,timeArray,type){
		var data = originalData.data ; //画图数据数组
		if(data.length === 0){
			this.drawEmptyLine(window,originalData,startTime,endTime);
			return;
		}
		var Xcoordinate =  "time"; //X坐标的属性
		var Ycoordinate = "date";//Y坐标的属性
		var label = originalData.lable;
		var width = 800;
		var height = 450;
		//判断时间间隔 大于2天
		//formate Date 
		var dateformate = "";
		switch(type){
			case:"day":dateformate="%H";
		}
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
		var el = window.document.querySelector('#dataviz-container');

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

//拼接时间
Object.defineProperty(DrawTimeContrastReport,"buildTime",{
	value:function(obj){
		return obj.year + "-" + obj.month + "-" +  obj.day+ " " +obj.hour + ":" +obj.minute+":"+obj.second;
	}
});

//根据查询条件返回结果
Object.defineProperty(DrawTimeContrastReport,"export",{
	value:function(monitorId,timeArray,type){
		var records = this.getMonitorRecords(monitorId,timeArray);//获取监视器原始数据
		var dataProcess = new TimeContrastReportDataProcess(records);//原始数据的基本处理 //客户端服务端通用
		var tableData = dataProcess.getTableData();
		var imageData = dataProcess.getImageData();
		var baseData = dataProcess.getBaseData();
		var nstartTime1 =  Date.str2Date(this.buildTime(timeArray[0]),"yyyy-MM-dd hh-mm-ss");
		var nendTime1 =  Date.str2Date(this.buildTime(timeArray[1]),"yyyy-MM-dd hh-mm-ss");
		var nstartTime2 = Date.str2Date(this.buildTime(timeArray[2]),"yyyy-MM-dd hh-mm-ss");
		var nendTime2 =  Date.str2Date(this.buildTime(timeArray[3]),"yyyy-MM-dd hh-mm-ss");
		
		var newDate = [nstartTime1,nendTime1,nstartTime2,nendTime2];

		var renderObj = {
			baseDate:baseData,
			tableData:tableData
		}
		var htmlStub = HtmlTemplate.render(this._option.htmlTemplate,renderObj);
		var document = Jsdom.jsdom(htmlStub,null,{
			features : {
				FetchExternalResources : ['css'],
			 	QuerySelector : true
			}
		});
	    Css.addStyle(this._option.CssTemplate,document);//添加css文件

		var window = document.parentWindow;
		return this.draw(imageData,window,newDate,type);
		
	}
});

Object.defineProperty(DrawTimeContrastReport,"draw",{
	value:function(imageData,window,timeArray,type){
		var length = imageData.length;
		for(var i = 0; i < length; i++){
			if(imageData[i].drawimage === "1"){
				this.drawLine(window,imageData[i],timeArray,type);
			}
		}
		return window.document.innerHTML;
	}
})