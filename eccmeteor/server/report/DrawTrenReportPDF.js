/**
Object.defineProperty(DrawTrendReportPDF,"draw",{
	value:function(imageData,window,st,et){
		var length = imageData.length;
		for(var i = 0; i < length; i++){
			if(imageData[i].drawimage === "1"){
				this.drawLine(window,imageData[i],st,et);
			}
		}
		/*<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIx
MDAiIC8+PC9zdmc+" width="600" height="600">
		
		var more = window.document.querySelector('.moresvg');
		var beforeSvg = more.innerHTML;
		var afterSvg = new Buffer(beforeSvg).toString('base64');
	//	console.log(afterSvg);
	//	more.innerHTML = '<img src="data:image/svg+xml;base64,'+afterSvg+'" width="800" height="450">'
		more.innerHTML = '<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIC8+PC9zdmc+" width="600" height="600">'
		/*
		for(var j=0;j<more.length;j++){
			console.log(more[i]);
	//		console.log(new Buffer(more[i].innerHtml).toString('base64'))
		}
		*/
/*
		return window.document.innerHTML;
	}
})

*/