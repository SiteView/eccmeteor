
* router 是 svapi 与路由器的整合
  1.  代码基础: 根据 "随^ǒ^源 qq:125432012" 提供的 remote-ctrl 代码
  2.  请运行：router/remote-ctrl/lib/remote-ctrl ，运行效果为：router/remote-ctrl/remote-ctrl_run.txt
  3.  代码在：router/remote-ctrl/src/remote_ctrl.cpp  160行，里面进行了 svapi 的调用
  4.  编译方法：基于路由器的原有代码 router/remote-ctrl/src/Makefile 增加了 34行 和 47行，执行make命令即可编译
  5.  若需基于路由器中已有的 xmpp 应答进行开发，请咨询 "随^ǒ^源 qq:125432012" 
  
  