var sublitLoginform = function(t){
    //  var username = $("#loginForm :input[name='username']").val();
    //  var password = $("#loginForm :input[name='password']").val();
      var username = t.find("input:text[name='username']").value;
      var password = t.find("input:password[name='password']").value;
    //  var errorMsg = $("#loginErrorDiv div:first");
      var errorMsg = $(t.find("div#loginErrorDiv div"));
      if(!password || password.replace(/" "/g,"").length === 0){
          errorMsg.html("*密码不能为空");
          return;
      }
      errorMsg.empty();
      SvseUserDao.login(username,password,function(err,status){
        if(err){
          Log4js.error(err);
          console.log("login fail");
          Meteor.logout();
          errorMsg.html(status ? err : "*登陆名不存在或密码错误");
        }else{
            $("body").css("background-color","white");
            remeberMe(username,password);
            errorMsg.empty();
            Meteor.Router.to("/home");    
        }
      });
}

Template.Login.events({
    "keydown input:password":function(e,t){
      if(e.keyCode !== 0 && e.keyCode !== 13){
        return;
      }
      sublitLoginform(t);
    },
    "click #loginFormLoginBtn":function(e,t){
      sublitLoginform(t);
    }
});
var remeberMe = function(username,password){
  if($("#login-remeber")[0].checked){
      if(UserUtils.gotUser())
        return;
      UserUtils.remberUser(username,password);
  }else{
    UserUtils.forgotUser();
  }
}
Deps.autorun(function(){
  if(!Meteor.user())
    return;
  if(!Meteor.user().profile.accountstatus){
    Meteor.logout(function(){alert('你的账户已被禁止，请联系系统管理员');});    
  }
});

Template.Login.rendered = function(){
  $("body").css("background-color","#e7f6fd");
  var user = UserUtils.gotUser();
  if(user){
    $("#loginForm :input[name='username']").val(user.a);
    $("#loginForm :input[name='password']").val(user.b);
    $("#login-remeber")[0].checked = true;
  }
}