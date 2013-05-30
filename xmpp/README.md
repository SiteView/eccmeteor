
node-xmpp 的地址： https://github.com/astro/node-xmpp

* 安装 node-xmpp
  1.	下载后面的目录放到~/node_linux， https://github.com/SiteView/eccmeteor/blob/master/node_linux		
		cp ~/node_linux/meteor_runtime/node           /usr/local/bin/  ，并设置运行权限		
		cp ~/node_linux/node-v0.8.22/tools/node-waf   /usr/local/bin/   ，并设置运行权限		
		cp -r ~/node_linux/node-v0.8.22/tools/wafadmin  /usr/local/lib/node/wafadmin		
  2.	cd ~/node_linux/node-v0.8.22		
		yum install gcc-c++		
		yum install libicu-devel		
		yum install python	
  3.	安装 npm， curl https://npmjs.org/install.sh | sh		
    	npm install node-expat	
		npm install ltx		
		npm install node-xmpp	
  4.	npm安装 node-stringprep （会自动下载源代码并编译，这一步最容易出错误）			
		执行下面3行，设置 g++ 的环境变量：			
CPLUS_INCLUDE_PATH=$CPLUS_INCLUDE_PATH:~/node_linux/node-v0.8.22/deps/v8/include/:~/node_linux/node-v0.8.22/deps/uv/include/:~/node_linux/node-v0.8.22/src/				
export CPLUS_INCLUDE_PATH		
export NODE_PATH=/usr/local/lib/node_modules		
		
		npm install node-stringprep@0.1.0
		cp ~/node_modules/node-stringprep/build/Release/node-stringprep.node   ~/node_modules/node-stringprep		
	
* 运行 node-xmpp	
  1.	关闭防火墙，然后启动xmpp服务：node ~/node_modules/node-xmpp/examples/c2s.js		
  2.	发送消息：node ./node_modules/node-xmpp/examples/send_message.js		
  3.	或下载xmpp客户端  http://pandion.im/，连接到你的 xmpp服务器，看到如下提示说明 xmpp 服务器正常工作了		
AUTHsiteview@192.168.0.51 -> siteview	
ONLINE	
STANZA<iq type="get" id="sd3" to="192.168.0.51" xmlns:stream="http://etherx.jabber.org/streams" from="siteview@192.168.0.51/潘迪安"><query xmlns="http://jabber.org/protocol/disco#items"/>	
  

