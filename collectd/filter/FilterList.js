var SaveToDBFilter = require('./SaveToDBFilter');
var DataTestFilter = require('./DataTestFilter');
var StatusFilter = require('./StatusFilter');
FilterList = function(){};

Object.defineProperty(FilterList,"getFilterList",{
    value:function(){
        return [StatusFilter,DataTestFilter,SaveToDBFilter];
    }
});

module.exports =  FilterList;