(function() {
  var lastRange;  // 这个变量用于保存最近一次的选择区域，设置标记时要用

  // loadmd 函数负责下载 md 文件并更新文档
  function loadmd(src, nocache) {
    var xmlhttp, blocks;

    // 下载 md 文档
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", src, false);
    if (nocache) { xmlhttp.setRequestHeader("Cache-Control", "no-cache"); }
    xmlhttp.send();

    // 解析 md 并插入文档（顺便给所有表格套了个 div.responsive）
    document.getElementById("md").innerHTML = marked(xmlhttp.responseText)
      .replace(/(<table>[\S\s]*?<\/table>)/g, '<div class="responsive">$1</div>');

    // 给文档代码设置高亮
    blocks = document.querySelectorAll("pre > code");
    [].forEach.call(blocks, hljs.highlightBlock);

    // 加载大纲和标记
    setContents();
    setMark();

    // 更新地址
    location.hash = src;
  }
  
  // setContents 函数负责设置文章内的目录导航
  function setContents(){
    var contents = document.createElement("div");
    var nodes = document.getElementById("md").getElementsByTagName("*");
    var headings = [];
    var index = 0;
    
    [].forEach.call(nodes, function(node){
      if (node.tagName.indexOf("H") === 0) {
        headings.push(node);
      }
    });
    headings.forEach(function(heading){
      var id = "h-" + index;
      var a = document.createElement("a");
      heading.id = id;
      a.href = "#" + id;
      a.textContent = heading.textContent;
      a.className = heading.tagName.toLowerCase();
      contents.appendChild(a);
      index += 1;
    });
    document.getElementById("outline").innerHTML = "索引";
    document.getElementById("outline").appendChild(contents);
  }

  // setMark 函数负责管理添加或删除标记
  function setMark(){
    var page = location.hash;
    var marks = JSON.parse( localStorage.getItem(page) || "[]" );
    var html = document.getElementById("md").innerHTML;
    var container = document.createElement('div');
    var selection, markToRemove, i;
    var highlight = function (markToRemove){
      marks.forEach(function(mark){
        html = html.replace(mark, '<del class="mark">$&</del>');
      });
      if (markToRemove) {
        html = html.replace('<del class="mark">' + markToRemove + '</del>', markToRemove);
      }
      document.getElementById("md").innerHTML = html;
    };
    var clean = function (){  // 去掉无效的标记内容
      var changed = false;
      marks.forEach(function(mark, index){
        if (html.indexOf(mark) === -1){
          marks.splice(index, 1);
          changed = true;
        }
      });
      if (changed) { localStorage.setItem(page, JSON.stringify(marks)); }
    };

    // 提取选择区域内的 HTML 代码
    if (lastRange) {
      container.appendChild(lastRange.cloneContents());
      selection = container.innerHTML;
    }

    // 页面初始化或者没有选择内容时就不用继续向下执行
    switch (selection){
      case undefined: highlight(); clean();  // 此处特意不用 break
      case ""       : return;
    }

    // 确定是要增加标记还是要删除标记
    for (i = 0; i < marks.length; i++){
      if (marks[i].indexOf(selection) > -1){
        markToRemove = (marks.splice(i, 1))[0];
        break;
      }
    }

    if (!markToRemove) { marks.push(selection); }
    highlight(markToRemove);
    localStorage.setItem(page, JSON.stringify(marks));
  }

  // 初始化页面
  window.addEventListener("DOMContentLoaded", function() {
    var sidemenu = document.getElementById("sidemenu");
    var src = location.hash ? location.hash.slice(1) : (localStorage.getItem("currentPage") ||
        sidemenu.getElementsByTagName("a")[0].getAttribute("href"));
    var markbutton = document.getElementById("mark");
    loadmd(src);
    if (!localStorage.getItem("currentPage")) { localStorage.setItem("currentPage", src); }

    // 定义菜单开关按钮
    document.getElementById("togglemenu").addEventListener("click", function() {
        sidemenu.classList.toggle("show");
      });

    // 设置标记功能
    document.getElementById("md").addEventListener("mouseup", function(e){
      if(e.target !== markbutton) { lastRange = window.getSelection().getRangeAt(0); }
    });  // 如果不做这一步，点击 #mark 按钮调用 setMark 时就拿不到前面选择的文本
    document.getElementById("mark").addEventListener("click", setMark);

    // 定义页面切换功能及菜单栏折叠功能
    sidemenu.addEventListener("click", function(e) {
      if (e.target.tagName.toLowerCase() === "a") {
        var src = e.target.getAttribute("href");
        if (src !== localStorage.getItem("currentPage")) {
          loadmd(src);
          window.scrollTo(0, 0);
          localStorage.setItem("currentPage", src);
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
