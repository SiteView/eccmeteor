
本文件所在目录为 https://github.com/SiteView/ECC8_BACKEND/tree/master/Server/kennel/node_module/meteor_runtime
				

meteor 使用说明：
1.	拷贝 svapi.ini 到工程目录下（比如 \Meteor\examples\todos），设置 svdb 的地址并确认 svdb 已经启动
2.	拷贝 node.exe、msvcp100.dll、msvcr100.dll 到 \meteor\bin 目录下，替换掉 meteor 原有的 node.exe
3.	启动 meteor

node.exe 独立测试
	运行 .\run.bat，在浏览器中输入 http://127.0.0.1:1337/ 即可看到 node.exe 调用 svapi 返回的数据

