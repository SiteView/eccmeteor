
* sv_linux_vm 虚拟机说明
  1.  node_linux 和 android 的编译环境在sv_linux_vm 虚拟机中已配置好，下载即用；
  2.  下载该页面中的3个文件解压即可：http://dl.vmall.com/c0o4rvcyrf
  

* 压缩包中有如下说明文件：“node_linux 和 android_svapi 说明.txt”，内容复制如下：


用 root/nagiosxi 登录linux
启动虚拟机时，如果卡在进度条处，无法出现登录页面，ctrl+alt+del 重启虚拟机即可


1.编译 node_linux 
   进入目录： /root/node_linux/node-v0.10.21
   执行命令： make
   生成的node位于： /root/node_linux/node-v0.10.21/out/Release/node
   
2.编译 android 版本 svapi
	进入目录：/root/android/sv
	执行命令：/root/android-ndk-r9/ndk-build
	生成的 .so 位于： /root/android/sv/libs/armeabi/libhello-jni.so
	
3. apk
    在Windows下安装 android sdk, 参考  http://hi.baidu.com/jms001/item/4dee23992fee5dd27a7f0161
	拷贝目录 /root/android/sv/ 到 windows 下，用 eclipse 打包为 apk
	拷贝 apk 到手机上，安装运行
	
	
  