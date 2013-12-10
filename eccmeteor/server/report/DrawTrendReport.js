var d3 = Meteor.require("d3");
var Jsdom = Meteor.require("jsdom");

 //趋势报告
DrawTrendReport = function(){}

Object.defineProperty(DrawTrendReport,"_option",{
	value:{
		htmlTemplate:"TrendReport.html",
		CssTemplate:"TrendReport.css"
	}
})

Object.defineProperty(DrawTrendReport,"getPrimaryKey",{
	value:function(monitorId){
		return SvseMonitorTemplateDaoOnServer.getReportDataPrimaryKey(monitorId);
	}
});

//获取相关数据
Object.defineProperty(DrawTrendReport,"getMonitorRecords",{
	value:function(monitorId,startTime,endTime){
		return SvseMonitorDaoOnServer.getMonitorRuntimeRecordsByTime(monitorId,startTime,endTime);
	}
})

//画图
Object.defineProperty(DrawTrendReport,"drawLine",{
	value:function(data,foreigkeys,window){
		var primary = foreigkeys["monitorPrimary"];
		var label =foreigkeys["monitorDescript"];
		var width = 800;
		var height = 600;
		var dateformate = "%H:%M";
		var isXAxisAction = dateformate.length > 5 ? true : false;//x轴是否需要做变动？
		var xAxisRotate =   isXAxisAction ? -30 : 0; //x轴 坐标标签旋转角度
		var xAxisAnchor =   "middle";//x轴 坐标标签对齐方式
		var xAxisTicks  = 12; //x数轴的段数
		var yAxisTicks  = 12; //y轴的段数

		var margin = {
			top : 20,
			left : 50
		};
		margin.top = isXAxisAction ? 40 : 20;

		var el = window.document.querySelector('#dataviz-container');

		var svg = d3.select(el)
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
			.domain(d3.extent(data, function (d) {
				return d.creat_time;
			}))
			.range([margin.left, width-margin.left])
			.nice();

		var yExtent = d3.extent(data, function (d) {
				return d[primary];
			})
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
        
        ExponentialRegression.exp(data,primary);
        //曲线计算
		var line = d3.svg.line()
			.x(function (d) {
				return xScale(d.creat_time);
			})
			.y(function (d) {
				return yScale(d[primary]);
			});

		//趋势线
		var trendLine = d3.svg.line()
			.x(function (d) {
				return xScale(d.creat_time);
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

		return window.document.innerHTML;
	}
});

//拼接时间
Object.defineProperty(DrawTrendReport,"buildTime",{
	value:function(obj){
		return obj.year + "-" + obj.month + "-" +  obj.day+ " " +obj.hour + ":" +obj.minute+":"+obj.second;
	}
})
/*
	获取模板渲染的对象
*/
Object.defineProperty(DrawTrendReport,"getTemplateRenderInfo",{
	value:function(monitorId,keys,st,et){
		var entityId = monitorId.substr(0,monitorId.lastIndexOf("\."));
		var entity  = SvseTree.findOne({sv_id:entityId});
		var monitor = SvseTree.findOne({sv_id:monitorId});
		var info = {};
		
		info.startTime = this.buildTime(st);
		info.endTime =  this.buildTime(et);
		
		if(!entity || !monitor){
			return {};
		}

		info.entityName = entity.sv_name;
		info.monitorName = monitor.sv_name;
		console.log(EJSON.stringify(keys));
		info.max = keys[0].max;
		info.min = keys[0].min;
		info.mean = keys[0].mean;
		info.last = "Test";
		info.maxTime = "Test";
		info.returnName = "Test";
		return info;
	}
});

//根据查询条件返回结果
Object.defineProperty(DrawTrendReport,"export",{
	value:function(monitorId,startTime,endTime){
		var foreigkeys = this.getPrimaryKey(monitorId);
		console.log(foreigkeys);
		if(!foreigkeys){
			Log4j.warn("监视器"+id+"不能获取画图数据");
			return;
		}
		var records = this.getMonitorRecords(monitorId,startTime,endTime);
	//	Log4js.info(records);
		return;
		var dataProcess = new MonitorDataProcess(records,foreigkeys["monitorForeignKeys"]);
		var resultData = dataProcess.getData();
		//var keysData = dataProcess.getKeysData();
		//var renderObj = this.getTemplateRenderInfo(monitorId,keysData,startTime,endTime);
		var htmlStub = HtmlTemplate.render(this._option.htmlTemplate,{render:{}});
		var document = Jsdom.jsdom(htmlStub,null,{
			features : {
				FetchExternalResources : ['css'],
			 	QuerySelector : true
			}
		});
	    Css.addStyle(this._option.CssTemplate,document);//添加css文件
		var window = document.parentWindow;
		return this.drawLine(resultData,foreigkeys,window);
	}
});