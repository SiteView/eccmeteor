var getTopNListSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("topNlist");
}
Template.topN.events = {
    //点击添加按钮弹出框    
	"click #topNofadd":function(e){
		$('#topNofadddiv').modal('toggle');
	},
	"click #topNofdel":function(){
	/*var checks = $("#topNlist :checkbox[checked]");
	var ids = [];
	for(var i = 0; i < checks.length; i++){
	   ids.push($(checks[i]).attr("id"));
	}
	//Message.info("请选择报告！");
	if(ids.length)
	  SvseTopNDao.deleteTopNByIds(ids,function(result){
	    console.log("删除全部《《");
	  	SystemLogger(result);
	  	console.log("删除全部》》");
	  });*/
	  
	  var ids = getTopNListSelectAll();
            SvseTopNDao.checkTopNresultlistSelect(ids);
				if(ids.length)
					SvseTopNDao.deleteTopNByIds(ids,function(result){
					SystemLogger(result);
						});
	  
	},
	 //启用TopN地址
	"click #allowetopN" : function(){ 
		/*var checks = $("#topNlist :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseTopNDao.updateTopNStatus(ids,"on",function(result){
				SystemLogger(result);
			});*/
			SvseTopNDao.checkTopNresultlistSelect(getTopNListSelectAll());
            SvseTopNDao.updateTopNStatus(getTopNListSelectAll()," on",function(result){
                if(result.status){
                    SystemLogger("改变状态"+result.option.count+"条");
                        }
                });
			
	},
	//禁用TopN地址
	"click #forbidtopN" : function(){ 
		/*var checks = $("#topNlist :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseTopNDao.updateTopNStatus(ids,"NO",function(result){
				SystemLogger(result);
			});*/
			SvseTopNDao.checkTopNresultlistSelect(getTopNListSelectAll());
            SvseTopNDao.updateTopNStatus(getTopNListSelectAll()," No",function(result){
                if(result.status){
                    SystemLogger("改变状态"+result.option.count+"条");
                        }
                });
	},
	//topN报告生成
	"click #generatereport" : function(){
	   LoadingModal.loading();
		    SvseTopNDao.checkTopNresultlistSelect(getTopNListSelectAll());
            SvseTopNDao.updateTopNStatus(getTopNListSelectAll()," No",function(result){
                if(result.status){
                    SystemLogger("改变状态"+result.option.count+"条");
                        }
                });
	},
	//topN报告同步
	"click #topNrefresh" : function(){
		SvseTopNDao.sync();
	},
	//帮助信息
	"click #topNhelpmessage" : function(){
	$('#helpmessagediv').modal('toggle');
 
	}
}


//点击保存、取消按钮时的事件

Template.topNofadd.events = {
  'change #Typelist': function(evt) {
     Session.set("selected_Typelist", evt.currentTarget.value);
	   Session.set("Marklist", evt.currentTarget.value);
	 console.log("yes"); 
  },
  
/*'change #Typelist':function(){
	var type=$(this).val();
	//Type模板
	if(type=="Default"){
		$("#marklist").empty();//清空select的option
		SvseMonitorTemplateDao.getMonitorTemplate(function(err,result){
			for(name in result){
				//console.log(name);
				var option=$("<option value"+name+"></option>").html(name)
				$("#marklist").append(option);
			}
		});
	}
	//mark模板
	if(type=="com"){
		$("#marklist").empty();//清空select的option
		SvseMonitorTemplateDao.getMonitorTemplate(function(err,result){
			for(name in result){
				//console.log(name);
				var option = $("<option value="+name+"></option>").html(name)
				$("#marklist").append(option);
			}
		});
	}
},*/
   /*"change #Typelist":function(){
	  
               //var index = document.getElementById('s1').selectedIndex; 
             if(document.getElementById("Typelist").value=="{{sv_name}}"){
 
               document.getElementById('marklist').disabled=false;
           }
		   else{
               document.getElementById('marklist').disabled=false;
				}
        },*/

    "change #reporttypePeriodlist":function(){
	  
                if(document.getElementById("reporttypePeriodlist").value=="Week"){
			   
                     document.getElementById("topNtypetemplatelist").disabled=false;
           }
		   else{
				 document.getElementById("topNtypetemplatelist").disabled=true;
				}
        },
		
         "click #topNofaddcancelbtn":function(){
		 console.log("helloQQ");
          $('#topNofadddiv').modal('toggle');
                                     },
          "click #topNofaddsavebtn":function(){
  
        var targets = [];
	    var basicinfooftopNadd = ClientUtils.formArrayToObject($("#basicinfooftopNadd").serializeArray());
	    var arr = $.fn.zTree.getZTreeObj("svse_tree_check").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
			for(index in arr){
			targets.push(arr[index].id);
			}
			basicinfooftopNadd["GroupRight"] = targets.join();
			
			$(":checkbox[name='Status']").each(function(){
			if(!this.checked) basicinfooftopNadd["Status"]="Yes";
		});
		//报告标题是否为空
		var Title=basicinfooftopNadd["Title"];
		   if(!Title){
			Message.info("请填写标题！",{align:"center",time:3});
			return;
		}
		//报告标题是否重复判断
		var result=SvseTopNDao.getTopNByName(Title);
		   if(result){
			Message.info("报告标题已经存在!",{align:"center",time:3});
			return;
		}
		//E-mail的判断
		var email=basicinfooftopNadd["EmailSend"];
		
           if(!email){
            Message.info("E-mail不能为空！",{align:"center",time:3});
			 //alert("邮件中必须包含@");
            return;
         }
		 //判断邮箱格式是否正确  
		var mailStr =  'aa@bb.com;bb@aa.com;cc@aa.com';
		 var mail_arr =mailStr.split(";");
		 //if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email))      {  
		 if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*([,;][,;\s]*(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)*)*$/.test(email))      {   
             Message.info("E-mail格式错误!");   
             return false;
        }

		var nIndex = new Date().format("yyyyMMddhhmmss") +"x"+ Math.floor(Math.random()*1000);
		for(index in arr){
			targets.push(arr[index].id);
		}
		basicinfooftopNadd["AlertTarget"] = targets.join();
		if(!basicinfooftopNadd["AlertTarget"]){
			Message.info("监测范围不能为空",{align:"center",time:3});
			return;
		}
			
        var nIndex = Utils.getUUID();
        basicinfooftopNadd["nIndex"] = nIndex
        var address = {};
		
          address[nIndex] = basicinfooftopNadd;
          console.log(address[nIndex]); 
		  
          SvseTopNDao.addTopN(nIndex,address,function(result){
          SystemLogger(result);
			console.log(result); //控制台打印添加的信息
          $('#topNofadddiv').modal('toggle');
              });
			  
            }
       }
	   

    /*   Template.topNofedit.topNofaddsavebtneditform = function(){
	return Session.get("topNofaddsavebtneditform");
   }*/
   /*
Template.topNofaddform.marklist = function(parent){
  Marklists.find({typelist: Session.get("selected_typelist")});
};
// Client
Meteor.autosubscribe(function () {
  Meteor.typelist("Marklists",Session.get("selected_typelist"));
}

// Server
Meteor.publish("Marklists", function(selectedTypelist) {
  Marklists.find({typelist: selectedTypelist})  
});*/

Template.topNofaddform.rendered = function(){
	//检测器下拉列表
		Meteor.call("svGetMonitorTemplate",function(err,result){
			for(name in result){
				//console.log(name);
				var option = $("<option value="+name+"></option>").html(name)
				$("#typelist").append(option);
			}
		});
		
	}
//获取topNlist的集合
Template.topNlist.topNresultlist = function(){
	console.log(SvseTopNDao.getTopNresultlist());
	//return SvseTopNDao.getTopNresultlist();
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

Template.topNlist.destroyed = function(){
  page.destroy();
}

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
	//list分页实现
	/*$(function(){
		var init = {
				pagePre:	6,	//单页条数
				pageMax:	3	//页数分类基数
			};
		var getPager = function(p,a,b,c){
			var pages = a;
			var pageHide = b;
			var parentBox = p;
			var lis = parentBox.find('tr');
			var html = '';
			if(pageHide){
				var index = (c || 1) < 4 ? 4 : ((c > (pages - 3)) ? (pages - 3) : c);
				html += '<a href="###">1</a>\n';
				index > 4 ? html += '<span>....</span>\n' : html += '';
				for(var i=(index-2);i<=(index+2);i++){
					html += '<a href="###">'+i+'</a>\n';
				}
				index < pages - 3 ? html += '<span>....</span>\n' : html += '';
				html += '<a href="###">'+pages+'</a>\n';
			}else{
				if(pages != 1){
					for(var i=0;i<pages;i++){
						html += '<a href="###">'+(i+1)+'</a>\n';
					}
				}
			}
			lis.hide();
			parentBox.find('tr[flag="'+c+'"]').show();
			return html;
		}
	
	$('.eventList').each(function(){
		//var _this = $(this);
		var tr = $(this).find('tr'),liNum = tr.length;
		var pages = Math.ceil(liNum/init.pagePre);
		for(var i=0;i<liNum;i++){
			$(tr[i]).attr('flag',parseInt(i/init.pagePre)+1);
		}
		var pageHide = pages > init.pageMax ? 1 : 0;
		$(this).find('.pager').append(getPager($(this),pages,pageHide,1));
		$(this).find('a').live('click',function(){
			var index = parseInt($(this).html());
			$(this).find('.pager').empty();
			$(this).find('.pager').append(getPager($(this),pages,pageHide,index));
		});
	});
});*/

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
		console.log(e.currentTarget.id);
		var result = SvseTopNDao.getTopNById(e.currentTarget.id);
        console.log(result);
		$("#topNofadddivedit").find(":text[name='Title']:first").val(result.Title);
		$("#topNofadddivedit").find(":text[name='Descript']:first").val(result.Descript);
	    $("#topNofadddivedit").find("input[type='number'][name='Count']:first").val(result.Count);
		$("#topNofadddivedit").find("input[type='number'][name='Generate']:first").val(result.Generate);
		$("#topNofadddivedit").find("input[type='email'][name='EmailSend']:first").val(result.EmailSend);
		$("#topNofadddivedit").find(":text[name='Deny']:first").val(result.Deny);
		
		
		$("#Typelisted").find("option[value = '"+result["Type"]+"']:first").attr("selected","selected");
		$("#marklisted").find("option[value = '"+result["Mark"]+"']:first").attr("selected","selected");
		$("#reporttypePeriodlisted").find("option[value = '"+result["Period"]+"']:first").attr("selected","selected");
		$("#topNoutputtyped").find("option[value = '"+result["fileType"]+"']:first").attr("selected","selected");
		$("#GetValuelisted").find("option[value = '"+result["GetValue"]+"']:first").attr("selected","selected");
		$("#topNtypetemplatelisted").find("option[value = '"+result["WeekEndTime"]+"']:first").attr("selected","selected");
		$("#topNofadddivedit").find(":hidden[name='nIndex']:first").val(result.nIndex);
		
		   var Sort = result.Sort;
		   $("#topNofadddivedit").find(":radio[name='Sort']").each(function(){
			if($(this).val() === Sort){
				$(this).attr("checked",true);
			}
		  });
		  
            var CheckedDeny = result.Deny;
			 $("#topNofadddivedit").find(":checkbox[name='Deny']").each(function(){
				 if($(this).val()=== CheckedDeny){
					 $(this).attr("checked",true);
					 }
					// $(this).attr("checked",false);
				 });
				 
				 
		function addTreeNode() {
			
			var newNode = { name:"增加" + (addCount++)};
			if (zTree.getSelectedNodes()[0]) {
				newNode.checked = zTree.getSelectedNodes()[0].checked;
				zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
			} else {
				zTree.addNodes(null, newNode);
			}
		}
		function removeTreeNode() {
			
			var nodes = zTree.getSelectedNodes();
			if (nodes && nodes.length>0) {
				if (nodes[0].children && nodes[0].children.length > 0) {
					var msg = "要删除的节点是父节点，如果删除将连同子节点一起删掉。\n\n请确认！";
					if (confirm(msg)==true){
						zTree.removeNode(nodes[0]);
					}
				} else {
					zTree.removeNode(nodes[0]);
				}
			}
		}
		function checkTreeNode(checked) {
			var nodes = zTree.getSelectedNodes();
			if (nodes && nodes.length>0) {
				zTree.checkNode(nodes[0], checked, true);
			}
			hideRMenu();
		}
		
		function resetTree() {
			
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
		}
		 console.log(">>>>>>>>T");
		console.log(t.find("div[id=topNofadddivedit]"));
		//console.log(t.find(".controls"));
		
				 
		$('#topNofadddivedit').modal('toggle');
		
         //加载编辑弹出页面左侧树
		var checkednodes = result.GroupRight.split("\,")
		 //左边树的勾选
		var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_edit");
		treeObj.checkAllNodes(false); //清空上一个用户状态
		 //节点勾选
		 
		for(var index  = 0; index < checkednodes.length ; index++){
			treeObj.checkNode(treeObj.getNodesByFilter(function(node){
				return  node.id  === checkednodes[index];
			}, true), true);
		}
	}
});

Template.topNofedit.rendered = function(e,t){
//树
	$(function(){
		var data = SvseDao.getDetailTree();
		var setting = {
			check:{
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "ps", "N": "ps" }
			},
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: "0",
				}
			}
		};
		$.fn.zTree.init($("#svse_tree_check_edit"), setting, data);
	});
	//填充检测器列表
		/*SvseMessageDao.getMessageTemplates(function(err,result){
			for(name in result){
				console.log(name);
				var option = $("<option value="+name+"></option>").html(name)
				$("#Typelist").append(option);
			}
		});*/
	Meteor.call("svGetEntityDynamicPropertyData",function(err,result){
		for(name in result){
			console.log(name);
			var option = $("<option value="+name+"></option>").html(name)
			$("#Typelist").append(option);
		}
	});
	Meteor.call("svGetEmailTemplates",function(err,result){
		for(name in result){
			//console.log(name);
			var option = $("<option value="+name+"></option>").html(name)
			$("#marklist").append(option);
		}
	});
	Meteor.call("svGetEmailTemplates",function(err,result){
		for(name in result){
			//console.log(name);
			var option = $("<option value="+name+"></option>").html(name)
			$("#Typelisted").append(option);
		}
	});
	Meteor.call("svGetEmailTemplates",function(err,result){
		for(name in result){
			//console.log(name);
			var option = $("<option value="+name+"></option>").html(name)
			$("#marklisted").append(option);
		}
	});
	
	
	/*$(function(){ type(s)
{
    txt.value+=s;
    //选择后,让第一项被选中
    document.all.sel.options[0].selected=true;
}*/

 ModalDrag.draggable("#topNofadddivedit")
}

Template.topNofadd.rendered = function(){

//监视器选择树
	$(function(){
		
		var data = SvseDao.getDetailTree();
		var setting = {
			check:{
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "ps", "N": "ps" }
			},
			
			callback:{
			
			      Change:function (event, treeId, treeNode) {
			  
			      zTree = $.fn.zTree.getZTreeObj("svse_tree_check");
			
			     if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
				     zTree.cancelSelectedNode();
				     show("root", event.clientX, event.clientY);
			     } else if (treeNode && !treeNode.noR) {
				zTree.selectNode(treeNode);
				show("node", event.clientX, event.clientY);
			}
		}
			
			},
			
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: "0",
				}
			}
		};
		$.fn.zTree.init($("#svse_tree_check"), setting, data);
	});
	//弹窗移动
	ModalDrag.draggable("#topNofadddiv");
	///////读取检测器
	Meteor.call("svGetMonitorTemplate",function(err,result){
		for(name in result){
			console.log(name);
			var option = $("<option value="+name+"></option>").html(name)
			$("#marklist").append(option);
		}
	}),
	
        console.log("QQQQ");
       
         function zTreeOnChange(event, treeId, treeNode) {
            operDiyDom(treeId, treeNode);
        }
	function show(type, x, y) {
			$("#basicinfooftopNadd select").show();
			$("body").bind("change", onBodyChange);
		}
		
		function hideMenu() {
			if (basicinfooftopNadd) $("#basicinfooftopNadd").css({"visibility": "hidden"});
			$("body").unbind("change", onBodyChange);
		}			
		function onBodyChange(event){
			if (!(event.target.id == "basicinfooftopNadd" || $(event.target).parents("#basicinfooftopNadd").length>0)) {
				$("#basicinfooftopNadd").css({"visibility" : "hidden"});
			}
		}
         console.log("QQQQ111");
        function addTreeNode() {
			
			var newNode = { name:"增加" + (addCount++)};
			if (zTree.getSelectedNodes()[0]) {
				newNode.checked = zTree.getSelectedNodes()[0].checked;
				zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
			} else {
				zTree.addNodes(null, newNode);
			}
		}
		function removeTreeNode() {
			
			var nodes = zTree.getSelectedNodes();
			if (nodes && nodes.length>0) {
				if (nodes[0].children && nodes[0].children.length > 0) {
					var msg = "要删除的节点是父节点，如果删除将连同子节点一起删掉。\n\n请确认！";
					if (confirm(msg)==true){
						zTree.removeNode(nodes[0]);
					}
				} else {
					zTree.removeNode(nodes[0]);
				}
			}
		}
		function checkTreeNode(checked) {
			var nodes = zTree.getSelectedNodes();
			if (nodes && nodes.length>0) {
				zTree.checkNode(nodes[0], checked, true);
			}
			hideRMenu();
		}
		
		function resetTree() {
			
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
		}
		console.log("QQQQ99999");
	
}


Template.topNofedit.topNeditform = function(){
	return Session.get("topNeditform");
}

Template.topNofedit.events = {
         "change #Typelisted":function(){
	  
               //var index = document.getElementById('s1').selectedIndex; 
        if(document.getElementById("Typelisted").value=="Default"){
 
            document.getElementById('marklisted').disabled=false;
       }else{
            document.getElementById('marklisted').disabled=true;
				}
        },
         "change #reporttypePeriodlisted":function(){
	  
                if(document.getElementById("reporttypePeriodlisted").value=="Week"){
			   
                         document.getElementById("topNtypetemplatelisted").disabled=false;
                }
				else{
				 document.getElementById("topNtypetemplatelisted").disabled=true;
				}
        },
		
		
		
		
         "click #topNofaddcancelbtnedit":function(){
          $('#topNofadddivedit').modal('toggle');
         },
          "click #topNofaddsavebtnedit":function(){
       var topNofaddfromedit = ClientUtils.formArrayToObject($("#topNofaddfromedit").serializeArray());
       console.log("form:"+topNofaddfromedit);
	   //E-mail的判断
	     var email=topNofaddfromedit["EmailSend"];
		
           if(!email){
            Message.info("E-mail不能为空！",{align:"center",time:3});
			 //alert("邮件中必须包含@");
            return;
         }
		  //判断邮箱格式是否正确  
		 var mailStr =  'aa@bb.com;bb@aa.com;cc@aa.com';
		 var mail_arr =mailStr.split(";");
		 //if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email))      {  
		 if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*([,;][,;\s]*(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)*)*$/.test(email))      {   
             Message.info("E-mail格式错误!",{align:"center",time:3});   
             return false;
        }
       var nIndex = topNofaddfromedit["nIndex"];
       var address = {};
           address[nIndex] = topNofaddfromedit;
          console.log("nIndex:"+nIndex);
          SvseTopNDao.updateTopN(nIndex,address,function(result){
          console.log("12313");
          $('#topNofadddivedit').modal('toggle');
          console.log("%%%%");
              });
            }
       }