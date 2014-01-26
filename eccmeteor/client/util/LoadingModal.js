/**转动球机制
  LoadingModal.loading() //出现转动球
   LoadingModal.load() //隐藏转动球
*/
LoadingModal = {}
var flag = null;
Object.defineProperties(LoadingModal,{
  "selector":{
  	"value":"#LoadingModal",
  	"writable": false
  },
  "loading":{
    "value":function(){
      	console.log("================正在加载...====================");
        flag = true
        var show = function(){
          if(flag){
            $(LoadingModal.selector).modal('show');   
          } 
          flag = false;
        };
      //  show();
        Meteor.setTimeout(show,1000);
    },
    "writable": false,
    "enumerable": false,
    "configurable": false
  },
  "loaded":{
    "value":function(){
    	console.log("==================加载完毕...================");
        if(!flag){
          $(LoadingModal.selector).modal('hide');
        }else{
          flag = false;
        }  
    }
  }
});