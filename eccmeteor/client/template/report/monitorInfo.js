//var QueryLists = new Meteor.Collection("querylists");
Session.setDefault('query', {id:"", name:"",status:"", Ip:""});

/*
*点击查询按钮开始查询
*/
Template.monitorInfo.events = 
{
	"click #searchBtn":function(e)
	{
		//console.log("dsdsfd");
		console.log($("#searchName").val());
		//var txt = eval("{sv_id:/" + $("#searchName").val()+"/}");		
		//console.log(txt);
		//var txt = $("#searchName").val();
		var queryCondition = {id:$("#searchId").val(), name:$("#searchName").val(), 
		status:$("#searchStatus").val(), Ip:$("#searchIp").val()};
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
Template.monitorInfolist.monitorInforesultlist = function()
{
		var queryobj = Session.get('query').id;
		var obj = new RegExp(queryobj);
		//var obj = new RegExp("^"+txt+"$"); 
		//var reg = {sv_id:"/" txt "\/"};		
		//console.log(Template.monitorInfolist.monitorInforesultlist);
		
		return SvseTree.find({sv_id:obj}).fetch();
		//return QueryLists.find().fetch();
}

/*
*获取监测树数据
*/
var getEntityTree = function()
{ 
	//查询条件
	var queryobj = Session.get('query').id;
	var obj = new RegExp(queryobj);

	
	//包含监视器	
	var nodes = Svse.find({sv_id:obj}).fetch();
	var branch = [];
	for(index in nodes)
	{
		var obj = nodes[index];
		var branchNode = {};
		branchNode["id"] = obj["sv_id"];
		branchNode["pId"] = obj["parentid"];
		branchNode["type"] = obj["type"];
		branchNode["name"] = SvseTree.findOne({sv_id:obj["sv_id"]})["sv_name"];			
		//branchNode["isParent"] = true;
		branchNode["status"] = SvseTree.findOne({sv_id:obj["sv_id"]})["status"];
		if(branchNode["pId"] === "0") branchNode["open"] = true;
		branchNode["open"] = true;
		if(obj["type"] === "entity" && obj["submonitor"] && obj["submonitor"].length)
		{				
			var submonitor = obj["submonitor"];		
			var submonitors = [];
			for(subindex in submonitor)
			{
				var subobj = {};
				subobj["id"] = submonitor[subindex];
				//subobj["pId"] = obj["sv_id"];
				subobj["type"] = SvseTree.findOne({sv_id:submonitor[subindex]})["sv_monitortype"];
				subobj["name"] = SvseTree.findOne({sv_id:submonitor[subindex]})["sv_name"];
				subobj["dstr"] = SvseTree.findOne({sv_id:submonitor[subindex]})["dstr"];
				subobj["status"] = SvseTree.findOne({sv_id:submonitor[subindex]})["status"];
				//subobj["status_disable"] = SvseTree.findOne({sv_id:submonitor[subindex]})["status_disable"];
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
	var queryobj = Session.get('query').id;
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

Template.monitorInfo.rendered = function()
{	
	//绘制监视器树视图
	drawMonitorTree();
	
	//绘制设备树视图
	drawSvseSettingTree();
}