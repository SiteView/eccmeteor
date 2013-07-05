Template.usersetting.events({
	"click #addusersetting":function(){
		$('#usersettingadddiv').modal('toggle');
	},
	"click #delusersetting":function(){
		var checks = $("#userSettingList :checkbox[checked]");
		if(!checks.length) return;
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			var id = $(checks[i]).attr("id");
			ids.push(id);
		}
		if(ids.length)
			SvseUserDao.deleteUser(ids,function(result){
				console.log(result);
			});
	},
	"click #allowusersetting":function(){
		var checks = $("#userSettingList :checkbox[checked]");
		if(!checks.length) return;
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			var id = $(checks[i]).attr("id");
			if(Meteor.users.findOne(id).profile.accountstatus)
				continue;
			ids.push(id);
		}
		if(ids.length)
			SvseUserDao.forbid(ids,true,function(result){
				console.log(result);
			});
	},
	"click #forbidusersetting":function(){
		var checks = $("#userSettingList :checkbox[checked]");
		if(!checks.length) return;
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			var id = $(checks[i]).attr("id");
			if(!Meteor.users.findOne(id).profile.accountstatus)
				continue;
			ids.push(id);
		}
		if(ids.length)
			SvseUserDao.forbid(ids,false,function(result){
				console.log(result);
			});
	},
	"click #helpmessage":function(){
		
	}
});
Template.usersettingListTable.userlist = function(){
	return Meteor.users.find({}).fetch();
}

Template.usersettingListTable.rendered = function(){
	//初始化 checkbox事件
	$(function(){
		$("#usersettingtableselectall").click(function(){
			var flag = this.checked; 
			$(this).closest("table").find("tbody :checkbox").each(function(){
				this.checked = flag;
			});
		});
	
	});
}
Template.usersettingListTable.events({
	"click #userSettingList button[name='edit']":function(e){
		var user = SvseUserDao.getUserByUsername(e.target.id);
		$('#usersettingeditdiv :text[name="username"]').val(user.username);
		$('#usersettingeditdiv :text[name="aliasname"]').val(user.profile.aliasname);
		$('#usersettingeditdiv').modal('toggle');
	},
	"click #userSettingList button[name='promission']":function(e){
		console.log(e.target.id);
		var user = SvseUserDao.getUserByUsername(e.target.id);
		console.log(user);
		$("#userPromissionSettingDiv #promissionUsername").html(user.username);
		$("#userPromissionSettingDiv #promissionUserId").val(user._id);
		$('#userPromissionSettingDiv').modal('toggle');
	}
});

Template.usersettingadd.events({
	"click #usersettingaddformsavebtn":function(){
		var user = ClientUtils.formArrayToObject($("#usersettingaddform").serializeArray());
		if(!user.password.length || user.password !== user.password2) return;
		SvseUserDao.register(user,function(result){
			if(result.status){
				console.log("注册成功");
				$("#usersettingaddform :text").val("");
				$("#usersettingaddform :password").val("");
				$("#usersettingaddform :text[name='username']").closest("div.controls").find("span").css("display","none");
				$("#usersettingaddform :text[name='username']").closest("div.control-group").removeClass("error");
				$('#usersettingadddiv').modal('toggle');
			}else{
				$("#usersettingaddform :text[name='username']").closest("div.controls").find("span").css("display","block").html(result.msg);
				$("#usersettingaddform :text[name='username']").closest("div.control-group").addClass("error");
			}
		});
	},
	"click #usersettingaddformcanclebtn":function(){
		$("#usersettingaddform :text").val("");
		$("#usersettingaddform :password").each(function(){$(this).val("")});
		$("#usersettingaddform :text[name='username']").closest("div.controls").find("span").css("display","none");
		$("#usersettingaddform :text[name='username']").closest("div.control-group").removeClass("error");
		$('#usersettingadddiv').modal('toggle');
	}
});

Template.usersettingadd.rendered = function(){
	$(function(){
		$("#usersettingaddform :password[name='password2']").blur(function(){
			if($(this).val() !== $("#usersettingaddform :password[name='password']").val()){
					$(this).closest("div.controls").find("span").css("display","block");
					$(this).closest("div.control-group").addClass("error");
			}else{
				$(this).closest("div.controls").find("span").css("display","none");
				$(this).closest("div.control-group").removeClass("error");
			}
		});
	});
}

Template.usersettingedit.rendered = function(){
	$(function(){
		$("#usersettingeditform :password[name='password2']").blur(function(){
			if($(this).val() !== $("#usersettingeditform :password[name='password']").val()){
					$(this).closest("div.controls").find("span").css("display","block")
					$(this).closest("div.control-group").addClass("error");
			}else{
				$(this).closest("div.controls").find("span").css("display","none")
				$(this).closest("div.control-group").removeClass("error");
			}
		});
	});
}

Template.usersettingedit.events({
	"click #usersettingeditformcanclebtn":function(){
		$("#usersettingeditform :password").each(function(){$(this).val("")});
		$('#usersettingeditdiv').modal('toggle');
	},
	"click #usersettingeditformsavebtn":function(){
		var user = ClientUtils.formArrayToObject($("#usersettingeditform").serializeArray());
		if(!user.password.length || user.password !== user.password2) return;
		console.log(user);
		SvseUserDao.setPassword(user,function(result){
			if(!result.status){
				console.log(result.msg);
			}else{
				$("#usersettingeditform :password").each(function(){$(this).val("")});
				$('#usersettingeditdiv').modal('toggle');
			}
		});
		
	}
});

Template.userPromissionSetting.rendered = function(){
	console.log("重复执行");
	$(function(){
		$('#userPromissionSettingDiv').modal({
			backdrop:false,
			keyboard:false,
			show:false
		}).css({
			height:"545",
			width:"800"
		});
	});
}

Template.userPromissionSetting.events({
	"click #userPromissionSettingSetNodesBtn":function(){
		console.log(Session.set("userPromissionSettingGroupControlData"));
		return;
	
		var svsenodes = [];
		//获取可见节点授权
		var svsenodearr = $.fn.zTree.getZTreeObj("svse_tree_promission_check").getNodesByFilter(function(node){return node.checked});
		for(index in svsenodearr){
			svsenodes.push(svsenodearr[index].id);
		}
		console.log(svsenodes);
		var settingnodes = [];
		var svsesettingnodearr = $.fn.zTree.getZTreeObj("svse_other_promission_check").getNodesByFilter(function(node){return node.checked});
		for(index in svsesettingnodearr){
			settingnodes.push(svsesettingnodearr[index].action);
		}
		console.log(settingnodes);
		var uid = $("#userPromissionSettingDiv #promissionUserId").val();
		console.log(uid);
		//存储可见节点数据
		SvseUserDao.setDisplayPromission(uid,svsenodes,settingnodes,function(result){
			console.log(result);
		});
		//存储节点授权
		console.log(Session.set("userPromissionSettingGroupControlData"));
		
		//清空Session中的临时数据
	},
	"click #userPromissionSettingCloseBtn":function(){ //关闭权限控制弹窗
		Session.set("userPromissionSettingGroupControlData",undefined);//清空Session中的临时数据
		Session.set("userPromissionSettingGroupControlNodeId",undefined);
		$("#userPromissionSettingDiv").modal('toggle');
	}
});

Template.userPromissionSettingGroupControl.type = function(){
	return Session.get("userPromissionSettingGroupControlType");
}
Template.userPromissionSettingGroupControl.rendered = function(){
	var data = Session.get("userPromissionSettingGroupControlData");
	var currendOperationUserId = $("#userPromissionSettingDiv #promissionUserId").val();//当前被操作的用户id
	if(!currendOperationUserId) return;
	//如果临时数据不存在，则从数据拉取  ???或者新建一个????	
	if(!data){
		//data = {};
		console.log(currendOperationUserId);
		data = SvseUserDao.getNodeOpratePromissByUserId(currendOperationUserId);
		Session.set("userPromissionSettingGroupControlData",data);//存储到临时数据里面
	}
	var currend_id = Session.get("userPromissionSettingGroupControlNodeId");
	var promissionCheckboxs = data[currend_id];
	console.log("promissionCheckboxs:  ");
	console.log(promissionCheckboxs);
	//如果当前节点不存在授权
	if(!promissionCheckboxs)
		return;
	//勾选相应的权限选项
	for(promission in promissionCheckboxs){
		if(!$("#userPromissionSettingGroupControlForm :checkbox[name="+promission+"]")[0]){
			console.log(promission);
			continue;
		}
		try{
			$("#userPromissionSettingGroupControlForm :checkbox[name="+promission+"]")[0].checked = promissionCheckboxs[promission];
		}catch(e){
			console.log(e);
		}
	}
}
//两棵树的渲染
Template.userPromissionSettingTree.rendered = function(){
	$(function(){
		var data = SvseDao.getTreeSimple();
		var svsesetting = {
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
			},
			callback:{
				onClick:function(event, treeId, treeNode){
					//第一步  获取上一个操作节点，存储相关信息  ps:当前函数中实现
					//第二步  先从内存中读取 点击 的节点的操作权限，  
						//	若不存在，则从数据库中获取该节点的操作权限，反射到操作权限选择框中
						// ps: Template.userPromissionSettingGroupControl.rendered中实现
					//第三步 点击关闭按钮或者确认按钮时 ，清空临时数据 //ps:在 Template.userPromissionSetting.events 中实现
						
					var currend_id= treeNode.id;	//当前节点的ID
					var current_type = treeNode.type === "entity" ? "entity" : "group" ;//当前节点类型
					console.log("当前节点ID是" + currend_id  +"  节点类型是 " + current_type);
					var foward_id = Session.get("userPromissionSettingGroupControlNodeId"); //获取上个节点id
					if(currend_id === foward_id) return;  //如果当前节点和上一次点击节点相同则返回
					
					//设置节点对应的操作权限的临时存储数据
					var  data  = Session.get("userPromissionSettingGroupControlData");		

					//存储上一个节点	
					if(typeof foward_id !== "undefined"){
						var operation ={};//定义节点操作权限对象
						$("#userPromissionSettingGroupControlForm :checkbox").each(function(){ //遍历复选框
							operation[$(this).attr("name")] = this.checked;
							this.checked = false;
						});
						//节点权限赋值
						data[foward_id] = operation;
						console.log("上个节点 "+foward_id+" 的权限情况是：");
						console.log(operation);
						data[foward_id] = operation;
					}
					Session.set("userPromissionSettingGroupControlData",data);//存储到临时数据里面
					Session.set("userPromissionSettingGroupControlNodeId",currend_id); //存储临时信息
					Session.set("userPromissionSettingGroupControlType",current_type); //改变模板状态			
				}
			}
		};
		$.fn.zTree.init($("#svse_tree_promission_check"), svsesetting, data);
		
		var settingdata = NavigationSettionTree.getTreeData();
		var othersetting ={
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
		}
		$.fn.zTree.init($("#svse_other_promission_check"), othersetting, settingdata);
	});
}
