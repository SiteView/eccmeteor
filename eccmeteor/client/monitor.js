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
		//用此方法代替上面的存储方式
		SessionManage.setCheckedMonitroId(id);
		drawImage(id);
	}
}

Template.showMonitor.rendered = function(){ //默认选中第一个监视进行绘图
	if(!this._rendered) {
			this._rendered = true;
	}
	var tr = $("#showMonitorList tr:first");
	if(!tr){
		$("#showSvg").css("display","none");
		return;//如果没有监视器则不画图
	}
	var id = tr.attr("id");
	if(!id || id=="") {
		$("#showSvg").css("display","none");
		return;
	}
	$("#showSvg").css("display","block");
	var ID = {id:id,type:"monitor"}
	Session.set("checkedMonitorId",ID);//存储选中监视器的id
	//用此方法代替上面的存储方式
	SessionManage.setCheckedMonitroId(id);
	drawImage(id);
}
Template.recordsData.recordsData = function(){
	return Session.get("recordsData");
}
Template.recordsData.events = {
	"click .btn#monitorDetail" :  function(){
		SwithcView.view(MONITORVIEW.MONITORDETAIL);//设置视图状态为监视器详细信息
	}
}

//画图前 获取相关数据
function drawImage(id,count){
	if(!count) var count = 200;
	var foreigkeys =SvseMonitorDao.getMonitorForeignKeys(id);
	if(!foreigkeys){
		SystemLogger("监视器"+id+"不能获取画图数据");
		return;
	}
	//获取画图数据
	Meteor.call("getQueryRecords",id,count, function (err, result) {
		if(err){
			SystemLogger(err);
			return;
		}	
		var dataProcess = new DataProcess(result,foreigkeys["monitorForeignKeys"]);
		var resultData = dataProcess.getData();
		var recordsData = dataProcess.getRecordsDate();
		var keys = dataProcess.getDataKey();
		var table = new DrawTable();//调用 client/lib 下的table.js 中的drawLine函数画图
		table.drawTable(keys,"#tableData");
		var line = new DrawLine(resultData,foreigkeys["monitorPrimary"],foreigkeys["monitorDescript"]);
		line.drawLine();//调用 client/lib 下的line.js 中的drawLine函数画图
		Session.set("recordsData",recordsData);
	});
	/*
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
	*/
}

//初始化导航树
/*
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
*/

Deps.autorun(function(c){
	if(Session.get("SvseCollectionComplete")&&Session.get("moitorContentRendered")){
		console.log("cookie  "+$.cookie("expandnode"));
		var expandnodes = $.cookie("expandnode") ?　$.cookie("expandnode").split(",")　: [];
		var data = SvseDao.getTree("0");
		var setting = {
			callback:{
				onClick:function(event, treeId, treeNode){
					var id= treeNode.id;
					var type = treeNode.type;
					var checkedTreeNode = {};
					checkedTreeNode.id = id;
					checkedTreeNode.type=type;
					checkedTreeNode.name = treeNode.name;
					Session.set("checkedTreeNode",checkedTreeNode);//记录点击的节点。根据该节点获取 编辑增加设备时的基本信息;
					if(type !== "entity"){
						SwithcView.view(MONITORVIEW.GROUPANDENTITY); //设置视图状态
						Session.set("svid",id);
						return;
					}
					SwithcView.view(MONITORVIEW.MONTIOTR);//设置视图状态
					Session.set("entityid",id);
				}
			}
		};	
		$.fn.zTree.init($("#svse_tree"), setting, [ClientUtils.expandTreeNode(data[0],expandnodes)]);
	}
});

Template.moitorContent.rendered = function(){
	if(!Session.get("moitorContentRendered"))
		Session.set("moitorContentRendered",true); //渲染完毕
	$(document).ready(function(){
		//console.log("12333333333");
		$(window).unload(function() {
			console.log("123");
			var svse_tree= $.fn.zTree.getZTreeObj("svse_tree");
			var arr =  svse_tree.getNodesByFilter(function(node){
				return node.open;
			});
			var ids  = "";
			for(index in arr){
				console.log(arr[index].id);
				ids = ids +","+arr[index].id;
			}
			console.log(ids);
			$.cookie("expandnode",ids.substr(1,ids.length));
		});
		//初始化设置等导航节点
		/*
		(function(){
			var setting = {
				data: {
					simpleData: {
						enable: true
					}
				},
				callback:{
					onClick:function(event, treeId, treeNode){
						NavigationSettionTree.execute(treeNode.action);
					}
				}
			};
			$.fn.zTree.init($("#setting_tree"), setting, NavigationSettionTree.getTreeData());
		})();
		*/
	});
}

//树的渲染
Template.moitorContentTree.rendered = function(){
	(function(){
		var setting = {
			data: {
				simpleData: {
					enable: true
				}
			},
			callback:{
				onClick:function(event, treeId, treeNode){
					NavigationSettionTree.execute(treeNode.action);
				}
			}
		};
		$.fn.zTree.init($("#setting_tree"), setting, NavigationSettionTree.getTreeData());
	})();
}


Template.operateNode.sv_name = function(){
	if(Session.get("checkedTreeNode"))return Session.get("checkedTreeNode").name;
	return false;
}

Template.operateNode.type = function(){
	return Session.get("checkedTreeNode") ? Session.get("checkedTreeNode")["type"] : "";
}

//增删改操作Template
Template.operateNode.events ={
	"click .btn#addGroup":function(){
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] === "entity") return;
		SwithcView.view(MONITORVIEW.GROUPADD);//设置视图状态
	},
	"click .btn#editGroup":function(){
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] === "entity") return;
		SwithcView.view(MONITORVIEW.GROUPEDIT);//设置视图状态
		return;
		var id = Session.get("checkedTreeNode")["id"];
		var group= {'property':{'sv_name':'测试pc设备组','sv_description':'测试pc设备组'},'return':{'id':id}};
		SvseDao.editNode(group);
	},
	"click a#forbidGroup" : function(e){
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] !== "group") return;
		var id  = Session.get("checkedTreeNode")["id"];
		var status = e.target.name;
		if(status === "enable"){
			SvseDao.enableNode([id],function(err){});
			return;
		}
		SvseDao.forbidNode([id],function(err){});
		//console.log("forbidGroup");
	},
	"click .btn#addEntity":function(){
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] === "entity") return;
		SwithcView.view(MONITORVIEW.ENTITYGROUP);//设置视图状态
	},
	"click .btn#editEntity":function(){
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] !== "entity") return;
		SystemLogger(Session.get("checkedTreeNode"));
		SwithcView.view(MONITORVIEW.ENTITYEDIT);//设置视图状态
	},
	"click a#forbidEntity" : function(e){
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] !== "entity") return;
		var id  = Session.get("checkedTreeNode")["id"];
		var status = e.target.name;
		if(status === "enable"){
			SystemLogger("启用设备"+id)
			SvseDao.enableNode([id],function(err){});
			return;
		}
		SystemLogger("禁用设备"+id)
		SvseDao.forbidNode([id],function(err){});
	},
	"click a#removeNodes":function(){ //删除子节点
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode").type === "se") return;
		var id = Session.get("checkedTreeNode")["id"];
		SvseDao.removeNodesById(id);
		var fatherId = id.substring(0,id.lastIndexOf("\."));//获取删除节点的父节点Id
	//	ConstructorNavigateTree.checkedNodeByTreeId(fatherId);//根据id选中节点设置到Session中
		SwithcView.view(MONITORVIEW.GROUPANDENTITY);//设置视图状态
	},
	"click .btn#addMonitor":function(){
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] !== "entity") return;
		SwithcView.view(MONITORVIEW.MONITORTEMPLATES);//设置视图状态 监视器模板选择
	},
	"click .btn#editMonitor" : function(){//编辑监视，应该先获取 监视器添加时的模板，然后填充数据
		if(!Session.get("checkedMonitorId")||Session.get("checkedMonitorId")["type"] !== "monitor") return;
		var monitorid = Session.get("checkedMonitorId")["id"];
		var templateMonitoryId = SvseTreeDao.getMonitorTypeById(monitorid); //获取需编辑监视器的模板id
		Session.set("monityTemplateId",templateMonitoryId);//设置模板id
		SwithcView.view(MONITORVIEW.MONITOREDIT);
	},
	"click a#deleteMonitor" : function(){
		if(!Session.get("checkedMonitorId")||Session.get("checkedMonitorId")["type"] !== "monitor") return;
		var monitorid = Session.get("checkedMonitorId")["id"];
		var parentid  = Session.get("checkedTreeNode")["id"];
		SystemLogger(monitorid+"::"+parentid);
		SvseDao.removeMonitor(monitorid,parentid,function(err){
			if(err) SystemLogger(err);
		})
	},
	"click a#forbidMonitor" : function(e){
		if(!Session.get("checkedMonitorId")||Session.get("checkedMonitorId")["type"] !== "monitor") return;
		/*
			1.判断当前选中的树节点是否为 设备，不是则不做任何事情
			2.根据存在Sesion中的监视器id来禁用启用监视器
		*/
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] !== "entity") return;
		var id = Session.get("checkedMonitorId")["id"];
		var status = e.target.name;
		if(status === "enable"){
			SvseDao.enableNode([id],function(err){});
			return;
		}
		SvseDao.forbidNode([id],function(err){});
	},
	"click .btn#refresh" : function(){
		SvseDao.refreshTreeData();
	}
}
/*
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
*/

Deps.autorun(function(c){
	//自动改变 禁用按钮的文字，为禁用或者启用。根据session中存的id的状态来决定。
	//状态为disable则为启用，其他状态全为禁用。
	var monitor = Session.get("checkedMonitorId");//存储选中监视器的id
	if(!monitor) return;
	var id = monitor["id"];
	var node = SvseTreeDao.getNodeById(id);
	var status = node ? node["status"] : false;
	console.log("checkedMonitorId 变化");
	//控制监视器禁止按钮的文本显示
	var statusContext = "";
	var name = "";
	if( status === "disable"){
		statusContext = "启用";
		name = "enable"
	}else{
		statusContext = "禁用";
		name = "disable"
	}
	$("a#forbidMonitor").html(statusContext).attr("name",name);
});

Template.operateNode.rendered = function () {
	var node = Session.get("checkedTreeNode");
	if(!node) return;
	var id = node["id"];
	var type = node["type"];
	var n = SvseTreeDao.getNodeById(id);
	console.log(status+":"+n["status"]);
	var status = n ? n["status"] : false;
	console.log("checkedTreeNode 变化");
	//控制设备和组上禁止按钮的文本显示
	type = type === "entity" ? "Entity" : "Group"; 
	var statusContext = "";
	var name = "";
	if( status === "disable"){
		statusContext = "启用";
		name = "enable"
	}else{
		statusContext = "禁用";
		name = "disable";
	}
	console.log(type+":"+name);
	$("a#forbid"+type).html(statusContext).attr("name",name);
}