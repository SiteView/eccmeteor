SessionManage = {	/*	'tempdata' : {		'language' :"",//当前语言		'checkedTreeNode' : {}, //树选择的节点		'checkedMonitorId' :"", //选中的监视器节点		'addedEntityId' : ""//刚刚添加后的设备id	},	*/	set : function(name,value){		Session.set(name,value);	},		get : function(name){		return Session.get(name);	},		setLanguage : function(language){		Session.set("language",language);	},		getLanguage :  function(language){		return Session.get("language") ?　Session.get("language")　: "ZH-CN";	},		setCheckedTreeNode : function(node){	//	SessionManage.tempdata.checkedTreeNode = node;		Session.set("CHECKEDTREENODE",node);	},	getCheckedTreeNode : function(parameter){	//	return SessionManage.tempdata.checkedTreeNode;		return parameter ?  Session.get("CHECKEDTREENODE")[parameter] : Session.get("CHECKEDTREENODE");	},		setCheckedMonitorId : function(id){	//	SessionManage.tempdata.checkedMonitorId = id;		Session.set("CHECKEDMONITORID",id);	},		getCheckedMonitorId : function(){	//	return SessionManage.tempdata.checkedMonitorId;		return Session.get("CHECKEDMONITORID")	},		setAddedEntityId : function(id){		Session.set("ADDEDENTITYID",id);	},		getAddedEntityId:function(id){		return Session.get("ADDEDENTITYID")	}}