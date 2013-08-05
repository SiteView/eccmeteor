Handlebars.registerHelper('equal', function(arg1,arg2) {
	if(arg1 === arg2){
		return true;
	}
	return false;
});

Handlebars.registerHelper('createDomeByTypeAndName', function(type,name,value,selects) {
	//textbox,password ,combobox
	 var result;
	 value =  value ? value :"";
	switch(type){
		case "textbox":
			result = '<input type="input" name="'+name+'" value="'+value+'"/>';
			break;
		case "password":
			result = '<input type="password" name="'+name+'" value="'+value+'"/>';
			break;
		case "combobox":
			result = '<select name="'+name+'">';
			options = "";
			for(index in selects){
				if(value === selects[index]["value"]){
					options = options + "<option selected='selected' value='"+selects[index]["value"]+"'>"+selects[index]["key"]+"</option>";
					continue;
				}
				options = options + "<option value='"+selects[index]["value"]+"'>"+selects[index]["key"]+"</option>";
			}
			result = result + options+"</select>";
			break;
		case "textarea":
			result = '<textarea name="'+name+'">'+value+'</textarea>';
			break;
		default:
			result = '<input type="input" name="'+name+'" value="'+value+'"/>';
			break;
	}
 
  return new Handlebars.SafeString(result);
});

Handlebars.registerHelper('createDomeByPropertyHelper', function(obj) {
    var type = obj["sv_type"] ||obj["type"]|| "";
	var name = obj["sv_name"] ||obj["name"]|| "";
	var value = obj["sv_value"] ||obj["value"]||"";
	var selects = obj["selects"] ||obj["select"]|| [];
	var readOnly = (obj["sv_isreadonly"] === 'true')||obj["readonly"] || false;
	var result;
	switch(type){
		case "textbox":
			result = '<input type="input" name="'+name+'" value="'+value+'" ';
			if(readOnly){
				result	= result + 'readonly='+readOnly;
			}
			result =  result + '>'
			break;
		case "password":
			result = '<input type="password" name="'+name+'" value="'+value+'" ';
			if(readOnly){
				result	= result + 'readonly='+readOnly;
			}
			result =  result + '>'
			break;
		case "combobox":
			if(obj["sv_dll"]){
				result = '<select name="'+name+'" class="dll"></select>';
				break;
			}
			result = '<select name="'+name+'">';
			options = "";
			for(index in selects){
				if(value === selects[index]["value"]){
					options = options + "<option selected='selected' value='"+selects[index]["value"]+"'>"+selects[index]["key"]+"</option>";
					continue;
				}
				options = options + "<option value='"+selects[index]["value"]+"'>"+selects[index]["key"]+"</option>";
			}
			result = result + options+"</select>";
			break;
		case "textarea":
			result = '<textarea name="'+name+'" ';
			if(readOnly){
				result	= result + 'readonly='+readOnly;
			}
			result = result +'>'+value+'</textarea>';
			break;
		default:
			result = '<input type="input" name="'+name+'" value="'+value+'" ';
			if(readOnly){
				result	= result + 'readonly='+readOnly;
			}
			result =  result + '>'
			break;
	}
 
  return new Handlebars.SafeString(result);
});

/**
	国际化助手
*/
/*
Handlebars.registerHelper('language',function(arg){
	var lang = Language.findOne();
	var defaultLang = lang["default"];
	//console.log("default language is "+ defaultLang);
	var language = lang["language"][defaultLang];
	return language[arg] ? language[arg] : arg;
});
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