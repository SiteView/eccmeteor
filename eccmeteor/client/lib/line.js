DrawLine = function(data,key,label){
	this.svgDomId = "svg#line";
	this.key = key;
	this.label = label;
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
		var width = 650 - margin.left - margin.right;
		var height = 300 - margin.top - margin.bottom
		
		var x = d3.time.scale()
			.range([0, width]);

		var y = d3.scale.linear()
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.tickFormat(d3.time.format(this.dateformate));
			
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

		var line = d3.svg.line()
			.x(function (d) {
				return x(d.creat_time);
			})
			.y(function (d) {
				return y(d[primary]);
			});

		//clearALl
		d3.select(this.svgDomId).selectAll("g").remove();
		d3.select(this.svgDomId).selectAll("path").remove();
		d3.select(this.svgDomId).selectAll("line").remove();
		d3.select(this.svgDomId).selectAll("text").remove();
		
		var svg = d3.select(this.svgDomId)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		var testObj={};
		
		x.domain(d3.extent(this.data, function (d) {
				return d.creat_time;
			}));
		
		var minmax = d3.extent(this.data, function (d) {
				return d[primary];
		})
	
		//判断Y轴方向的所有数据是否相同，如果相同则则设置区间为0-最大，否则取 最小值和最大值区间
		if(minmax[0] === minmax[1]){		
			y.domain([0,minmax[0]]);	
		}else{
			y.domain(minmax);
		}
		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
		
		svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);
		
		d3.select(this.svgDomId).append("g")
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y",6)
		.attr("x",0-(height/2))
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text(this.label);;
		
		svg.append("path")
			.datum(this.data)
			.attr("class", "line")
			.attr("d", line);
	}
}