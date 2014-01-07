
本工程编译出的 node 在此下载 https://github.com/SiteView/eccmeteor/tree/master/node_linux/meteor_runtime
推荐 linux 平台为 centos6.2-32bit，需要的编译环境有：Python 2.6 or 2.7，GNU Make 3.81 or newer，CMake, gcc-c++

node 只改了一个文件
https://github.com/SiteView/eccmeteor/blob/master/node_windows/node-v0.10.21/src/node.cc
2427-2433行，94行

node.js官网跟新后， 去下载源代码， 然后在2427行位置添加这几行代码，在把4个.lib放到指定位置  就能编译出我们自己的node.exe  

node 的linux 版本，修改  node.gyp 以设置引用目录和引用的库 
https://github.com/SiteView/eccmeteor/blob/master/node_linux/node-v0.10.21/node.gyp 
77行， 82-85行 

修改这个 node.gyp 等同与修改 vc studio 中的 引用目录


* linux 下编译 node 方法
  1.	下载目录 https://github.com/SiteView/eccmeteor/tree/master/node_linux 到/root下，进入/root/node_linux，运行 ./build.sh
  2.	最后编译出的程序为 /meteor_runtime/node ，大小为 10M 左右，要替换到 meteor 安装目录中去；官方原版的 node 大小为 8M 左右。
* 与windows版本的区别
  1.  	commoncpp 版本不同 （http://www.gnu.org/software/commoncpp/）
		node(windows版)ecc里原有的 commoncpp 在 linux 下编译无法通过，版本未知。
		node(windows版)所在目录为 https://github.com/SiteView/eccmeteor/tree/master/node_module
		node(linux版本)所在目录为 https://github.com/SiteView/eccmeteor/tree/master/node_linux
		node(linux版本)的 commoncpp 为 1.7.3 版本，下载地址为：http://mirror.bjtu.edu.cn/gnu/commoncpp/
  2.  	如下四个功能在linux版本中无法使用，因为没有对应的 library 。
		dowhat= SmsTest，   	//发送测试短信
		dowhat= GetSmsDllName;  //获取定制开发的发送短信的 dll名
		dowhat= SmsTestByDll，  //通过定制开发的发送短信的dll，发送测试短信
		dowhat= EmailTest，		//发送测试邮件    
  3.	其他小的修改，代码保持与 windows 版本兼容。


* node.js 基本功能测试
  1.	下载目录/meteor_runtime 到你的linux中，并进入该目录
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


* meteor linux下的版本控制
  1.    安装node.js  在http://nodejs.org/download/ 下载相应版本的node进行安装
  2.    如在Ubuntu下  运行  sudo -H npm install -g meteorite 安装
  3.    使用 mrt cteate myapp  创建基于最近meteor版本的应用。注意：第一次创建过程中将有一个下载meteor过程等待即可。
  4.    如果需要使用特定版本的meteor，则使用命令mrt create myapp --tag v0.5.9 创建基于0.5.9版本的应用。注意：如果第一次使用该版
 	该版本则也需要等待下载。
  5.    其他命令如果添加pages等，只需将meteor改成mrt即可。如 mrt add jquery. 注意，mrt支持一次添加一个package.
  6.    使用ecc自编译的node可运行文件 代替路径/usr/local/bin 下的node文件即可。注意替换的node的权限问题。
