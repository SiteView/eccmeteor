var SaveMonitorFilter = require('./SaveMonitorFilter');
var DataTestFilter = require('./DataTestFilter');
var StatusFilter = require('./StatusFilter');
var CompanyAndEntityFilter = require('./CompanyAndEntityFilter');
var EntityAndMonitorFilter = require('./EntityAndMonitorFilter');
FilterList = function(){};

Object.defineProperty(FilterList,"getFilterList",{
    value:function(){
        return [StatusFilter,CompanyAndEntityFilter,EntityAndMonitorFilter,DataTestFilter,SaveMonitorFilter];
    }
});

module.exports =  FilterList;