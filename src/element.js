/**
 * 扩展，公共方法
 */
(function ($) {

  // 关闭弹窗
  $(document).on('click', '.layui-btn[lay-event=cancel]', function (e) {
    $(this).closest('.layui-layer-content').dialog('cancel')
  });

  // 表单重置
  $(document).on('click', ' .layui-btn[lay-event=reset]', function () {
    $(this).closest('.layui-form').find('input,select').val('')
  });

  /**
   * $(xxx).load
   */
  $.fn.load = function (template, url, data) {
    var self = $(this);
    return layext.render(template, url, data).then(function (html) {
      return self.html(html);
    });
  };

  $.fn.form = function (method, name, callback) {
    var form = $(this);
    var submit = $(this).find('[lay-submit]');
    var filter = submit.attr('lay-filter');
    if (!filter) {
      filter = 'lay-submit-' + $.guid++;
      submit.attr('lay-filter', filter)
    }

    layui.form.render();

    // event
    if (method === 'event') {

      // submit
      if (name === 'submit') {
        if (callback) {

          // 回车事件
          form.keydown(function (event) {
            if (event.keyCode === 13) {
              form.form('event', 'submit');
            }
          });

          // submit event
          layui.form.on('submit(' + filter + ')', function (data) {
            callback(data.field, data.elem, form);
            return false;
          });
        } else {
          setTimeout(function () {
            submit.trigger('click');
          }, 0)
        }
      } else if (callback) {
        // lay-event
        form.find('.layui-btn[lay-event=' + name + ']').click(function (e) {
          callback.call(form, e)
        })
      }
    }
  }
})(jQuery);
