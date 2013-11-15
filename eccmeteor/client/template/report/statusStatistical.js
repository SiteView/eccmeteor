Template.statusStatisticalrendered = function(e,t){
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
		$.fn.zTree.init($("#svse_tree_check"), setting, data);
	});
}