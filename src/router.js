/**
 * jQuery 模拟 vue-router
 */
(function ($) {

  var router = {};
  var routeList = [];

  // 当前路由
  router.current = '';

  // beforeEach
  var beforeCallbacks = [];
  router.beforeEach = function (callback) {
    beforeCallbacks.push(callback);
  };

  // afterEach
  var afterCallbacks = [];
  router.beforeEach = function (callback) {
    afterCallbacks.push(callback);
  };

  var errorCallbacks = [];
  router.onError = function (callback) {
    errorCallbacks.push(callback);
  };

  router.addRoutes = function (routes) {
    $.each(routes, function (route) {
      routeList.push({
        path: path
      });
    });
  };

  router.addRoute = function (route) {
    routeList.push({
      path: route
    });
  };

  router.push = function (route) {
    location.hash = router.resolveRoute(route);
  };

  router.replace = function (route) {
    location.href.replace(/#.*/, router.resolveRoute(route));
  };

  router.back = function () {
    history.back();
  };

  router.resolveRoute = function (route) {
    if (typeof route !== 'object') {
      route = {
        path: route
      };
    }

    var query = '';
    if (route.query) {
      query = '?' + Qs.stringify(route.query);
    }

    return '#' + route.path + query;
  };

  // event
  $(window).on('hashchange', function () {
    var path = location.hash.replace('#', '');


  });

  $.router = router;

})(jQuery);
