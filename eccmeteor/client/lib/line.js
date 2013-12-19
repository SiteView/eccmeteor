/*
*画折线统计图
*Parameter:

*data : 画图数据数组 Needed

*setting:画图的一些属性设置 
	*key : 指定画图数据对象的画图属性 Needed
	*label :指定显示的标签	Needed
	*width : 图像的宽度	No Needed Default:650
	*height：图像的高度	No Needed Default:350

*selector:Dom 选择器 （类似jquery的选择器） Needed
*/
//DrawLine = function(data,key,label,selector){
//	this.svgDomId = "svg#line";
DrawLine = function(data,setting,selector){
	this.svgDomId = selector;
	this.key = setting.key;
	this.label = setting.label;
	this.width = setting.width  ? setting.width :750;
	this.height = setting.height ? setting.height : 380;
	this.dateformate = setting.dateformate ? setting.dateformate :"%H:%M";
	this.isXAxisAction = this.dateformate.length > 5 ? true : false;//x轴是否需要做变动？
	this.xAxisRotate =   this.isXAxisAction ? -30 : 0; //x轴 坐标标签旋转角度
	this.xAxisAnchor =   "middle";//x轴 坐标标签对齐方式
	this.xAxisTicks  = 12; //x数轴的段数
	this.yAxisTicks  = 12; //y轴的段数
	this.data = data;
	this.drawLine = function(){ //折线统计图
		var primary = this.key;
		var margin = {
			top : 20,
			left : 50
		};
		margin.top = this.isXAxisAction ? 40 : 20;
		//clear all
		d3.select(this.svgDomId).text('');

		var svg = d3.select(this.svgDomId)
			.attr("width", this.width )
			.attr("height", this.height);

		svg.append('g')
			.attr("transform", "translate("+(margin.left+1)+","+margin.top+ ")")
			.append("clipPath") //Make a new clipPath
			.attr("id", "lineArea") //Assign an ID 添加一个可渲染元素的区域
			.append("rect") //Within the clipPath, create a new rect
			.attr("width", this.width - margin.left)
			.attr("height", this.height - margin.top);

		var xScale = d3.time.scale()
			.domain(d3.extent(this.data, function (d) {
				return d.creat_time;
			}))
			.range([margin.left, this.width-margin.left])
			.nice();

		var yExtent = d3.extent(this.data, function (d) {
				return d[primary];
			});
		//判断Y轴方向的所有数据是否相同，如果相同则则设置区间为0-最大，否则取 最小值和最大值区间
		yExtent = yExtent[0] === yExtent[1] ? [0,yExtent[0]] : yExtent;
		
		var yScale = d3.scale.linear()
			.domain(yExtent)
			.range([this.height-margin.top,margin.top])
			.nice();
		//辅助线
		svg.append('g')
			.attr("clip-path", "url(#lineArea)")
			.selectAll("line.horizontalGrid")
			.data(yScale.ticks(this.yAxisTicks/2)).enter()
    		.append("line")
        	.attr({
	            "class":"horizontalGrid",
	            "x1" : margin.left,
	            "x2" : this.width,
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
				return xScale(d.creat_time);
			})
			.y(function (d) {
				return yScale(d[primary]);
			});

		svg.append('g')
			.attr("clip-path", "url(#lineArea)")
			.append("path")
			.datum(this.data)
			.attr("class", "line")
			.attr("d", line);

		var xAxis = d3.svg.axis()
			.scale(xScale)
			.ticks(this.xAxisTicks)
			.orient("bottom")
			.tickFormat(d3.time.format(this.dateformate));//"%H:%M"this.dateformate
			
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.ticks(this.yAxisTicks)
			.orient("left");

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (this.height-margin.top) + ")")
		.call(xAxis)
		.selectAll("text")
			.attr('transform','rotate('+this.xAxisRotate+')')
     		.style("text-anchor", this.xAxisAnchor)
     		.attr("dx",this.isXAxisAction ? "-20px" : "0");
		svg.append("g")
		.attr("transform", "translate("+margin.left+",0)")
		.attr("class", "axis")
		.call(yAxis);


		d3.select(this.svgDomId).append("g")
		.append("text")
		.attr('font-size',12)
        .attr('fill',"#3a87ad")
        .attr('transform','translate(0,10)')
		.text(this.label);
	}
}