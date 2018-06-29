/**
 * layext
 */
(function($) {

  window.$ = undefined;

  // export
  window.layext = {
    query: Qs.parse(location.search.substr(1)),
    dictList: {},
    path: {
      base: '',
      api: '/api',
      upload: '/frame/upload'
    },
    pathToId: function(path) {
      return path.replace(/\//g, '-')
        .replace(/([A-Z])/g, '-$1')
        .replace(/^-/, '')
        .replace(/-$/, '')
        .replace(/--/, '-')
        .toLowerCase();
    },
    define: function(module, callback) {
      layui.define(function(exports) {
        exports(module, callback);
      });
    },
    require: function(module) {
      var id = 'scope-' + this.pathToId(module);
      layui.use(module, function(callback) {
        var scope = $('#' + id);
        var form = scope.find('.layui-form:not(.layui-table-view):first');
        var table = scope.find('table:first');
        callback({
          scope: scope,
          form: form,
          table: table
        });
      });
    },
    config: function(type, options) {
      var self = this;
      options = options || {};

      // 递归
      if (typeof type === 'object') {
        $.each(type, function(k, v) {
          self.config(k, v);
        });
        return;
      }

      if (type === 'table') {
        layui.table.set(options);
      } else if (type === 'dict') {
        self.dictList = options;
      } else if (type === 'login') {
        self.login = options;
      } else if (type === 'path') {
        $.extend(self.path, options);

        // layui
        layui.config({
          base: self.path.base + '/module/'
        });

        // template
        self.nunjucks.addGlobal('baseUrl', self.path.base);
      } else if (type === 'filter') {
        $.each(options, function(k, v) {
          self.addFilter(k, v);
        });
      }
    }
  };
})(jQuery);
