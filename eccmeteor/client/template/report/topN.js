var getTopNListSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("topNlist");
}
/*var getTopNListSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("topN_detail");
}*/
Template.topN.events = {
    //点击添加按钮弹出框    
	"click #topNofadd":function(e,t){
		//$('#topNofadddiv').modal('toggle');
		var result = SvseTopNDao.getTopNById(e.currentTarget.id);
				
		console.log(e.currentTarget.id);
		var content = {result:result};
		RenderTemplate.showParents("#topNofadddiv","topNofadd",content);
		//console.log(t.find("div[id=topNofadddiv]"));
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
	console.log(SvseTopNDao.getTopNresultlist());
	
	//return SvseTopNDao.getTopNresultlist();
	return SvseTopNresultlist.find({},page.skip());
	//console.log("............");
}


//获取日志的集合列表
/*Template.topN_detail.topN_detaillist = function(){
	console.log(SvseTopNDao.getTopNresultlist());
	//return SvseTopNDao.getTopNresultlist();
	//return SvseTopNresultlist.find({},page.skip());
	return SvseTopNDao.getTopNresultlist();
}*/

//日志分页列表
/*var page = new Pagination("topN_detailPagination",{perPage:2});

Template.topN_detail.svseTopNresultlist = function(){
  return SvseTopNresultlist.find({},page.skip());
}
  
Template.topN_detail.pager = function(){
  return page.create(SvseTopNresultlist.find().count());
}*/


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
/*"change #reporttypePeriodlisted":function(){
	  
                if(document.getElementById("reporttypePeriodlisted").value=="Week"){
			   
                         document.getElementById("topNtypetemplatelisted").disabled=false;
                }
				else{
				 document.getElementById("topNtypetemplatelisted").disabled=true;
				}
        },*/
	"click td .btn":function(e,t){
		//console.log(t.find(".controls"));
		
		var result = SvseTopNDao.getTopNById(e.currentTarget.id);
				
		console.log(e.currentTarget.id);
		var content = {result:result};
		RenderTemplate.showParents("#topNofadddivedit","topNofedit",content);
		//$("#reporttypePeriodlisted").find("option[value='"+result["Period"]+"']:first").prop("selected",true);
		console.log(result);		

	}
});
