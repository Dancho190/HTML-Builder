const fs = require('fs');
const path = require('path');

// Создание пути к файлу text.txt
const filePath = path.join(__dirname, 'text.txt');

// Создание потока чтения
const readStream = fs.createReadStream(filePath);

// Направляем поток на стандартный вывод (консоль)
readStream.pipe(process.stdout);
