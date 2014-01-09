//var QueryLists = new Meteor.Collection("querylists");
//Session.setDefault('query', {id:"", name:"",status:"", Ip:""});
Session.setDefault('query', {sv_id:"", QueryObj:"", QueryOpr:"", QueryValue:""});

/*
*点击查询按钮开始查询
*/
Template.monitorInfo_right.events = 
{
    "click #testmenu li a" : function(e)
	{
		//Session.set("language",e.currentTarget.name);
		alert(e.currentTarget.innerText);
	},

	"change #MonitorTemplate":function(evt) 
    {
        Session.set("selected_template", evt.currentTarget.value);
    },

	"click #searchBtn":function(e)
	{
		//console.log("dsdsfd");
		//console.log($("#searchName").val());
		//var txt = eval("{sv_id:/" + $("#searchName").val()+"/}");		
		//console.log(txt);
		//var txt = $("#searchName").val();
		
		//var queryCondition = {id:$("#searchId").val(), name:$("#searchName").val(), status:$("#searchStatus").val(), Ip:$("#searchIp").val()};
		var queryCondition = {sv_id: $("#sv_id").val(), QueryObj:$("#QueryObj").val(), QueryOpr:$("#QueryOpr").val(), QueryValue:$("#QueryValue").val()};
		
		//var obj = new RegExp("\/" +txt+ "\/");
		//var obj = new RegExp(txt);
		//var obj = new RegExp("^"+txt+"$"); 
		//var reg = {sv_id:"/" txt "\/"};
		//var obj = {sv_id:txt};
		//console.log(obj);
		//SvseTree.find(obj).fetch();
		//console.log(SvseTree.find({sv_id:obj}).fetch());
		//Template.monitorInfolist.monitorInforesultlist = SvseTree.find({sv_id:obj}).fetch();
		//QueryLists = SvseTree.find({sv_id:obj});
		Session.set('query', queryCondition);
		//console.log(Template.monitorInfolist.monitorInforesultlist);
		//Template.monitorInfolist.rendered();
	}
}


/*
*查询结果数据列表
*/
Template.monitorInfo_list.monitorInforesultlist = function()
{
	//var obj = new RegExp(queryobj);
	//var obj = new RegExp("^"+txt+"$"); 
	//var reg = {sv_id:"/" txt "\/"};		
	//console.log(Template.monitorInfolist.monitorInforesultlist);
	
	//return SvseTree.find({sv_name:obj}).fetch();
	//return QueryLists.find().fetch();
	
	//var queryobjand = {sv_name:new RegExp(Session.get('query').name), sv_id:new RegExp(Session.get('query').id),status:new RegExp(Session.get('query').status)};
	//var queryobjor = {$or : [{sv_name:new RegExp(Session.get('query').name)}, {sv_id:new RegExp(Session.get('query').id)}, {status:new RegExp(Session.get('query').status)}]};
	//var queryobj = {$querycond:new RegExp(Session.get('query').QueryValue)};
	var queryobj = {};
	queryobj[Session.get('query').QueryObj] = new RegExp(Session.get('query').QueryValue);
	
	var nodes = SvseTree.find(queryobj).fetch();
	
	return nodes;		
}

/*
*获取监测树数据
*/
var getEntityTree = function()
{ 
	//查询条件	
	//var obj = new RegExp(Session.get('query').name);
	//var nodes = Svse.find({sv_name:obj}).fetch();
	
	//var queryobjand = {sv_name:new RegExp(Session.get('query').name), sv_id:new RegExp(Session.get('query').id),status:new RegExp(Session.get('query').status)};
	//var queryobjor = {$or : [{sv_name:new RegExp(Session.get('query').name)}, {sv_id:new RegExp(Session.get('query').id)}, {status:new RegExp(Session.get('query').status)}]};
	
	//var queryobj = {$querycond:new RegExp(Session.get('query').QueryValue)};
	var basequeryobj = {};
	basequeryobj["sv_id"] = new RegExp(Session.get('query').sv_id);
	
	var nodes = Svse.find(basequeryobj).fetch();
	
	//先组织出符合条件的sv_id及parentid数组?没有父亲的monitor等怎么处理?怎么展示到树上?设备及组下多余的子对象怎么
	//过滤?此种树是否太难做?列表方式虽然简单但不直观, 是否继续?
	
	//用关联查询查出符合条件的sv_id?SvseTree是否都有了?没必要关联?
	
	//是否从组织好的全信息树数组里查询并剪切出来?
	
	//是否sv_id为基础条件， 如果没有默认为1 + 一个附加条件实现各种过滤 + 关联（sv_id关联报警报告等）。
	//如果只搜索出一堆监测器怎么用树展示， 加上父亲设备等?
	
	//包含监视器		
	var branch = [];
	for(index in nodes)
	{
		var obj = nodes[index];
		var otherqueryobj = {};
		//otherqueryobj[Session.get('query').QueryObj] = new RegExp(Session.get('query').QueryValue);	
		otherqueryobj["sv_id"]=obj["sv_id"];
		//if(SvseTree.findOne(otherqueryobj).length == 0)
		   //continue;
		   
		var branchNode = {};
		branchNode["id"] = obj["sv_id"];
		branchNode["pId"] = obj["parentid"];
		branchNode["type"] = obj["type"];
		branchNode["name"] = SvseTree.findOne(otherqueryobj)["sv_name"];			
		//branchNode["isParent"] = true;
		branchNode["status"] = SvseTree.findOne(otherqueryobj)["status"];
		if(branchNode["pId"] === "0") branchNode["open"] = true;
		branchNode["open"] = true;
		if(obj["type"] === "entity" && obj["submonitor"] && obj["submonitor"].length)
		{				
			var submonitor = obj["submonitor"];		
			var submonitors = [];
			for(subindex in submonitor)
			{
				otherqueryobj = {};
				//otherqueryobj[Session.get('query').QueryObj] = new RegExp(Session.get('query').QueryValue);	
				otherqueryobj["sv_id"]=submonitor[subindex];	
				
				//if(SvseTree.findOne(otherqueryobj).length == 0)
				  // continue;
				
				var subobj = {};
				subobj["id"] = submonitor[subindex];
				//subobj["pId"] = obj["sv_id"];
				subobj["type"] = SvseTree.findOne(otherqueryobj)["sv_monitortype"];
				subobj["name"] = SvseTree.findOne(otherqueryobj)["sv_name"];
				//subobj["dstr"] = SvseTree.findOne(therqueryobj)["dstr"];
				subobj["status"] = SvseTree.findOne(otherqueryobj)["status"];
				subobj["status_disable"] = SvseTree.findOne({sv_id:submonitor[subindex]})["status_disable"];
				submonitors.push(subobj);
			}
			branchNode["submonitor"] = submonitors;
		}
		branchNode["icon"] = "imag/status/"+branchNode["type"]+(branchNode["status"]?branchNode["status"]:"")+".png";
		branch.push(branchNode);
	}
	return branch;		
}
	
/*
*获取设置树数据
*/
var getSearchTreeData = function()
{		
	//设备树 实例数据根节点		
	var treeNodes = [
		{id:1,pId:0,name:LanguageModel.getLanaguage("AlertModel").Alert,open:true,action:"warner",type:"warner",icon:"imag/setting/warner.png"},
		{id:3,pId:0,name:LanguageModel.getLanaguage("ReportModel").Report,open:true,action:"report",type:"report",icon:"imag/setting/Report.png"},
		{id:2,pId:0,name:LanguageModel.getLanaguage("othersetting").setting,open:true,action:"setting",type:"setting",icon:"imag/setting/setting.png"},	
		{id:11,pId:1,name:LanguageModel.getLanaguage("AlertModel").Alertrule,open:true,action:"warnerrule",type:"warner",icon:"imag/setting/warnerrule.png"},
		{id:22,pId:2,name:LanguageModel.getLanaguage("othersetting").emailsetting,open:true,action:"emailsetting",type:"setting",icon:"imag/setting/emailsetting.png"},
		{id:23,pId:2,name:LanguageModel.getLanaguage("othersetting").messagesetting,open:true,action:"messagesetting",type:"setting",icon:"imag/setting/messagesetting.png"},
		{id:24,pId:2,name:LanguageModel.getLanaguage("othersetting").usersetting,open:true,action:"usersetting",type:"setting",icon:"imag/setting/usersetting.png"},
		{id:31,pId:3,name:LanguageModel.getLanaguage("ReportModel").statistical,open:true,action:"statistical",type:"report",icon:"imag/setting/statistical.png"},
		{id:33,pId:3,name:LanguageModel.getLanaguage("ReportModel").topN,open:true,action:"topN",type:"report",icon:"imag/setting/topN.png"},
	];
	
	//查询条件
	var queryobj = Session.get('query').QueryValue;
	var obj = new RegExp(queryobj);

	
	//报警规则 实例数据		
	var alertrules = SvseWarnerRule.find({AlertTarget:obj}).fetch();
	//var alertrules = SvseWarnerRule.find().fetch();
	
	var id = 111;
	var childs = [];
	for(index in alertrules)
	{
		var subobj = alertrules[index];
		var alertrulenode = {};
		alertrulenode["id"]=String(id);
		alertrulenode["pId"]="11";
		alertrulenode["name"]=subobj["AlertName"];
		alertrulenode["type"]="alertrule";			
		id++;			
		childs.push(alertrulenode);
	}
	treeNodes[3]["childs"] = childs;

	//统计报告 实例数据		
     alertrules = SvseStatisticalresultlist.find({GroupRight:obj}).fetch();
	//alertrules = SvseStatisticalresultlist.find().fetch();
	
	id = 311;
	childs = [];
	for(index in alertrules)
	{
		var subobj = alertrules[index];
		var alertrulenode = {};
		alertrulenode["id"]=String(id);
		alertrulenode["pId"]="31";
		alertrulenode["name"]=subobj["Title"];
		alertrulenode["type"]="staticreport";
		id++;
		childs.push(alertrulenode);
	}	
	treeNodes[7]["childs"] = childs;
	
	return treeNodes;
}

/*
*构建监测树
*/
var drawMonitorTree = function()
{
	var IDMark_Switch = "_switch",
	IDMark_Icon = "_ico",
	IDMark_Span = "_span",
	IDMark_Input = "_input",
	IDMark_Check = "_check",
	IDMark_Edit = "_edit",
	IDMark_Remove = "_remove",
	IDMark_Ul = "_ul",
	IDMark_A = "_a";		
	function addDiyDom(treeId, treeNode) 
	{
		if (treeNode.type !== "entity") return;
		var aObj = $("#" + treeNode.tId + IDMark_A);
		var editStr = "";
		var monitorids = treeNode.submonitor;
		for(subindex in monitorids)
		{
			if(monitorids[subindex].status === "ok")
			{
				//editStr += "<a id='diyBtn1_" +monitorids[subindex].id+ "' onclick='alert(1);return false;'>" + "<img " + "id='timg1_"+ monitorids[subindex].id + "' src='imag/status/ok.png'/>" + "</a>";
				editStr += "<a id='diyBtn1_" +monitorids[subindex].id+ "' onclick=alert('"+ monitorids[subindex].name + "');>" + "<img "+"title='" + monitorids[subindex].dstr +"'src='imag/status/ok.png'/>" + "</a>";
				//editStr += $("#diyBtn1_"+ monitorids[subindex].id).popover({title:monitorids[subindex].name});
				//editStr += "MessageTip.info('hello world',{selector:'#diyBtn1_"+ monitorids[subindex].id + "',replace:true,close:false},)";
			}
			if(monitorids[subindex].status === "warning")
				editStr += "<a id='diyBtn1_" +monitorids[subindex].id+ "' onclick=alert('"+ monitorids[subindex].name + "');>" + "<img "+"title='" + monitorids[subindex].dstr +"'src='imag/status/warning.png'/>" + "</a>";
			if(monitorids[subindex].status === "error")
				editStr += "<a id='diyBtn1_" +monitorids[subindex].id+ "' onclick=alert('"+ monitorids[subindex].name + "');>" + "<img "+"title='" + monitorids[subindex].dstr +"'src='imag/status/error.png'/>" + "</a>";
			if(monitorids[subindex].status === "disable")
				editStr += "<a id='diyBtn1_" +monitorids[subindex].id+ "' onclick=alert('"+ monitorids[subindex].name + "');>" + "<img "+"title='" + monitorids[subindex].dstr +"'src='imag/status/disable.png'/>" + "</a>";
			if(monitorids[subindex].status === "bad")
				editStr += "<a id='diyBtn1_" +monitorids[subindex].id+ "' onclick=alert('"+ monitorids[subindex].name + "');>" + "<img "+"title='" + monitorids[subindex].dstr +"'src='imag/status/bad.png'/>" + "</a>";
			if(monitorids[subindex].status === "null")
				editStr += "<a id='diyBtn1_" +monitorids[subindex].id+ "' onclick=alert('"+ monitorids[subindex].name + "');>" + "<img "+"title='" + monitorids[subindex].dstr +"'src='imag/status/bad.png'/>" + "</a>";
			else
				editStr += "<a id='diyBtn1_" +monitorids[subindex].id+ "' onclick=alert('"+ monitorids[subindex].name + "');>" + "<img "+"title='" + monitorids[subindex].dstr +"'src='imag/status/error.png'/>" + "</a>";
		    //
			//monitorids[subindex].name 
		}
			//var editStr = "<a id='diyBtn1_" +treeNode.id+ "' onclick='alert(1);return false;'>链接1</a>" +
			//	"<a id='diyBtn2_" +treeNode.submonitor + "' onclick='alert(2);return false;'>链接2</a>";
			aObj.after(editStr);
			//$("#" + "id='timg1_"+ monitorids[subindex].id + "'").setTooltip(monitorids[subindex].name);
		//}
	};	
	
		
	function OnRightClick(event, treeId, treeNode) 
	{
		if (treeNode.type !== "entity") return;
		/*
		if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0)
		{
			zTree.cancelSelectedNode();
			showRMenu("root", event.clientX, event.clientY);
		}
		else if (treeNode && !treeNode.noR) 
		{
			zTree.selectNode(treeNode);
			showRMenu("node", event.clientX, event.clientY);
		}*/
		$("#testmenu").empty();
		var monitorids = treeNode.submonitor;
		for(subindex in monitorids)
		{
			var option = "<li><a tabindex='-1' href='#'>"+monitorids[subindex].type+"</a></li>";
			$("#testmenu").append(option);			
		}
		$("#testmenu").css({"top":event.pageY +"px", "left":event.pageX +"px"});
		//$("#testmenu").css({"top":event.currentTarget.offsetTop +"px", "left":event.currentTarget.offsetLeft +"px","visibility":"visible"});
		
		$("#testmenu").dropdown('toggle');
	}
	var data = getEntityTree();
	var setting = {
		/*check:{
			enable: false
			chkStyle: "checkbox",
			chkboxType: { "Y": "ps", "N": "ps" }
		},*/
		view: {
			addDiyDom: addDiyDom
		},			
		data: {
			simpleData: {
				enable: true,
				idKey: "id",
				pIdKey: "pId",
				rootPId: "0",
			}
		},
		callback: 
		{
			onRightClick: OnRightClick
		}
	};
	
	$.fn.zTree.init($("#svse_entity_tree"), setting, data);
}

/*
*构建设置树
*/
var drawSvseSettingTree = function()
{
	var IDMark_Switch = "_switch",
	IDMark_Icon = "_ico",
	IDMark_Span = "_span",
	IDMark_Input = "_input",
	IDMark_Check = "_check",
	IDMark_Edit = "_edit",
	IDMark_Remove = "_remove",
	IDMark_Ul = "_ul",
	IDMark_A = "_a";		
	function addDiyDom(treeId, treeNode) 
	{
		if (treeNode.id == 11)
		{
			//报警规则
			var aObj = $("#" + treeNode.tId + IDMark_A);
			var editStr = "";
			var childs = treeNode.childs;
			for(subindex in childs)
			{
			   editStr += "<a id='diyBtn1_" +childs[subindex].id+ "' onclick=alert('"+ childs[subindex].name + "');>" + "<img "+"title='" + childs[subindex].name +"'src='imag/setting/warnerrule.png'/>" + "</a>";
			}
			
			aObj.after(editStr);
		}
		else if (treeNode.id == 31)
		{
			//统计报告
			var aObj = $("#" + treeNode.tId + IDMark_A);
			var editStr = "";
			var childs = treeNode.childs;
			for(subindex in childs)
			{
				editStr += "<a id='diyBtn1_" +childs[subindex].id+ "' onclick=alert('"+ childs[subindex].name + "');>" + "<img "+"title='" + childs[subindex].name +"'src='imag/setting/statistical.png'/>" + "</a>";	
			}
			aObj.after(editStr);			
		}
		else
		{
			
		}
	};	
	
	var data = getSearchTreeData();
	
	var setting = {
		/*check:{
			enable: false
			chkStyle: "checkbox",
			chkboxType: { "Y": "ps", "N": "ps" }
		},*/
		view: {
			addDiyDom: addDiyDom
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
	
	$.fn.zTree.init($("#seach_setting_tree"), setting, data);		
}

Template.monitorInfo_right.rendered = function()
{	
	//绘制监视器树视图
	drawMonitorTree();
	
	//绘制设备树视图
	drawSvseSettingTree();
	
	
/*
	var nodes = SvseMonitorTemplate.find().fetch();
	for(name in nodes){
		//console.log(name);
		var option = $("<option value="+nodes[name].property.sv_id+"></option>").html(nodes[name].property.sv_name);
		$("#MonitorTemplate").append(option);
	}

	$("#MonitorReturn").empty();
	var returns = SvseMonitorTemplateDao.getMonityTemplateReturnItemsById(Session.get("selected_template"));
	for(name in returns){
		//console.log(name);
		var option = $("<option value="+returns[name].sv_name+"></option>").html(returns[name].sv_name);
		$("#MonitorReturn").append(option);
	}
	$("#testmenu").empty();
	for(name in returns){
		//console.log(name);
		var option = "<li><a tabindex='-1' href='#'>"+returns[name].sv_name+"</a></li>";
		$("#testmenu").append(option);
	}*/
}

/*
*查询结果数据列表
*/
Template.monitorInfo_right.monitortemplates = function()
{
	
	var nodes = SvseMonitorTemplate.find().fetch();
	
	return nodes;		
}

/*
*查询结果数据列表
*/
Template.monitorInfo_right.monitorreturns = function()
{
	
	var returns = SvseMonitorTemplateDao.getMonitorTemplateIdBySvid(Session.get("selected_template"));
	
	return returns;		
}


// Client
Meteor.autosubscribe = function () 
{
  Meteor.subscribe("selected_template",Session.get("selected_template"));
}

// Server
// Meteor.publish("selected_template", function(selected_template) {
	// var returns = SvseMonitorTemplateDao.getMonityTemplateReturnItemsById(Session.get("selected_template"));	
	// return returns;	
// })