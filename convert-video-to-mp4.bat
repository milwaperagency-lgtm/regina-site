@echo off
chcp 65001 >nul
echo Конвертация IMG_9808.MOV в MP4 для стабильной работы в браузере...
where ffmpeg >nul 2>&1
if %errorlevel% neq 0 (
  echo.
  echo ffmpeg не найден. Установите FFmpeg и добавьте в PATH:
  echo https://ffmpeg.org/download.html
  echo.
  echo Либо конвертируйте IMG_9808.MOV в MP4 онлайн и сохраните как assets\videos\IMG_9808.mp4
  pause
  exit /b 1
)
cd /d "%~dp0assets\videos"
ffmpeg -y -i IMG_9808.MOV -c:v libx264 -preset medium -crf 23 -c:a aac -movflags +faststart IMG_9808.mp4
if %errorlevel% equ 0 (
  echo.
  echo Готово: assets\videos\IMG_9808.mp4
) else (
  echo Ошибка конвертации.
)
pause
