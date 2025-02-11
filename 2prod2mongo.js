const mongoose = require('mongoose');
const fs = require('fs');

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

// Подключение к MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Определение схемы для товара
const productSchema = new mongoose.Schema({
  id: {
    type: String,  // ID скорее всего будет строкой, так как это числовой код
  },
  name: {
    type: String,  // Название товара
  },
  description: {
    type: String,  // Описание товара
  },
  count: {
    type: String,  // Количество, строка, так как в примере указано "1" как строка
  },
  preview_link: {
    type: String,  // Ссылка на изображение товара
  },
  send_preview_as_document: {
    type: String,  // Вероятно, это флаг или строковое значение, указывающее на документ
  },
  article: {
    type: String,  // Артикул товара
  },
  enabled: {
    type: String,  // Может быть флагом для включения товара
  },
  category: {
    type: String,  // Категория товара
  },
  purchase_success_command: {
    type: String,  // Команда для успешной покупки
  },
  promocodes: {
    type: String,  // Промокоды
  },
  promocodes_variable: {
    type: String,  // Промокоды, связанные с переменными
  },
  promocodes_purchase_success_command: {
    type: String,  // Команда для успешного использования промокода
  },
  promocodes_multiple: {
    type: String,  // Возможность использования нескольких промокодов
  },
  promocodes_random_order: {
    type: String,  // Признак случайного порядка промокодов
  },
  is_parent: {
    type: String,  // Возможно, это флаг для обозначения родительского товара
  },
  group_id: {
    type: String,  // Идентификатор группы товара
  },
  UAH: {
    type: String,  // Цена товара в UAH
  }
})

// Создание модели на основе схемы
const Products = mongoose.model('Products', productSchema);

// Чтение JSON-файла
const jsonFilePath = './data2.json';
const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

// Функция для сохранения данных в MongoDB
async function saveToMongo() {
    try {
        // Вставка данных в базу данных
        const result = await Products.insertMany(jsonData);
        console.log(`Успешно добавлено документов: ${result.length}`);
    } catch (error) {
        console.error('Ошибка при сохранении в MongoDB:', error.message);
    } finally {
        // Закрытие подключения
        mongoose.connection.close();
        console.log('Соединение с MongoDB закрыто.');
    }
}

// Запуск функции сохранения
saveToMongo();


