/*
*根据浏览器设置默认语言，完成国际化
*/
SessionManage.setLanguage(navigator.language.toLocaleUpperCase());

Deps.autorun(function(c){
	if(SessionManage.isCollectionCompleted(CONLLECTIONMAP.SVSETREE)){
		/*/*
		*首次记载页面展示你内容*/	
		SwithcView.layout(LAYOUTVIEW.EquipmentsLayout);
		SessionManage.setCheckedTreeNode({
			id : "1",
			type:"se",
			name:SvseTreeDao.getNodeById("1","sv_name")
		});
		SwithcView.view(MONITORVIEW.GROUPANDENTITY);
		c.stop();
	}
});
//设置每页记录的默认条数
Session.setDefault("PERPAGE",10);
Session.setDefault("CURRENTPAGE",1);

Session.setDefault(Subscribe.LOADSVSEENTITYTEMPLATEGROUP,false);
Session.setDefault(Subscribe.LOADSVSEENTITYTEMPLATE,false);
Session.set(Subscribe.LOADSVSEMONITORTEMPLATE,false);

Session.setDefault("USERLOGINSUCCESS",false);