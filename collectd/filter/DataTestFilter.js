var DataTestFilter = function(){};

Object.defineProperty(DataTestFilter,"doFilter",{
	value:function(record,next){
		if(record.type == "memory"){
			console.log(record);
		}
	}
});
module.exports =  DataTestFilter;