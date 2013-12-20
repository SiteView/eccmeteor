//小报告 饼状图
DrawMonitorModulePie = function(){};


Object.defineProperty(DrawMonitorModulePie,"chooseColor",{
	value:function(d){
		if(typeof d === "string"){
			switch(d){
				case "ok" : return "#468847"; // ok
				case "disable" : return "#999999"; //disable
				case "warn" : return "#f89406";//warn
				case "error" : return "#b94a48"; //error;
				case "bad" : return  "black";//bad
	   		}
		}
		if(typeof d === "number"){
			switch(d){
				case 1 : return "#468847"; // ok
				case 2 : return "#999999"; //disable
				case 3 : return "#f89406";//warn
				case 4 : return "#b94a48"; //error;
				case 5 : return  "black";//bad
	   		}
   		}
	}
});

Object.defineProperty(DrawMonitorModulePie,"getData",{
	value:function(data){
		var arr = [];
		for(x in data){
			arr.push({status:x,count:data[x]});
		}
		return arr;
	}
})

Object.defineProperty(DrawMonitorModulePie,"draw",{
	value:function(data,selector,XExtent){
		var dataset = this.getData(data);
		var arcPrimary = "count";
		var arcforeign = "status";
		var color = this.chooseColor ;

		var pie = d3.layout.pie();
		pie.value(function(d){return d[arcPrimary]});
		var w = 150;
		var h = 150;
		var outerRadius = w / 2;
		var innerRadius = 0;
		var arc = d3.svg.arc()
					.innerRadius(innerRadius)
					.outerRadius(outerRadius);

		var svg = d3.select(selector);
		var svg = svg.select("g.pie").empty() 
				  ? svg.append("g").attr("class","pie").attr("transform", "translate(60,0)")
				  :svg.select("g.pie")

		var arcs = svg.selectAll("g.arc")
					.data(pie(dataset));
		//Set up groups Add
		arcs.enter()
			.append("g")
				.attr("class", "arc")
				.attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")")
			.append("path")
				.attr("fill", function(d) {
					if(d.data[arcPrimary] === 0){
						d3.select(this).style({'stroke-width': 0})
					}
					return color(d.data[arcforeign]);
				})
				.attr("d", arc)
		//remove
		arcs.selectAll('text').remove();
		arcs.append("text")
				.attr("transform", function(d) {
					return "translate(" + arc.centroid(d) + ")";
				})
				.attr("text-anchor", "middle")
				.text(function(d) {
					return d.data[arcPrimary] === 0 ? "" : d.data[arcPrimary];
				});

		//update
		svg.selectAll("g.arc")
			.data(pie(dataset))
			.select("path")
				.attr("fill", function(d, i) {
					if(d.data[arcPrimary] === 0){
						d3.select(this).style({'stroke-width': 0})
					}
					return color(d.data[arcforeign]);
				})
				.attr("d", arc)
			.select("text")
				.attr("transform", function(d) {
					return "translate(" + arc.centroid(d) + ")";
				})
				.attr("text-anchor", "middle")
				.text(function(d) {
					return d.data[arcPrimary] === 0 ? "" : d.data[arcPrimary];
				});
		//时间段
		var time = d3.select(selector);
		var time = time.select("g.svgtime").empty()
						? time.append("g").attr("class","svgtime").attr("transform","translate(0,187)")
						:  time.select("g.svgtime")
		var timeLabel = [XExtent[0].format("yyyy-MM-dd hh:mm:ss"),"-",XExtent[0].format("yyyy-MM-dd hh:mm:ss")]
		times = time.selectAll("text").data(timeLabel);
		times.enter().append("text")
				.attr("width",function(d,i){
					return i == 1 ? 14 : 134;
				})
				.attr("transform",function(d,i){
					return i == 2 ? "translate("+i*140+14+",0)" :"translate("+i*140+",0)";
				})
				.text(function(d){return d})
		times.attr("width",function(d,i){
					return i == 1 ? 14 : 134;
				})
				.attr("transform",function(d,i){
					return i == 2 ? "translate("+(140+14)+",0)" :"translate("+i*140+",0)";
				})
				.text(function(d){return d})
	}
});