var DataTestFilter = function(){};

Object.defineProperty(DataTestFilter,"doFilter",{
	value:function(record,next){
		console.log(record);
	}
});
module.exports =  DataTestFilter;