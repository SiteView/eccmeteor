/*求交集*/
ArrayUtils={};
Object.defineProperty(ArrayUtils,"intersect",{
	value:function(a,b){
		var ai=0;
		var bi=0;
		var result = new Array();
		while( ai < a.length && bi < b.length ){
	     	if(a[ai] < b[bi] ){
				ai++;
	    	}else if(a[ai] > b[bi] ){
	      		bi++; 
	  		}else{
		       result.push(a[ai]);
		       ai++;
		       bi++;
	     	}
	  	}
	  return result;
	}
});