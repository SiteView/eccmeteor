var Configure = function(){};
//配置帐号信息
var account = {
        jid: "lihui@xmpp.siteview.com",
        password: 123456,
        host: 'xmpp.siteview.com',
        port: 5222
	}
var reg = /(xmpp\.siteview\.com)$/;//接受 好友请求时的正则表达式
Object.defineProperty(Configure,"account",{
	value:account
});
Object.defineProperty(Configure,"checkFriend",{
	value:function(account){
		return reg.test(account);
	}
});


module.exports = Configure;