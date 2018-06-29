/**
 * 扩展，公共方法
 */
(function($) {
  var WebLoader = nunjucks.Loader.extend({
    async: true,
    init: function(opts) {
      // init
    },

    getSource: function(name, callback) {
      var url = name;

      if (!url.startsWith('/')) {
        url = '/' + url;
      }

      url = layext.path.base + '/module' + url + '.html';

      $.ajax(url, {
        type: 'GET',
        dataType: 'html'
      }).done(function(data, textStatus, jqXHR) {
        callback(null, {
          src: data,
          path: name,
          noCache: false
        });

      }).fail(function(jqXHR, textStatus, errorThrown) {
        callback(errorThrown);
      });
    }
  });

  var env = new nunjucks.Environment(new WebLoader());

  // 覆盖 table laytpl
  layui.laytpl = function(source) {
    return {
      render: function(data) {
        if (!source) {
          return '';
        }

        return env.renderString(source, data);
      }
    };
  };

  /**
   * 根据模版ID + 数据渲染
   *
   * @param template 模版
   * @param data 数据
   */
  function renderData(template, data) {
    var def = $.Deferred();

    // render
    env.render(template, data || {}, function(err, res) {
      if (err) {
        def.reject(err);
        throw new Error(err);
      } else {
        def.resolve(res);
      }
    });

    return def.promise();
  }

  /**
   * 加载数据，渲染
   * @param template 模版
   * @param url 请求数据
   * @param data postJSON参数
   */
  function render(template, url, data, filter) {
    // 本地数据渲染
    if (!url || typeof url === 'object') {
      return renderData(template, url);
    }

    // 异步数据渲染
    return layext.postJSON(url, data).then(function(json) {
      if (filter) {
        json = filter(json);
      }

      return renderData(template, json);
    });
  }

  /**
   * 日期格式化
   */
  env.addFilter('date', function(date, format) {
    if (!date) {
      return '';
    }

    format = format || 'date';

    if (format === 'date') {
      format = 'YYYY-MM-DD';
    } else if (format = 'datetime') {
      format = 'YYYY-MM-DD HH:mm:ss';
    }

    return moment(date).format(format);
  });

  /**
   * base
   */
  env.addFilter('base', function(path) {
    return layext.path.base + path;
  });

  /**
   * 字典
   */
  env.addFilter('dict', function(value, dictCode) {
    if (!value) return '';

    var dict = layext.dictList[dictCode];
    if (dict) return dict[value];
    return value;
  });

  // export
  $.extend(layext, {
    nunjucks: env,
    render: render,
    renderString: function(src, ctx) {
      return env.renderString(src, ctx);
    },
    addFilter: function(name, callback) {
      return env.addFilter(name, callback);
    }
  });
})(jQuery);
