const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;






(async () => {
  try {
    // Подключение к базе данных MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Подключение к MongoDB успешно.');

    // Определение схемы и модели
const productSchema = new mongoose.Schema({
  id: { type: String },  // ID товара
  name: { type: String },  // Название товара
  description: { type: String },  // Описание товара
  count: { type: String },  // Количество
  preview_link: { type: String },  // Ссылка на изображение
  send_preview_as_document: { type: String },
  article: { type: String },  // Артикул
  enabled: { type: String },  // Включен/выключен
  category: { type: String },  // Категория
  purchase_success_command: { type: String },
  promocodes: { type: String },  // Промокоды
  promocodes_variable: { type: String },
  promocodes_purchase_success_command: { type: String },
  promocodes_multiple: { type: String },
  promocodes_random_order: { type: String },
  is_parent: { type: String },
  group_id: { type: String },  // ID группы
  UAH: { type: String }  // Цена в UAH
});

const Products = mongoose.model('Products', productSchema);
    // Получение данных из коллекции
    const data = await Products.find();

    // Запись данных в JSON-файл
    fs.writeFileSync('prods.json', JSON.stringify(data, null, 2));
    console.log('Данные успешно записаны в файл data.json');

    // Закрытие соединения
    await mongoose.disconnect();
  } catch (error) {
    console.error('Ошибка:', error);
  }
})();
