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
				    //设置布局
				    SwithcView.layout("settingLayout");
				    //引用 navsetting.js中的函数
					NavigationSettionTree.execute(treeNode.action);
				}
			}
		};
		$.fn.zTree.init($("#setting_tree"), setting, NavigationSettionTree.getTreeData());
	})();
  $(document).ready(function(){
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
	});  
}

var drawSvseTree = function(){
    var expandnodes = $.cookie("expandnode") ?　$.cookie("expandnode").split(",")　: [];
	var data = SvseDao.getTree("0");
	var setting = {
		callback:{
			onClick:function(event, treeId, treeNode){
			    //设置布局
				SwithcView.layout("nodeLayout");
				var id= treeNode.id;
				var type = treeNode.type;
				var checkedTreeNode = {};
				checkedTreeNode.id = id;
				checkedTreeNode.type=type;
				checkedTreeNode.name = treeNode.name;
				Session.set("checkedTreeNode",checkedTreeNode);//记录点击的节点。根据该节点获取 编辑增加设备时的基本信息;
				if(type !== "entity"){
				    //设置视图状态
					SwithcView.view(MONITORVIEW.GROUPANDENTITY); 
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

Deps.autorun(function(c){
	if(Session.get("SvseCollectionComplete")&&Session.get("moitorContentRendered")){
		drawSvseTree();
	}
});
