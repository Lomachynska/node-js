const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const FILE_PATH = path.join(__dirname, 'user.txt');

// Создаем пустой файл user.txt при запуске сервера
fs.writeFileSync(FILE_PATH, '', { flag: 'w' });

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        // Читаем содержимое файла и отправляем клиенту
        fs.readFile(FILE_PATH, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Ошибка чтения файла');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(data);
            }
        });
    } else if (req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            // Добавляем данные в файл user.txt
            fs.appendFile(FILE_PATH, body + '\n', err => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Ошибка записи в файл');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Данные успешно добавлены');
                }
            });
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Метод не поддерживается');
    }
});

server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
