/*求交集*/
ArrayUtils={};
Object.defineProperty(ArrayUtils,"intersect",{
	value:function(a,b){
		var al = a.length;
		var bl = b.length;
		var result = [];
		var tmpIndex =0;
		var tmp;
		for(var i = 0; i < al; i ++){
			if(tmpIndex === bl)
				break;
			for(var j = tmpIndex; j < bl; j++){
				if(a[i] === b[j]){
					if(tmpIndex !== j){
						tmp = b[j];
						b[j] = b[tmpIndex];
						b[tmpIndex] = tmp;
					}
					tmpIndex++;
					result.push(a[i]);
					break;
				}
				
			}
		}
		return result;
	}
});