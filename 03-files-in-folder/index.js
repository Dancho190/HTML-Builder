const fs = require('fs/promises')
const path = require('path')

const folderPath = path.join(__dirname, 'secret-folder');

async function listFiles() {
    try {
      // Чтение содержимого папки
      const files = await fs.readdir(folderPath, { withFileTypes: true });
  
      for (const file of files) {
        // Проверяем, что объект — файл
        if (file.isFile()) {
          const filePath = path.join(folderPath, file.name);
  
          // Получаем информацию о файле
          const stats = await fs.stat(filePath);
  
          // Извлекаем имя и расширение
          const name = path.basename(file.name, path.extname(file.name));
          const ext = path.extname(file.name).slice(1); // Убираем точку
  
          // Размер в кБ (опционально)
          const sizeInKB = stats.size / 1024;
  
          // Выводим информацию
          console.log(`${name} - ${ext} - ${sizeInKB.toFixed(3)}kb`);
        }
      }
    } catch (err) {
      console.error('Ошибка при чтении папки:', err.message);
    }
  }
  
  listFiles();