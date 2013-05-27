* 编译未全部搞好，链接了下载的 .a 
		但目前的 node 已经能够运行（大小10MB左右，官方原版的8M左右），可用于linux平台下进行测试


* node.js 基本功能测试
  1.	下载后面的目录到你的linux中，https://github.com/SiteView/eccmeteor/tree/master/node_linux/meteor_runtime
  2.	设置该目录的权限：隶属于什么组、什么用户、node 是否有可运行权限
  3.	设置该目录中 svapi.ini 的 svdb 地址
  4.	运行 ./node sv.js ，即可看到从 ecc 系统返回的数据


* meteor linux 的安装事项
  1. 	Install Meteor: $ curl https://install.meteor.com | /bin/sh
		官方文档： http://docs.meteor.com/ 
  2. 	注意命令行提示 meteor 安装到什么目录了，提示类似：Meteor 0.6.3.1 has been installed in your home directory (~/.meteor).
		到 meteor 安装目录下（目录类似：~/meteor/tools/11f45b3996/bin）备份原来的 node，替换为从本文开头的地址下载的 node
		设置新的权限：隶属于什么组、什么用户、node 是否有可运行权限
  3.	按后面文档的要求操作，https://github.com/SiteView/eccmeteor/blob/master/eccmeteor/README.md	
  4.	关闭防火墙，关闭selinux，启动 eccmeteor，从浏览器中访问


*meteor linux下的版本控制
  1.    安装node.js  在http://nodejs.org/download/ 下载相应版本的node进行安装
  2.    如在Ubuntu下  运行  sudo -H npm install -g meteorite 安装
  3.    使用 mrt cteate myapp  创建基于最近meteor版本的应用。注意：第一次创建过程中将有一个下载meteor过程等待即可。
  4.    如果需要使用特定版本的meteor，则使用命令mrt create myapp --tag v0.5.9 创建基于0.5.9版本的应用。注意：如果第一次使用该版
 	该版本则也需要等待下载。
  5.    其他命令如果添加pages等，只需将meteor改成mrt即可。如 mrt add jquery. 注意，mrt支持一次添加一个package.
  6.    使用ecc自编译的node可运行文件 代替路径/usr/local/bin 下的node文件即可。注意替换的node的权限问题。
