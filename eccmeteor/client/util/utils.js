ClientUtils = {
	"formArrayToObject":function(arr){
		if(!arr ||arr.length == 0)return {};
		var property ={};
		for(index in arr){
			property[arr[index]["name"]] = arr[index]["value"];
		}
		return property;
	},
	"statusFormToObj" : function(arr){
		if(!arr ||arr.length == 0)return{};
		var property ={};
		for(index in arr){
			property[arr[index]["name"]] = arr[index]["value"];
		}
	    var objArr = [];
		var robj = {};
		for(name in property){
			if(name.indexOf("sv_paramname") === -1) continue;
			var i = +name.substr(12);
			var obj = {};
				obj["sv_paramname"] = property[name];
				obj["sv_operate"] =  property["sv_operate"+i];
				obj["sv_paramvalue"] =  property["sv_paramvalue"+i];
				obj["sv_relation"] =  property["sv_relation"+i];
				objArr.push(obj);
		}	
		if(objArr.length === 1 || objArr === 0){
			robj["sv_expression"] = 1;
		}else{
			robj["sv_expression"] = "1#"+objArr[objArr.length-2]["sv_relation"]+"2#";
		}
		robj["sv_conditioncount"] = objArr.length;
		for (j=1;j< robj["sv_conditioncount"]+1;j++){
		    var tobj = objArr[j-1];
			robj["sv_paramname"+j] = tobj["sv_paramname"];
			robj["sv_operate"+j] = tobj["sv_operate"];
			robj["sv_paramvalue"+j] = tobj["sv_paramvalue"];
			if(tobj["sv_relation"]){
				robj["sv_relation"+j] = tobj["sv_relation"];
			}
		}
		return robj;
	},
	"objectCoalescence":function(obj1,obj2){
		if(!obj2) return obj1||{};
		if(!obj1) return obj2||{};
		for(property in  obj1){
			obj2[property] = obj1[property];
		}
		return obj2;
	},
	"createInputHiddenDom":function(name,value){
		 var hidden = $("<input type='hidden'/>");
		 hidden.attr("name",name);
		 hidden.val(value);
		 return hidden;
	},
	/**接受td的内容的数组，如数组里面存的是对象，则需要指出需要显示的字段名称。如果未指明则默认显示原始值
		第二个参数为设置参数，数据类型为Object，其中label属性指明需要显示的字段
		如{label:"value"}
	*/
	"creatTrDom":function(tdArray,property){
		var tr = $("<tr></tr>");
		if(!property){ //设置属性不存在
			for(index in tdArray){
				var td = $("<td></td>");
				td.html(JSON.stringify(tdArray[index]));
				tr.append(td);
			}
			return tr;
		}
		//设置属性存在
		var label = property.label;
		for(index in tdArray){
				var td = $("<td></td>");
				td.html(tdArray[index][label]);
				tr.append(td);
		}
		return tr;
	},
	/**
	参数 obj 需要进行属性删除的对象
	参数 attributes 参数数组  Array[string]
	参数flag      为true则表示保留obj中的attributes属性删除其他，否则是删除obj中的attributes属性，保留其他，默认为true*/
	"deleteAttributeFromObject" : function(obj,attributes,flag){
		if(typeof flag === "undefined")
			flag = true;
		if(flag){
			for(attr in obj){
				var status = false;
				for(index in attributes){
					if(attr.indexOf(attributes[index]) != -1){
						status = true; //保留该属性
						break;
					}
				}
				if(!status){//如果为非保留属性
					delete(obj[attr]);
				}
			}
		}else{
			for(attr in obj){
				for(index in attributes){
					if(attr.indexOf(attributes[index]) != -1){
						//该属性存在，则删除
						delete(obj[attr]);
						break;
					}
				}
			}
		}
		return obj
	},
	/**
		将日期转对象格式，如 2013-06-05 12:30:00转成{year:2013,month:06,day:04,hour:12,minute:30,second:0}对象形式
	*/
	'dateToObject':function(date){
		return {
			year:date.getFullYear(),
			month:date.getMonth() + 1,
			day:date.getDate(),
			hour:date.getHours(),
			minute:date.getMinutes(),
			second:date.getSeconds()
		}
	},
	'objectToDate':function(obj){
		return  new Date(
				obj.year,
				obj.month-1,
				obj.day,
				obj.hour,
				obj.minute,
				obj.second
			);
	},
	'getDateDifferenceHour':function(date1,date2){
		var time = date2.getTime() - date1.getTime();
		return Math.floor(time/(3600*1000));
	},
	"formFillValue" : function(formid,obj){
		$(formid).find("input:text").each(function(){
			$(this).val(obj[this.name]);
		});
	},
	//对象属性名中 的 '.'和'-'的相互替换
	"changePointAndLine":function(obj,flag){ 
		if(!obj) return obj;
		var robj = {};
		if(flag === -1){
			for(index in obj){
				robj[index.replace(/\-/g,"\.")] = obj[index];
			}
		}else{
			for(index in obj){
				robj[index.replace(/\./g,"\-")] = obj[index];
			}
		}
		return robj;
	},
	//表格中的checkbox全选效果
	"tableSelectAll":function(id){
	    $("#"+id).click(function(){
			var flag = this.checked; 
			$(this).closest("table").find("tbody :checkbox").each(function(){
				this.checked = flag;
				if(flag){
					$(this).parents("tr:first").addClass("error");
				}else{
					$(this).parents("tr:first").removeClass("error");
				}
			});
		});
	},
	//根据表tbody id获取表格中选中的checkbox的id
	"tableGetSelectedAll":function(id){
	    var checks = $("#"+id+" :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		return ids;
	},
	/*
	*表格行选中变色 接收一个表格id参数
	*/
	"trOfTableClickedChangeColor":function(id){
		$("#"+id+" tr").click(function(){
			var checkbox = $(this).find(":checkbox:first");
		//	checkbox[0].checked = !checkbox[0].checked;
			$(this).siblings(".success").each(function(){
				$(this).removeClass("success");
				if($(this).find(":checkbox:first")[0].checked){
					$(this).addClass("error");
				}
			});
			$(this).removeClass().addClass("success");

		});
		$("#"+id+" :checkbox").click(function(e){
			e.stopPropagation();
			if(this.checked){
				if(!$(this).closest("tr").hasClass("success")){
					$(this).closest("tr").addClass("error");
				}
			}else{
				$(this).closest("tr").removeClass("error");
			}
		});
	},
	/*
	*隐藏所有操作按钮
	*接收一个tbdoy的id 参数
	*/
	"hideOperateBtnInTd":function(id){
		$("#"+id+" tr").each(function(){
			$(this).children("td:last").children(".btn-group").css("visibility","hidden");
		})
	},
	/*
	*鼠标悬停显示操作按钮
	*接收一个tbdoy的id 参数
	*/
	"showOperateBtnInTd":function(id){
		$("#"+id+" tr").mouseenter(function(){
			$(this).children("td:last").children(".btn-group").css("visibility","visible");
			$(this).siblings("tr").each(function(){
				$(this).children("td:last").children(".btn-group").css("visibility","hidden");
			});
		}).mouseleave(function(){
			$(this).children("td:last").children(".btn-group").css("visibility","hidden");
		});
	}
}