//编辑一条任务计划后保存Template.taskabsolute_editform.events = {//取消编辑	"click #taskabsoluteeditcancelbtn":function(e,t){		RenderTemplate.hideParents(t);	},//保存操作	"click #taskabsoluteeditofsavebtn":function(e,t){		var basicinfooftaskabsoluteedit = ClientUtils.formArrayToObject($("#taskabsoluteeditofbasciinfo").serializeArray());		var address = {};		address = basicinfooftaskabsoluteedit;		console.log(address);				SvseTaskDao.addtaskabsolute(address, function (err,result) {			   RenderTemplate.hideParents(t);				// console.log(result);			// console.log("123");			// console.log(result); //控制台打印添加的信息			// console.log("123");			// $('#taskabsoluteadddiv').modal('toggle');		});			},//点击关闭	"click .close":function(e,t){		RenderTemplate.hideParents(t);	}};