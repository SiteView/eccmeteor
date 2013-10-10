drawDie = function(data,selector){
	var getDataSet = function(data){
		var dataset = [];
		dataset.push(data.ok);
		dataset.push(data.warning);
		dataset.push(data.error);
		dataset.push(data.disable);
		return dataset;
	}
	var getTime  = function(data){
		return [data.starttime," - ",data.endtime];
	}
	var color = d3.scale.ordinal()
		.domain([0,1,2,3])
		.range(["#468847","#f89406","#b94a48","#999999"]);

	var dataset = getDataSet(data);
	var pie = d3.layout.pie();
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
			.attr("fill", function(d, i) {
				if(d.value === 0){
					d3.select(this).style({'stroke-width': 0})
				}
				return color(i);
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
				return d.value === 0 ? "" : d.value;
			});

	//update
	svg.selectAll("g.arc")
		.data(pie(dataset))
		.select("path")
			.attr("fill", function(d, i) {
				if(d.value === 0){
					d3.select(this).style({'stroke-width': 0})
				}
				return color(i);
			})
			.attr("d", arc)
		.select("text")
			.attr("transform", function(d) {
				return "translate(" + arc.centroid(d) + ")";
			})
			.attr("text-anchor", "middle")
			.text(function(d) {
				return d.value === 0 ? "" : d.value;
			});
	//时间段
	var time = d3.select(selector);
	var time = time.select("g.svgtime").empty()
					? time.append("g").attr("class","svgtime").attr("transform","translate(0,187)")
					:  time.select("g.svgtime")

	times = time.selectAll("text").data(getTime(data));
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