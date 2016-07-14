# TinyWeb Server on Windows

Article source / 原文链接：http://ccm.net/faq/2568-tinyweb-server-on-windows#to-run-tinyweb   
Official Site / 官网：https://www.ritlabs.com/en/products/tinyweb/

### To run TinyWeb / 启动 TinyWeb 服务器

You will have to create an index.html file. Example: c:\www\index.html, Then add some content.   
首先，您需要创建一个 index.html 文件，如 c:\www\index.html，然后在文件内输入写内容。

In the command line, run: `tiny c:\www`   
在命令行输入命令：`tiny c:\www`

Note: You need to use the absolute path   
注意：您必须使用绝对路径。

Check the result on : http://localhost/   
在浏览器输入地址查看效果：http://localhost/

### How to Stop TinyWeb / 关闭 TinyWeb 服务器

Open the Task Manager (CTRL+Alt+Del) and end the process tiny.exe   
打开任务管理器 (CTRL+Alt+Del)，找到 tiny.exe 并结束该进程。

Or, using the command line: `taskkill /F /IM tiny.exe`   
或者您可以通过在命令行输入命令关闭服务器：`taskkill /F /IM tiny.exe`

- - -

<br>

> **Gavin's Review / 个人评论**
> 
> This is a super tiny web server, single file and run directly without setup process. It's tiny but with sufficient capble of serving local html file.
> 
> 这是一个非常小巧的 web 服务器，而且是单文件免安装的，功能对于仅需要在本地查看静态文件的用户来说是足够了。
 
