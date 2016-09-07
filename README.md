# 简易 markdown 文档阅读器  - mdReader

一个简易的本地 markdown 文档阅读器, 也可以作为建站框架使用。   
作为本地阅读器使用时，只支持 windows 系统。
- - - 

### 快速指引

1. 下载项目文件压缩包 [mdreader v1.3](https://ooboqoo.github.io/mdreader/dist/mdreader1.3.zip) （只有88KB）
2. 解压文档到您期望的位置
3. 将 markdown 文档放置到 md 文件夹下
4. 编辑 index.html 文件的目录部分，将您刚才导入的 markdown 文件信息添加进去
5. 双击 runServer.bat 启动本地服务器
6. 打开浏览器并输入 http://localhost/ 开启阅读之旅

### 使用说明

请访问本项目主页，包含了说明文档和项目示例展示：https://ooboqoo.github.io/mdreader/

### 浏览器支持

支持 IE9 及更新浏览器。

### 项目特点

* 整个项目非常小巧，且自成一体不用再安装其他软件；
* 采用了成熟的 marked + highlight.js 方案来搭建项目，高效强大；
* 不仅可以作为本地 md 阅读系统，而且还可以自己编辑 md 文档并整体上传到服务器，做成在线笔记系统；
* 模板设计遵从响应式设计原则，能较好适应不同大小屏幕阅读；
* 且提供了好用的“折叠/展开”增强功能，方便浏览；
* 项目的 3 个主体文件 index.html main.css main.js 都比较小巧，代码没有压缩，可以根据个人偏好随便修改；
* v1.3 版本新增了标题导航列表和高亮文字功能(最简单的笔记功能，不是很好用，但比没有强)。

### 不够完善的地方

* 导入文档时需要手动编辑目录，比较不方便（如果文件多的话，用模式匹配查找并替换，分分钟完成）

### 项目原理解析

1. 当您点击菜单条目时，main.js 会取得点击条目的文档地址（您编辑菜单时指定的）；
2. main.js 通过地址下载相应 md 文件（采用的是 ajax 技术，所以在资源管理器中直接双击打开 index.html 是不行的）；
3. main.js 将下载到的 md 文件传给 marked 解析并加载到页面；
4. main.js 调用 highlight.js 对代码进行高亮操作

### 为什么要做这个项目

学习网站前端开发，碰到的绝大多数插件或模块基本都能在 GitHub 仓库中找到 md 格式的 doc 供下载，而这些项目的 html 格式的手册也基本都是 md 直接转的。在学习过程中经常碰到有的项目的手册页面的风格调地不好，阅读很费劲，还有就是有时国外的网站访问起来挺慢的，再者就是有时自己想边阅读边做做笔记。于是就将自己现在在用笔记系统经过抽象修改，做成现在这个专门用来阅读 md 文档的系统。过程很简单，将 md 文档下载下来，放到本项目下，然后通过编辑 index.html 的目录将文档引入系统（这里没有自动生成目录，是因为无法知道文档的顺序），最后，双击 runServer.bat 启动本地服务器，现在进入浏览器输入 http://localhost/ 就可以在本地查看 md 文档了。

### 项目许可

您可以将本项目应用到任何您需要的地方，可以随便更改和分发，总之，做任何您想做的事。

本项目使用了 4 个外部组件，每个组件都有他们的相应许可，本项目许可不包含对外部组件的许可，您需要自行查阅之：

* marked: https://github.com/chjj/marked
* highlight.js：https://github.com/isagalaev/highlight.js
* normalize.css：https://github.com/necolas/normalize.css
* TinyWeb: https://www.ritlabs.com/en/products/tinyweb/
