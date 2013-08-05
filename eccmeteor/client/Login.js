Template.Login.events({
    "submit #loginForm":function(){
        return false;
    },
    "keydown input:password,click .loginbtndiv":function(e){
      console.log(e.keyCode);
      if(typeof e.keyCode !== "undefined" && e.keyCode !== 13){
        return;
      }
      var username = $("#loginForm :input[name='username']").val();
      var password = $("#loginForm :input[name='password']").val();
      var errorMsg = $("#loginErrorMsg");
      if(!password || password.replace(/" "/g,"").length === 0){
        errorMsg.html("密码不能为空").css("display","block");
        return;
      }
      SvseUserDao.login(username,password,function(err,status){
        if(err){ 
          errorMsg.html(status ? err : "登陆名不存在或密码错误").css("display","block");
        }else{
            Meteor.Router.to("/home");
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
