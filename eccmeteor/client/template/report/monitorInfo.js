var QueryLists = new Meteor.Collection("querylists");
Session.setDefault('query_id', null);
//单击添加按钮
Template.monitorInfo.events = {
	"click #searchBtn":function(e){
		//console.log("dsdsfd");
		console.log($("#searchName").val());
		//var txt = eval("{sv_id:/" + $("#searchName").val()+"/}");		
		//console.log(txt);
		var txt = $("#searchName").val();	
		//var obj = new RegExp("\/" +txt+ "\/");
		var obj = new RegExp(txt);
		//var obj = new RegExp("^"+txt+"$"); 
		//var reg = {sv_id:"/" txt "\/"};
		//var obj = {sv_id:txt};
		//console.log(obj);
		//SvseTree.find(obj).fetch();
		//console.log(SvseTree.find({sv_id:obj}).fetch());
		//Template.monitorInfolist.monitorInforesultlist = SvseTree.find({sv_id:obj}).fetch();
		//QueryLists = SvseTree.find({sv_id:obj});
		Session.set('query_id', txt);
		//console.log(Template.monitorInfolist.monitorInforesultlist);
		//Template.monitorInfolist.rendered();
	}
}

Template.monitorInfolist.monitorInforesultlist = function(){
		var obj = new RegExp(Session.get('query_id'));
		//var obj = new RegExp("^"+txt+"$"); 
		//var reg = {sv_id:"/" txt "\/"};		
		//console.log(Template.monitorInfolist.monitorInforesultlist);
		return SvseTree.find({sv_id:obj}).fetch();
		//return QueryLists.find().fetch();
}

Template.monitorInfo.rendered = function(){
	//监视器选择树
	$(function(){
		var IDMark_Switch = "_switch",
		IDMark_Icon = "_ico",
		IDMark_Span = "_span",
		IDMark_Input = "_input",
		IDMark_Check = "_check",
		IDMark_Edit = "_edit",
		IDMark_Remove = "_remove",
		IDMark_Ul = "_ul",
		IDMark_A = "_a";		
		function addDiyDom(treeId, treeNode) {
			if (treeNode.type !== "entity") return;
			var aObj = $("#" + treeNode.tId + IDMark_A);
			/*if (treeNode.id == 21) {
				var editStr = "<span class='demoIcon' id='diyBtn_" +treeNode.id+ "' title='"+treeNode.name+"' onfocus='this.blur();'><span class='button icon01'></span></span>";
				aObj.append(editStr);
				var btn = $("#diyBtn_"+treeNode.id);
				if (btn) btn.bind("click", function(){alert("diy Button for " + treeNode.name);});
			} else if (treeNode.id == 22) {
				var editStr = "<span class='demoIcon' id='diyBtn_" +treeNode.id+ "' title='"+treeNode.name+"' onfocus='this.blur();'><span class='button icon02'></span></span>";
				aObj.after(editStr);
				var btn = $("#diyBtn_"+treeNode.id);
				if (btn) btn.bind("click", function(){alert("diy Button for " + treeNode.name);});
			} else if (treeNode.id == 23) {
				var editStr = "<select class='selDemo' id='diyBtn_" +treeNode.id+ "'><option value=1>1</option><option value=2>2</option><option value=3>3</option></select>";
				aObj.after(editStr);
				var btn = $("#diyBtn_"+treeNode.id);
				if (btn) btn.bind("change", function(){alert("diy Select value="+btn.attr("value")+" for " + treeNode.name);});
			} else if (treeNode.id == 24) {
				var editStr = "<span id='diyBtn_" +treeNode.id+ "'>Text Demo...</span>";
				aObj.after(editStr);
			} else if (treeNode.id == 25) {*/
			var editStr = "";
			var monitorids = treeNode.submonitor;
			for(subindex in monitorids){
				if(monitorids[subindex].status === "ok")
				{
					//editStr += "<a id='diyBtn1_" +monitorids[subindex].id+ "' onclick='alert(1);return false;'>" + "<img " + "id='timg1_"+ monitorids[subindex].id + "' src='imag/status/ok.png'/>" + "</a>";
					editStr += "<a id='diyBtn1_" +monitorids[subindex].id+ "' onclick='alert(1);return false;'>" + "<img src='imag/status/ok.png'/>" + "</a>";
					//editStr += $("#diyBtn1_"+ monitorids[subindex].id).popover({title:monitorids[subindex].name});
					//editStr += "MessageTip.info('hello world',{selector:'#diyBtn1_"+ monitorids[subindex].id + "',replace:true,close:false},)";
				}
				if(monitorids[subindex].status === "warning")
					editStr += "<a id='diyBtn1_" +monitorids[subindex].id+ "' onclick='alert(1);return false;'>" + "<img src='imag/status/warning.png'/>" + "</a>";
				if(monitorids[subindex].status === "error")
					editStr += "<a id='diyBtn1_" +monitorids[subindex].id+ "' onclick='alert(1);return false;'>" + "<img src='imag/status/error.png'/>" + "</a>";
				if(monitorids[subindex].status === "disable")
					editStr += "<a id='diyBtn1_" +monitorids[subindex].id+ "' onclick='alert(1);return false;'>" + "<img src='imag/status/disable.png'/>" + "</a>";
				if(monitorids[subindex].status === "bad")
					editStr += "<a id='diyBtn1_" +monitorids[subindex].id+ "' onclick='alert(1);return false;'>" + "<img src='imag/status/bad.png'/>" + "</a>";				
				if(monitorids[subindex].status === "null")
					editStr += "<a id='diyBtn1_" +monitorids[subindex].id+ "' onclick='alert(1);return false;'>" + "<img src='imag/status/bad.png'/>" + "</a>";				
				else
					editStr += "<a id='diyBtn1_" +monitorids[subindex].id+ "' onclick='alert(1);return false;'>" + "<img src='imag/status/error.png'/>" + "</a>";	
			    //
				//monitorids[subindex].name 
			}
				//var editStr = "<a id='diyBtn1_" +treeNode.id+ "' onclick='alert(1);return false;'>链接1</a>" +
				//	"<a id='diyBtn2_" +treeNode.submonitor + "' onclick='alert(2);return false;'>链接2</a>";
				aObj.after(editStr);
				//$("#" + "id='timg1_"+ monitorids[subindex].id + "'").setTooltip(monitorids[subindex].name);
			//}
		};	
		
		var data = SvseDao.getEntityTree();
		var setting = {
			check:{
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "ps", "N": "ps" }
			},
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
		
		//MessageTip.info("hello world",{selector:"#diyBtn1_1",replace:true,close:false,id:"a1"});
		//MessageTip.info("hello world",{selector:"#diyBtn1_1.26",replace:true,close:false,id:"a1"});	
	});
}