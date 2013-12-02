var getstatusStatisticalSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("statusStatistical");
}

Template.statusStatisticalform.events = {
  
	"click #select":function(e){
		
		var methodsendforweb = ClientUtils.formArrayToObject($("#methodsendforweb").serializeArray());
		console.log(methodsendforweb);
		SvseMessageDao.setMessageWebConfig(methodsendforweb,function(result){
			console.log(result);
			console.log("成功！");
		});
		  console.log("54545llllll");
	},
	/*"click #messagewarner":function(e){
		$('#messagewarnerdiv').modal('show');
	},
	"click #scriptwarner":function(){
		$("#scriptwarnerdiv").modal("show");
	},
	"click #soundwarner":function(){
		$("#soundwarnerdiv").modal("show");
	},
	"click #delwarnerrule" : function(){
		SvseWarnerRuleDao.deleteWarnerRules(getWarnerRuleListSelectAll());
	},
	"click #allowewarnerrule":function(){
		SvseWarnerRuleDao.updateWarnerRulesStatus(getWarnerRuleListSelectAll(),"Enable",function(result){
			if(result.status){
				SystemLogger("改变状态"+result.option.count+"条");
			}
		});
	},
	"click #forbidwarnerrule":function(){
		SvseWarnerRuleDao.updateWarnerRulesStatus(getWarnerRuleListSelectAll(),"Disable",function(result){
			if(result.status){
				SystemLogger("改变状态"+result.option.count+"条");
			}
		});
	},
	"click #refreshwarnerrule":function(){
		SvseWarnerRuleDao.sync(function(result){
			if(result.status){
				console.log("刷新完成");
			}else{
				SystemLogger(result);
			}
			
		});
	},
	"click #warnerrulehelpmessage":function(){
		console.log("warnerrulehelpmessage");
	},*/

}

Template.warnerrulelist.rendered = function(){
	//初始化checkbox选项
	$(function(){
		//隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("warnerrulelist");
		//初始化 checkbox事件
		ClientUtils.tableSelectAll("warnerrulelistselectall");
		//初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("warnerrulelist");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("warnerrulelist");
	});

}
/*Template.warnerrulelist.events = {
	"click td .btn":function(e){
		console.log(e.currentTarget.id);
		var result = SvseWarnerRuleDao.getWarnerRule(e.currentTarget.id);
		var alertType=result["AlertType"];
		console.log("alerttype:"+alertType);
		//邮件报警EmailAlert
		if(alertType=="EmailAlert"){
			console.log("EmailAlert");
			//填充表单
			$("#emailwarnerdivedit").find(":text[name='AlertName']:first").val(result.AlertName);
			$("#emailwarnerdivedit").find(":text[name='OtherAdress']:first").val(result.OtherAdress);
			$("#emailwarnerdivedit").find(":text[name='Upgrade']:first").val(result.Upgrade);
			$("#emailwarnerdivedit").find(":text[name='UpgradeTo']:first").val(result.UpgradeTo);
			$("#emailwarnerdivedit").find(":text[name='Stop']:first").val(result.Stop);
			$("#emailwarnerdivedit").find(":text[name='WatchSheet']:first").val(result.WatchSheet);
			$("#emailwarnerdivedit").find(":text[name='UpgradeTo']:first").val(result.Strategy);
			$("#emailwarnerdivedit").find(":hidden[name='nIndex']:first").val(result.nIndex);
			var checkedEmailAdress = result["EmailAdress"].split(",");
			$(".emailmultiselectedit").attr("value","");
			$(".emailmultiselectedit").multiselect("refresh");
			for(var eal = 0 ; eal < checkedEmailAdress.length ; eal ++){
				try{
					$(".emailmultiselectedit").multiselect('select',checkedEmailAdress[eal]);
				}catch(e){}
			}
			var checkedEmailTemplate = result["EmailTemplate"].split(",");
			for(var etl = 0 ; etl < checkedEmailTemplate.length; etl ++){
				$("#emailtemplatelistedit").find("option[value='"+checkedEmailTemplate[etl]+"']:first").attr("selected","selected").prop("selected",true);
			}
			var AlertCategory = result.AlertCategory;
			$("#warnerruleofemailformsendconditionsedit").find(":radio[name='AlertCategory']").each(function(){
				if($(this).val() === AlertCategory){
					$(this).attr("checked",true);
				}
			});
			$("#emailwarnerdivedit").modal('toggle');
			
			var checkednodes = result.AlertTarget.split("\,")
			//左边树的勾选
			var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_edit");
			//节点勾选
			for(var index  = 0; index < checkednodes.length ; index++){
				treeObj.checkNode(treeObj.getNodesByFilter(function(node){
					return  node.id  === checkednodes[index];
				}, true), true);
			}
		}else
		//短信报警SmsAlert
		if(alertType=="SmsAlert"){
			console.log("SmsAlert");
			//console.log(result);
			//填充表单
			$("#messagewarnerdivedit").find(":text[name='AlertName']:first").val(result.AlertName);
			$("#messagewarnerdivedit").find(":text[name='OtherNumber']:first").val(result.OtherNumber);
			$("#messagewarnerdivedit").find(":text[name='Upgrade']:first").val(result.Upgrade);
			$("#messagewarnerdivedit").find(":text[name='UpgradeTo']:first").val(result.UpgradeTo);
			$("#messagewarnerdivedit").find(":text[name='Stop']:first").val(result.Stop);
			$("#messagewarnerdivedit").find(":text[name='WatchSheet']:first").val(result.WatchSheet);
			$("#messagewarnerdivedit").find(":text[name='UpgradeTo']:first").val(result.Strategy);
			$("#messagewarnerdivedit").find(":hidden[name='nIndex']:first").val(result.nIndex);
			var checkedSmsNumber = result["SmsNumber"].split(",");
			$(".messagemultiselectedit").attr("value","");
			$(".messagemultiselectedit").multiselect("refresh");
			for(var eal = 0 ; eal < checkedSmsNumber.length ; eal ++){
				try{
					$(".messagemultiselectedit").multiselect('select',checkedSmsNumber[eal]);
				}catch(e){}
			}
			var checkedSmsTemplate = result["SmsTemplate"].split(",");
			//console.log(checkedSmsTemplate);
			for(var etl = 0 ; etl < checkedSmsTemplate.length; etl ++){
				$("#messagetemplatelistedit").find("option[value='"+checkedSmsTemplate[etl]+"']:first").attr("selected","selected").prop("selected",true);
			}
			var AlertCategory = result.AlertCategory;
			$("#warnerruleofmessageformsendconditionsedit").find(":radio[name='AlertCategory']").each(function(){
				if($(this).val() === AlertCategory){
					$(this).attr("checked",true);
				}
			});
			$("#messagewarnerdivedit").modal('show');
			
			var checkednodes = result.AlertTarget.split("\,")
			//左边树的勾选
			var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_editsms");
			treeObj.checkAllNodes(false);//清空上一个用户状态
			//节点勾选
			for(var index  = 0; index < checkednodes.length ; index++){
				treeObj.checkNode(treeObj.getNodesByFilter(function(node){
					return  node.id  === checkednodes[index];
				}, true), true);
			}
		}
		
	}

}*/


Template.statusStatistical.rendered = function(e,t){
/*var oL,oT,oW,oH;
var oMX,oMY;
var obj,element;
var minW=100;
var maxW=500;
var resizable=false;

$(function doMove(e){
	if(!e)e=window.event;
	obj=e.srcElement || e.target;
	var mX=e.pageX || e.clientX;

	if(resizable){
		w=oW;
		w=oW + mX - oMX;
		//tt.value=event.clientX;
		if(w<minW){w=minW;}
		if(w>maxW){w=maxW;}
		ResizeTo(w);
		return(true);
	}
	var cc="";
	if(obj.title && obj.title=="oWin"){
		l=0;
		w=parseInt(obj.offsetWidth);
		if(Math.abs(l+w-mX)<5)cc+="e";
		if(cc!=""){
			obj.style.cursor=cc+"-resize";
			return(true);
		}
	}	
	if(obj.style.cursor!="default"){
		obj.style.cursor="default";
	}
}),

$(function doDown(e){
	if(obj.style.cursor!="default"){//开始改变大小
		//记录鼠标位置和层位置和大小;
		if(!e)e=window.event;
		obj=e.srcElement || e.target;
		element=obj;
		oMX=e.pageX || e.clientX;
		oW=parseInt(element.offsetWidth);
		//改变风格;
		resizable=true;
		return(true);
	}
}),

$(function doUp(){
	if(resizable){
		element.style.cursor="default";
		resizable = false;
		return(false);
	}
}),

$(function ResizeTo(w){	
	var w=isNaN(w)?minW:parseInt(w);
	var w=w<minW?minW:w;
	element.width=w;
})

    document.onmousemove=doMove;
	document.onmousedown=doDown;
	document.onmouseup=doUp;
*/
$(function $(d){return document.getElementById(d);}),
$(function gs(d){var t=$(d);if (t){return t.style;}else{return null;}}),
function gs2(d,a){
if (d.currentStyle){ 
var curVal=d.currentStyle[a]
}else{ 
var curVal=document.defaultView.getComputedStyle(d, null)[a]
} 
return curVal;
}
function ChatHidden(){gs("ChatBody").display = "none";}
function ChatShow(){gs("ChatBody").display = "";}
if(document.getElementById){
(
function(){
if (window.opera){ document.write("<input type='hidden' id='Q' value=' '>"); }

var n = 500;
var dragok = false;
var y,x,d,dy,dx;

function move(e)
{
if (!e) e = window.event;
if (dragok){
d.style.left = dx + e.clientX - x + "px";
d.style.top= dy + e.clientY - y + "px";
return false;
}
}

function down(e){
if (!e) e = window.event;
var temp = (typeof e.target != "undefined")?e.target:e.srcElement;
if (temp.tagName != "HTML"|"BODY" && temp.className != "dragclass"){
temp = (typeof temp.parentNode != "undefined")?temp.parentNode:temp.parentElement;
}
if('TR'==temp.tagName){
temp = (typeof temp.parentNode != "undefined")?temp.parentNode:temp.parentElement;
temp = (typeof temp.parentNode != "undefined")?temp.parentNode:temp.parentElement;
temp = (typeof temp.parentNode != "undefined")?temp.parentNode:temp.parentElement;
}

if (temp.className == "dragclass"){
if (window.opera){ document.getElementById("Q").focus(); }
dragok = true;
temp.style.zIndex = n++;
d = temp;
dx = parseInt(gs2(temp,"left"))|0;
dy = parseInt(gs2(temp,"top"))|0;
x = e.clientX;
y = e.clientY;
document.onmousemove = move;
return false;
}
}

function up(){
dragok = false;
document.onmousemove = null;
}

document.onmousedown = down;
document.onmouseup = up;

}
)();
}
}



Template.statusStatistical.rendered = function(){
	//监视器选择树
	$(function(){
		var data = SvseDao.getDetailTree();
		var setting = {
			check:{
				enable: false,
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
		$.fn.zTree.init($("#svse_tree_check"), setting, data);
	});
	/*$(".form_datetime").datetimepicker({
        format: "dd-MM-yyyy hh:mm",
        autoclose: true,
        todayBtn: true,
		language: 'en',  
        pickDate: true,  
        pickTime: true,  
        hourStep: 1, 
        minuteStep: 15,  
        secondStep: 30,  
        inputMask: true 
        //pickerPosition: "bottom-left"
    });*/
	var template = this;
        $(function() { //初始化日期选择器
                var endDate = new Date();
                var startDate = new Date();
                startDate.setTime(startDate.getTime() - 1000*60*60*24);
                $(template.find("#datetimepickerStartDate")).datetimepicker({
                        format: 'yyyy-MM-dd hh:mm:ss',
                        language: 'zh-CN',
                        maskInput: false
                });
                $(template.find("#datetimepickerEndDate")).datetimepicker({
                        format: 'yyyy-MM-dd hh:mm:ss',
                        language: 'zh-CN',
                        endDate : endDate,
                        maskInput: false,
                });
                var startPicker = $(template.find("#datetimepickerStartDate")).data('datetimepicker');
                var endPicker = $(template.find("#datetimepickerEndDate")).data('datetimepicker');
                startPicker.setDate(startDate);
                endPicker.setDate(endDate);
//                $('#AlertdatetimepickerStartDate').on('changeDate', function(e) {
//                        endPicker.setstartDate(e.date);
//                });
//                $('#AlertdatetimepickerEndDate').on('changeDate', function(e) {
//                        startPicker.setEndDate(e.date);
//                });
});

}