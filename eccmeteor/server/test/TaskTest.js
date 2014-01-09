TaskTest = function(){};
Object.defineProperty(TaskTest,"create",{
	value:function(){
		var task = {
			Allow0: "0", Allow1: "1",
			Allow2: "1", Allow3: "1",
			Allow4: "1",Allow5: "1",
			Allow6: "0",
			Description: "",
			Type: "2",
			end0: "23:59",end1: "18:00",
			end2: "18:00",end3: "18:00",
			end4: "18:00",end5: "18:00",
			end6: "18:00",start0: "00:00",
			start1: "09:00",start2: "09:00",
			start3: "09:00",start4: "09:00",
			start5: "09:00",start6: "00:00",
			sv_name: "5x10"
		}
		var robj= process.sv_univ({'dowhat':'CreateTask',id:"qqq"},0); //增加
		if(!robj.isok(0)){
			console.log(robj.estr(0));
		}
		var fmap = robj.fmap(0);
		console.log(fmap);
		var newObj = {
			return :{id:"qqq",return:true},
			property :task
		}

		var robj2= process.sv_submit(newObj,{'dowhat':'SubmitTask','del_supplement':false},0); //修改

		if(!robj2.isok(0)){
			console.log(robj2.estr(0));
		}
		var fmap2 = robj2.fmap(0);
		console.log(fmap2);
	}
})