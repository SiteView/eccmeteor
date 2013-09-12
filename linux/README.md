
* svdb_linux 使用说明
  1.  下载 \bin\svdb 到linux（centos）中，设置其权限，执行：svdb 即可启动，Ctrl+c 停止；
  2.  启动为linux服务：启动命令：svdb -service ，停止命令：svdb -stop ，如需开机启动则将这两条命令添加到 linux 启动脚本中。
  3.  数据文件目录：/var/lib/siteview/ecc/data ，进程锁文件：/var/run/svdb.pid ，文件格式与 windows 完全一致。

* 编译说明
  1.  推荐 linux 平台为 centos-6.X 和 debian-7.X，需要的编译环境有：GNU Make 3.81 or newer，CMake, gcc-c++
  2.  运行 /build.sh ,编译的程序和依赖的 .a 都在 /bin 下
  