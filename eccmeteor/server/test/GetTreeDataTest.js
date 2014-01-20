GetTreeDataTest = function(){};
Object.defineProperty(GetTreeDataTest,"test",{
	value:function(){
		Log4js.info(svGetDefaultTreeData('default',false));
	}
});
/*
svGetDefaultTreeData('default',true)
{"m1":
	{
	"has_son":"true",
	"sub_entity_sum":"11",
	"sub_monitor_disable_sum":"2",
	"sub_monitor_error_sum":"3",
	"sub_monitor_null_sum":"3",
	"sub_monitor_ok_sum":"25",
	"sub_monitor_sum":"33",
	"sub_monitor_warning_sum":"0",
	"sv_id":"1","sv_name":
	"SiteView ECC 8.8",
	"type":"se"
	}
}
*/