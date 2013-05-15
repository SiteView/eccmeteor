/**
	构造函数UnrealThread 
	参数1  fn：需要循环调用的函数above
	参数2  time: 调用的间隔时间 ，单位为毫秒
	
	方法 start 接受一个数组参数 该数组依次为fn的参数
	方法 close 接收一个参数 time 单位为毫秒，表示time后 结束该方法的调用
	使用方法 eg
	function test(i){
		console.log(i);
	}
	var thread = new UnreaThread(test,300);
	thread.start([5]);//开始调用
	thread.close();//结束调用
**/
function UnrealThread(fn,time){
    var thread = {
        _fn : function(arg){
            fn.apply(undefined,arg)
            thread.$fn(arg);
        },
        __fn : function(arg){
            return function(){
                thread._fn(arg);
            };
        },
        $fn : function(arg){
            stop = Meteor.setTimeout(thread.__fn(arg),time);
        },
		close : function(){
			Meteor.clearTimeout(stop);
		}
    };
    this.start = function(arg){
		fn.apply(undefined,arg);
        thread.$fn(arg);
    };
	this.close = function(closetime){
		if(!closetime || typeof closetime !== "number" || closetime < 0){
			thread.close();
		}else{
			Meteor.setTimeout(thread.close,closetime);
		}
	};
}