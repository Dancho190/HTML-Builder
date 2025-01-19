const fs = require('fs/promises');
const path = require('path');

// Путь к исходной директории
const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

async function copyDir(src, dest) {
  try {
    // Проверяем, существует ли целевая директория
    await fs.mkdir(dest, { recursive: true });

    // Читаем содержимое исходной директории
    const files = await fs.readdir(src, { withFileTypes: true });

    // Копируем каждый файл или директорию
    for (const file of files) {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);

      if (file.isDirectory()) {
        // Рекурсивно копируем подкаталоги
        await copyDir(srcPath, destPath);
      } else {
        // Копируем файлы
        await fs.copyFile(srcPath, destPath);
      }
    }
    console.log('Копирование завершено.');
  } catch (err) {
    console.error('Ошибка при копировании:', err.message);
  }
}

copyDir(sourceDir, targetDir);
