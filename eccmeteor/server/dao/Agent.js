Agent = {};

Object.defineProperty(Agent,"getReturn",{
	value:function(status,msg){
		status = !!status;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	}
})

Object.defineProperty(Agent,"error",function(cls,fn){
	Log4js.info(cls +" function "+fn+" isn't exists",-1);
})


Object.defineProperty(Agent,"getPermission",{
	value:function(permission){
		return true;
		var user = Meteor.user();
		if(!user) return false;
		if(user.profile.accounttype === "admin") //如果是管理员则拥有全部权限
			return true;
		//权限层次关系以 ">" 作为分割符
		var permissionArr = permission.split(">");
		var permissionflag = Meteor.user().profile;
		try{
			for(i in permissionArr){
				permissionflag = permissionflag[permissionArr[i]];
			}
		}catch(e){
			return false;
		}
		return permissionflag;
	}
});
/*
  定义权限类型常量
*/
Object.defineProperty(Agent,"_PermissionType",{
	value:{
		addGroup : "addGroup",//添加组
        addEntity : "addEntity",//添加设备
        delete : "delete",//删除本身
        edit : "edit",//编辑本身
        refresh : "refresh",//刷新本身
	    foribed : "foribed",//”禁用本身”, //新增
	    enable : "enable",//启用本身。 //新增
	    deleteMul : "deleteMul", //删除多个下属节点
	    foribedMul : "foribedMul",//批量禁用下属节点 //新增
	    enableMul : "enableMul", //批量启用下属节点//新增
	    addMonitor ： "addMonitor", // 添加监视器
		editMonitor ： "editMonitor", //编辑监视器
		deleteMonitor : "deleteMonitor", //删除监视器
	   	foribedMonitor:true://批量禁用下属节点 //新增
	    enableMonitor:true //批量启用下属节点//新增
	}
});

//转换id，由1.1转成1-1
Object.defineProperty(Agent,"converId",{
	value:function(id){
		return typeof(id) === "string" ? id.replace(/\./g,"-") : "";
	}
});
/**
	设备(组,监视器，设备)节点的权限权限获取方式
	参数：
		id:需要获取权限节点id;
		type:需要获取的权限类型;
**/
Object.defineProperty(Agent,"getEquipmentsOpratePermission",{
	value:function(id,type){
		var permission = "nodeOpratePermission>"+Agent.converId(id)+">"+type;
		return Agent.getPermission(permission);
	}
});