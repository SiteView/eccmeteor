/*
*javascript自有对象扩展
*/
Date.prototype.format = function(format){
  var o = {
    "M+" : (this.getMonth()+1), //month 
    "d+" : this.getDate(),    //day 
    "h+" : this.getHours(),   //hour 
    "m+" : this.getMinutes(), //minute 
    "s+" : this.getSeconds(), //second 
    "q+" : Math.floor((this.getMonth()+3)/3),  //quarter 
    "S" : this.getMilliseconds() //millisecond 
  } 
  if(/(y+)/.test(format)) format=format.replace(RegExp.$1, 
    (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o)if(new RegExp("("+ k +")").test(format)) 
    format = format.replace(RegExp.$1, 
      RegExp.$1.length==1 ? o[k] : 
        ("00"+ o[k]).substr((""+ o[k]).length)); 
  return format; 
}
Object.defineProperty(Date,"str2Date",{
  value:function(str,format){
    var year = str.substr(format.indexOf("yyyy"),4); //year
    var month = str.substr(format.indexOf("MM"),2);//month 
    var day = str.substr(format.indexOf("dd"),2);//day
    var hour = str.substr(format.indexOf("hh"),2);//hour
    var minute = str.substr(format.indexOf("mm"),2);//minute
    var second = str.substr(format.indexOf("ss"),2);//hour
    var newStr = year+"/"+month+"/"+"/"+day+" "+hour+":"+minute+":"+second
    var d = new Date(newStr);
    return d;
  }
})