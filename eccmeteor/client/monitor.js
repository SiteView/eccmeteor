Template.body.viewstatus = function () { //视图控制
	return Session.get("viewstatus");
}

Template.showGroupAndEntity.svid = function () {
	return Session.get("svid");
}

Template.showMonitor.entityid = function () {
	return Session.get("entityid");
}

Template.showMonitor.events={
	"click tbody tr":function(e){
		var id  = e.currentTarget.id;
		var status = e.currentTarget.title;
		if(!id || id=="") return;
		var ID = {id:id,type:"monitor"}
		Session.set("checkedMonitorId",ID);//存储选中监视器的id
		if(status !== "ok"){
			SystemLogger("Monitor "+id+" status is"+status+",coould no parse the data.");
			return;
		}
		drawImage(id);
	}
}

Template.recordsData.recordsData = function(){
	return Session.get("recordsData");
}

//画图前 获取相关数据
function drawImage(id,count){
	if(!count) var count = 200;
	//var monitor = SvseTree.findOne({sv_id:id});//找到该监视器所依赖的监视器模板
	var monitor = SvseTreeDao.getNodeById(id);//找到该监视器所依赖的监视器模板
	if(!monitor)return; //如果该监视器不存在，不划线
	var monitorTypeId = monitor.sv_monitortype+""; //获取监视器模板ID
	SystemLogger("Monitor ID is: "+id+"  and its monitor template ID is  "+ monitorTypeId);
	//获取监视器模板	
	//var monitorTemplate = SvseMonitorTemplate.findOne({"return.id" : monitorTypeId});
	var monitorTemplate = SvseMonitorTemplateDao.getTemplateById(monitorTypeId);
	//SystemLogger(monitorTemplate);
	//遍历 模板对象，找到 画图数据的主键，定义找到主键标志
	var findFlag = false;
	var monitorPrimary = "";
	var monitorDescript = "";
	var monitorForeignKeys = []; //定义 数据主副键的数组，用来求最大、平均等
	for (property in monitorTemplate) {
		if (property.indexOf("ReturnItem") != -1) { //主键包含在ReturnItem1，ReturnItem2,..等属性中
			var template = monitorTemplate[property];
			if (template["sv_primary"] === "1" && template["sv_drawimage"] == "1") {  //判断是否为主键和是否可以画图
				monitorPrimary = template["sv_name"];
				monitorDescript = template["sv_label"];
				SystemLogger("画图属性为"+property+"画图主键为  "+monitorPrimary + "画图说明"+monitorDescript);
				findFlag = true;
				monitorForeignKeys.push({name:template["sv_name"],label:template["sv_label"]});
			}else{
				monitorForeignKeys.push({name:template["sv_name"],label:template["sv_label"]});
			}
		}
	}
	//获取画图数据
	
	 //如果没有找到画图主键，或者不能画图 ，返回。
	if(!findFlag) 
	{
		SystemLogger("监视器 "+ id+"不能绘制图形");
		return;
	}
	
	//获取画图数据
	Meteor.call("getQueryRecords",id,count, function (err, result) {
		if(err){
			SystemLogger(err);
			return;
		}	
		var dataProcess = new DataProcess(result,monitorForeignKeys);
		var resultData = dataProcess.getData();
		var recordsData = dataProcess.getRecordsDate();
		var keys = dataProcess.getDataKey();
		var table = new DrawTable();//调用 client/lib 下的table.js 中的drawLine函数画图
		table.drawTable(keys,"#tableData");
		var line = new DrawLine(resultData,monitorPrimary,monitorDescript);
		line.drawLine();//调用 client/lib 下的line.js 中的drawLine函数画图
		Session.set("recordsData",recordsData);
	});
}

//初始化导航树
Deps.autorun(function(c){
	if(Session.get("SvseCollectionComplete")&&Session.get("moitorContentRendered")){
		var data = SvseDao.getTree("0");
		var $tree = $('#svse_tree');
		if(Session.get("treeload")){ //避免重复加载
			SystemLogger("tree重新加载");
			$tree.tree("loadData",data);
			return;
		}
		$tree.tree({
				saveState:true,
				data : data,
				autoOpen: 0
		});
		Session.set("treeload",true);//避免重复加载
		$tree.bind('tree.click',function (event) { //绑定树的点击事件
					var node = event.node;
					var id= node.id;
					var type = node.type;
					var checkedTreeNode = {};
					checkedTreeNode.id = id;
					checkedTreeNode.type=type;
					checkedTreeNode.name = node.name;
					Session.set("checkedTreeNode",checkedTreeNode);//记录点击的节点。根据该节点获取 编辑增加设备时的基本信息;
					if(type !== "entity"){
						SwithcView.view(MONITORVIEW.GROUPANDENTITY); //设置视图状态
						Session.set("svid",id);
						return;
					}
					SwithcView.view(MONITORVIEW.MONTIOTR);//设置视图状态
					Session.set("entityid",id);
		});
	}
});

Template.moitorContent.rendered = function(){
	if(!Session.get("moitorContentRendered"))
	Session.set("moitorContentRendered",true); //渲染完毕
}

Template.operateNode.sv_name = function(){
	if(Session.get("checkedTreeNode"))return Session.get("checkedTreeNode").name;
	return false;
}
//增删改操作Template
Template.operateNode.events ={
	"click a#addGroup":function(){
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] === "entity") return;
		SwithcView.view(MONITORVIEW.GROUPADD);//设置视图状态
	},
	"click a#editGroup":function(){
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] === "entity") return;
		SwithcView.view(MONITORVIEW.GROUPEDIT);//设置视图状态
		return;
		var id = Session.get("checkedTreeNode")["id"];
		var group= {'property':{'sv_name':'测试pc设备组','sv_description':'测试pc设备组'},'return':{'id':id}};
		SvseDao.editNode(group);
	},
	"click a#addEntity":function(){
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] === "entity") return;
		SwithcView.view(MONITORVIEW.ENTITYGROUP);//设置视图状态
	},
	"click a#editEntity":function(){
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] !== "entity") return;
		SystemLogger(Session.get("checkedTreeNode"));
		SwithcView.view(MONITORVIEW.ENTITYEDIT);//设置视图状态
	},
	"click a#removeNodes":function(){ //删除子节点
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode").type === "se") return;
		var id = Session.get("checkedTreeNode")["id"];
		SvseDao.removeNodesById(id);
		var fatherId = id.substring(0,id.lastIndexOf("\."));//获取删除节点的父节点Id
		ConstructorNavigateTree.checkedNodeByTreeId(fatherId);//根据id选中节点设置到Session中
		SwithcView.view(MONITORVIEW.GROUPANDENTITY);//设置视图状态
	},
	"click a#addMonitor":function(){
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] !== "entity") return;
		SwithcView.view(MONITORVIEW.MONITORTEMPLATES);//设置视图状态 监视器模板选择
	},
	"click a#editMonitor" : function(){//编辑监视，应该先获取 监视器添加时的模板，然后填充数据
		if(!Session.get("checkedMonitorId")||Session.get("checkedMonitorId")["type"] !== "monitor") return;
		var monitorid = Session.get("checkedMonitorId")["id"];
		var templateMonotoryId = SvseTreeDao.getMonitorTypeById(monitorid); //获取需编辑监视器的模板id
		Session.set("monityTemplateId",templateMonotoryId);//设置模板id
		SwithcView.view(MONITORVIEW.MONITOREDIT);
	}
}
var ConstructorNavigateTree =  {
	checkedNodeByTreeId:function(id){
		var $tree = $('#svse_tree');
		var node = $tree.tree('getNodeById', id);
		$tree.tree('selectNode', node);
		var checkedTreeNode = {};
		checkedTreeNode.id = node.id;
		checkedTreeNode.type = node.type;
		checkedTreeNode.name = node.name;
		Session.set("checkedTreeNode",checkedTreeNode);
		Session.set("svid",node.id);
	}
}