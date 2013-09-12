
* svdb_linux 使用说明
  1.  下载 \bin\svdb 到linux（centos）中，设置其权限，执行：svdb 即可启动，Ctrl+c 停止；
  2.  启动为linux服务：启动命令：svdb -service ，停止命令：svdb -stop ，如需开机启动则将这两条命令添加到 linux 启动脚本中。
  3.  数据文件目录：/var/lib/siteview/ecc/data ，进程锁文件：/var/run/svdb.pid ，文件格式与 windows 完全一致。

