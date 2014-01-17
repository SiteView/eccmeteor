var zTreeView = function(){};

Template.TreeView.rendered = function(){
	zTreeView.initTree();
}

Template.TreeView.events({
	"mouseenter #svse_tree_view img":function(e){
		//console.log(e.currentTarget);
    	$(e.currentTarget).popover('show');
    },
    "mouseleave #svse_tree_view img":function(e){
    	$(e.currentTarget).popover('hide');
    },
	"click #svse_tree_view a":function(e,t){
		//console.log(e.currentTarget.id);
		var aid = e.currentTarget.id;
		if(!aid){
			return;
		}
		var monitorid = aid.slice(aid.indexOf("_")+1);
		console.log(monitorid);
		var context = SvseTree.findOne({sv_id:monitorid});
		if(!context){
			return;
		}
		EntityMouduleDomAction.drawReportLine(e,t,context);
	}
});

Object.defineProperty(zTreeView,"initTree",{
	value:function(){
		zTreeView.drawSvseSimpleTree();
	}
});

Object.defineProperty(zTreeView,"drawSvseSimpleTree",{
	value:function(){
		var _self = this;
		var data = zTreeView.getTreeData();
		//console.log(data);
		var setting = {
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: "0",
				}
			},
			view:{
				addDiyDom:addDiyDom
			},
			callback:{
				onRightClick: zTreeOnRightClick
			}
		}
		if(!$.fn.zTree){
			return ;
		}

		var zTree = $.fn.zTree.init($("#svse_tree_view"), setting,data);
		
		function zTreeOnRightClick(event, treeId, treeNode) { 
			
			console.log(treeNode);
			console.log(event);
			if (!treeNode) {  
				zTree.cancelSelectedNode();   
				showRMenu("root", event.clientX, event.clientY);   
			} else if (treeNode && !treeNode.noR) { //noR属性为true表示禁止右键菜单   
				if (treeNode.newrole && event.target.tagName != "a" && $(event.target).parents("a").length == 0) {   
					zTree.cancelSelectedNode();   
					showRMenu("root", event.clientX, event.clientY);   
				} else {   
					zTree.selectNode(treeNode);   
					showRMenu("node", event.clientX, event.clientY);   
				}   
			}   
		}  

	}
});

function addDiyDom(treeId, treeNode) {
	//console.log(treeNode);
	if (treeNode.type !== "entity") return;
	var aObj = $("#" + treeNode.tId + "_a");
	//if ($("#diyBtn_"+treeNode.id).length>0) return;
	var editStr = "";
	var monitors = treeNode.submonitor;
	for(index in monitors){
		editStr += "<a id='diyBtn1_" +monitors[index].id+ "'>"
		+"<img title='' src='"+ monitors[index].icon +"' data-toggle='popover' data-placement='top' data-html=true data-content='&nbsp;状态:"+monitors[index].status+"<br />&nbsp;"+monitors[index].dstr+"'data-original-title='&nbsp;"+monitors[index].name+"' />"
		+"</a>";
	}
	aObj.after(editStr);
	
};

Object.defineProperty(zTreeView,"getTreeData",{
	value:function(){
		var nodes = Svse.find().fetch();
		var branch = [];
		for(index in nodes){
			var obj = nodes[index];
			if(obj["type"] == "group" && obj["subentity"] && (obj["subentity"].length == 0)){
				continue;
			}
			if(!SvseDao.hasDisplayPermission(obj["sv_id"])){
				continue;
			}
			var branchNode = {};
			var treeNode = SvseTree.findOne({sv_id:obj["sv_id"]});
			branchNode["id"] = obj["sv_id"];
			branchNode["pId"] = obj["parentid"];
			branchNode["type"] = obj["type"];
			branchNode["name"] = SvseTree.findOne({sv_id:obj["sv_id"]})["sv_name"];
			branchNode["isParent"] = true;
			branchNode["icon"] = "imag/status/"+obj["type"]+(treeNode["status"]?treeNode["status"]:"")+".png";
			branchNode["open"] = true;
			if(obj["type"] === "entity" && obj["submonitor"] && obj["submonitor"].length){
				branchNode["isParent"] = false;
				var submonitor = obj["submonitor"];
				var submonitors = [];
				for(subindex in submonitor){
					var subobj = {};
					var monitor = SvseTree.findOne({sv_id:submonitor[subindex]})
					subobj["id"] = submonitor[subindex];
					subobj["pId"] = obj["sv_id"];
					subobj["type"] = "monitor";
					subobj["monitortype"] = monitor["sv_monitortype"];
					subobj["name"] = monitor["sv_name"];
					subobj["status"] = monitor["status"];
					subobj["dstr"] = monitor["dstr"];
					subobj["icon"] = "imag/status/"+(monitor["status"]?monitor["status"]:"")+".png";
					submonitors.push(subobj);
				}
				branchNode["submonitor"] = submonitors;
			}
			branch.push(branchNode);
		}
		return branch;
	}
});



function showRMenu(type, x, y) {
    $("#rMenu").attr("style","display");
    
    $("#rMenu").css({
        "top" : y + "px",
        "left" : x + "px",
        "visibility" : "visible"
    });
 
    $("body").bind("mousedown", onBodyMouseDown);
} 

function hideRMenu() {
    if ($("#rMenu"))
        $("#rMenu").css({
            "visibility" : "hidden"
        });
    $("body").unbind("mousedown", onBodyMouseDown);
}

function onBodyMouseDown(event) {
    if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
        $("#rMenu").css({
            "visibility" : "hidden"
        });
    }
}

//看能不能组成 entity中加个submonitor属性 对应他的监视器 重整data
/* Object.defineProperty(zTreeView,"getTreeData",{
	value:function(treelist){
		var data = [];
		var ids = [];
		for(i in treelist){
			if(treelist[i]["type"] == "entity"){
				treelist[i]["isParent"] = false;
				var id = treelist[i]["pId"];
				ids.push(treelist[i]["id"]);
				ids.push(id);
			}
		}
		for(i in treelist){
			if(treelist[i]["type"] == "se"){
				data.push(treelist[i]);
			}
			for(id in ids){
				if(treelist[i]["id"] == ids[id]){
					data.push(treelist[i]);
				}
			}
		}
		return data;
	}
}); */
