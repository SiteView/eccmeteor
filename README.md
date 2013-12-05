# node-xmpp安装
=========================================
Ubuntu
## 安装依赖
```shell
sudo apt-get install libexpat1 libexpat1-dev libicu-dev
```

## 步骤

```shell
cd workspace  #进入到自己的工作目录
mkdir  xmpp    #创建工程文件夹
cd  xmpp  #进入工程文件夹
npm install simple-xmpp #安装simple-xmpp
```
然后把相关文件复制到工程文件夹xmpp目录下：

主要文件是：

Configure.js
node
svapi.ini
Svdb.js
testSimple.js

## 运行

在xmpp目录下：
```shell
./node testSimple.js

```

## 注意
Conifgure.js 主要是一些配置信息。如账户，好友正则等。
API使用 请参考文件   cankao.js ， api ，然后结合SiteView Tools来构建相关实体类。
svapi.ini配置svdb的服务器。 默认是长沙的192.168.9.242

## 测试

### 添加好友

请在xmpp客户端添加Configure.js中配置的账户信息为好友。(必须是xmpp.siteview.com的账户才能添加，若需要改变接受好友请求规则请在Configure.js改变相关好友正则表达式)

默认配置的账户是 lihui@xmpp.siteview.com

### 发送测试消息
添加好友后 可以通过  分别  发送以下三条信息进行测试：
```js
//测试消息  消息以空行隔开了。直接复制一行信息发送即可。
/*

{"DataType":"sv_univ","Parameters":{"dowhat":"GetSVSE","id":"1"}}


{"DataType":"sv_forest","Parameters":{"dowhat":"GetTreeData","parentid":"1","onlySon":true}}


{
	"DataType":"sv_submit",
	"Parameters":{
		"dowhat":"SubmitGroup","parentid":"1"
	},
	"Module":{
		"property":{
			"sv_dependson":"",
			"sv_name":"testXMPP",
			"sv_description":"hello world",
			"sv_dependscondition":"3"
		}
	}
}
*/
```

### 接收消息

接收到的消息是json格式的字符串。请根据具体返回结果进行解析json
