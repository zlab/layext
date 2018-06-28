/**
 * ajax
 */
(function ($) {

  /**
   * ajax 全局配置
   */
  $.ajaxSetup({
    type: 'POST',
    timeout: 15000,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    beforeSend: function (jqXHR, settings) {
      if (settings.type === 'POST') {
        if (!settings.url.startsWith('/')) {
          settings.url = '/' + settings.url
        }

        settings.url = layext.path.base + layext.path.api + settings.url;

        if (settings.contentType && settings.contentType.includes('json')) {
          settings.data = JSON.stringify(Qs.parse(settings.data))
        }
      }
    },
    converters: {
      'text json': function (text) {
        var json = JSON.parse(text + '');

        // table require
        json.layui_code = json.err_code || 0;

        return json;
      }
    }
  });

  /**
   * postJSON
   */
  var loadNum = 0;
  var loadIndex;
  var postJSON = function (url, data) {
    if (loadNum++ === 0) {
      loadIndex = layer.load()
    }

    // 数组转换
    if (data) {
      data = Qs.parse(Qs.stringify(data))
    }

    return $.ajax({
      url: url,
      data: data || {}
    }).then(function (json) {
      // 异常
      if (json.err_code) {
        return $.Deferred().reject(json).promise()
      }

      return json;
    }).always(function () {
      if (--loadNum === 0) {
        layer.close(loadIndex)
      }
    });
  };

  /**
   * global
   */
  $(document).ajaxSuccess(function (e, jqXHR, options, data) {
    if (options.type === 'POST' && options.dataType === 'json') {
      // 异常
      if (data.err_code) {
        if (data.err_code === '401' && layext.login) {
          layext.login();
        } else {
          layext.error(data.err_msg);
        }
      }
    }
  });

  /**
   * ajax异常处理
   */
  $(document).ajaxError(function (e, jqXHR) {
    var msg;
    if (jqXHR.status === 404) {
      msg = '页面不存在'
    } else if (jqXHR.status === 500) {
      msg = '服务器内部错误'
    } else if (jqXHR.status === 413) {
      msg = '上传文件大小超过限制'
    } else {
      msg = '服务器没有响应'
    }

    layext.error(msg)
  });

  // export
  layext.postJSON = postJSON;
})(jQuery);
