Template.statisticalofedit_form.events({	"click button#statisticalofeditcancelbtn":function(e,t){		RenderTemplate.hideParents(t);	},	"change #reporttypePeriodlisted":function(){		if(document.getElementById("reporttypePeriodlisted").value=="Week"){			 document.getElementById("reporttypetemplatelisted").disabled=false;		}else if(document.getElementById("reporttypePeriodlisted").value=="Other"){			document.getElementById("editform_datetime").style.display="";			document.getElementById("editform_datetimes").style.display="";			//$("#form_datetime").attr("disabled","disabled");			}else{		document.getElementById("editform_datetime").style.display="none";		document.getElementById("editform_datetimes").style.display="none";		document.getElementById("reporttypetemplatelisted").disabled=true;		}	},	"click button#statisticalofeditsavebtn" : function (e,t) {		var statisticalofaddformedit = ClientUtils.formArrayToObject($("#statisticalofaddformedit").serializeArray());		//E-mail的判断		var email=statisticalofaddformedit["EmailSend"];					if(!email){				Message.info("E-mail不能为空！");				 //alert("邮件中必须包含@");				return;         }		 //判断邮箱格式是否正确  		var mailStr =  'aa@bb.com;bb@aa.com;cc@aa.com';		var mail_arr =mailStr.split(";");		 //if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email))      {  			if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*([,;][,;\s]*(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)*)*$/.test(email))      {   	            Message.info("E-mail格式错误!");   	            return false;        }				var nIndex = statisticalofaddformedit["nIndex"];		var address = {};		address[nIndex] = statisticalofaddformedit;		SvseStatisticalDao.updateStatistical(nIndex, address, function (result) {		RenderTemplate.hideParents(t);		});	}});Template.statisticalofedit_form.rendered = function () {	//树console.log("111111111111111111");		var data = SvseDao.getDetailTree();		var setting = {			check : {				enable : true,				chkStyle : "checkbox",				chkboxType : {					"Y" : "ps",					"N" : "ps"				}			},			callback : {							// onRightClick : function (event, treeId, treeNode) {					// zTree = $.fn.zTree.getZTreeObj("svse_tree_check_statistical");					// if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {						// zTree.cancelSelectedNode();						// showRMenu("root", event.clientX, event.clientY);					// } else if (treeNode && !treeNode.noR) {						// zTree.selectNode(treeNode);						// showRMenu("node", event.clientX, event.clientY);					// }				// }			},			data : {				simpleData : {					enable : true,					idKey : "id",					pIdKey : "pId",					rootPId : "0",				}			}		};		$.fn.zTree.init($("#svse_tree_check_statistical"), setting, data);								var nIndex = $("#getnIndex").val();									console.log("nIndex:"+nIndex);								 var result = SvseStatisticalDao.getStatisticalById(nIndex);				 console.log("2222");				 console.log(result);				var displayNodes = result.GroupRight.split("\,");				console.log(displayNodes);				if(displayNodes && displayNodes.length){						var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_statistical");						//节点勾选						for(var index  = 0; index < displayNodes.length ; index++){								if(displayNodes[index] == "") continue;								treeObj.checkNode(treeObj.getNodesByFilter(function(node){										return  node.id  === displayNodes[index];								},true),true);						}				}			// function showRMenu(type, x, y) {		//		$("#rMenu ul").show();				// $("#rMenu").css({					// "top" : y + 10 + "px",					// "left" : x + 10 + "px",					// "visibility" : "visible"				// });				// $("body").bind("mousedown", onBodyMouseDown);			// }			// function hideRMenu() {				// if (rMenu)					// $("#rMenu").css({						// "visibility" : "hidden"					// });				// $("body").unbind("mousedown", onBodyMouseDown);			// }			// function onBodyMouseDown(event) {				// if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {					// $("#rMenu").css({						// "visibility" : "hidden"					// });				// }			// }	//弹窗可移动	 ModalDrag.draggable("#statisticalofadddivedit");}//鼠标悬停功能实现		$().tooltip();		 		$.fn.tooltip = function( options ) { 		return this.each(function(e) {        		// If options exist, lets merge them		// with our default settings			if ( options ) { 				$.extend( settings, options );			}			var tooltip = "";			var title = "";			$(this).mouseover(function(e){						 				title = $(this).attr("title");				if(title== ""){					 tooltip = "";				}else{					tooltip = "<div id='tooltip'><p>"+title+"</p></div>";					$(this).attr("title","");				}						$('body').append(tooltip);				$('#tooltip')					.css({					"opacity":"0.8",					"top":(e.pageY)+"px",					"left":(e.pageX)+"px"						}).show('fast');			})			$(this).mouseout(function(){				$(this).attr("title",title);				$('#tooltip').remove();							 })						$(this).mousemove(function(e){				$('#tooltip').css({					"top":(e.pageY+20)+"px",					"left":(e.pageX+10)+"px"				});										})		});			};