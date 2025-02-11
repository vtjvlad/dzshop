const fs = require('fs');

// Чтение массива объектов из файла input.json
const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

// Определяем ключ, значения которого нужно извлечь
const key = 'id'; // Замените на ваш ключ

// Извлекаем все значения этого ключа
const values = data.map(item => item[key]).filter(value => value !== undefined);

// Записываем значения в текстовый файл, каждое с новой строки
fs.writeFileSync('../id', values.join('\n'), 'utf-8');

console.log(`Значения ключа "${key}" успешно записаны в output.txt`);
