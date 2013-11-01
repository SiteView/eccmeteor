(function () {

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// packages/router/tests/router_server_tests.js                               //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
                                                                              //
// XXX: is it OK to assume localhost:3000 here?                               // 1
//                                                                            // 2
// it seems that stream does in it's tests.                                   // 3
                                                                              // 4
// Force serving before Meteor fully starts                                   // 5
Meteor.Router._start();                                                       // 6
                                                                              // 7
Tinytest.add("Simple Router.serve", function(test) {                          // 8
  Meteor.Router.add('/server/foo', function() {                               // 9
    return 'data';                                                            // 10
  });                                                                         // 11
                                                                              // 12
  Meteor.Router.add(/server\/page\/(\d+)/, function(number) {                 // 13
    return [number, 'page'];                                                  // 14
  });                                                                         // 15
                                                                              // 16
  var resp = Meteor.http.get(Meteor.absoluteUrl('server/foo'));               // 17
  test.equal(resp.content, 'data');                                           // 18
                                                                              // 19
  var resp = Meteor.http.get(Meteor.absoluteUrl('server/page/7'));            // 20
  test.equal(resp.statusCode, 7);                                             // 21
  test.equal(resp.content, 'page');                                           // 22
});                                                                           // 23
                                                                              // 24
Tinytest.add("Router.serve with params", function(test) {                     // 25
  Meteor.Router.add('/server/bar/:id.xml', function(id) {                     // 26
    return id;                                                                // 27
  })                                                                          // 28
                                                                              // 29
  var resp = Meteor.http.get(Meteor.absoluteUrl('server/bar/content.xml'));   // 30
  test.equal(resp.content, 'content');                                        // 31
});                                                                           // 32
                                                                              // 33
                                                                              // 34
Tinytest.add("Router.serve various response types", function(test) {          // 35
  Meteor.Router.add({                                                         // 36
    '/server/baz-1': [201, {'x-my-header': 'Baz'}, 'data'],                   // 37
    '/server/baz-2': [202, 'data'],                                           // 38
    '/server/baz-3': ['data'],                                                // 39
    '/server/baz-4': 203,                                                     // 40
    '/server/baz-5': 'data'                                                   // 41
  });                                                                         // 42
                                                                              // 43
  var resp = Meteor.http.get(Meteor.absoluteUrl('server/baz-1'));             // 44
  test.equal(resp.statusCode, 201);                                           // 45
  test.equal(resp.content, 'data');                                           // 46
  test.equal(resp.headers['x-my-header'], 'Baz');                             // 47
                                                                              // 48
  // grab it again to make sure we aren't messing with it                     // 49
  var resp = Meteor.http.get(Meteor.absoluteUrl('server/baz-1'));             // 50
  test.equal(resp.statusCode, 201);                                           // 51
  test.equal(resp.content, 'data');                                           // 52
  test.equal(resp.headers['x-my-header'], 'Baz');                             // 53
                                                                              // 54
  var resp = Meteor.http.get(Meteor.absoluteUrl('server/baz-2'));             // 55
  test.equal(resp.statusCode, 202);                                           // 56
  test.equal(resp.content, 'data');                                           // 57
                                                                              // 58
  var resp = Meteor.http.get(Meteor.absoluteUrl('server/baz-3'));             // 59
  test.equal(resp.content, 'data');                                           // 60
                                                                              // 61
  var resp = Meteor.http.get(Meteor.absoluteUrl('server/baz-4'));             // 62
  test.equal(resp.statusCode, 203);                                           // 63
                                                                              // 64
  var resp = Meteor.http.get(Meteor.absoluteUrl('server/baz-5'));             // 65
  test.equal(resp.content, 'data');                                           // 66
});                                                                           // 67
                                                                              // 68
                                                                              // 69
Tinytest.add("Router.serve with futures", function(test) {                    // 70
  Meteor.Router.add('/server/delayed', function() {                           // 71
    var Future = (typeof(Npm) == "undefined") ? __meteor_bootstrap__.require("fibers/future") : Npm.require("fibers/future");
    var fut = new Future();                                                   // 73
    setTimeout(function() {                                                   // 74
      fut.return('foo-in-timeout');                                           // 75
    }, 1);                                                                    // 76
                                                                              // 77
    return fut.wait();                                                        // 78
  });                                                                         // 79
                                                                              // 80
  var resp = Meteor.http.get(Meteor.absoluteUrl('server/delayed'));           // 81
  test.equal(resp.content, 'foo-in-timeout');                                 // 82
});                                                                           // 83
                                                                              // 84
                                                                              // 85
Tinytest.add("Router.serve without http method restriction", function(test) { // 86
  Meteor.Router.add('/bat-1', 'data');                                        // 87
  var resp = Meteor.http.get(Meteor.absoluteUrl('bat-1'));                    // 88
  test.equal(resp.content, 'data');                                           // 89
  var resp = Meteor.http.post(Meteor.absoluteUrl('bat-1'));                   // 90
  test.equal(resp.content, 'data');                                           // 91
});                                                                           // 92
                                                                              // 93
                                                                              // 94
Tinytest.add("Router.serve with http method restriction", function(test) {    // 95
  Meteor.Router.add('/bat-2', 'GET', 'data');                                 // 96
  Meteor.Router.add('/bat-2', 'POST', 'postdata');                            // 97
  var resp = Meteor.http.get(Meteor.absoluteUrl('bat-2'));                    // 98
  test.equal(resp.content, 'data');                                           // 99
  var resp = Meteor.http.post(Meteor.absoluteUrl('bat-2'));                   // 100
  test.equal(resp.content, 'postdata');                                       // 101
  var resp = Meteor.http.put(Meteor.absoluteUrl('bat-2'));                    // 102
  test.notEqual(resp.content, 'postdata');                                    // 103
  test.notEqual(resp.content, 'data');                                        // 104
});                                                                           // 105
                                                                              // 106
////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// packages/router/tests/router_common_tests.js                               //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
                                                                              //
Tinytest.add("Route basics", function(test) {                                 // 1
  var route = new Meteor.Router.Route('/posts/:_id');                         // 2
                                                                              // 3
  var params = {};                                                            // 4
  test.equal(route.match('/posts/7', null, params), true);                    // 5
  test.equal(params._id, '7');                                                // 6
                                                                              // 7
  params = {};                                                                // 8
  test.equal(route.match('/posts/', null, params), false);                    // 9
  test.equal(params, {});                                                     // 10
                                                                              // 11
  test.equal(route.pathWithContext({_id: 10}), '/posts/10');                  // 12
  test.equal(route.pathWithContext(10), '/posts/10');                         // 13
});                                                                           // 14
////////////////////////////////////////////////////////////////////////////////

}).call(this);
