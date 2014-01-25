var getTopNListSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("topNlist");
}
/*var getTopNListSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("topN_detail");
}*/
Template.topN.events = {
    //点击添加按钮弹出框    
	"click #topNofadd":function(e,t){
		var result = SvseTopNDao.getTopNById(e.currentTarget.id);
		var svsetreedata = SvseTree.find().fetch();
		console.log(svsetreedata);
		var monitorIds = []; 
		for(i in svsetreedata){
			if(svsetreedata[i]["type"] == "monitor"){
				monitorIds.push(svsetreedata[i]["sv_id"]);
			}
		}
		console.log(monitorIds);
		var svsedata = Svse.find().fetch();
		var entityids = [];
		for(var j = 0;j < monitorIds.length;j++){
			for(s in svsedata){
				var data = svsedata[s];
				if(data["type"] == "entity" && data["submonitor"] && data["submonitor"].length > 0){
					var submonitorids = data["submonitor"];
					for(sub in submonitorids){
						if(monitorIds[j] == submonitorids[sub]){
							entityids.push(data["sv_id"]);
						}
					}
				}
			}
		}
		console.log(entityids);
		//去重复
		var rec = [];
		var entityidsData = [];
		for(var k = 0;k < entityids.length;k++){
			if(!rec[entityids[k]]){
				rec[entityids[k]] = true;
				entityidsData.push(entityids[k]);
			}
			
		}
		console.log(entityidsData);
		console.log("----------------");
		SvseMonitorTemplateDao.getMonitorInfoByIdAsync(monitorIds,entityidsData,function(result){
			var context = result.context;
				console.log(context);	
			var monitorTypes = [];
			var monitorData = [];
			for(i in context){
				var results = {};
				monitorTypes.push(context[i].monitorType);
				results["monitorType"] = context[i].monitorType;
				var returnItems = context[i].MonityTemplateReturnItems;
				var itemsLabels = [];
				for(j in returnItems){
					itemsLabels.push(returnItems[j].sv_label);
					results["itemsLabel"] = itemsLabels;		
				}
				monitorData.push(results);
			}
			console.log(monitorData);
			//去重复
			var rec = [];
			var resultData = [];
			for(m in monitorData){
				//console.log(monitorData[m]);
				if(!rec[monitorData[m]["monitorType"]]){
					rec[monitorData[m]["monitorType"]] = true;
					resultData.push(monitorData[m]);
				}
				
			}			
			console.log(resultData);
			//数据循环
			var content = {resultData:resultData};
			RenderTemplate.showParents("#topNofadddiv","topNofadd",content);
			var type = $("#Typelist").val();
			console.log(type);
			
			var itemsLabel = [];
			for(i in resultData){
				if(resultData[i]["monitorType"] == type){
					var items = resultData[i]["itemsLabel"]
					for(j in items){
						var option = $("<option value="+items[j]+"></option>").html(items[j])
						$("#marklist").append(option);	
					}
					
				}
			}		
	});
	
	},
	 //启用TopN地址
	"click #allowetopN" : function(){ 
		SvseTopNDao.checkTopNresultlistSelect(getTopNListSelectAll());
		SvseTopNDao.updateTopNStatus(getTopNListSelectAll()," on",function(result){
			if(result.status){
				SystemLogger("改变状态"+result.option.count+"条");
					}
			});
		
	},
	//禁用TopN地址
	"click #forbidtopN" : function(){ 
		SvseTopNDao.checkTopNresultlistSelect(getTopNListSelectAll());
		SvseTopNDao.updateTopNStatus(getTopNListSelectAll()," No",function(result){
			if(result.status){
				SystemLogger("改变状态"+result.option.count+"条");
					}
			});
	},
	//topN报告同步
	"click #topNrefresh" : function(){
		SvseTopNDao.sync(function (result) {
			if (result.status) {
				console.log("页面刷新已完成！");
			} else {
				SystemLogger(result);
			}
		});
	},
	//帮助信息
	"click #topNhelpmessage" : function(){
	   // $('#helpmessagediv').modal('toggle');
 
	},
	//点击删除日志
	"click #deletelog":function(){
	    var ids = getTopNListSelectAll();
        SvseTopNDao.checkTopNresultlistSelect(ids);
			if(ids.length)
				SvseTopNDao.generatereport(ids,function(result){
				SystemLogger(result);
					});
	  },
}
Template.topN.rendered = function(){
	 $(function(){
				//在点击删除操作时弹出提示框实现进一步提示
			$("#topNofdel").confirm({
					'message':"确定删除操作？",
					'action':function(){
							var ids = getTopNListSelectAll();
							SvseTopNDao.checkTopNresultlistSelect(ids);
							if(ids.length){
							SvseTopNDao.deleteTopNByIds(ids,function(result){
									Log4js.info(result);
							});
							//console.log("确定");
							}
							$("#topNofdel").confirm("hide");
					}
			});
		});
}

//获取topNlist的集合
Template.topNlist.topNresultlist = function(){
	//console.log(SvseTopNDao.getTopNresultlist());
	return SvseTopNresultlist.find({},page.skip());
}

//分页列表
var page = new Pagination("topNPagination",{perPage:2});

Template.topNlist.svseTopNresultlist = function(){
    return SvseTopNresultlist.find({},page.skip());
}
  
Template.topNlist.pager = function(){
    return page.create(SvseTopNresultlist.find().count());
}

/*Template.topNlist.destroyed = function(){
  page.destroy();
}*/

Template.topNlist.rendered = function(){
   
	   //初始化checkbox选项
	$(function(){
		//隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("topNlist");
		//初始化 checkbox事件
		ClientUtils.tableSelectAll("topNlistselectall");
		//初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("topNlist");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("topNlist");
	});
}

Template.topNlist.events({
	"click td .btn":function(e,t){
		//console.log(t.find(".controls"));
		var result = SvseTopNDao.getTopNById(e.currentTarget.id);		
		console.log(e.currentTarget.id);
		var content = {result:result};
		RenderTemplate.showParents("#topNofadddivedit","topNofedit",content);
		console.log(result);	
//检测器数据列表的读取(编辑)	
		/*var svsetreedata = SvseTree.find().fetch();
		console.log(svsetreedata);
		var monitorIds = []; 
		for(i in svsetreedata){
			if(svsetreedata[i]["type"] == "monitor"){
				monitorIds.push(svsetreedata[i]["sv_id"]);
			}
		}
		console.log(monitorIds);
		var svsedata = Svse.find().fetch();
		var entityids = [];
		for(var j = 0;j < monitorIds.length;j++){
			for(s in svsedata){
				var data = svsedata[s];
				if(data["type"] == "entity" && data["submonitor"] && data["submonitor"].length > 0){
					var submonitorids = data["submonitor"];
					for(sub in submonitorids){
						if(monitorIds[j] == submonitorids[sub]){
							entityids.push(data["sv_id"]);
						}
					}
				}
			}
		}
		console.log(entityids);
		//去重复
		var rec = [];
		var entityidsData = [];
		for(var k = 0;k < entityids.length;k++){
			if(!rec[entityids[k]]){
				rec[entityids[k]] = true;
				entityidsData.push(entityids[k]);
			}
			
		}
		console.log(entityidsData);
		console.log("----------------");
		SvseMonitorTemplateDao.getMonitorInfoByIdAsync(monitorIds,entityidsData,function(result){
			var context = result.context;
				console.log(context);	
			var monitorTypes = [];
			var monitorData = [];
			for(i in context){
				var results = {};
				monitorTypes.push(context[i].monitorType);
				results["monitorType"] = context[i].monitorType;
				var returnItems = context[i].MonityTemplateReturnItems;
				var itemsLabels = [];
				for(j in returnItems){
					itemsLabels.push(returnItems[j].sv_label);
					results["itemsLabel"] = itemsLabels;		
				}
				monitorData.push(results);
			}
			console.log(monitorData);
			//去重复
			var rec = [];
			var resultData = [];
			for(m in monitorData){
				//console.log(monitorData[m]);
				if(!rec[monitorData[m]["monitorType"]]){
					rec[monitorData[m]["monitorType"]] = true;
					resultData.push(monitorData[m]);
				}
				
			}			
			console.log(resultData);
			//数据循环
			var content = {resultData:resultData};
			//RenderTemplate.showParents("#topNofadddiv","topNofadd",content);
			RenderTemplate.showParents("#topNofadddivedit","topNofedit",content);
			var type = $("#Typelisted").val();
			console.log(type);
			
			var itemsLabel = [];
			for(i in resultData){
				if(resultData[i]["monitorType"] == type){
					var items = resultData[i]["itemsLabel"]
					for(j in items){
						var option = $("<option value="+items[j]+"></option>").html(items[j])
						$("#marklisted").append(option);	
					}
					
				}
			}		
	});*/
	
	}
});
