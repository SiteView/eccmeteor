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

//验正邮箱格式要正确 20080602_heyitang
//var email=document. getElementById_r("trans_email").value;
//如果，用户入了邮箱才需要进行判断
/*var email=basicinfooftopNadd["EmailSend"];
if (email!=null)
{if (email.indexOf(",")==-1)
{
if(!Email(email))
{
alert("您输入的单个邮件格式有误，请重新核对后再输入");
document.getElementById_r("trans_email").focus();
return false;
}
}
else
{
var emailArray=email.split(",");
for(i=0;i<emailArray.length;i++)
{
//这里防止出现heyitang@qq.com;heyitang@163.com;;多加了;这时候，数组中可能有元素没有内容
if(emailArray[i]!=null || emailArray[i]!="")
{
if(!Email(emailArray[i]))
{
alert("您输入的多个邮箱格式中有邮箱格式不 正确，请重新核对后再输入");
document.getElementById_r("trans_email").focus();
return false;
}
}
}
}
 } */
 
       
/*var mailStr =  'aa@bb.com;bb@aa.com;cc@aa.com';
先将字符串转换为数组
var mail_arr =mailStr.split(";");
然后用正则表达式逐个判断是否合法
for(var i=0;i<mail_arr.length;i++){
 if(!/([a-zA-Z]|[0-9]|_)+@([a-zA-Z]|[0-9]|_)+.com/.test(mail_arr[i]))
{
如果当中有一个邮箱格式错误。。则返回false
  return 'false';
}
return 'true';
}*/
	/* if(email.indexOf(".")==-1)  {
         Message.info("邮箱地址中必须包含."); 
     //document.myform.userEmail.focus();
     //document.myform.userEmail.select();
          return false;
     document.getElementById("24").style.display="block";
     document.getElementById("14").style.display="none";
    }   
    var email = document.getElementById("email").value; //获取邮箱地址  
     //判断邮箱格式是否正确  
       if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email))      {   
              Message.info("E-mail格式错误!");   
              document.getElementById("email").focus();       //让邮箱文本框获得焦点  
              return false;
             document.getElementById("24").style.display="block";
             document.getElementById("14").style.display="none";    
       }  */
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
	
	
	
	//topN报告分页
		/* $(function index(pos)
		{
		window.location = "pageUrl.aspx?page=" + pos;
		}),
		$(function gopage()
		{
		var pInput = document.getElementById('pInput').value;
		index(pInput);
		}),
		//curpage当前页码,totalpage总共页数,totalnum总记录数
		$(function ShowPages(curpage,totalpage,totalnum)
		{
		var str = "";
		str += "<table border=\"0\" align=\"center\" cellspacing=\"0\" cellpadding=\"3\">";
		str += "<tr>";
		str += "<td>第" + curpage + "页/共[" + totalpage + "]页 [" + totalnum + "]条记录</td>";
		str += "<td>";

		if(curpage > 1)
		{
		var last_page = curpage - 1;
		str += "<a href=\"javascript:index(" + last_page + ")\" class=\"fclblack\"><img
		src=\"images/prev.gif\" alt=\"上一页\" align=\"absmiddle\" border=\"0\"/></a>";
		}

		str += "</td>";

		var show_pages = 2;

		var start_page = curpage - show_pages;
		if(start_page < 1)
		{
		start_page = 1;
		}

		var end_page = curpage + show_pages;
		if(end_page > totalpage)
		{
		end_page = totalpage;
		}

		for(var i=start_page;i<=end_page;i++)
		{
		str += "<td><a href=\"javascript:index(" + i + ")\" class=\"fclblack\">[" + i + "]</a></td>";
		}

		if(curpage < totalpage)
		{
		var next_page = curpage + 1;
		str += "<td><a href=\"javascript:index(" + next_page + ")\" class=\"fclblack\"><img
		src=\"images/next.gif\" alt=\"下一页\" align=\"absmiddle\" border=\"0\"/></a></td>";
		}

		str += "<td>跳转到&nbsp;<input id=\"pInput\" type=\"text\" name=\"pInput\"
		style=\"width:20px;height:15px;border:1px solid #606060;line-height:16px;\"/>&nbsp;页&nbsp;<a
		href=\"javascript:gopage();\" class=\"fclblack\">GO</a></td>";
		str += "</tr>";
		str += "</table>";

		document.write(str);

		})*/
			  
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
		ModalDrag.draggable("#topNofadddiv")
	}
//获取topNlist的集合
Template.topNlist.topNresultlist = function(){
	console.log(SvseTopNDao.getTopNresultlist());
	return SvseTopNDao.getTopNresultlist();
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
	Meteor.call("svGetEmailTemplates",function(err,result){
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
Template.showMonitorInfo.rendered = function(){
	if(!this._rendered) {
			this._rendered = true;
	}
	$(function(){
		$("thead .span1 :checkbox").each(function(){//全选，全不选
			$(this).bind("click",function(){
				var flag = this.checked; 
				$(this).closest("table").find("tbody :checkbox").each(function(){
					this.checked = flag//$(this).attr("checked",flag);该写法有bug无法再界面上显示钩
				});
			});
		});
		//在HelperRegister.js中createDomeByPropertyHelper 创建监视器属性时，可能出现dll(通过Class="dynamicDll")类型动态属性，此时需要重新处理该属性对应的Dom元素
		if($("select.dynamicDll:first").length){
			(function(){		
			//	var panrentid = Session.get("checkedTreeNode")["id"];
				var entityId = SessionManage.getCheckedTreeNode("id");
				var monitorstatus = ($("#monitorstatus").val() === "true" || $("#monitorstatus").val() === true) ;
				if(monitorstatus){ //编辑状态
				//	var monitorid = Session.get("checkedMonitorId")["id"];
					var monitorTemplateType = SessionManage.setCheckedMonitorId();
					var templateMonitoryId = SvseTreeDao.getMonitorTypeById(monitorTemplateType); //获取需编辑监视器的模板id
				}else{
					templateMonitoryId = Session.get("monityTemplateId");
				}			
				console.log(entityId+" : "+templateMonitoryId);
				//获取某个监视器的动态属性
				SvseMonitorTemplateDao.getMonityDynamicPropertyData(entityId,templateMonitoryId,function(status,result){
					if(!status){
						SystemLogger(result,-1);
						return;
					}
					var optionObj = result["DynamicData"];
					for(name in optionObj){
						var option = $("<option value='"+optionObj[name]+"'>"+name+"</option>");
						$("select.dynamicDll:first").append(option);
					}
				});
			})();
		}
	});
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