/*!
 * mdreader 的核心 js 代码，负责页面的加载和功能定义
 * version 1.3
 * last update：2016/9/6
 * 
 * 依赖两个全局变量:
 * marked - marked.js: Markdown 语言解析库
 * hljs - highlight.pak.js: 语法高亮库
 */

// 将各基础方法添加到 app 命名空间，便于单元测试 ##################################################
(function(global) {

  /**
   * 通过 XMLHttp 下载文档资源
   * @param {string} src 资源地址
   * @param {boolean} [nocache] 是否下载最新资源，true 表示强制跳过本地缓存
   * @returns {string}
   */
  function ajax(src, nocache) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", src, false);  // 采用同步方式下载，没有使用异步的必要
    if (nocache) { xmlhttp.setRequestHeader("Cache-Control", "no-cache"); }
    xmlhttp.send();
    return xmlhttp.responseText;
  }

  /**
   * 提供一个切换类的工具方法
   * @param {HTMLElement} element 须切换类名的 DOM 元素
   * @param {String} className 类名
   */
  function toggleClass(element, className) {
    if (element.classList) {
      element.classList.toggle(className); // IE10 or higher
    } else {
      element.className = element.className.indexOf(className) === -1 ?
        element.className + " " + className :
        element.className.replace(className, "");
    }
  }

  /**
   * 根据文档标题自动生成目录导航，显示4级标题：h1 h2 h3 h4
   * @param {HTMLElement} source 需要生成目录的文档元素，实际使用为 #md 元素
   * @param {HTMLElement} target 存放生成的目录的元素，实际使用为 #outline 元素
   */
  function setContents(source, target) {
    var oldContents = target.firstElementChild;  // target 元素除了文本节点外，顶多只能包含1个div
    var contents = document.createElement("div");
    var nodes = source.getElementsByTagName("*");
    var headings = [];
    var index = 0;
    var reg = /H[1234]/;
    
    [].forEach.call(nodes, function(node) {
      if (reg.test(node.tagName)) { headings.push(node); }
    });

    headings.forEach(function(heading) {
      var id = "h-" + index;
      var a = document.createElement("a");

      index += 1;
      heading.id = id;
      a.href = "#" + id;
      a.textContent = heading.textContent;
      a.className = heading.tagName.toLowerCase();
      contents.appendChild(a);
    });

    if (oldContents) { target.removeChild(oldContents); }
    contents.style["max-height"] = (window.innerHeight - 36) + "px";
    target.appendChild(contents);
  }

  /**
   * 负责解析 md 文件并更新文档
   * @param {String} article 下载的 markdown 文档内容
   * @param {HTMLElement} target 存放 md 文档内容的容器元素，实际使用为 #md 元素
   */
  function loadMD(article, target) {

    // 解析 md 并插入文档
    target.innerHTML = marked(article);

    // 给文档代码设置高亮
    [].forEach.call(target.querySelectorAll("pre > code"), hljs.highlightBlock);

    // 通过重新生成 script 标签来执行 script 标签内容
    [].forEach.call(target.getElementsByTagName("script"), function(script){
      var newScript = document.createElement("script");
      if (script.src) {
        newScript.src = script.src;
      } else {
        newScript.innerHTML = script.innerHTML;
      }
      target.appendChild(newScript);
    });
  }

  global.app = {
    ajax: ajax,
    toggleClass: toggleClass,
    setContents: setContents,
    loadMD: loadMD,
    handler: {}                // 用于集中保存需测试的监听函数
  };

})(this);


// 初始化页面 #####################################################################################
window.addEventListener("DOMContentLoaded", function() {
  "use strict";

  // 统一列出对 index.html DOM元素的依赖
  var elem_main       = document.getElementsByTagName("main")[0];  // #md 容器
  var elem_md         = document.getElementById("md");             // markdown 文档容器
  var elem_tools      = document.getElementById("tools");          // 右上角按钮区
  var elem_outline    = document.getElementById("outline");        // 右上角按钮 - 页内标题导航
  var elem_sidemenu   = document.getElementById("sidemenu");       // 左侧菜单
  var elem_togglemenu = document.getElementById("togglemenu");     // 显示/关闭左侧菜单的按钮

  // 负责下载 md 文件并更新文档、目录索引及地址栏
  function loadPage(src, nocache) {
    var article = app.ajax(src, nocache);
    app.loadMD(article, elem_md);
    app.setContents(elem_md, elem_outline);    // 加载文档大纲
    if (elem_md.onload) { elem_md.onload(); }  // 笔记标注功能挂载在 onlaod，一个仿冒的监听函数
    location.hash = "!" + src;                 // 更新地址，采用的 hash bang 标准
  }

  var src = location.hash ? location.hash.slice(2) : (localStorage.getItem("currentPage") ||
      elem_sidemenu.getElementsByTagName("a")[0].getAttribute("href"));

  loadPage(src);

  // 记录最后一次打开的页面
  if (!localStorage.getItem("currentPage")) {
    localStorage.setItem("currentPage", src);
  }

  // 定义菜单开关按钮
  app.handler.togglemenu_click = function() {
    app.toggleClass(document.getElementById("sidemenu"), "show");
  };

  elem_togglemenu.addEventListener("click", app.handler.togglemenu_click);


  // 定义页面切换及菜单栏折叠功能
  app.handler.sidemenu_click = function(e) {
    var nextStyle;

    // 定义页面切换功能
    if (e.target.tagName === "A") {
      src = e.target.getAttribute("href");

      if (src !== localStorage.getItem("currentPage")) {
        loadPage(src);
        window.scrollTo(0, 0);
        localStorage.setItem("currentPage", src);
      } else {
        loadPage(src, true);
      }

      e.preventDefault();  // 阻止默认跳转页面的动作
    }

    // 定义菜单栏折叠功能，点击 h2 标题栏可折叠/展开该部分内容
    if (e.target.tagName.indexOf("H2") === 0) {
      nextStyle = e.target.nextElementSibling.style;
      nextStyle.display = nextStyle.display ? "" : "none";
      e.target.className = e.target.className ? "" : "collapse";
    }

    e.stopPropagation();
  };

  elem_sidemenu.addEventListener("click", app.handler.sidemenu_click);


  // 定义正文折叠功能 -- #md > h2 区块
  app.handler.md_click = function(e) {
    if (e.target.tagName === "H2") {
      var next = e.target.nextElementSibling;
      var reg = /h2|h1/i;
      while (!reg.test(next.tagName)) {
        next.style.display = next.style.display ? "" : "none";
        next = next.nextElementSibling;
        if (next === null) break;
      }
      app.toggleClass(e.target, "collapse");
      e.stopPropagation();
    }
  };

  elem_md.addEventListener("click", app.handler.md_click);

  // 对 hash 变化做出响应
  window.onhashchange = function(event) {
    if (event.newURL.indexOf("!") === -1) {  // 防止点击页内导航时修改网址
      location.href = event.oldURL;
    } else {                                 // 如果带 ! 而 hash 变化了就是点击了回退或前进按钮
      src = location.hash.slice(2);
      loadPage(src);
      localStorage.setItem("currentPage", src);
    }
  };
});


// 定义在页面上添加或删除标记(用淡紫色底色高亮显示)的功能，作为试验功能提供 #######################
window.addEventListener("DOMContentLoaded", function() {
  "use strict";

  var elem_markbutton = document.getElementById("mark");           // 右上角按钮 - 增/删标记
  var elem_md         = document.getElementById("md");             // markdown 文档容器
  var page, marks, html;

  /** 将所有标记高亮显示，如果有传入标记，就会将该标记去掉高亮显示 */
  function highlight() {

    // 每次 loadMD 加载文档时都会更新以下变量，其他函数就可以拿到最新内容
    page = location.hash;
    marks = JSON.parse( localStorage.getItem(page) || "[]" );
    html = elem_md.innerHTML;

    marks.forEach(function(mark) {
      html = html.replace(mark, '<del class="mark">$&</del>');
    });
    elem_md.innerHTML = html;
  }

  /** 去掉无效的标记内容 */
  function clean(){
    var changed = false;
    marks.forEach(function(mark, index){
      if (html.indexOf(mark) === -1){
        marks.splice(index, 1);
        changed = true;
      }
    });
    if (changed) { localStorage.setItem(page, JSON.stringify(marks)); }
  }

  /** 负责添加或删除标记 */
  function setMark(){
    var range = window.getSelection().getRangeAt(0);
    var container = document.createElement('div');
    var selection, markToRemove, i;

    container.appendChild(range.cloneContents());
    selection = container.innerHTML;

    elem_md.style.cursor = "";
    elem_md.removeEventListener("mouseup", setMark);

    if (selection === "") { return; }

    // 确定是要增加标记还是要删除标记
    for (i = 0; i < marks.length; i++) {
      if (marks[i].indexOf(selection) !== -1){
        markToRemove = (marks.splice(i, 1))[0];
        break;
      }
    }

    if (markToRemove) {
      html = html.replace('<del class="mark">' + markToRemove + '</del>', markToRemove);
    } else {
      marks.push(selection);
      html = html.replace(selection, '<del class="mark">$&</del>');
    }

    localStorage.setItem(page, JSON.stringify(marks));
    elem_md.innerHTML = html;
  }

  elem_markbutton.style.display = "";

  // 文档加载时初始化标记，通过将初始化函数挂载到 onload 供 loadMD 函数在文档加载完成后调用
  elem_md.onload = function initMark() {
    highlight();
    clean();
  };

  // 单击 “增/删标记” 按钮，鼠标会变成带问号箭头，选中文本即添加一个标记，如选择已有标记内容，则删除该标记
  elem_markbutton.onclick = function(){
    elem_md.style.cursor = "help";
    elem_md.addEventListener("mouseup", setMark);
  };
});
