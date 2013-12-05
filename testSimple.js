var xmpp = require('simple-xmpp');
var Svdb = require("./Svdb");
var Configure = require("./Configure");
//配置登录账户
xmpp.connect(Configure.account);

xmpp.on('online', function() {
    console.log('Yes, I\'m connected!');
    var roster = new xmpp.Element('iq', {type: 'get' });
    roster.c('query', { xmlns: 'jabber:iq:roster' });
    xmpp.send(roster);
});


//from 好友的地址  message:消息
xmpp.on('chat', function(from, message) {
	xmpp.send(from, Svdb.do(message));
});

xmpp.on('error', function(err) {
    console.error(err);
});
/*
	订阅加好友消息
*/
xmpp.on('subscribe', function(from) {
	if (Configure.checkFriend(from)) {
    	xmpp.acceptSubscription(from); //接受好友请求
    }
});

// /获取好友列表
xmpp.on('stanza', function(stanza) {
    if(stanza.name !== "iq"){
    	return;
    }
	var friendList = [];
	var flag = true;
	var items = stanza.children[0].children;
	for(var i = 0 ; i<items.length ; i++){
		if(items[i].name !== "item"){
			flag =  false;
			break;
		}
		friendList.push({
			jid:items[i].attrs.jid,
			nick:items[i].attrs.name
		});
	}
	if(flag){
		console.log(friendList);
	}

});
xmpp.subscribe('huyinghuan@xmpp.siteview.com');//设置联系好友默认好友
// check for incoming subscription requests
xmpp.getRoster();
