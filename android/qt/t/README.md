
* svapi qt-addroid 使用说明
  1.  设置 /svapi.ini 中 svdb 地址
  2.  拷贝 /svapi.ini 和 /QT-svapi.apk 到 android 手机的SD卡根目录（/mnt/sdcard/）上
  3.  安装运行 /QT-svapi.apk，即可读取 svdb 中的数据

* 例子代码
  1.  代码为 /t.cpp  main.cpp
  2.  修改该代码以获得其他数据,代码需为UTF-8编码

  
* 编译方法
  1.  安装：Qt 5.1.1 for Android (Windows 32-bit, 716 MB)，android ndk, android sdk, ant
           参考 http://www.cnblogs.com/A-Number--1/p/windows下Qt510配置android环境变量.htm
  2.  用 Qt Creator 打开工程 /t.pro，构建运行，apk 安装包位于 /android/bin，	apk起始大小11MB，在手机上安装后是39MB
  3.  未解决的bug，本例子中的 QLabel 控件没有搞好，当手机触发重力感应横屏旋转后，页面布局就会乱掉
  
  