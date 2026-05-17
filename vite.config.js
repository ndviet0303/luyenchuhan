import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs';
import path from 'path';

function apiSaveWordPlugin() {
  return {
    name: 'api-save-word',
    configureServer(server) {
      server.middlewares.use('/api/save-word', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (data.pass !== '111') {
                res.statusCode = 401;
                res.end(JSON.stringify({ error: 'Mật khẩu không chính xác' }));
                return;
              }
              const level = Number(data.level) || 1;
              const filePath = path.resolve(__dirname, `public/data/hsk${level}.json`);
              
              let fileData = { words: [] };
              if (fs.existsSync(filePath)) {
                fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
              }
              
              const existIdx = fileData.words.findIndex(w => w.simplified === data.wordObj.simplified);
              if (existIdx !== -1) {
                fileData.words[existIdx] = { ...fileData.words[existIdx], ...data.wordObj };
              } else {
                fileData.words.unshift(data.wordObj);
              }
              
              fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Đã lưu trực tiếp vào file JSON máy chủ!' }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [vue(), apiSaveWordPlugin()],
  server: {
    port: 8080,
    host: true
  }
});
