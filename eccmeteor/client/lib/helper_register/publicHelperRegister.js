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
	if(!nid || nid === "")
		return false;
	var user = Meteor.user();
	if(!user)
		return false;
	if(UserUtils.isAdmin())
		return true;
	nid = nid.replace(/\./g,"-");
	var nodeOpratePermissions = user.profile.nodeOpratePermission;
	return nodeOpratePermissions && nodeOpratePermissions[nid] && nodeOpratePermissions[nid][permission]
});

/*
	求数组长度
*/
Handlebars.registerHelper('arrayLengthHelper',function(array){
	if(!array)
		return 0;
	return array.length;
});