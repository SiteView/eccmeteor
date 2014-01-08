/**
        构造函数 Timer 
        参数1  fn：需要循环调用的函数above
        参数2  time: 调用的间隔时间 ，单位为毫秒
        
        方法 start 
                        参数1  arg  数组 该数组依次为fn的参数，
                        参数2  runNow 布尔值  是否立刻执行调用方法。true为立刻调用。false为延迟调用，延迟时间为构造函数中time.默认为false
        方法 close 接收一个参数 time 单位为毫秒，表示time后 结束该方法的调用
        使用方法 eg
        function test(i){
                console.log(i);
        }
        var timer = new Timer(test,300);
        timer.start([5]);//开始调用
        timer.close();//结束调用
**/ 
function Timer(fn,time){
	var _self = this;
	_self.fn = fn;
	_self.time = time;
	_self.timer = {
		stop:null,
        _fn : function(arg){
            fn.apply(undefined,arg);
            _self.timer.$fn(arg);
        },
        __fn : function(arg){
            return function(){
                _self.timer._fn(arg);
            };
        },
        $fn : function(arg){
            _self.timer.stop = setTimeout(_self.timer.__fn(arg),time);
        },
        close : function(){
            clearTimeout(_self.timer.stop);
        }
    };
};

Timer.prototype.start = function(arg,runNow){
	var _self = this ;
    if(runNow){
    	_self.fn.apply(undefined,arg);
    }                   
    _self.timer.$fn(arg);
};

Timer.prototype.close = function(closetime){
	var _self = this ;
    if(!closetime || typeof closetime !== "number" || closetime < 0){
        _self.timer.close();
    }else{
        setTimeout(_self.timer.close,closetime);
    }
};

module.exports = Timer;