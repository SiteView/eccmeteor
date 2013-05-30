
node-xmpp 的地址： https://github.com/astro/node-xmpp

* 安装 node-xmpp
  1.	这是ecc的node进程：https://github.com/SiteView/eccmeteor/blob/master/node_linux/meteor_runtime/node
	下载ecc的node 放到/usr/local/bin/ 及 /usr/local/lib/ ；
  2.	安装 npm， curl https://npmjs.org/install.sh | sh
  3.	npm install node-xmpp
  4.	npm install node-expat
  5.	npm install ltx
  6.	yum install libicu-devel
  7.	npm install node-stringprep@0.1.0  ，拷贝 ./node_modules/node-stringprep/build/Release/*.node 到 ./node_modules/node-stringprep
	
* 运行 node-xmpp	
  1.	关闭防火墙
  2.	启动xmpp服务： node ./node_modules/node-xmpp/examples/c2s.js
  3.	发送消息：node ./node_modules/node-xmpp/examples/send_message.js chen2@192.168.0.51 chen2 hello_hhhh chen@192.168.0.51

	