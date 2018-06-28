/**
 * 扩展，公共方法
 */
(function ($) {
  /**
   * 弹出对话框
   *
   * @param template 模版
   * @param url 初始化数据
   * @param data postJSON参数
   * @returns {*}
   */
  var cache = {};
  var showDialog = function (options) {
    var def = $.Deferred();

    // 对话框传参
    if (options.local) {
      options.filter = function (json) {
        return $.extend({}, options.local, json)
      }
    }

    var tplDef;

    // 本地模版
    if (!options.template && options.content) {
      tplDef = $.Deferred().resolve(options.content).promise();
    } else {
      // render template
      tplDef = layext.render(options.template, options.url, options.data, options.filter);
    }

    // 弹出对话框
    tplDef.done(function (html) {
      var id;

      if (options.template) {
        id = 'scope-' + options.template.replace(/.+\//, '');
      } else {
        id = 'dialog-' + (options.id || $.guid++);
      }

      var index = layer.open($.extend({
        id: id,
        type: 1,
        skin: 'layui-layer-dialog',
        anim: -1,
        isOutAnim: false,
        shadeClose: false,
        content: html,
        btnAlign: 'c',
        scrollbar: false,
        success: function (elem, index) {
          elem.find('#' + id).addClass('scope-container');

          layui.form.render();
        },
        cancel: function () {
          def.reject()
        }
      }, options));

      cache[index] = def
    });

    return def.promise();
  };

  // extend
  $.fn.dialog = function (method, data) {
    var index = $(this).closest('.layui-layer').attr('times');
    layer.close(index);

    if (method === 'cancel') {
      cache[index] && cache[index].reject();
    } else if (method === 'confirm') {
      cache[index] && cache[index].resolve(data);
    }
  };

  // export
  $.extend(layext, {
    dialog: showDialog,
    error: function (msg) {
      layer.msg(msg, {icon: 5})
    },
    info: function (msg) {
      layer.msg(msg, {icon: 6, time: 1000})
    },
    alert: function (content, options, yes) {
      if (typeof options === 'function') {
        yes = options;
        options = {}
      }

      options = $.extend({title: '提示', shadeClose: true}, options);
      return layer.alert(content, options, yes)
    },
    confirm: function (content, options) {
      var def = $.Deferred();

      options = $.extend({title: '操作提示', shadeClose: true}, options);
      layer.confirm(content, options, function (index) {
        layer.close(index);
        def.resolve()
      });

      /* layer.open($.extend({
        type: 1,
        title: '操作提示',
        content: content,
        skin: 'layui-layer-dialog',
        anim: -1,
        isOutAnim: false,
        shadeClose: true,
        scrollbar: false,
        btn: ['确定', '取消'],
        yes: function (index) {
          layer.close(index);

          def.resolve(function () {
            layer.close(index)
          })
        },
        btn2: function (index) {
          def.reject()
        },
        success: function (elem, index) {
        },
        cancel: function () {
          def.reject()
        }
      }, options)); */

      return def.promise();
    }
  });
})(jQuery);
