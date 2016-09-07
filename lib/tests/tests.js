(function($){
"use strict";

QUnit.module("基础方法", function(hooks) {
  var $qf = $('#qunit-fixture');
  
  hooks.beforeEach(function(assert) {
    assert.ok(app, "存在 app 全局对象");
  });

  QUnit.test("ajax", function(assert) {
    var text = app.ajax("tests.js");

    assert.ok(/^http/.test(location.href), "已经开启服务器并通过 http 协议访问");
    assert.ok(text, "可以正常同步下载资源");
  });

  QUnit.test("toggleClass", function(assert) {
    $qf.html('<div class="class1 class2 class3"></div>');
    var $div = $qf.children().first();

    app.toggleClass($div[0], "class2");
    assert.notOk($div.hasClass("class2"), "能够正常移除一个类");

    app.toggleClass($div[0], "class2");
    assert.ok($div.hasClass("class2"), "能够正常添加一个类");
  });

  QUnit.test("setContents", function(assert) {
    $qf.html('<div id="tools"><div id="outline">索引</div></div>' +
             '<main><article id="md"><h1>标题1</h1><h2>标题2</h2></article></main>');
    var $target = $('#outline');
    var $source = $('#md');

    app.setContents($source[0], $target[0]);
    assert.equal($('#h-1').length, 1, "能够正常设定标题的锚点");
    assert.equal($('.h1').length, 1, "能够正常生成索引项目");
    assert.equal($('.h1').attr('href'), "#h-0", "能够正常设定索引项目的 href 属性");
    assert.equal($('.h1').text(), "标题1", "能够正常设定索引项目的内容");

    app.setContents($source[0], $target[0]);
    assert.equal($target.children().length, 1, "重复生成索引时，能够移除老的索引列表");

    assert.ok($target.children()[0].style.maxHeight, "设定了索引列表的最大高度");
  });

  QUnit.test("loadMD", function(assert) {
    var article = "# 标题1 \n" +
                  "```js \n var i = 0; \n ``` \n " +
                  "<script>window.app.testflag = 2;</script>";

    assert.ok(window.marked, "页面引入了依赖组件 marked.js");
    assert.ok(window.hljs, "页面引入了依赖组件 highlight.pak.js");

    app.loadMD(article, $qf[0]);
    assert.equal($qf.html().indexOf("<h1"), 0, "能正常解析并加载文档");
    assert.ok($qf.find('pre>code').hasClass("hljs"), "能正常高亮代码");
    assert.equal(app.testflag, 2, "<script>标签内代码能够执行");
    if (app.testflag) { delete app.testflag; }
  });
});

/**
 * 开始实际页面加载测试，
 * 要求测试前将项目入口 index.html 文件中 <body> 内的内容
 * 拷贝到测试入口文件 index.html 中的 <div id="qunit-fixture"> 容器内
 */
QUnit.module("页面加载", function(hooks) {

  QUnit.module("文档依赖", function(hooks) {
    QUnit.test("存在文档容器 main>#md", function( assert ) {
      assert.equal($('main>#md').length, 1);
    });

    QUnit.test("存在左侧菜单容器并已正确配置", function( assert ) {
      assert.equal($('#sidemenu').length, 1, "存在左侧菜单容器 #sidemenu");
      assert.equal($('#togglemenu').length, 1, "存在菜单开关按钮 togglemenu");
      assert.notOk(/\s/g.test($('#togglemenu').html()), "菜单开关按钮代码不能出现空格");
    });

    QUnit.test("存在索引显示容器 #tools>#outline", function( assert ) {
      assert.equal($('#tools>#outline').length, 1);
    });

    QUnit.test("菜单栏链接避免以‘/’开头(方便部署到站点子目录)", function( assert ) {
      assert.notEqual($('#sidemenu a:first').attr('href').indexOf("/"), 0);
      assert.notEqual($('#sidemenu a:last' ).attr('href').indexOf("/"), 0);
    });
  });

  // TODO: 只是大概测了下，并不是很理想，暂时不知道如何更好地测试
  QUnit.test("加载文档内容并更新地址", function(assert) {

    assert.notEqual($('#md').text(), "", "能够正常加载文档");
    assert.equal($('#outline>div').length, 1, "设置了文档索引");
    assert.notEqual(location.hash, "", "更新了地址栏");
  });
});


QUnit.module("功能测试", function(hooks) {
  QUnit.test("页面切换 - 不同浏览器表现不一，如报错请再手动测试看看", function(assert){
    var done = assert.async();
    var contents1, contents2;   // 通过测试索引栏变化判断是否完成页面切换
    $('#sidemenu').click(app.handler.sidemenu_click);

    assert.ok($('#sidemenu a').length > 1, "该测试需要至少提供2个文件链接");

    $('#sidemenu a')[0].click();
    setTimeout(function() {
      contents1 = $('#outline').html();

      $('#sidemenu a')[1].click();
      setTimeout(function() {
        contents2 = $('#outline').html();
        assert.equal(contents1, contents2, "点击不同链接，能够实现页面切换");
        done();
      });
    });
  });

  QUnit.test("菜单栏开关", function(assert) {
    var done = assert.async();
    $('#togglemenu').click(app.handler.togglemenu_click);

    $('#togglemenu').click();
    setTimeout(function() {
      assert.ok($('#sidemenu').hasClass('show'), "能够打开菜单栏");

      $('#togglemenu').click();
      setTimeout(function() {
        assert.ok(!$('#sidemenu').hasClass('show'), "能够关闭菜单栏");
        done();
      });
    });
  });

  QUnit.test("菜单折叠", function(assert){
    var done = assert.async();
    $('#sidemenu').html('<h2>菜单栏标题</h2><div></div>');
    $('#sidemenu').click(app.handler.sidemenu_click);

    $('#sidemenu h2').click();
    setTimeout(function() {
      assert.ok($('#sidemenu h2').hasClass('collapse') &&
        $('#sidemenu div').css('display') === "none", "点击标题能够折叠菜单明细");

      $('#sidemenu h2').click();
      setTimeout(function() {
        assert.notOk($('#sidemenu h2').hasClass('collapse') ||
          $('#sidemenu div').css('display') === "none", "再次点击标题能够展开菜单明细");
         done();
      });
    });
  });

  QUnit.test("正文H2折叠", function(assert) {
    var done = assert.async();
    $('#md').html('<h2>二级标题</h2><div>div</div><p>p</p>' +
                  '<h2>二级标题</h2><p>p</p><h1>一级标题</h1>');
    $('#md').click(app.handler.md_click);

    $('#md h2:first').click();
    setTimeout(function() {
      assert.ok($('#md h2:first').hasClass('collapse') &&
        $('#md div').css('display') === "none" &&
        $('#md p').css('display') === "none", "点击二级标题能够折叠明细");

      assert.notOk($('#md h2:last').hasClass('collapse') ||
        $('#md p:last').hasClass('collapse') ||
        $('#md h1').hasClass('collapse'), "点击二级标题后续二级标题、一级标题不受影响");

      $('#md h2').click();
      setTimeout(function() {
        assert.ok(!$('#md h2:first').hasClass('collapse') &&
          $('#md h2:last').hasClass('collapse') &&
          $('#md div').css('display') !== "none" &&
          $('#md p').css('display') !== "none", "再次点击二级标题能够正常展开明细");
        done();
      });
    });
  });

  QUnit.test("记录最后访问页", function(assert) {
    var done = assert.async();
    var item1, item2, href;
    $('#sidemenu').click(app.handler.sidemenu_click);

    assert.ok($('#sidemenu a').length > 1, "该测试需要至少提供2个文件链接");

    $('#sidemenu a')[0].click();
    setTimeout(function() {
      item1 = localStorage.getItem("currentPage");

      $('#sidemenu a')[1].click();
      setTimeout(function() {
        item2 = localStorage.getItem("currentPage");
        href = $('#sidemenu a').eq(1).attr('href');
        assert.equal(item2, href, "能够正确设定访问页面的地址");
        assert.notEqual(item2, item1, "每次切换页面都能够保存访问页面的地址");
        done();
      });
    });
  });

  QUnit.test("hash 监控", function(assert) {
    var done = assert.async();
    var oldhash = location.hash;

    location.hash = "someid";
    setTimeout(function() {
      assert.equal(location.hash, oldhash, "能够自动屏蔽标签跳转对 location.hash 的修改");
      done();
    });
  });
});

QUnit.module("笔记标注", function(hooks) {
  QUnit.skip("此为试验功能，暂未添加测试");
});

})(jQuery);
