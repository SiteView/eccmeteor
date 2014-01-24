var SaveToDBFilter = require('./SaveToDBFilter');
var DataTestFilter = require('./DataTestFilter');
FilterList = function(){};

Object.defineProperty(FilterList,"getFilterList",{
    value:function(){
        return [DataTestFilter,SaveToDBFilter];
    }
});

module.exports =  FilterList;