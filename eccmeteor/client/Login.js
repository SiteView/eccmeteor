Template.Login.events({
    "submit #loginForm":function(){
        return false;
    },
    "click #loginBtn":function(){
      var username = $("#loginForm :input[name='username']").val();
      var password = $("#loginForm :input[name='password']").val();
      SvseUserDao.login(username,password,function(err){
        if(err){
            console.log(err);
           $("#loginForm #loginErrorMsg").css("display","block");
        }else{
            Meteor.Router.to("/home");
        }
      });
    }
});
