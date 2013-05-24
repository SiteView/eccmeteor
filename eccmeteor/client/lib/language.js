Language = new Meteor.Collection();
Deps.autorun(function (c) {
	Language.remove({});
	console.log("初始化本地语言环境");
	console.log(navigator.language);
	Language.insert(
		{
			language:{
				cn : {
					hello: "你好",
					language: "Language"
				},
				en : {
					hello: "Hello",
					language: "语言"
				}
			},
			default:"cn"
		}
	);
	c.stop();
});