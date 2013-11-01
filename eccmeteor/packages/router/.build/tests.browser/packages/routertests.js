(function () {

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/router/tests/router_client_tests.js                                 //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
Tinytest.add("Router page", function(test) {                                    // 1
  Meteor.Router.resetFilters();                                                 // 2
  Meteor.Router.add({                                                           // 3
    '/foo': 'foo',                                                              // 4
    '/bar/:id': function(id) {                                                  // 5
      Session.set('id', id);                                                    // 6
      return 'bar';                                                             // 7
    }                                                                           // 8
  });                                                                           // 9
  Meteor.Router.add(/page\/(\d+)/, function(number) {                           // 10
    Session.set('pageNo', number);                                              // 11
    return 'page';                                                              // 12
  });                                                                           // 13
                                                                                // 14
  test.equal(Meteor.Router.page(), null);                                       // 15
                                                                                // 16
  Meteor.Router.to('/foo');                                                     // 17
  test.equal(Meteor.Router.page(), 'foo');                                      // 18
                                                                                // 19
  Meteor.Router.to('/bar/1');                                                   // 20
  test.equal(Meteor.Router.page(), 'bar');                                      // 21
  test.equal(Session.get('id'), '1');                                           // 22
                                                                                // 23
  Meteor.Router.to('/page/7');                                                  // 24
  test.equal(Meteor.Router.page(), 'page');                                     // 25
  test.equal(Session.get('pageNo'), '7');                                       // 26
});                                                                             // 27
                                                                                // 28
Tinytest.add("Router reactivity", function(test) {                              // 29
  var context_called = 0;                                                       // 30
  Meteor.Router.resetFilters();                                                 // 31
  Meteor.Router.add({                                                           // 32
    '/foo': 'foo',                                                              // 33
    '/bar': 'bar',                                                              // 34
    '/bar/2': function() {                                                      // 35
      // do something unrelated                                                 // 36
      Session.set('router-test-page', 2);                                       // 37
      return 'bar';                                                             // 38
    }                                                                           // 39
  })                                                                            // 40
                                                                                // 41
  Meteor.autorun(function() {                                                   // 42
    Meteor.Router.page();                                                       // 43
    context_called += 1;                                                        // 44
  });                                                                           // 45
                                                                                // 46
  test.equal(context_called, 1);                                                // 47
                                                                                // 48
  Meteor.Router.to('/foo')                                                      // 49
  Meteor.flush()                                                                // 50
  test.equal(context_called, 2);                                                // 51
                                                                                // 52
  Meteor.Router.to('/bar')                                                      // 53
  Meteor.flush()                                                                // 54
  test.equal(context_called, 3);                                                // 55
                                                                                // 56
  // returns 'bar' to shouldn't trigger reactivity                              // 57
  Meteor.Router.to('/bar/2')                                                    // 58
  Meteor.flush()                                                                // 59
  test.equal(context_called, 3);                                                // 60
});                                                                             // 61
                                                                                // 62
Tinytest.add("Router filtering", function(test) {                               // 63
  Meteor.Router.resetFilters();                                                 // 64
  Meteor.Router.add({                                                           // 65
    '/foo': 'foo',                                                              // 66
    '/bar': 'bar',                                                              // 67
    '/baz': 'baz'                                                               // 68
  })                                                                            // 69
                                                                                // 70
  Meteor.Router.filters({                                                       // 71
    'something_else': function() { return 'something_else'; },                  // 72
    'third': function() { return 'a third thing' }                              // 73
  })                                                                            // 74
  Meteor.Router.filter('something_else', {only: 'foo'});                        // 75
  Meteor.Router.filter('third', {except: ['something_else', 'baz']});           // 76
                                                                                // 77
  Meteor.Router.to('/foo');                                                     // 78
  test.equal(Meteor.Router.page(), 'something_else');                           // 79
                                                                                // 80
  Meteor.Router.to('/bar');                                                     // 81
  test.equal(Meteor.Router.page(), 'a third thing');                            // 82
                                                                                // 83
  Meteor.Router.to('/baz');                                                     // 84
  test.equal(Meteor.Router.page(), 'baz');                                      // 85
});                                                                             // 86
                                                                                // 87
Tinytest.add("FilteredRouter filter reactivity", function(test) {               // 88
  Meteor.Router.resetFilters();                                                 // 89
  Meteor.Router.add('/foo', 'foo');                                             // 90
                                                                                // 91
  Meteor.Router.filters({                                                       // 92
    'something_else': function(page) {                                          // 93
      if (Session.get('something_else')) {                                      // 94
        return 'something_else';                                                // 95
      } else {                                                                  // 96
        return page;                                                            // 97
      }                                                                         // 98
    }                                                                           // 99
  });                                                                           // 100
  Meteor.Router.filter('something_else');                                       // 101
                                                                                // 102
  Session.set('something_else', null);                                          // 103
  Meteor.flush();                                                               // 104
  Meteor.Router.to('/foo');                                                     // 105
  test.equal(Meteor.Router.page(), 'foo');                                      // 106
                                                                                // 107
  Session.set('something_else', true);                                          // 108
  Meteor.flush();                                                               // 109
  test.equal(Meteor.Router.page(), 'something_else');                           // 110
});                                                                             // 111
                                                                                // 112
Tinytest.add("Router named route helpers", function(test) {                     // 113
  Meteor.Router.resetFilters();                                                 // 114
  Meteor.Router.add('/named/:arg', 'named');                                    // 115
                                                                                // 116
  test.equal(Meteor.Router.namedPath({arg: 7}), '/named/7');                    // 117
  test.equal(Meteor.Router.namedUrl(7), Meteor.absoluteUrl('named/7'));         // 118
                                                                                // 119
  Meteor.Router.to('named', {arg: 7});                                          // 120
  Meteor.flush();                                                               // 121
  test.equal(Meteor.Router.page(), 'named');                                    // 122
});                                                                             // 123
                                                                                // 124
Tinytest.add("Router different argument formats", function(test) {              // 125
  Meteor.Router.resetFilters();                                                 // 126
  Meteor.Router.add({                                                           // 127
    '/route1': 'page1',                                                         // 128
    '/route2': function() { return 'page2'; },                                  // 129
    '/route3': {to: 'page3', and: function() { Session.set('foo', 'page3'); }}, // 130
    '/route4': {to: 'page4', as: 'route4'},                                     // 131
  });                                                                           // 132
                                                                                // 133
  // simple one                                                                 // 134
  Meteor.Router.to('page1');                                                    // 135
  Meteor.flush();                                                               // 136
  test.equal(Meteor.Router.page(), 'page1');                                    // 137
                                                                                // 138
  // no named route exists                                                      // 139
  test.throws(function() {                                                      // 140
    Meteor.Router.to('page2');                                                  // 141
  })                                                                            // 142
                                                                                // 143
  // slightly more complex                                                      // 144
  Meteor.Router.to('page3');                                                    // 145
  Meteor.flush();                                                               // 146
  test.equal(Meteor.Router.page(), 'page3');                                    // 147
  test.equal(Session.get('foo'), 'page3');                                      // 148
                                                                                // 149
  test.throws(function() {                                                      // 150
    Meteor.Router.to('page4');                                                  // 151
  });                                                                           // 152
  test.equal(Meteor.Router.route4Path(), '/route4');                            // 153
  Meteor.Router.to('route4');                                                   // 154
  Meteor.flush();                                                               // 155
  test.equal(Meteor.Router.page(), 'page4');                                    // 156
});                                                                             // 157
                                                                                // 158
Tinytest.add("Router before routing", function(test) {                          // 159
  var beforeCalled = false;                                                     // 160
                                                                                // 161
  Meteor.Router.resetFilters();                                                 // 162
  Meteor.Router.add('/before', 'before');                                       // 163
  Meteor.Router.beforeRouting = function() {                                    // 164
    beforeCalled = true;                                                        // 165
  }                                                                             // 166
                                                                                // 167
  test.equal(beforeCalled, false);                                              // 168
  Meteor.Router.to('/before');                                                  // 169
  test.equal(beforeCalled, true);                                               // 170
});                                                                             // 171
                                                                                // 172
Tinytest.add("Router before routing interrupt", function(test) {                // 173
  var beforeCalled = false;                                                     // 174
                                                                                // 175
  Meteor.Router.resetFilters();                                                 // 176
                                                                                // 177
  Meteor.Router.beforeRouting = function() {                                    // 178
	// a method (i.e. returns undefined) should not interrupt routing              // 179
  }                                                                             // 180
                                                                                // 181
  Meteor.Router.to('/route1');                                                  // 182
  Meteor.flush();                                                               // 183
  test.equal(Meteor.Router.page(), 'page1');                                    // 184
                                                                                // 185
  Meteor.Router.beforeRouting = function() {                                    // 186
	// returning false should interrupt (block) routing                            // 187
	return false;                                                                  // 188
  }                                                                             // 189
                                                                                // 190
  Meteor.Router.to('/route2');                                                  // 191
  test.equal(Meteor.Router.page(), 'page1');                                    // 192
});                                                                             // 193
//////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/router/tests/router_common_tests.js                                 //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
Tinytest.add("Route basics", function(test) {                                   // 1
  var route = new Meteor.Router.Route('/posts/:_id');                           // 2
                                                                                // 3
  var params = {};                                                              // 4
  test.equal(route.match('/posts/7', null, params), true);                      // 5
  test.equal(params._id, '7');                                                  // 6
                                                                                // 7
  params = {};                                                                  // 8
  test.equal(route.match('/posts/', null, params), false);                      // 9
  test.equal(params, {});                                                       // 10
                                                                                // 11
  test.equal(route.pathWithContext({_id: 10}), '/posts/10');                    // 12
  test.equal(route.pathWithContext(10), '/posts/10');                           // 13
});                                                                             // 14
//////////////////////////////////////////////////////////////////////////////////

}).call(this);
