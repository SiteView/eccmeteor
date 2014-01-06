UserLogin = function(){};

Object.defineProperty(UserLogin,"logout",{
  value:function(value){
    if(value){
      Meteor.logout(function(){alert(value);});
    }
    Meteor.Router.to("/");
  }
});

Object.defineProperty(UserLogin,"loginFail",{
  value:function(err){
    Log4js.error(err);
    console.log("login fail");
    Meteor.logout();
    Session.set("USERLOGINSUCCESS",false);
  }
});

Object.defineProperty(UserLogin,"loginSuccess",{
  value:function(username,password){
    var _self = this;
    $("body").css("background-color","white");
    _self.remeberMe(username,password);
    Session.set("USERLOGINSUCCESS",true);
  }
});


Object.defineProperty(UserLogin,"submitLoginform",{
  value:function(t){
      var _self = this;
      var username = t.find("input:text[name='username']").value;
      var password = t.find("input:password[name='password']").value;
      var errorMsg = $(t.find("div#loginErrorDiv div"));
      if(!password || password.replace(/" "/g,"").length === 0){
          errorMsg.html("*密码不能为空");
          return;
      }
      errorMsg.empty();
      LoadingModal.loading();

      SvseUserDao.login(username,password,function(err,status){
        if(err){
          _self.loginFail(err);
          errorMsg.html(status ? err : "*登陆名不存在或密码错误");
        }else{
          errorMsg.empty(); 
          _self.loginSuccess(username,password); 
        }
      });
  }
});

Object.defineProperty(UserLogin,"remeberMe",{
  value:function(username,password){
    if($("#login-remeber")[0].checked){
      if(UserUtils.gotUser()){
        return;
      }
      UserUtils.remberUser(username,password);
    }else{
      UserUtils.forgotUser();
    }
  }
});

Object.defineProperty(UserLogin,"autoCompleteLoginForm",{
  value:function(){
    $("body").css("background-color","#e7f6fd");
    var user = UserUtils.gotUser();
    if(user){
      $("#loginForm :input[name='username']").val(user.a);
      $("#loginForm :input[name='password']").val(user.b);
      $("#login-remeber")[0].checked = true;
    }
  }
});

Object.defineProperty(UserLogin,"init",{
  value:function(){
    var _self  = this;
      _self.autoCompleteLoginForm(); 
      Meteor.logout();
      Session.set("USERLOGINSUCCESS",false);
  }
});

Template.Login.rendered = function(){
    UserLogin.init();
}

Template.Login.events({
    "keydown input:password":function(e,t){
      if(e.keyCode !== 0 && e.keyCode !== 13){
        return;
      }
      UserLogin.submitLoginform(t);
    },
    "click #loginFormLoginBtn":function(e,t){
      UserLogin.submitLoginform(t);
    }
});

/*自动跳转到首页*/
Deps.autorun(function(){
    if(Session.get("USERLOGINSUCCESS") 
        && SessionManage.isCollectionCompleted(CONLLECTIONMAP.SVSE)
        &&SessionManage.isCollectionCompleted(CONLLECTIONMAP.SVSETREE)
      )
    {
      LoadingModal.loaded();
      Meteor.Router.to("/home");
    }
});

Deps.autorun(function(){
  if(!Meteor.user()){
      return;
  }
    
  if(!Meteor.user().profile.accountstatus){
    UserLogin.logout('你的账户已被禁止，请联系系统管理员');
  }
});