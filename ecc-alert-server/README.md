================
* 基本思路（TODO）
   * 第一 做一个定时器，隔一段时间 自动自行某函数。（完成）
   * 第二 node调用api获取svdb的监视数据，提取出非正常状态的监视器信息。（这个参考svapi.js中的）
   * 第三 获取用户配置的邮件模板（ini文件）。
   * 第四 根据非正常监视器信息填充模板。获取完整要发送的邮件内容。
   * 第五 获取邮件发送Server配置 （ini配置文件）
   * 第六 获取需要接收邮件 的邮箱地址（ini配置文件）。
   * 第七 根据 4,5,6 获取的信息构成 邮件的完整信息。
   * 第八 发送邮件
   * 以上每个步骤 为单独一个Object类 并 单独为一个js文件

* 准备步骤
   * 报警服务器所在目录为 eccmeteor/ecc-alert-server
   * 进入报警服务器目录 复制ecc-window-runtime 下面的msvcp100.dll，msvcr100.dll ，node.exe ,svapi.ini到该报警服务器目录下
   * 进入报警服务器目录 安装邮件发送模块
   * npm install nodemailer
  
* 要求 
   * 类名与文件名相同
   * 主文件  index.js
   * 定时器  Timer.js 
   * 监视器信息 MonitorInformation.js
   * 邮件模板   EmailTemplate.js
   * 邮件内容   EmailContent.js
   * Server邮件配置  EmailServerConfigure.js
   * 接收邮件地址   EmailClientConfigure.js
   * 发送邮件      EmailSending.js
   * 每个类的功能需要进行单元测试，测试文件放在test目录下
   * 每完成一个功能类后，需要在 TODO部分标记完成

* 提醒
  * 已经完成 Timer类。
  * 已经完成 EmailSending 类的demo 需要更具实际情况修改。同下。
  * 已经完成 MonitorInformation 类的demo 
  * 已经完成 EmailTemplate 类的demo 
  * 已经完成 EmailContent 类的demo 
  * 已经完成 EmailServerConfigure 类的demo 
  * 已经完成 EmailClientConfigure 类的demo 
  * 已经完成 EmailSending 类的demo 

* 运行demo
    * 请配置EmailServerConfigure.js 里面的 邮箱账户密码
    * 运行 ./node index.js (window 下为 node.exe index.js)