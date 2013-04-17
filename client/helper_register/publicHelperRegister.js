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
	}
 
  return new Handlebars.SafeString(result);
});