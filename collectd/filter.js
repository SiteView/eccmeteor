//数据加工处理
var FilterList = require('./filter/FilterList');

var Filter = function(){};

Object.defineProperty(Filter,"do",{
    value:function(record){
    	var _self = this; 
        var middlewareStack = FilterList.getFilterList();
        var next = function(){
            var middleware = middlewareStack.shift();
            if(middleware && middleware.doFilter){
                middleware.doFilter(record,next);
            }
        }
        next();
    }
});

module.exports = Filter;