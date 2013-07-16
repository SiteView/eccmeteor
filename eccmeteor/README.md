eccmeteor
=========
* Windows:
* 安装说明: 进入项目目录 在cmd中运行
  * meteor create eccmeteor
  * cd eccmeteor
  * meteor add bootstrap
  * metoer add d3
  * meteor remove autopublish
  * meteor add accounts-base
  * meteor add accounts-password
  * 从网址https://github.com/SiteView/eccmeteor/tree/master/eccmeteor 下载该目录下的所有文件 复制到 eccmeeor目录下
  * meteor (或 meteor run -p 3000)  ##用-p 参数指定访问端口 默认为3000
* 注意：
  * 需要在metor安装目录下的   \Meteor\packages 
  * 找到jquery 文件夹 在jquery官网下载最新jquery或者1.7以上版本替换原有的jquery.js
  * 找到d3文件夹 ，在d3.js官网http://d3js.org/d3.v3.zip 下载最新的d3.js替换原有d3.js
  * 第一次启动 找到文件eccmeteor/server/startup.js 将函数的参数-1改成0  (第二次启动时可以改回来。以减少启动时间)

* Linux:
* 安装说明：(以Ubuntu为例)
  *  安装node.js  在http://nodejs.org/download/ 下载相应版本的node进行安装,安装node请参照官方文档
  *  运行  sudo -H npm install -g meteorite 安装mrt
  *  使用 mrt cteate myapp  创建基于最近meteor版本的应用。 
  *  如果需要使用特定版本的meteor，则使用命令mrt create myapp --tag v0.5.9
  *  注意上述两步 在第一次创建过程中需要等待下载相应版本的meteor，需要一定的时间，大概1-2分钟。
  ** 现在以0.5.9为例进行详细说明：
    * cd workspace
    * git clone git@github.com:SiteView/eccmeteor.git
    * mrt create myapp --tag v0.5.9
    * cp -r myapp/.meteor/ eccmeteor/eccmeteor/
    * cp myapp/smart.json eccmeteor/eccmeteor/
    * cp eccmeteor/node_linux/meteor_runtime/node ~/.meteorite/meteors/meteor/meteor/45fef52095bb6726cc1b2f05008ad891c446100a/dev_bundle/bin
    * mrt add bootstrap
    * mrt add d3
    * mrt remove autopublish
    * mrt run -p 3000
    
  


* 关于svlog.js：
  * \Meteor\eccmeteor\server\lib\svlog.js 的功能是：自动增量导入log到mongodb
  * 该功能默认是关闭的，若要打开请到 svlog.js 的第3行设置 can_run 为 true
  * 因为ecc的log数据量巨大，首次启动该功能时请耐心等待数据迁移完成，后续的运行是增量的，比较快；数据全部在 mongodb 的 meteor 数据库的 svlog 表中
  * 如果因为该功能的数据对 meteor 其他功能产生了影响，请先设置 can_run 为 false 关闭该功能，然后运行 meteor reset 清空所有数据
  
