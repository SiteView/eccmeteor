Template.License.rendered = function(){
	Meteor.call("svGetLicenselist",function(err,license){
		console.log(license);
		if(!license) return;
			$("#list :text[name='point']").val(license["point"]);
			$("#list :text[name='nw']").val(license["nw"]);
			$("#list :text[name='showpoint']").val(license["showpoint"]);
			$("#list :text[name='shownw']").val(license["shownw"]);
			$("#list :text[name='starttime']").val(license["starttime"]+"+"+30);
			$("#list :text[name='lasttime']").val(license["lasttime"]);
			$("#list :text[name='Version']").val(license["Version"]);
			console.log("123");
	});
}