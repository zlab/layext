/**
 * jQuery 模拟 vue-router
 */
(function($) {

  var router = {};

  // 当前路由
  router.current = '';

  // config
  router.config = function(options) {
    router.defaultRoute = options.defaultRoute || '/';
    router.onChange = options.onChange;

    $(window).trigger('hashchange');
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
    var path = router.resolve(route);
    location.replace(location.pathname + location.search + path);
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

    // root
    if (!path) {
      return router.replace(router.defaultRoute);
    }

    var parts = path.split('?');
    path = parts[0];

    var query = {};
    if (parts.length === 2) {
      query = Qs.parse(parts[1]);
    }

    router.current = {
      path: path,
      query: query
    };

    router.onChange(router.current);
  });

  // export
  $.router = router;

})(jQuery);
