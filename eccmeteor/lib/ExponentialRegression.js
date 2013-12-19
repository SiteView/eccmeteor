// 数据趋势算法。
/*
使用：
如果数据为number数组:
	ExponentialRegression.exp(data); 
	返回值为计算后的趋势数组
如果数据为 object 数组:  第一个参数是原数据集 ,第二个为需要计算趋势的属性
 	ExponentialRegression.exp(data,primary);
	如： people = [{name:"A",age:1},{name:"B",age:2},...];需要计算趋势的属性是age
	那么使用是： ExponentialRegression.exp(people,"age");
	无返回值,但是原数组每个对象里将增加i一个属性值，表示它的计算趋势后的值,如people将变为：
	[{name:"A",age:1,_exp_trend:1.5},{name:"B",age:2,_exp_trend:1.5},...]:
*/
ExponentialRegression = function(){};
//求平方
Object.defineProperty(ExponentialRegression,"square",{
	value:function(x){
		return Math.pow(x,2)
	}
});

//解析
Object.defineProperty(ExponentialRegression,"parse",{
	value:function(primary){
		if(primary){
   			return function(d){return d[primary]}
   		}
   		return function(d){return d}
	}
})

//重组数组
Object.defineProperty(ExponentialRegression,"exp",{
	value:function(Y,primary){
		if(Meteor.isServer){
			var d3 = Meteor.require("d3");
		}else{
			var d3 = window.d3;
		}
		if(typeof d3 === "undefined"){
			throw new Error("d3 can't be found");
		}
		var _self  = this;
   		var parse = _self.parse(primary);
		var n = Y.length;
		var X = d3.range(1,n+1);
		var sum_x = d3.sum(X)
		var sum_y = d3.sum(Y,function(d){
			return parse(d);
		});
		var y_mean = sum_y / n;
		var log_y = Y.map(function(d){return Math.log(parse(d))});
		var x_squared = X.map(function(d){return _self.square(parse(d))});
		var sum_x_squared = d3.sum(x_squared);
		var sum_log_y = d3.sum(log_y);
		var x_log_y = X.map(function(d,i){return parse(d)*log_y[i]});
		var sum_x_log_y = d3.sum(x_log_y);

		a = (sum_log_y*sum_x_squared - sum_x*sum_x_log_y) /
		  (n * sum_x_squared - _self.square(sum_x));

		b = (n * sum_x_log_y - sum_x*sum_log_y) /
		  (n * sum_x_squared - _self.square(sum_x));
		//如果为对象数组
		if(primary){
			X.forEach(function(x,i){
				Y[i]["_exp_trend"] = Math.exp(a)*Math.exp(b*x);
			});
			return ;
		}
		//非对象数组
		var y_fit = [];
		X.forEach(function(x){
			y_fit.push(Math.exp(a)*Math.exp(b*x));
		});
		return y_fit;
	}
});