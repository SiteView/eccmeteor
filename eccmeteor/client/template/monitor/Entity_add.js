Template.AddEntity.events = {
	"click #showEntityFormSaveBtn":function(e,t){
	//	var checkedTreeNode =  Session.get("checkedTreeNode");//该node为父节点
		var checkedTreeNode = SessionManage.getCheckedTreeNode();
		var arr = $("#showEntityForm").serializeArray();
		var property = {};
		for(index in arr){
			property[arr[index]["name"]] = arr[index]["value"];
		}
		if(!property["sv_dependson"]){
			property["sv_dependson"] = "";
		}
		var sv_devicetype = t.find("input:hidden").value;
		property["sv_devicetype"] =  sv_devicetype;
		var parentid =checkedTreeNode.id;
		var entity ={"property":property};
		LoadingModal.loading();
		SvseEntityTemplateDao.addEntity(entity,parentid,function(result){
			LoadingModal.loaded();
			RenderTemplate.hideParents(t);
			if(!result.status){
				Log4js.error("SvseEntityTemplateDao.addEntity 捕捉到错误");
				Log4js.error(result);
				return;
			}
			var entityid = result.option['id'];
			showQuickMonityTemplate(sv_devicetype,entityid); //处理动态监视器属性
		});
	},
	"click #showEntityFormCancelBtn":function(e,t){
		RenderTemplate.hideParents(t);
	},
	"click #showEntityTemplateAgainBtn":function(e,t){
		RenderTemplate.hideParents(t);
		var group = SvseEntityTemplateDao.getEntityGroup();
		RenderTemplate.showParents("#ChooseEntityTemplateForAddEntity","EntitiesGroupByType",{entityGroup:group});
	},
	"click .close":function(e,t){
		RenderTemplate.hideParents(t);
	},
	"keyup #showEntityForm input:first":function(e,t){
		t.find("input:text[name='sv_name']").value = e.currentTarget.value ;
	}
};


var showQuickMonityTemplate = function(entityDevicetype,addedEntityId){
	//addedEntityId = "1.26.19" ;//测试
	LoadingModal.loading();
	SvseMonitorTemplateDao.getQuickAddMonitorsAsync(entityDevicetype,addedEntityId,function(result){
		LoadingModal.loaded();
		if(!result.status){
			Log4js.error("SvseEntityTemplateDao.showQuickMonityTemplate 捕捉到错误");
		}else{
			monitors = result.context;
			RenderTemplate.showParents("#QuickAddMonitorModal","showQuickMonityTemplate",monitors);
		}
	});
}
