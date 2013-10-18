/**
创建Dom元素
	其中obj对象来自LocalObjectConverter标准对象
**/
DomCreateFactory = function(){
	this.getInput = function(name,value,readonly){
		var result = '<input type="input" class="createInputDomStyle createInputDomStyle-input"  name="'+name+'" value="'+value+'" ';
		if(readonly){
			result	= result + 'readonly='+readonly;
		}
		result =  result + '>'
		return result
	};
	this.getPasswd = function(name,value,readonly){
		var result = '<input type="password" class="createInputDomStyle createInputDomStyle-input" name="'+name+'" value="'+value+'" ';
		if(readonly){
			result	= result + 'readonly='+readonly;
		}
		result =  result + '>'
		return result;
	};
	this.getSelect = function(name,value,selects,clazz){
		var result = "";
		if(clazz){
			result = '<select name="'+name+'" class="'+clazz+'">';
		}else{
			result = '<select name="'+name+'">';
		}
		options = "";
		for(index in selects){
			if(value === selects[index]["value"]){
				options = options + "<option selected='selected' value='"+selects[index]["value"]+"'>"+selects[index]["key"]+"</option>";
				continue;
			}
			options = options + "<option value='"+selects[index]["value"]+"'>"+selects[index]["key"]+"</option>";
		}
		result = result + options+"</select>";
		return result;
	};
	this.getTextArea = function(name,value,readonly){
		var result = '<textarea name="'+name+'" ';
		if(readonly){
			result	= result + 'readonly='+readonly;
		}
		result = result +'>'+value+'</textarea>';
		return result;
	},
	this.get = function(obj){
		switch (obj["type"]){
			case "input":
				return this.getInput(obj["name"],obj["value"],obj["readonly"]);
			case "passwd":
				return this.getPasswd(obj["name"],obj["value"],obj["readonly"]);
			case "select":
				return this.getSelect(obj["name"],obj["value"],obj["selects"],obj["clazz"]);
			case "textarea":
				return this.getTextArea(obj["name"],obj["value"],obj["readonly"]);
			default:
				SystemLogger("DomCreateFactory找不到类型"+obj["type"]);
				return "";
		}
	};
}