
gloox 是 svapi 的 xmpp 应答 windows 客户端


* 试运行
  1.  设置 /gloox/bin/svapi.ini 中 svdb 地址，指向 ecc 的 ip
  1.  运行 /gloox/bin/sv.exe
  3.  安装 /gloox/spark_2_6_3.exe
  4.  注册一个帐号，添加好友 chenjiant2 并发送如下消息：
  4.1.  ["GetUnivData",{"dowhat":"GetMonitorTemplet","id":"5"}]
  4.2.  ["GetForestData",{"dowhat":"GetTreeData","parentid":"1"}] 
  4.3.  ["SubmitUnivData",{"dowhat":"SubmitGroup","parentid":"1","del_supplement":"true"},{"property":{"sv_name":"测试设备","sv_description":"测试设备"}}]
  5.  在 spark 客户端中即可得到调用 ecc 后返回的数据，效果截图：/gloox/xmpp自动应答1.png
  
  
  
* 代码  
  1.  代码请见：/gloox/gloox/src/examples/message_example.cpp ，若要修改 xmpp 帐号和密码请在 172、173行，代码如下:
		JID jid("chenjiant2@rkquery.de");
		j = new Client(jid, "cjt");  
  2.  解压该文件：/gloox/bin/"gloox.lib.请解压_原文件尺寸受限于github的100M上限.rar"
  3.  打开 /gloox/xmpp.sln ，编译工程：sv
  