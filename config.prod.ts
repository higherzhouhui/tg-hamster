import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';

// 定义一个函数来解析路径
function _resolve(dir: string) {
  return path.resolve(__dirname, dir);
}

const phaserMsg = () => {
  return {
    name: 'phaserMsg',
    buildStart() {
      process.stdout.write(`Building for production...\n`);
    },
    buildEnd() {
      const line = "---------------------------------------------------------";
      const msg = `❤️❤️❤️ Tell us about your game! - games@phaser.io ❤️❤️❤️`;
      process.stdout.write(`${line}\n${msg}\n${line}\n`);

      process.stdout.write(`✨ Done ✨\n`);
    }
  }
}


// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    // https://npmjs.com/package/@vitejs/plugin-react-swc
    react(),
    // Allows using the compilerOptions.paths property in tsconfig.json.
    // https://www.npmjs.com/package/vite-tsconfig-paths
    tsconfigPaths(),
    // Allows using self-signed certificates to run the dev server using HTTPS.
    // https://www.npmjs.com/package/@vitejs/plugin-basic-ssl
    basicSsl(),
    phaserMsg(),
  ],
  build: {
    outDir: 'docs',
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 2
      },
      mangle: true,
      format: {
        comments: false
      }
    }
  },
  // @ts-ignore
  // base: process.env.GH_PAGES ? '/telegram-mini/' : './',
  server: {
    proxy: {
      '/api': {
        // target: 'http://localhost:8085', // 目标服务器地址
        target: 'https://test.forkfrenpet.com', // 目标服务器地址
        changeOrigin: true, // 是否改变源地址
        rewrite: (path) => path.replace(/^\/api/, '/api/'), // 重写路径
      }
    },
    fs: {
      allow: ['../sdk', './'],
    },
  },
  resolve: {
    alias: {
      '@': _resolve('src'),
    },
  },
  publicDir: './public',
})