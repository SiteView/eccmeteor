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
		SystemLogger(entity);
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
	//true表示获取快速添加的监视器列表
	var monitors = SvseEntityTemplateDao.getEntityMonitorByDevicetype(entityDevicetype,true); 
	var dynamicMonitorIds = [];
	var mLength =  monitors.length;
	//获取动态属性
	for(var i = 0 ; i < mLength; i++){
		if(!monitors[i]["property"]["sv_extradll"]){ //如果没有动态属性
			continue;
		}
		dynamicMonitorIds.push(monitors[i]["return"]["id"]);
		monitors[i]["isDynamicProperty"] = true ; //添加一个属性表明此监视器有动态属性 ####重要
	}
	if(!dynamicMonitorIds.length){ //如果动态属性不存在
		RenderTemplate.showParents("#QuickAddMonitorModal","showQuickMonityTemplate",{monitors:monitors,addedEntityId:addedEntityId});
		return;
	}
	//等待后台返回数据
	LoadingModal.loading();
	//查询相关的动态属性  结果返回一个动态属性数组
	/*
		格式为：
		[{
			temlpateId:temlpateId, //监视器模板id
			DynamicProperties:DynamicProperties //动态属性数组：如[“C:”,“D:”]等
		},...]
	*/
	SvseMonitorTemplateDao.getMonityDynamicPropertyDataArray(addedEntityId,dynamicMonitorIds,function(status,result){
		LoadingModal.loaded();
		if(!status){
			Message.error(result);
			return;
		}
		for(rIndex in result){
			for(var mIndex = 0; mIndex< mLength;mIndex++){
				if(result[rIndex]["templateId"] === monitors[mIndex]["return"]["id"]){
					monitors[mIndex]["DynamicProperties"] = result[rIndex]["DynamicProperties"];
					break;
				}
			}
		}
		RenderTemplate.showParents("#QuickAddMonitorModal","showQuickMonityTemplate",{monitors:monitors,addedEntityId:addedEntityId});
	});
}
