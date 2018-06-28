/**
 * 文件上传
 */
(function ($) {

  var htmlSingle = '<div class="layui-form layui-col-space10" style="margin: 0;">' +
    '<div class="layui-upload-drag layui-col-md6">' +
    '  <i class="fa fa-cloud-upload fa-3x" style="color: #009688;"></i>' +
    '  <p>点击此处选择文件</p>' +
    '</div>' +
    '<div class="layui-col-md5">' +
    '<img src="" alt=""/>' +
    '</div>' +
    '<table class="layui-table layui-view" style="margin-top: 20px">' +
    '  <tbody>' +
    '    <tr>' +
    '      <td class="layui-td-label">文件名</td>' +
    '      <td>xxx.jpg</td>' +
    '      <td class="layui-td-label">文件大小</td>' +
    '      <td>600KB</td>' +
    '    </tr>' +
    '  </tbody>' +
    '</table>' +
    '<div class="layui-form-item">' +
    '    <div class="layui-input-block">' +
    '      <button type="button" class="layui-btn" lay-event="upload">上 传</button>' +
    '      <button type="button" class="layui-btn layui-btn-primary" lay-event="cancel">取 消</button>' +
    '    </div>' +
    '</div>' +
    '</div>';

  var htmlMulti = '<div class="layui-form">' +
    '<button type="button" class="layui-btn layui-btn-normal">选择文件</button>' +
    '<button type="button" class="layui-btn">开始上传</button>' +
    '<div class="layui-upload-list" style="padding-left: 10px">' +
    '    <table class="layui-table">' +
    '      <thead>' +
    '        <tr>' +
    '        <th>文件名</th>' +
    '        <th>大小</th>' +
    '        <th>状态</th>' +
    '        <th>操作</th>' +
    '        </tr>' +
    '      </thead>' +
    '      <tbody></tbody>' +
    '    </table>' +
    '</div>' +
    '<div class="layui-form-item">' +
    '    <div class="layui-input-block">' +
    '      <button type="button" class="layui-btn" lay-submit>确 定</button>' +
    '      <button type="button" class="layui-btn layui-btn-primary" lay-event="cancel">取 消</button>' +
    '    </div>' +
    '</div></div>';

  // $
  $.fn.upload = function (action) {
    var self = $(this);

    // render
    if (typeof action === 'object') {
      var inst = layui.upload.render($.extend({
        elem: self.get(0),
        url: layext.path.upload,
        method: 'POST',
        field: 'file',
        accept: 'file', // images, file
        // exts: 'zip|rar|7z', // zip|rar|7z
        // size: '',
        multiple: false,
        number: 0,
        auto: false
        // bindAction: ''
      }, action));

      // 挂载
      self.data('upload', inst);

      return self;
    } else if (action === '') {

    }

  };

  // export
  layext.upload = function (options) {

    var def = $.Deferred();

    htmlSingle = layext.renderString(htmlSingle, {});

    layer.open({
      type: 1,
      anim: -1,
      isOutAnim: false,
      shadeClose: false,
      scrollbar: false,
      title: '文件上传',
      content: options.multi ? htmlMulti : htmlSingle,
      area: options.multi ? '600px' : '450px',
      success: function (elem, dialog) {
        var upload = elem.find('.layui-upload-drag').upload({
          choose: function (obj) {
            // console.log(obj)
          },
          before: function (obj) {
            //  console.log(obj);

            layer.load();
          },
          done: function (json, index, upload) {
            // console.log(json)

            layer.closeAll('loading');

            // 异常
            if (!json.err_code) {
              layer.close(dialog);
              def.resolve(json.url);
            }
          },
          error: function (index, upload) {
            layer.closeAll('loading');
          }
        });

        elem.find('.layui-form').form('event', 'upload', function (e) {
          upload.data('upload').upload();
        });
      }
    });

    return def.promise();
  }

})(jQuery);
