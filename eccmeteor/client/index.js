Meteor.Router.add({
    '/': 'Login',
    '/index':'Login',
    '/login':'Login',
    '/home': 'home',
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

