const fs = require('fs');
const path = require('path');

// Функция для преобразования CSV в JSON
function csvToJson(csvFilePath) {
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const rows = csvData.split('\n'); // Разделяем на строки
    const headers = rows[0].split(';'); // Первая строка — это заголовки

    const json = rows.slice(1).map(row => {
        const values = row.split(';'); // Разделяем значения
        const obj = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim(); // Привязываем значения к заголовкам
        });
        return obj;
    });

    return json;
}

// Указываем путь к CSV-файлу и сохраняем результат
const csvFilePath = path.join(__dirname, 'items.csv'); // Замените 'data.csv' на ваш файл
const jsonFilePath = path.join(__dirname, 'data.json'); // Имя выходного JSON-файла

const jsonData = csvToJson(csvFilePath);

// Сохраняем JSON в файл
fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 4), 'utf8');
console.log('Данные успешно преобразованы в JSON!');
