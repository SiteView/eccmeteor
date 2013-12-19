DrawStatusReport = function(){};

Object.defineProperty(DrawStatusReport,"getData",{
	value:function(monitorId,startTime,endTime,fn){
		Meteor.call(SvseMonitorDao.AGENT,"getMonitorReportDataByfilter",[monitorId,startTime,endTime,"sv_primary,sv_drawimage"],function(err,result){
			if(err){
				fn({status:false,msg:err})
				return;
			}
			fn({status:true,content:result});
			
		});
	}
});

//拼接时间格式
Object.defineProperty(DrawStatusReport,"buildTime",{
	value:function(obj){
		return obj.year + "-" + obj.month + "-" +  obj.day+ " " +obj.hour + ":" +obj.minute+":"+obj.second;
	}
})

Object.defineProperty(DrawStatusReport,"drawStatusBarChart",{
	value:function(data){
		var width = 660;
		var height = 30;
		//var el = window.document.querySelector('#statisticalList');
		var chart = d3.select("#statisticalList")
					.append('svg:svg')
					.attr('width', width)
					.attr('height', height)
					.append("g");

		var length = data.length;
		var averge = length === 0 ? width : width/length;
		var x = function(i){
			return i*averge;
		}
   		var color = this.chooseColor ;
   		chart.selectAll("rect").data(data)
   			.enter().append("rect")
   			.style({
   				"fill":function(d){
   					return color(d);
   			 	},
   				"stroke-width": 0
   			 })
 			.attr("x",function(d,i){return x(i)})//相当于function(d){return x(d);}  
 			.attr("y",0)//svg的坐标以左上角为原点，
 			.attr("width",averge) //获取散列值每段的长度 为矩形的宽  
 			.attr("height",height); // 通过函数1  function(d){return  (420/42)*d}  得到矩形的高  	
	}
})

Object.defineProperty(DrawStatusReport,"drawStatusPie",{
	value:function(data){
		//var el = window.document.querySelector('#statistical');
		var w = 250;
		var h = 250;
		var svg = d3.select("#statistical")
					.append('svg:svg')
					.attr('width', w)
					.attr('height', h)
					.append("g")
					.attr("class","pie");

		var color = this.chooseColor ;
		var pie = d3.layout.pie();
		pie.value(function(d){return d.count});
		var outerRadius = w / 2;
		var innerRadius = 0;
		var arc = d3.svg.arc()
					.innerRadius(innerRadius)
					.outerRadius(outerRadius);

		var arcs = svg.selectAll("g.arc")
				.data(pie(data));

		arcs.enter()
			.append("g")
				.attr("class", "arc")
				.attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")")
			.append("path")
				.attr("fill", function(d) {
					return color(d.data.status);
				})
			.attr("d", arc)
	}
})

Object.defineProperty(DrawStatusReport,"chooseColor",{
	value:function(d){
		if(typeof d === "string"){
			switch(d){
				case "ok" : return "green"; // ok
				case "disable" : return "gray"; //disable
				case "warn" : return "yellow";//warn
				case "error" : return "red"; //error;
				case "bad" : return  "black";//bad
	   		}
		}
		if(typeof d === "number"){
			switch(d){
				case 1 : return "green"; // ok
				case 2 : return "gray"; //disable
				case 3 : return "yellow";//warn
				case 4 : return "red"; //error;
				case 5 : return  "black";//bad
	   		}
   		}
	}
})