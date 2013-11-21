SvseTopNOnServer = {
	"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	"sync":function(){
		SyncFunction.SyncTopNList();
	},
	"addTopN":function(addressname,address){
		Log4js.info("SvseTopNOnServer addTopN");
		var result = SvseMethodsOnServer.svWriteTopNIniFileSectionString(addressname,address);
		if(!result){
			var msg = "SvseTopNOnServer's addTopN  add " + addressname +" faild";
			SystemLogger.log(msg,-1);
			throw new Meteor.Error(500,msg);
		}
		var addressresult = result[addressname];
		SvseTopNresultlist.insert(addressresult,function(err,r_id){
			if(err){
				SystemLogger(err,-1);
				throw new Meteor.Error(500,err);
			}
		})
	},
	"deleteTopNByIds" : function(ids){
		var address = ids.join();
		var result = SvseMethodsOnServer.svDeleteTopNIniFileSection(address);
		if(!result){
			var msg = "SvseTopNOnServer's deleteTopNByIds"+ids+" faild";
			SystemLogger.log(msg,-1);
			throw new Meteor.Error(500,msg);
		}
		for(index in ids){
			SvseTopNresultlist.remove(SvseTopNresultlist.findOne({nIndex:ids[index]})._id);
		}
		return SvseTopNOnServer.getReturn(true);
	},
	"updateTopN":function(addressname,address){
	        
			Log4js.info("SvseTopNOnServer updateTopN");
			
			var result = SvseMethodsOnServer.svWriteTopNIniFileSectionString(addressname,address);
		   	if(!result){
				var msg = "SvseTopNDaoOnServer's addTopN  update " + addressname +"faild";
				SystemLogger.log(msg,-1);
				throw new Meteor.Error(500,msg);
			}
			var addressresult = result[addressname];
		    if(!SvseTopNresultlist.findOne({nIndex:addressname})){
	            console.log(addressname+"is not exists");
	            return;
	        }
			var s_id = SvseTopNresultlist.findOne({nIndex:addressname})._id;
           /* Log4js.info("s_id is" + s_id);
			Log4js.info("addressresult is");
			Log4js.info(addressresult);*/
			
			console.log("s_id is" + s_id);
			console.log("addressresult is");
			console.log(addressresult);
	
			SvseTopNresultlist.update(s_id,{$set:addressresult},function(err){
				if(err){
					Log4js.error(err);
			    	throw new Meteor.Error(500,err);
					
				}
			})
	},
	"generatereport":function(addressname,address){
	        
			Log4js.info("SvseTopNOnServer generatereport");
			
			var result = SvseMethodsOnServer.svWriteTopNIniFileSectionString(addressname,address);
		   	if(!result){
				var msg = "SvseTopNDaoOnServer's addTopN  generate " + addressname +"faild";
				SystemLogger.log(msg,-1);
				throw new Meteor.Error(500,msg);
			}
			var addressresult = result[addressname];
		    if(!SvseTopNresultlist.findOne({nIndex:addressname})){
	            console.log(addressname+"is not exists");
	            return;
	        }
			var s_id = SvseTopNresultlist.findOne({nIndex:addressname})._id;
			console.log("s_id is" + s_id);
			console.log("addressresult is");
			console.log(addressresult);
	
			SvseTopNresultlist.update(s_id,{$set:addressresult},function(err){
				if(err){
					Log4js.error(err);
			    	throw new Meteor.Error(500,err);
					
				}
			})
	},
	"getMonitorTemplate" : function(){
		return SvseMethodsOnServer.svGetMonitorTemplate();
		console.log("MMMM");
	},
	"updateTopNStatus":function(ids,status){
		var count = 0;
		for(index in ids){
			var id = ids[index];
			console.log("CH8888");
			var result = SvseMethodsOnServer.svWriteTopNStatusInitFilesection(id,status);
			if(result){
				SvseTopNresultlist.update(SvseTopNresultlist.findOne({nIndex:id})._id,{$set:{"Deny":status}});
				count = count+1;
			}else{
				var msg = "SvseTopNDaoOnServer's updateTopNStatus "+index+" faild";
				SystemLogger.log(msg,-1);
			}
		}
		console.log("~~~~~~~~~~~~~~>>>>");
		return SvseTopNOnServer.getReturn(true,1);
		
		
	},
	
	
	getMonityDynamicPropertyData:function(panrentid,templateMonitoryId){
		var data =  SvseMethodsOnServer.svGetEntityDynamicPropertyData(panrentid,templateMonitoryId);
		if(!data) 
			throw new Meteor.Error(500,"SvseTopNDaoOnServer.getMonityDynamicPropertyData Errors");
		return data;
	},
	getMonityDynamicPropertyDataArray:function(entityId,templateMonitoryTemlpateIds){
		var array = [];
		var data;
		for(index in templateMonitoryTemlpateIds){
			var temlpateId = templateMonitoryTemlpateIds[index];
			data = SvseMethodsOnServer.svGetEntityDynamicPropertyData(entityId,temlpateId);
			if(!data || !data["DynamicData"])
				continue;
			var DynamicProperties = [];
			for (x in data["DynamicData"]){
				DynamicProperties.push(x);
			}

			array.push({
				temlpateId:temlpateId,
				DynamicProperties:DynamicProperties
			});
		}
		return array;
	}
	
}
