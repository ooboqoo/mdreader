@echo off
cd server
start tiny %~dp0
start http://localhost/
