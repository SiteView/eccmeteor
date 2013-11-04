initLanguageAtStartUp = function(status){
	//初始化语言集合开始^^^^^^^^^^^^^^^^^^
	if(status === 0)
		return;
	SvseLanguage.remove({});
	var languages = AssetsUtils.getLanguages();
	if(!languages)
		return;
	var length = languages.length;
	for(var i = 0; i < length; i++){
		SvseLanguage.insert(languages[i]);
	}
	//初始化语言集合结束$$$$$$$$$$$$$$$$$$$
}