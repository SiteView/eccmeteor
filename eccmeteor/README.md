eccmeteor
=========

* 安装说明: 进入项目目录 在cmd中运行
  * meteor create eccmeteor
  * cd eccmeteor
  * meteor add bootstrap
  * metoer add d3
  * meteor remove autopublish
  * 从网址https://github.com/SiteView/eccmeteor/tree/master/eccmeteor 下载该目录下的所有文件 复制到 eccmeeor目录下
  * meteor (或 meteor run -p 3000)  ##用-p 参数指定访问端口 默认为3000
* 注意：
  * 需要在metor安装目录下的   \Meteor\packages 
  * 找到jquery 文件夹 在jquery官网下载最新jquery或者1.7以上版本替换原有的jquery.js
  * 找到d3文件夹 ，在d3.js官网http://d3js.org/d3.v3.zip 下载最新的d3.js替换原有d3.js
  * 第一次启动 找到文件eccmeteor/server/startup.js 将函数的参数-1改成0  (第二次启动时可以改回来。以减少启动时间)


