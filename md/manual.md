# Manual / 使用说明

## 文档结构说明

```js
mdreader
  |- lib     // 这里放置各种组件
  |   |- marked.js         // markdown 文件解析器
  |   |- highlight.pak.js  // 代码区高亮插件
  |   |- main.js           // 本项目核心代码
  |   |- normalize.css     // 解决各浏览器差异的 css 插件
  |   |- vs.css            // visual studio 代码高亮风格，配合代码高亮插件使用
  |   └ main.css           // 本项目核心 css 文件
  |- server  // 为在本地查看文件提供了一个 web 服务器
  |   └ tiny.exe           // TinyWeb 服务器执行文件
  |- md      // 可以将待查看的 md 文件放在这，当然完全可以自行建立其他文件夹
  |   └ manual.md           // 您正在查看的使用说明文档
  |- index.html      // 主入口文档，您需要在里面编辑目录
  |- runServer.bat   // 启动本地 web 服务器的脚本，双击执行即可
  |- README.md       // 本项目的说明文档
```

### 外部组件介绍

* marked - markdown 文档解析器
* highlight.pack.js + vs.css - 对代码进行高亮显示，vs.css 是 highlight.js 项目下的一个 style 文件
* normalize.css - 解决各浏览器差异的 css 插件
* tiny.exe - 特地找的一个超级迷你的本地 web 服务器，Apache Node.js 之类的大块头都可以歇着了

备注：对每个组件都有独立 md 文档进行详细介绍，请查阅。（注：normalize 没有单独介绍。）

### 本项目自有文件介绍

* index.html - 模板主文件，需要您手动修改该文件中的目录部分以加载您的 md 文档；
* main.js - 项目的 JavaScript 代码，您可以不用管它，除非您自己知道怎么改；
* main.css - 项目的 css 文件，您觉得哪里看着不爽了，改它就是了
* runServer.bat - 启动 TinyWeb 的批处理文件，除了双击它启动服务器，应该不会有其他事了。
* md - 项目默认放 md 文档的文件夹，这个没关系，你可以自己随便建文档，关键是要在 index.html 里做相应修改

## 如何使用本系统

### 编辑 index.html

* `<h2>` 作为大类标题，且每个 `<h2>` 的子项目要用一个 `<div>` 包裹
* 子项目直接用 `<a>` 列出即可，外面不能套`<ul>` `<li>` 之类的标记
* 子项目 `<a>` 中的 `href` 属性必须与文件实际路径相一致
* 注意后缀就是您文档的后缀 `.md` 或 `.markdown` 而不是 `.html`

示例：

```html
<h2>Doc 文档</h2>
<div>
  <a href="/README.md">项目说明</a>
  <a href="/md/manual.md">使用手册</a>
  <!-- 在此处添加更多条目 -->
</div>
<h2>另外一个分类</h2>
<div>
  <h3>可以有 h3 来再细分类目</h3>
  <a href="path/file.md">文档条目</a>
  <!-- 在此处添加更多条目 -->
  <h3>可以有 h3 来再细分类目</h3>
  <a href="path/file.md">文档条目</a>
</div>
```

浏览器中浏览时，每个大类都可以通过点击 h2 标题来“展开或折叠”本类目，文档刚打开时默认都是展开的，如果您希望在文档打开时该类目就是折叠的，那么需要给 `<h2>` 添加 `collapse` 类，然后在相应的 `<div>` 上添加样式 `style = "display:none;"` ，就像下面这样：

```html
<h2 class="collpase">这个类默认只显示此类目，下面的条目会被隐藏</h2>
<div style = "display:none;">
  <a href="path/file.md">此处的条目默认会被隐藏</a>
  <!-- 在此处添加更多条目 -->
</div>
```

### 通过浏览器查看文档

双击 runServer.bat 文件启动本地 web 服务器，然后打开浏览器并输入 http://localhost/ 即可查看文档。

左侧导航菜单的 h2 标题 以及正文中的 h2 标题都是可以通过单击来“展开或折叠”该标题项下内容的，这样浏览长文档会方便很多。

在宽屏显示器中，左侧菜单默认是显示的，且无法关闭。而在小屏幕中，或者缩小浏览器窗口时，左侧菜单会自动隐藏，可以通过左上方的按钮来开启或关闭菜单。

## 根据您的个人偏好来改造此系统

如果不能高亮您 md 文档中的代码，请到 highlight.js 网站重新下载自定义解析包，然后替换掉 lib 目录下的 highlight.pack.js 文件。

如果您不喜欢代码高亮风格，请到 https://highlightjs.org/static/demo/ 挑选一个喜欢的风格，然后下载相应的 css 文档放到 lib 目录下，再然后修改 index.html 文档中的 `<link rel="stylesheet" href="./lib/vs.css">` 将 vs.css 修改为您新下载的 css文档名。

如果您不喜欢其他方面的显示风格，那么请您打开 lib 目录下的 main.css 调整相应设置。

## 应用场景介绍

### 本地 markdown 文件阅读器

这个是本项目的主要应用场景，下载网上的 md 文档放入本项目下的某个目录，然后将文档信息输入 index.html 的目录内就可以开启阅读之旅。

如果您想做做笔记或者想修改下源文档，可以直接编辑 md 源文档，然后点击页面的相应条目来刷新查看编辑后的文档。

### 在线笔记

您可以将自己写的 md 笔记上传到 GitHub 网站做成在线笔记系统。

GitHub 网站提供了 git pages 服务，您可以将本项目文件直接上传到 GitHub 上，即可在线阅读笔记内容，具体操作步骤请查看 GitHub 说明，这里提醒下，如果不是放到 username.github.io 的话，是要将 branch 调为 gh-pages 才能正常访问的。
