const fs = require('fs');
const readline = require('readline');
const path = require('path');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Добро пожаловать! Введи любой текст для записи.Для выхода введи "exit".');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('До свидания!');
    rl.close(); 
  } else {
    writeStream.write(input + '\n'); // Записать текст в файл
    console.log('Текст добавлен в файл. Введите следующий текст:');
  }
});

rl.on('close', () => {
  console.log('Завершаю работу. Удачи!');
  process.exit(0); // Завершение процесса
});
