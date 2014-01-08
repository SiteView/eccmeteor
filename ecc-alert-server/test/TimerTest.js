var Timer = require('../Timer');
var Test = function(){};
Object.defineProperty(Test,"say",{
	value:function(name){
		console.log("hello" + name);
	}
});

var timer = new Timer(Test.say,1000);
timer.start(["Tom"]);
timer.close(5000);