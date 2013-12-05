Meteor.Router.add({
    '/': 'Login',
    '/index':'Login',
    '/login':'Login',
    '/home': 'body',
    '/testReport': "testReport",
    '*':"NoFound"
});

Meteor.Router.filters({
    requireLogin: function(page) {
      if (Meteor.user()) {
        return page;
      }else {
        return 'Login';
      }
    }
});

Meteor.Router.filter('requireLogin',{expect:["Login"]});

/*
Deps.autorun(function(c){
  var connectStatus = Meteor.status();
  if(connectStatus.retryCount && connectStatus.retryCount > 3){
      console.log(connectStatus.retryCount)
      console.log("与服务器链接断开 ，请刷新页面重试！")
      c.stop();
  }
})
*/