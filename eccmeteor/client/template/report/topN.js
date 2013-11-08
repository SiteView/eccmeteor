var getTopNListSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("topNlist");
}
Template.topN.events = {
    //点击添加按钮弹出框    
	"click #topNofadd":function(e){
		$('#topNofadddiv').modal('toggle');
	},
	"click #topNofdel":function(){
	var checks = $("#topNlist :checkbox[checked]");
	var ids = [];
	for(var i = 0; i < checks.length; i++){
	   ids.push($(checks[i]).attr("id"));
	}
	if(ids.length)
	  SvseTopNDao.deleteTopNByIds(ids,function(result){
	    console.log("删除全部《《");
	  	SystemLogger(result);
	  	console.log("删除全部》》");
	  });
	  
	},
	"click #allowetopN" : function(){  //启用TopN地址
		var checks = $("#topNlist :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseTopNDao.updateTopNStatus(ids,"Yes",function(result){
				SystemLogger(result);
			});
			
	},
	"click #forbidtopN" : function(){ //禁用TopN地址
		var checks = $("#topNlist :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseTopNDao.updateTopNStatus(ids,"No",function(result){
				SystemLogger(result);
			});
	},
	"click #topNrefresh" : function(){//topN报告同步
		SvseTopNDao.sync();
	},
	"click #topNhelpmessage" : function(){//帮助信息
	$('#helpmessagediv').modal('toggle');
 
	}
}


//点击保存、取消按钮时的事件

Template.topNofadd.events = {
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
		var Title=basicinfooftopNadd["Title"];
		   if(!Title){
			Message.info("请填写标题");
			return;
		}
		
		var result=SvseTopNDao.getTopNByName(Title);
		   if(result){
			Message.info("报告标题已经存在!");
			return;
		}
		
		var email=basicinfooftopNadd["EmailSend"];
           if(!email){
            Message.info("E-mail格式不正确");
            return;
     }
		
		/*//验证E-mail格式是否正确
		var strEmail=SvseTopNDao.getTopNByName(EmailSend);
		if (strEmail.search(/^w+((-w+)|(.w+))*@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+)*.[A-Za-z0-9]+$/) != -1){
        return true; }
         else {
             alert("oh"); 
		}*/
		
		
		//邮箱  
   /* var emailValue=document.myform.userEmail.value;
    if(emailValue.indexOf("@")==-1)  {
        alert("邮件中必须包含@");
     document.myform.userEmail.focus();
     document.myform.userEmail.select();
        return false;
     document.getElementById("24").style.display="block";
     document.getElementById("14").style.display="none";
       }  
   if(emailValue.indexOf(".")==-1)  {
         alert("邮箱必须包含."); 
     document.myform.userEmail.focus();
     document.myform.userEmail.select();
          return false;
     document.getElementById("24").style.display="block";
     document.getElementById("14").style.display="none";
    }      
   var email = document.getElementById("email").value; //获取邮箱地址  
     //判断邮箱格式是否正确  
       if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email))      {   
              alert("邮箱格式错误!");   
              document.getElementById("email").focus();       //让邮箱文本框获得焦点  
              return false;
             document.getElementById("24").style.display="block";
             document.getElementById("14").style.display="none";    
       }*/
		
		var nIndex = new Date().format("yyyyMMddhhmmss") +"x"+ Math.floor(Math.random()*1000);
		for(index in arr){
			targets.push(arr[index].id);
		}
		basicinfooftopNadd["AlertTarget"] = targets.join();
		if(!basicinfooftopNadd["AlertTarget"]){
			Message.info("监测范围不能为空");
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
	"click td .btn":function(e){
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
				 
		/*function addTreeNode() {
			
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
		console.log("QQQQ99999");*/
		
				 
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

Template.topNofedit.rendered = function(){
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
	Meteor.call("svGetEmailTemplates",function(err,result){
		for(name in result){
			console.log(name);
			var option = $("<option value="+name+"></option>").html(name)
			$("#Typelist").append(option);
		}
	});
	Meteor.call("svGetEmailTemplates",function(err,result){
		for(name in result){
			console.log(name);
			var option = $("<option value="+name+"></option>").html(name)
			$("#marklist").append(option);
		}
	});
	
	
	/*$(function(){ type(s)
{
    txt.value+=s;
    //选择后,让第一项被选中
    document.all.sel.options[0].selected=true;
}*/


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
		
        function selectPeriod(x){
		      var y=document.getElementById(x).value
                if(document.getElementById("reporttypePeriodlist").value=="Week"){
			   //if(document.getElementById("reporttypePeriodlist").value==y.toselectPeriod()){
                         document.getElementById("reporttypetemplatelist").disabled=false;
                }
				else{
				 document.getElementById("reporttypetemplatelist").disabled=true;
				}
        }
		
}


Template.topNofedit.topNeditform = function(){
	return Session.get("topNeditform");
}

Template.topNofedit.events = {
         "click #topNofaddcancelbtnedit":function(){
          $('#topNofadddivedit').modal('toggle');
         },
          "click #topNofaddsavebtnedit":function(){
       var topNofaddfromedit = ClientUtils.formArrayToObject($("#topNofaddfromedit").serializeArray());
       console.log("form:"+topNofaddfromedit);
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