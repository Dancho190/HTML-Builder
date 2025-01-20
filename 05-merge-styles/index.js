const fs = require('fs');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const outputFile = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(stylesFolderPath, { withFileTypes: true }, async (err, files) => {
  if (err) {
    console.error('Error reading the styles directory:', err);
    return;
  }

  // Массив для хранения всех стилей
  const styles = [];

  for (const file of files) {
    const filePath = path.join(stylesFolderPath, file.name);
    
    // Проверяем, является ли объект файлом и имеет ли он расширение .css
    if (file.isFile() && path.extname(file.name) === '.css') {
      try {
        // Чтение содержимого CSS файла
        const content = await fs.promises.readFile(filePath, 'utf-8');
        styles.push(content); // Добавляем содержимое в массив
      } catch (readError) {
        console.error('Error reading file:', file.name, readError);
      }
    }
  }

  try {
    // Записываем объединенные стили в файл bundle.css
    await fs.promises.writeFile(outputFile, styles.join('\n'), 'utf-8');
    console.log('CSS bundle has been created successfully!');
  } catch (writeError) {
    console.error('Error writing to bundle.css:', writeError);
  }
});
