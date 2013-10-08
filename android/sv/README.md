
* svapi addroid 使用说明
  1.  启动电脑上的 svdb，确保手机 wifi 连接后可 ip 到达该电脑
  2.  设置 /svapi.ini 中 svdb 地址，指向上一步的电脑 ip
  3.  拷贝 /svapi.ini 和 /helloSV.apk 到 android 手机的SD卡根目录（/mnt/sdcard/）上
  4.  安装运行 /helloSV.apk，即可读取 svdb 中的数据

* 例子代码
  1.  代码位于 /src/com/example/hellojni/HelloJni.java
  2.  修改该代码以获得其他数据
  