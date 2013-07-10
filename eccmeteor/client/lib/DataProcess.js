DataProcess = function(data,keys){//数据的初步处理
	this.sortReturnTime = function(array){ //根据时间进行冒泡排序
		if(!array || array.length == 0) return;
		var length = array.length;
		var j = 0;
		var	k = 0;
		var flag = 0;
		flag = length;
		while (flag > 0)
		{
			k = flag;
			flag = 0;
			for (j = 1; j < k; j++){
				if (array[j - 1].creat_time < array[j].creat_time)
				{
					var temp = array[j - 1];
					array[j-1] = array[j];
					array[j] = temp;
					flag = j;
				}
			}
		}
		return array;
	};
	this.records = {};
	this.conversion = function(data){ //数据的初步处理，包括时间格式化，字符串转数字，数据排序
		var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
		var primarys = [];
		for(index in keys){
			primarys.push(keys[index]["name"]);
		}
		var ok = 0;
		var warning = 0;
		var error = 0;
		var disable = 0
		data.forEach(function (d) {
			d.creat_time = parseDate(d.creat_time);  //包括字符串转 时间			
			for(primary in primarys){
				var name = primarys[primary];
				d[name] = +d[name];
			}
			var status = d["record_status"];
			switch(status){
				case "ok":ok++;break;
				case "warning":warning++;break;
				case "error":error++;break;
				case "disable":disable++;break;
			}
		});
		SystemLogger(ok+":"+warning+":"+disable+":"+error);
		this.records.ok = ok;
		this.records.warning = warning;
		this.records.disable = disable;
		this.records.error  = error;
		return this.sortReturnTime(data);
	};
	this.data = this.conversion(data);
	this.getDataKey = function () {
		for (key in keys) {
			var keyObj = keys[key];
			keyObj["max"] = d3.max(data, function (d) {
					return d[keyObj["name"]]
				});
			keyObj["mean"] = d3.mean(data, function (d) {
					return d[keyObj["name"]]
				});

			var str = keyObj["mean"] + "";
			var strArr = str.split("\.");
			if (strArr.length === 2 && strArr[1].length > 3) {
				str = strArr[0] + "." + strArr[1].substr(0, 3);
				str = +str;
				keyObj["mean"] = str;
			}

			keyObj["new"] = data[data.length - 1][keyObj["name"]]
				keys[key] = keyObj;
		}
		return keys;
	};
	this.getData = function(){
		return this.data;
	}
	this.getRecordsDate =  function(){
	    this.records.starttime = this.data[this.data.length-1]["creat_time"].format("yyyy-MM-dd hh:mm:ss");
		this.records.endtime = this.data[0]["creat_time"].format("yyyy-MM-dd hh:mm:ss");
		return this.records;
	}
}