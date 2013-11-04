Template.Login.events({
    "keydown input:password, click .login-btn":function(e){
      if(e.keyCode !== 0 && e.keyCode !== 13){
        return;
      }
      console.log(e.keyCode);
      var username = $("#loginForm :input[name='username']").val();
      var password = $("#loginForm :input[name='password']").val();
      var errorMsg = $("#loginErrorMsg");
      if(!password || password.replace(/" "/g,"").length === 0){
        errorMsg.html("密码不能为空").css("display","block");
        return;
      }
      SvseUserDao.login(username,password,function(err,status){
        if(err){
          Log4js.error(err)
          errorMsg.html(status ? err : "登陆名不存在或密码错误").css("display","block");
        }else{
           Meteor.Router.to("/home");
           $("body").css("background-color","white");
        }
      });
    }
});

Deps.autorun(function(){
  if(!Meteor.user())
    return;
  if(!Meteor.user().profile.accountstatus){
    Meteor.logout(function(){alert('你的账户已被禁止，请联系系统管理员');});    
  }
});

Template.Login.rendered = function(){
  $("body").css("background-color","#e7f6fd");
}