@echo off
echo.
echo If there's no error prompt, the server is running as a backgroun task
echo and you can close this window safely, the server will keep running!
echo Please view the markdown files via: http://localhost/
echo And you can stop the server using the command line: taskkill /F /IM tiny.exe
echo or just open the Task Manager (CTRL+Alt+Del) and end the process tiny.exe
echo.
echo ���û�б���˵���������Ѿ����������ˡ�
echo �����Թرձ����ڣ��벻Ҫ���ģ���������������ں�̨���С�
echo ͨ�������������õ�ַ�Է������� markdown �ĵ�: http://localhost/
echo �����������������������������رշ�����: taskkill /F /IM tiny.exe
echo ������Ҳ����ֱ��������������� (CTRL+Alt+Del) ���رս��� tiny.exe
cd server
tiny %~dp0
