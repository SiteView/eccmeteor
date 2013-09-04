/*
*根据浏览器设置默认语言，完成国际化
*/
SessionManage.setLanguage(navigator.language.toLocaleUpperCase());
/*
*首次记载页面展示你内容
*/
SwithcView.layout(LAYOUTVIEW.NODE);
//SessionManage.setSvseId("1");
SessionManage.setCheckedTreeNode({
	id : "1",
	type:"se"
});
SwithcView.view(MONITORVIEW.GROUPANDENTITY);