Meteor.Router.add({
    '/': 'Login',
    '/index':'Login',
    '/login':'Login',
    '/home': 'body',
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

