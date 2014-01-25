var SaveMonitorFilter = require('./SaveMonitorFilter');
var DataTestFilter = require('./DataTestFilter');
var StatusFilter = require('./StatusFilter');
var CompanyAndEnityFlagFilter = require('./CompanyAndEnityFlagFilter');
FilterList = function(){};

Object.defineProperty(FilterList,"getFilterList",{
    value:function(){
        return [StatusFilter,CompanyAndEnityFlagFilter,DataTestFilter,SaveMonitorFilter];
    }
});

module.exports =  FilterList;