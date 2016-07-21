(function() {

  // 定义 loadmd 下载函数，负责下载 md 文件并更新文档
  function loadmd(src, nocache) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", src, false);
    if (nocache) {
      xmlhttp.setRequestHeader("Cache-Control", "no-cache");
    }
    xmlhttp.send();

    // 解析 md 并插入文档（顺便给所有表格套了个 div.responsive）
    document.getElementById("md").innerHTML = marked(xmlhttp.responseText)
      .replace(/(<table>[\S\s]*?<\/table>)/g,
        '<div class="responsive">$1</div>');

    // 给文档代码设置高亮
    var blocks = document.querySelectorAll('pre code');
    [].forEach.call(blocks, hljs.highlightBlock);

    // 修改网址
    location.hash = src;
  }

  // 初始化页面
  window.addEventListener("DOMContentLoaded", function() {
    var sidemenu = document.getElementById("sidemenu");
    var src = location.hash ? location.hash.slice(1) : localStorage.getItem("page") ||
      sidemenu.getElementsByTagName("a")[0].getAttribute("href");
    loadmd(src);
    if (!localStorage.getItem("page")) {
      localStorage.setItem("page", src);
    }

    // 定义菜单开关按钮
    document.getElementById("togglemenu").addEventListener("click",
      function() {
        sidemenu.classList.toggle("show");
      });

    // 定义页面切换功能及菜单栏折叠功能
    sidemenu.addEventListener("click", function(e) {
      if (e.target.tagName.toLowerCase() === "a") {
        var src = e.target.getAttribute("href");
        if (src !== localStorage.getItem("page")) {
          loadmd(src);
          window.scrollTo(0, 0);
          localStorage.setItem("page", src);
        } else {
          loadmd(src, true);
        }
        e.preventDefault();
        return;
      }

      var nextStyle = e.target.nextElementSibling.style;
      if (e.target.tagName.toLowerCase().indexOf("h2") === 0) {
        nextStyle.display = nextStyle.display ? "" : "none";
        e.target.className = e.target.className ? "" : "collapse";
      }

      e.stopPropagation();
    });

    // 给笔记正文添加折叠功能 -- #md > h2 区块
    document.getElementById("md").addEventListener("click", function(e) {
      if (e.target.tagName.toLowerCase() === "h2") {
        var next = e.target.nextElementSibling;
        var reg = /h2|h1/i;
        while (!reg.test(next.tagName)) {
          next.style.display = next.style.display ? "" : "none";
          next = next.nextElementSibling;
          if (next === null) break;
        }
        e.target.className = e.target.className ? "" : "collapse";
        e.stopPropagation();
      }
    });
  });
})();
