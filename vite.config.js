// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://api.openai.com/v1/chat',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
};
