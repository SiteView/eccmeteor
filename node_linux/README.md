
编译未全部搞好，链接了下载的 .a 
但目前的 node 已经能够运行（大小10MB左右，官方原版的8M左右），可用于linux平台下进行测试


node.js 基本功能测试
1.	下载后面的目录到你的linux中，https://github.com/SiteView/eccmeteor/tree/master/node_linux/meteor_runtime
2.	设置该目录的权限：隶属于什么组、什么用户、node 是否有可运行权限
3.	设置该目录中 svapi.ini 的 svdb 地址
4.	运行 ./node sv.js


meteor linux 的安装事项
1. 	Install Meteor: $ curl https://install.meteor.com | /bin/sh
	官方文档： http://docs.meteor.com/ 
2. 	注意命令行提示 meteor 安装到什么目录了，提示类似：Meteor 0.6.3.1 has been installed in your home directory (~/.meteor).
	到 meteor 安装目录下（目录类似：~/meteor/tools/11f45b3996/bin）备份原来的 node，替换为从本文开头的地址下载的 node
	设置新的权限：隶属于什么组、什么用户、node 是否有可运行权限
3.	按后面文档的要求操作，https://github.com/SiteView/eccmeteor/blob/master/eccmeteor/README.md	
4.	关闭防火墙，关闭selinux，启动 eccmeteor，从浏览器中访问


