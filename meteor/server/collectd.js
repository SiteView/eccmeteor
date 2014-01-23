Meteor.publish("monitor", function (fieldsObj) {
	return Monitor.find(
		{type:"cpu",type_instance:{$in:["system","user"]}},
		{sort:{recordDate:-1},limit:100}
	)
});