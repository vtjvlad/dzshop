const fs = require('fs');

/**
 * Копирует ключи из первого объекта массива JSON и создаёт новый JSON-файл.
 * @param {string} templatePath - Путь к образцу JSON-файла.
 * @param {string} outputPath - Путь для сохранения нового JSON-файла.
 * @param {any} defaultValue - Значение по умолчанию для всех ключей (например, null, "", 0).
 */
function copyKeysFromArrayObject(templatePath, outputPath, defaultValue = null) {
    try {
        // Читаем и парсим JSON
        const templateData = fs.readFileSync(templatePath, 'utf8');
        const templateJson = JSON.parse(templateData);

        // Проверяем, является ли JSON массивом и содержит ли объекты
        if (!Array.isArray(templateJson) || templateJson.length === 0 || typeof templateJson[0] !== 'object') {
            throw new Error('Файл должен содержать массив с объектами!');
        }

        // Берём первый объект массива и копируем его ключи
        const firstObject = templateJson[0];
        const newJson = Object.fromEntries(Object.keys(firstObject).map(key => [key, defaultValue]));

        // Записываем новый JSON в файл
        fs.writeFileSync(outputPath, JSON.stringify(newJson, null, 2), 'utf8');

        console.log(`JSON-файл успешно создан: ${outputPath}`);
    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}

// Пример использования
copyKeysFromArrayObject('prods.json', 'output.json', '');
