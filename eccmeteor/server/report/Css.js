Css = function(){};
//接收一个css文件名 或者一个css文件名的数组 ,如:"a.css" 或 ["a.css","b.css"]（该文件应该位于/private/report目录下））
//一个documents对象
Object.defineProperty(Css,"addStyle",{
	value:function(cssfile,document){
		var cssArr = [];
		if(typeof cssfile !== "string"){//如果是一个文件数组
			cssArr = cssfile;
		}else{
			cssArr.push(cssfile)
		}
		var cl = cssArr.length;
		var head = document.getElementsByTagName('head')[0];
		for(var i = 0; i< cl ; i++){
			var mainCss = AssetsUtils.getReportTemplate(cssArr[i]);
		    style = document.createElement("style");
		    style.type = 'text/css';
		    style.innerHTML = mainCss;
		    head.appendChild(style);
	    }
	}
});