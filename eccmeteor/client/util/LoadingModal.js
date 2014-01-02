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
		    Session.set("LOADINGMODAL".true);
        var show = function(){
          if(Session.get("LOADINGMODAL")){
            console.log("=====Loading Modal========");
            $(LoadingModal.selector).modal('show');
          } 
        }
      //  show();
        Meteor.setTimeout(show,500);
    },
    "writable": false,
    "enumerable": false,
    "configurable": false
  },
  "loaded":{
    "value":function(){
    	console.log("==================================加载完毕...==================================");
		  Session.get("LOADINGMODAL",false)
      $(LoadingModal.selector).modal('hide');
    }
  }
});