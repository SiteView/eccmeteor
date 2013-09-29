drawDie = function(data,selector){
	var getDataSet = function(data){
		var dataset = [];
		dataset.push(data.ok);
		dataset.push(data.warning);
		dataset.push(data.error);
		dataset.push(data.disable);
		return dataset;
	}

	var color = d3.scale.ordinal()
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

	var svg = d3.select(selector)
		.attr("width", w)
		.attr("height", h)  
		.append("g")
	 

	//Set up groups
	var arcs = svg.selectAll("g.arc")
		.data(pie(dataset))
		.enter()
		.append("g")
		.attr("class", "arc")
		.attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");

	//Draw arc paths
	arcs.append("path")
		.attr("fill", function(d, i) {
			return color(i);
		})
		.attr("d", arc);



	arcs.append("text")
		.attr("transform", function(d) {
			console.log(d);
			return "translate(" + arc.centroid(d) + ")";
		})
		.attr("text-anchor", "middle")
		.text(function(d) {
			return d.value === 0 ? "" : d.value;
		});
}