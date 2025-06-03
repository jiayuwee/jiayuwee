"""
Electron预加载脚本
提供安全的进程间通信接口
"""
const { contextBridge, ipcRenderer } = require('electron')

// 暴露FFmpeg相关API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 视频预览处理
  ffmpegPreview: (filePath, outputPath) => {
    return ipcRenderer.invoke('ffmpeg:preview', {
      filePath,
      outputPath
    })
  },
  
  // 添加路径验证方法
  validateFilePath: (filePath) => {
    return ipcRenderer.invoke('validate-file-path', filePath)
  }
})

// 错误处理增强
window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.on('process-error', (event, error) => {
    console.error('主进程错误:', error)
    if (window.showErrorDialog) {
      window.showErrorDialog(error.message)
    }
  })
})