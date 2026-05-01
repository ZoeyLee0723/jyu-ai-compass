import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    proxy:{
      '/api': {
        target: 'http://159.75.169.224:1235', // 后端真实地址（协议+IP+端口）
        changeOrigin: true, // 允许跨域（模拟同源请求）
        // rewrite: (path) => path.replace(/^\/api/, '') // 可选：去掉请求路径中的 "/api" 前缀
    }
  }
}})
