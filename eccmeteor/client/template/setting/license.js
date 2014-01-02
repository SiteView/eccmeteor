Template.License.rendered = function(){
		Meteor.call("svGetLicenselist",function(err,license){
				license["use_network_sum"] = 0;
				var svse = SvseTree.find({type:"se"}).fetch();
				for(i in svse){
					license["usedPoint"] = svse[i].sub_monitor_sum - license["use_network_sum"];
				}
				
				console.log(license);
				if(!license) return;
					$("#list :text[name='point']").val(license["point"]);
					$("#list :text[name='nw']").val(license["nw"]);
					$("#list :text[name='usedPoint']").val(license["usedPoint"]);
					$("#list :text[name='use_network_sum']").val(license["use_network_sum"]);
					$("#list :text[name='starttime']").val(license["starttime"]+"+"+30);
					$("#list :text[name='lasttime']").val(license["lasttime"]);
					$("#list :text[name='Version']").val(license["Version"]);
					console.log("123");
	});
}

