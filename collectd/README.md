###运行
```shell
node master.js
```

###collect setup
####如果是debian ubuntu安装
sudo apt-get install libcurl3 python-pycurl libcurl3-gnutls libcurl4-gnutls-dev 
sudo apt-get install perl-modules

####如果是Redhat系 CentOS RHEL Fedora
yum -y install curl curl-devel
yum install cpan

### node.js 依赖
1. npm install mongoskin


### 初步Collectd传输监视器数据标准
```
{
	"values" : [  //collectd原始数据字段保留
		2240
	],
	"dstypes" : [ //collectd原始数据字段保留
		"derive"   // 数据类型介绍具体 [https://collectd.org/wiki/index.php/Gauge]
	],
	"dsnames" : [//collectd原始数据字段保留
		"value"
	],
	"time" : 1390237481.495,//collectd原始数据字段保留 时间。从1970.1.1到现在的秒数（不是毫秒）
	"interval" : 30,  //collectd原始数据字段保留 数据频率
	"host" : "localhost.localdomain", //collectd原始数据字段 ABC@pc1 BCD@pc1 需改造。改成可以携带公司信息和机器信息的字段。例如：siteview@pcserver   siteview的pcserver这台机器。当然这个字段可能还需修带一些其他信息，如设备类型如Linux，windows,Mac之类的。字段是否需要加密？ 暂时使用简单的 公司名@机器名 来标识
	"plugin" : "cpu", //collectd原始数据字段保留 插件类型
	"plugin_instance" : "0", //collectd原始数据字段保留 
	"type" : "cpu",//collectd原始数据字段保留 监视器类型  
	"type_instance" : "system", //collectd原始数据字段保留 监视器的具体划分。如使用，空闲等
}
```
### 初步mongodb存储监视器数据标准
```

在上述Collecd传输数据基础上 增加以下字段：

{
	"value" : 2240,// 增加字段。 监视器的存储的值
	"unit":"%",// 增加字段。数据单位
	"status":1, //增加字段。数据状态。0 表示 warning 。1 表示 ok 正常
	"recordDate" : ISODate("2014-01-20T17:04:41.495Z"),//增加字段 数据日期
	"companyId":uuid(id),//增加字段 公司ID
	"entityId":uuid(id),//增加字段  设备ID
	"_id" : ObjectId("52dd5766c898abab1c000001")
}
```

其中dstypes的字段的意思是collectd处理数据的方式。

```
//  https://collectd.org/wiki/index.php/Gauge
gauge：数据原样存储。如温度或使用的内存量
derive ： 比率
counter ：
absoulute:
```

###初步存储公司数据标准
```
{
    companyId：uuid，//唯一标识
    companyName：公司名称
    .... 其他公司信息 待补充
}
```

### 初步存储公司与设备数据标准
```js
{
    companyId：uuid
    entityIds：[entityId(uuid),....]
    ...其他信息 待补充
}
```

### 初步设备与监视器数据标准
```js
{
    entityId ： uuid //唯一标识
    monitors : [monitorType],
    entityName:   //设备名称
    status： 0|1|2    //设备状态
    ...其他信息 待补充
}
```

### 初步监视器数据标准

```js
{
	monitorId：uuid ////唯一标识
	monitorName：... //监视器名称
	status:0|1|2  //设备状态
	...其他信息 待补充
}
```

