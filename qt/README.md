
* svdb_linux 使用说明
  1.  下载 \bin\svdb 到linux（centos）中，设置其权限，执行：svdb 即可启动，Ctrl+c 停止；
  2.  启动为linux服务：启动命令：svdb -service ，停止命令：svdb -stop ，如需开机启动则将这两条命令添加到 linux 启动脚本中。
  3.  数据文件目录：/var/lib/siteview/ecc/data ，进程锁文件：/var/run/svdb.pid ，文件格式与 windows 完全一致。

  
* svapi library for qt 说明
  1.  本目录中的所有工程，为了避免与原有程序新旧共存时互相冲突，全部采用静态链接，例如：windows下仅依赖 msvcp100.dll 和 msvcr100.dll 。
  2.  \bin 目录下包括了所有需要依赖的库，包括了 linux 的.a ，windows 的.lib
  3.  例子工程为 testsvapi.pro 里面有一个 main.cpp ，可以成功调用 svapi

* windows 编译
  1.	安装微软 vc2010
  2.	http://qt-project.org/downloads ，到该页面下载安装 “Qt 5.1.0 for Windows 32-bit (VS 2010, 505 MB)”
  2.	打开上一步安装目录中的 qt-creator，已经自动关联了上两步的编译环境。
  3.	open project, 选\testsvapi\testsvapi.pro，选重新构建，即生成 \bin\testsvapi.exe
  4.	设置 \bin\svapi.ini 中的 svdb 地址，运行 testsvapi.exe，即成功返回 ecc 数据


* linux 编译
  1.	推荐 linux 平台为 centos6.X-32bit，需要的编译环境有：GNU Make 3.81 or newer，CMake, gcc-c++
  2.	http://qt-project.org/downloads ，到该页面下载安装 “Qt 5.1.0 for Android (Linux 32-bit, 463 MB) (Info)”
  3.	到\testsvapi\目录，执行：qmake -o Makefile testsvapi.pro ，然后执行：make
  4.	设置 \bin\svapi.ini 中的 svdb 地址，运行 testsvapi，即成功返回 ecc 数据
  