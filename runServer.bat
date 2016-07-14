@echo off
echo.
echo If there's no error prompt, the server is running as a backgroun task
echo and you can close this window safely, the server will keep running!
echo Please view the markdown files via: http://localhost/
echo And you can stop the server using the command line: taskkill /F /IM tiny.exe
echo or just open the Task Manager (CTRL+Alt+Del) and end the process tiny.exe
echo.
echo 如果没有报错，说明服务器已经正常启动了。
echo 您可以关闭本窗口，请不要担心，服务器将会继续在后台运行。
echo 通过在浏览器输入该地址以访问您的 markdown 文档: http://localhost/
echo 您可以在命令行输入以下命令来关闭服务器: taskkill /F /IM tiny.exe
echo 或者您也可以直接启动任务管理器 (CTRL+Alt+Del) 并关闭进程 tiny.exe
cd server
tiny %~dp0
