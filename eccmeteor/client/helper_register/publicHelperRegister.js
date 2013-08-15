Handlebars.registerHelper('equal', function(arg1,arg2) {
	if(arg1 === arg2){
		return true;
	}
	return false;
});
Handlebars.registerHelper('unequal', function(arg1,arg2) {
	if(arg1 === arg2){
		return false;
	}
	return true;
});

Handlebars.registerHelper('createDomeByTypeAndName', function(type,name,value,selects) {
	//textbox,password ,combobox
	var result;
	value =  value ? value :"";
	var factory = new DomCreateFactory();
	switch(type){
		case "textbox":
			result = factory.getInput(name,value);
			break;
		case "password":
			result = factory.getPasswd(name,value);
			break;
		case "combobox":
			result = factory.getSelect(name,value,selects);
			break;
		case "textarea":
			result = factory.getTextArea(name,value);
			break;
		default:
			result =factory.getInput(name,value);
			break;
	}
 
  return new Handlebars.SafeString(result);
});

var DomCreateFactory = function(){
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
	}
}
Handlebars.registerHelper('createDomeByPropertyHelper', function(obj) {
	var type = obj["sv_type"] ||obj["type"]|| "";
	var name = obj["sv_name"] ||obj["name"]|| "";
	var value = obj["sv_value"] ||obj["value"]||"";
	var selects = obj["selects"] ||obj["select"]|| [];
	var readonly = (obj["sv_isreadonly"] === 'true')||obj["readonly"] || false;
	var factory = new DomCreateFactory();
	var result ="";
	switch(type){
		case "textbox":
			result = factory.getInput(name,value,readonly);
			break;
		case "password":
			result = factory.getPasswd(name,value,readonly);
			break;
		case "combobox":
			var clazz = obj["sv_dll"] ? "dll" : undefined;
			result = factory.getSelect(name,value,selects,clazz);
			break;
		case "textarea":
			result = factory.getTextArea(name,value,readonly);
			break;
		default:
			result = factory.getInput(name,value,readonly);
			break;
	}
	return new Handlebars.SafeString(result);
});
/**
	国际化助手
*/
Handlebars.registerHelper('language',function(){
	return Language.findOne({name:Session.get("language")}).value;
});

/*当前用户名*/
Handlebars.registerHelper('currentUsername',function(){
    return Meteor.user()  ? Meteor.user().profile.aliasname : "Cryptonym"
});

/*当前Session存储的视图状态*/
Handlebars.registerHelper('viewstatus',function(){
    return Session.get("viewstatus");
});
/*当前Session存储的布局状态*/
Handlebars.registerHelper('layout',function(){
    return Session.get("layout");
});

Handlebars.registerHelper('getSession',function(arg){
    return Session.get(arg);
});

Handlebars.registerHelper('trim',function(arg){
	// Otherwise use our own trimming functionality
	return arg ? arg.replace( /^\s+/, "" ).replace(/\s+$/, "" ) : arg;

});