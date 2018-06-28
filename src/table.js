/**
 * 扩展，公共方法
 */
(function ($) {

  /**
   * 表格
   */
  $.fn.table = function (action, options) {
    var self = $(this);

    // id
    var id = self.prop('id');
    if (!id) {
      id = 'table-' + $.guid++;
      self.prop('id', id);
    }

    // lay-filter
    self.attr('lay-filter', id);

    // 绑定事件
    if (action === 'event' && arguments.length === 3) {
      self.data('event-' + arguments[1], arguments[2]);
      return
    }

    // reload
    if (action === 'reload') {
      self.data('table').reload(options || {});
      return;
    }

    // init
    if (typeof action === 'object') {
      options = action
    }

    // cols render
    options.cols.forEach(function (row) {
      row.forEach(function (item) {
        var source;
        if (item.template) {
          source = $(item.template).html();
          delete item.template;
        } else if (item.dict) {
          source = '{{ ' + item.field + ' | dict(\'' + item.dict + '\') }}';
          delete item.dict;

        } else if (item.filter) {
          source = '{{ ' + item.field + ' | ' + item.filter + ' }}';
          delete item.filter;
        } else if (item.source) {
          source = item.source;
          delete item.source;
        }

        // render
        if (source) {
          item.templet = function (data) {
            return layext.renderString(source, data);
          }
        }
      })
    });

    // done
    if (options.done) {
      var done = options.done;
      options.done = function () {
        done.apply(self.siblings('.layui-table-view'), arguments)
      }
    }

    options = $.extend({
      elem: self.get(0),
      method: 'POST',
      where: {},
      request: {
        pageName: 'page_num',
        limitName: 'page_size'
      },
      response: {
        statusName: 'layui_code',
        statusCode: 0,
        msgName: 'err_msg',
        countName: 'total',
        dataName: 'list'
      },
      cols: [[]],
      skin: 'row',
      even: true,
      page: true,
      limits: [10, 20, 30],
      limit: 10
    }, options);

    // render
    self.hide();
    var table = layui.table.render(options);
    self.data('table', table);

    // tool event
    layui.table.on('tool(' + id + ')', function (obj) {
      var callback = self.data('event-' + obj.event);
      callback && callback(obj.data, obj)
    });

    // return fn
    return this
  };
})(jQuery);
