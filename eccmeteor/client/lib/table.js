DrawTable = function (){
	this.drawTable = function(dataset,domId){
		var trs = d3.select(domId).selectAll("tr").data(dataset);
		trs.enter().append("tr");//插入tr
		trs.exit().remove();//删除

		var tds = trs.selectAll("td").data(function(d){
			var td = [];
			for(property in d){
				if(property === "name") continue;
				td.push(d[property]);
			}
			return td;
		});
		tds.text(function(d){
			return d ? d : "";
		});
		tds.enter().append("td").text(function(d){
			return d ? d : "";
		});
		tds.exit().remove();	
	},
	this.drawTableWithCheckBox = function(dataset,domId){
		var trs = d3.select(domId).selectAll("tr").data(dataset);
		trs.attr("id",function(d,i){
			return "tr"+(i+1);
		})
		trs.enter().append("tr").attr("id",function(d,i){
			return "tr"+(i+1);
		});//插入tr
		trs.exit().remove();//删除

		var tds = trs.selectAll("td").data(function(d){
			var td = [];
			for(property in d){
				if(property === "name") continue;
				td.push(d[property]);
			}
			return td;
		});
		tds.text(function(d){
			return d ? d : "";
		});
		tds.enter().append("td").text(function(d){
			return d ? d : "";
		});
		tds.exit().remove();	
	}
}