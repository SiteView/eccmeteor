
* sv_linux_vm 虚拟机说明
  1.  node_linux 和 android 的编译环境在sv_linux_vm 虚拟机中已配置好，下载即用；
  2.  下载该页面中的3个文件解压即可：http://dl.vmall.com/c0o4rvcyrf
  

* 压缩包中有如下说明文件：“node_linux 和 android_svapi 说明.txt”，内容复制如下：


用 root/nagiosxi 登录linux
启动虚拟机时，如果卡在进度条处，无法出现登录页面，ctrl+alt+del 重启虚拟机即可

   
* 一.编译 android 版本 svapi
	进入目录：/root/android/sv
	执行命令：/root/android-ndk-r9/ndk-build
	生成的 .so 位于： /root/android/sv/libs/armeabi/libhello-jni.so
	
* 二. apk
    在Windows下安装 android sdk, 参考  http://hi.baidu.com/jms001/item/4dee23992fee5dd27a7f0161
	拷贝目录 /root/android/sv/ 到 windows 下，用 eclipse 打包为 apk
	拷贝 apk 到手机上，安装运行
	
//////////////////////////////////////////////////////////
/*
 * node_windows, Visual Studio 2010编译说明
 */
 
1. nodejs官网（http://nodejs.org/download/）下载最新版Source Code，注意官网提示、下载相应的Python，并配置环境变量。

2. 执行文件../node-v0.10.22/vcbuild.bat，在工程node.sln中生成19个项目。

3. 添加代码../node-v0.10.22/src/node.cc, 
  94行:
  #include "../addonsv/addonsv.h"
  
  2427-2433行：
  NODE_SET_METHOD(process, "sv_init", SV_Init);
  NODE_SET_METHOD(process, "sv_hello", SV_Hello);
  NODE_SET_METHOD(process, "sv_test", SV_Test);
  NODE_SET_METHOD(process, "sv_object", SV_CreateObject);
  NODE_SET_METHOD(process, "sv_univ", SV_GetUnivData);
  NODE_SET_METHOD(process, "sv_forest", SV_GetForestData);
  NODE_SET_METHOD(process, "sv_submit", SV_SubmitUnivData);
  
5. 修改项目node的配置属性->C/C++->代码生成，运行库-多线程 DLL (/MD)。链接器里面包含bin目录下面的4个.lib文件。  
//////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////
/*
 * node_linux, sv_linux_vm编译说明
 */
1. node 的linux 版本，修改设置引用目录和引用的库。修改这个 node.gyp 等同与修改 vc studio 配置属性中的引用目录。 
node-v0.10.22/node.gyp
77行， 82-85行
      'include_dirs': [
        'src',
        'tools/msvs/genfiles',
        'deps/uv/src/ares',
		'../addonsv',
        '<(SHARED_INTERMEDIATE_DIR)' # for node_natives.h
      ],
	  
	  'libraries': [ 
        '<(PRODUCT_DIR)/../../../bin/libaddonsv.a',
        '<(PRODUCT_DIR)/../../../bin/libaddon.a',
        '<(PRODUCT_DIR)/../../../bin/libutil.a',
		'<(PRODUCT_DIR)/../../../bin/libccgnu2.a',
      ],
	  
2. 进入目录： /root/node_linux/node-v0.10.22
   执行命令： make
   生成的node位于： /root/node_linux/node-v0.10.22/out/Release/node
//////////////////////////////////////////////////////////