import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import svgSpritemap from 'vite-plugin-svg-spritemap';
import { resolve } from 'path';

export default defineConfig({

  plugins: [
    svgSpritemap({
      pattern: 'src/assets/sprite/*.svg',
      filename: 'sprite.svg',
    }),
    createHtmlPlugin({
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    })
  ],

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['import'],
      },
    },
    devSourcemap: true,
  },

  build: {
    rollupOptions: {
      input: {
        // Посадочная страница
        main: resolve(__dirname, 'index.html'),
        // Основная верстка чемпионата
        about: resolve(__dirname, 'about.html'),
        // Страница ошибки
        404: resolve(__dirname, '404.html'),
        // Страница для проверки Pixel Perfect
        pixelPerfectTest: resolve(__dirname, 'about-static.html'),
      },
    },
    sourcemap: false,
    assetsInlineLimit: 4096,
    modulePreload: {
      polyfill: true
    },
    manifest: true
  },

  server: {
    port: 3000,
    open: true,
    host: true,
  },

  preview: {
    port: 8080,
    open: true,
  },
});
