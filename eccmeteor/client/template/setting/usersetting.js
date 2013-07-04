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
	$(function(){
		var data = SvseDao.getTreeSimple();
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
			},
			callback:{
				onClick:function(event, treeId, treeNode){
					var  data  = Session.set("userPromissionSettingGroupControlData");
					if(!data)
						Session.set("userPromissionSettingGroupControlData",{});
							
					var id= treeNode.id;
					var type = treeNode.type;
					Session.set("userPromissionSettingGroupControlType",type);
					//第一步  获取上一个操作节点，存储相关信息
					//第二步  先从内存中读取 点击 的节点的操作权限，
						//	若不存在，则从数据库中获取该节点的操作权限，反射到操作权限选择框中
					//点击关闭按钮时 ，清空临时数据
					
				}
			}
		};
		$.fn.zTree.init($("#svse_tree_promission_check"), setting, data);
		
		var settingdata = NavigationSettionTree.getTreeData();
		$.fn.zTree.init($("#svse_other_promission_check"), setting, settingdata);
	});
	
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
		var svsenodes = [];
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
		SvseUserDao.setDisplayPromission(uid,svsenodes,settingnodes,function(result){
			console.log(result);
		});
	},
	"click #userPromissionSettingCloseBtn":function(){
		$("#userPromissionSettingDiv").modal('toggle');
	}
});

Template.userPromissionSettingGroupControl.type = function(){
	return Session.get("userPromissionSettingGroupControlType");
}