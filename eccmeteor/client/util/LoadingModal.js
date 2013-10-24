LoadingModal = {}
Object.defineProperties(LoadingModal,{
  "selector":{
  	"value":"#LoadingModal",
  	"writable": false
  },
  "loading":{
    "value":function(){
      	console.log("==================================正在加载...==================================");
		$(LoadingModal.selector).modal('show');
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