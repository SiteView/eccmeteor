CONLLECTIONMAP={	SVSE:"SVSE",	SVSETREE:"SVSETREE",},/**		Type:fix bug		Author:huyinghuan		Date:2013-10-16 16:20		Content:增加一个MAP字符串映射		-----------CHECKEDENTITYTEMPLATEID:"CHECKEDENTITYTEMPLATEID"------------**/SessionManage = {	MAP : {		CHECKEDTREENODE:"CHECKEDTREENODE",//存储选中的树节点		CHECKEDMONITORID:"CHECKEDMONITORID",//存储选中的监视器ID		ADDEDENTITYID:"ADDEDENTITYID",//存储添加的设备ID （用于快速添加监视器）		MONITORTEMPLATEID:"MONITORTEMPLATEID",//存储添加监视器时 或者修改监视器时，所选监视器类型在监视器模板的ID		//checkedEntityTemplateId(此ID实际为设备的类型,如：_CiscoNetDev),在添加设备时，选择设备模板时，存储该模板的类型，供快速添加监视器使用		CHECKEDENTITYTEMPLATEID:"CHECKEDENTITYTEMPLATEID",	//	SVSEID:"SVSEID",	//	ENTITYID:"ENTITYID",		MONITORRUNTIMETABLEDATA:"MONITORRUNTIMETABLEDATA",//监视器运行时数据		MONITORSTATISTICALDETAILTABLEDATA:"MONITORSTATISTICALDETAILTABLEDATA",		language:"language",		ENTITYFILTER:"ENTITYFILTER"	},	set : function(name,value){		Session.set(name,value);	},		get : function(name){		return Session.get(name);	},		setLanguage : function(language){		Session.set(SessionManage.MAP.language,language);	},		getLanguage :  function(language){		return Session.get(SessionManage.MAP.language) 				?　Session.get(SessionManage.MAP.language)　				: "ZH-CN";	},		setCheckedTreeNode : function(node){		Session.set(SessionManage.MAP.CHECKEDTREENODE,node);	},	getCheckedTreeNode : function(parameter){		var node = Session.get(SessionManage.MAP.CHECKEDTREENODE);		if(!node){			return null;		}		return parameter ?  node[parameter] :  node;	},		setCheckedMonitorId : function(id){		Session.set(SessionManage.MAP.CHECKEDMONITORID,id);	},		getCheckedMonitorId : function(){		return Session.get(SessionManage.MAP.CHECKEDMONITORID)	},	setMonitorTemplateId : function(id){		Session.set(SessionManage.MAP.MONITORTEMPLATEID,id);	},	getMonitorTemplateId : function(){		return Session.get(SessionManage.MAP.MONITORTEMPLATEID);	},	setAddedEntityId : function(id){		Session.set(SessionManage.MAP.ADDEDENTITYID,id);	},		getAddedEntityId:function(id){		return Session.get(SessionManage.MAP.ADDEDENTITYID)	},	getCollectionCompleteFlag:function(conllectionName){		return Session.get(conllectionName);	},	setCollectionCompleteFlag:function(conllectionName){		Session.set(conllectionName,true);	},	setEntityListFilter:function(filter){		Session.set(SessionManage.MAP.ENTITYFILTER,filter);	},	getEntityListFilter:function(){		return Session.get(SessionManage.MAP.ENTITYFILTER);	},	/*	*这一部分属于监视器数据折线统计图表等相关	*/	/* ============开始=================*/	setMonitorRuntimeTableData:function(data){		Session.set(SessionManage.MAP.MONITORRUNTIMETABLEDATA,data);	},	getMonitorRuntimeTableData:function(){		return Session.get(SessionManage.MAP.MONITORRUNTIMETABLEDATA);	},	setMonitorStatisticalDetailTableData:function(data){		Session.set(SessionManage.MAP.MONITORSTATISTICALDETAILTABLEDATA,data);	},	getMonitorStatisticalDetailTableData:function(){		return Session.get(SessionManage.MAP.MONITORSTATISTICALDETAILTABLEDATA);	},	clearMonitorRuntimeDate:function(){		Session.set(SessionManage.MAP.MONITORRUNTIMETABLEDATA,null);		Session.set(SessionManage.MAP.MONITORSTATISTICALDETAILTABLEDATA,null);	},	/* =============结束=================*/	/*	*清空所有	*/	clear:function(){		SessionManage.clearMonitorRuntimeDate();	},	/*	*处理Collection的订阅事件	*/	collectionCompleted:function(collectionName){		Session.set(collectionName,true);	},	isCollectionCompleted:function(collectionName){		return Session.get(collectionName);	}}