
var SaveToDBFilter = require('./SaveToDBFilter');
FilterList = function(){};

Object.defineProperty(FilterList,"getFilterList",{
    value:function(){
        return [SaveToDBFilter];
    }
});

module.exports =  FilterList;