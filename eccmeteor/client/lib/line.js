/*
*画折线统计图
*Parameter:

*data : 画图数据数组 Needed

*setting:画图的一些属性设置 
	*key : 指定画图数据对象的画图属性 Needed
	*label :指定显示的标签	Needed
	*width : 图像的宽度	No Needed Default:650
	*height：图像的高度	No Needed Default:300

*selector:Dom 选择器 （类似jquery的选择器） Needed
*/
//DrawLine = function(data,key,label,selector){
//	this.svgDomId = "svg#line";
DrawLine = function(data,setting,selector){
	this.svgDomId = selector;
	this.key = setting.key;
	this.label = setting.label;
	this.width = setting.width  ? setting.width :650;
	this.height = setting.height ? setting.height : 300;
	this.data = data;
	this.dateformate = "%H:%M";
	this.drawLine = function(){ //折线统计图
		var primary = this.key;
		var margin = {
			top : 20,
			right : 20,
			bottom : 30,
			left : 60
		};
		var width = this.width - margin.left - margin.right;
		var height = this.height - margin.top - margin.bottom
		
		//clear all
		d3.select(this.svgDomId).text('');

		var svg = d3.select(this.svgDomId)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			

		var xScale = d3.time.scale()
			.domain(d3.extent(this.data, function (d) {
				return d.creat_time;
			}))
			.range([0, width])
			.nice();

		var yExtent = d3.extent(this.data, function (d) {
				return d[primary];
		})
		//判断Y轴方向的所有数据是否相同，如果相同则则设置区间为0-最大，否则取 最小值和最大值区间
		yExtent = yExtent[0] === yExtent[1] ? [0,yExtent[0]] : yExtent;
		
		var yScale = d3.scale.linear()
			.domain(yExtent)
			.range([height, 0])
			.nice();

		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom")
			.tickFormat(d3.time.format(this.dateformate));
			
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.ticks(5)
			.orient("left");


		var line = d3.svg.line()
			.x(function (d) {
				return xScale(d.creat_time);
			})
			.y(function (d) {
				return yScale(d[primary]);
			});

		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
		
		svg.append("g")
		.attr("class", "axis")
		.call(yAxis);

		svg.append("path")
			.datum(this.data)
			.attr("class", "line")
			.attr("d", line);

		d3.select(this.svgDomId).append("g")
		.append("text")
		.attr('font-size',12)
        .attr('fill',"#3a87ad")
        .attr('transform','translate(0,10)')
		.text(this.label);
	}
}