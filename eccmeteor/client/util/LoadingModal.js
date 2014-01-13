/**转动球机制
  LoadingModal.loading() //出现转动球
   LoadingModal.load() //隐藏转动球
*/
LoadingModal = {}
Object.defineProperties(LoadingModal,{
  "selector":{
  	"value":"#LoadingModal",
  	"writable": false
  },
  "loading":{
    "value":function(){
      	console.log("==================================正在加载...==================================");
        var show = function(){
          $(LoadingModal.selector).modal('show');
        };
        show();
    },
    "writable": false,
    "enumerable": false,
    "configurable": false
  },
  "loaded":{
    "value":function(){
    	console.log("==================================加载完毕...==================================");
      $(LoadingModal.selector).modal('hide');
    }
  }
});