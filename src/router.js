/**
 * jQuery 模拟 vue-router
 */
(function($) {

  var router = {};
  var routeList = [];

  // 当前路由
  router.current = '';

  // beforeEach
  var beforeCallbacks = [];
  router.beforeEach = function(callback) {
    beforeCallbacks.push(callback);
  };

  // afterEach
  var afterCallbacks = [];
  router.beforeEach = function(callback) {
    afterCallbacks.push(callback);
  };

  // onError
  var errorCallbacks = [];
  router.onError = function(callback) {
    errorCallbacks.push(callback);
  };

  /**
   * addRoutes
   */
  router.addRoutes = function(routes) {
    $.each(routes, function(route) {
      routeList.push({
        path: path
      });
    });
  };

  /**
   * addRoute
   */
  router.addRoute = function(route) {
    routeList.push({
      path: route
    });
  };

  /**
   * push
   */
  router.push = function(route) {
    location.hash = router.resolve(route);
  };

  /**
   * replace
   */
  router.replace = function(route) {
    location.href.replace(/#.*/, router.resolve(route));
  };

  /**
   * back
   */
  router.back = function() {
    history.back();
  };

  /**
   * resolve route
   */
  router.resolve = function(route) {
    if (typeof route !== 'object') {
      route = { path: route };
    }

    var query = '';
    if (route.query) {
      query = '?' + Qs.stringify(route.query);
    }

    return '#' + route.path + query;
  };

  // event
  $(window).on('hashchange', function() {
    var path = location.hash.replace('#', '');

    console.log('change: ' + path);

    // root
    if (!path) {

    }

    // 路由匹配
    $.each(routeList, function(route) {

    });

    router.push('/dasss');

  });

  // export
  $.router = router;

})(jQuery);
