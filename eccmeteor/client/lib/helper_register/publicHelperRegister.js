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

Handlebars.registerHelper('isNotNull', function(arg1) {
	if(arg1 === null || typeof arg1 === "undefined")
		return false;
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


Handlebars.registerHelper('createDomeByPropertyHelper', function(obj) {
	var factory = new DomCreateFactory();
	var result = factory.get(LocalObjectConverter.convertMonityTemplateParameter(obj));
	return new Handlebars.SafeString(result);
});



Handlebars.registerHelper('createDomByObjListHelper',function(list){
	if(!list | !list.length)
		return;
	var result = "";
	var length = list.length;
	var factory = new DomCreateFactory();
	for(x = 0; x < length; x++){
		result = result +"&nbsp;"+ factory.get(LocalObjectConverter.convertMonityTemplateParameter(list[x]));
	}
	return new Handlebars.SafeString(result);
});
/**
	国际化助手
*/
Handlebars.registerHelper('language',function(){
	//return Language.findOne({name:Session.get("language")}).value;
	return LanguageModel.getLanaguage();
});

Handlebars.registerHelper('getLanguage',function(key){
	var modal = LanguageModel.getLanaguage();
	if(!key)
		return "";
	if(key.length-1 > key.replace(/\./g,"").length)
		return "";
	if(key.indexOf("\.") === -1)
		return modal[key];
	var arr = key.split('\.');
	return modal[arr[0]][arr[1]];
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
/*
	节点是否可操作
*/
Handlebars.registerHelper('isNodeEnabled',function(nid,permission){
	var user = Meteor.user();
	if(!user)
		return false;
	if(UserUtils.isAdmin())
		return true;
	nid = nid.replace(/\./g,"-");
	var nodeOpratePermissions = user.profile.nodeOpratePermission;
	return nodeOpratePermissions && nodeOpratePermissions[nid] && nodeOpratePermissions[nid][permission]
});