/*
*parse guid 
*/
var Guid = function(){};
/*
* Parameter:
* 	guid: string
* Return : Object
	{
		companyId:
		entityId:
	}
*/
Object.defineProperty(Guid,"parse",{
	value:function(guid){
		var arr = guid.split("@");
		return {
			companyId:arr[0],
			entityId:arr[1]
		}
	}
});
module.exports = Guid;