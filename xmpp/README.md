
node-xmpp 的地址： https://github.com/astro/node-xmpp

安装 node-xmpp
	这是ecc的node进程：https://github.com/SiteView/eccmeteor/blob/master/node_linux/meteor_runtime/node
	下载ecc的node 放到/usr/local/bin/ 及 /usr/local/lib/ ；
	安装 npm， curl https://npmjs.org/install.sh | sh
	npm install node-xmpp
	npm install node-expat
	npm install ltx
	yum install libicu-devel
	npm install node-stringprep@0.1.0  ，拷贝 ./node_modules/node-stringprep/build/Release/*.node 到 ./node_modules/node-stringprep
	
运行 node-xmpp	
	关闭防火墙
	启动xmpp服务： node ./node_modules/node-xmpp/examples/c2s.js
	发送消息：node ./node_modules/node-xmpp/examples/send_message.js chen2@192.168.0.51 chen2 hello_hhhh chen@192.168.0.51
