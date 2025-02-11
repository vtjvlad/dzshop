const fs = require('fs');

/**
 * Добавляет новые объекты в JSON-массив, заполняя их значениями из нескольких файлов.
 * @param {string} templatePath - Путь к JSON-образцу (объект).
 * @param {Object} valueFiles - Объект, где ключ — имя поля, а значение — путь к файлу.
 * @param {string} outputPath - Путь для сохранения итогового JSON.
 */
function appendArrayFromMultipleFiles(templatePath, valueFiles, outputPath) {
    try {
        // Читаем образец JSON
        const templateData = fs.readFileSync(templatePath, 'utf8');
        const templateJson = JSON.parse(templateData);

        if (typeof templateJson !== 'object' || Array.isArray(templateJson)) {
            throw new Error('Образец JSON должен быть объектом, а не массивом!');
        }

        // Читаем файлы со значениями
        const values = {};
        let maxLength = 0;

        for (const [key, filePath] of Object.entries(valueFiles)) {
            if (!fs.existsSync(filePath)) {
                console.warn(`Файл ${filePath} не найден, ключ '${key}' будет пустым.`);
                values[key] = [];
                continue;
            }

            values[key] = fs.readFileSync(filePath, 'utf8')
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            maxLength = Math.max(maxLength, values[key].length);
        }

        // Читаем существующий JSON-массив
        let existingArray = [];
        if (fs.existsSync(outputPath)) {
            const existingData = fs.readFileSync(outputPath, 'utf8');
            try {
                existingArray = JSON.parse(existingData);
                if (!Array.isArray(existingArray)) {
                    throw new Error('Выходной JSON должен быть массивом!');
                }
            } catch {
                console.warn('Файл output.json повреждён или не является массивом, создаю новый.');
                existingArray = [];
            }
        }

        // Создаём новые объекты
        const newObjects = [];
        for (let i = 0; i < maxLength; i++) {
            let newObj = { ...templateJson };

            for (const key of Object.keys(valueFiles)) {
                newObj[key] = values[key][i] ?? ""; // Если данных меньше, подставляется пустая строка
            }

            newObjects.push(newObj);
        }

        // Добавляем к существующему массиву
        existingArray.push(...newObjects);

        // Записываем результат в файл
        fs.writeFileSync(outputPath, JSON.stringify(existingArray, null, 2), 'utf8');

        console.log(`JSON-файл обновлён: ${outputPath}`);
    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}

// Пример использования
appendArrayFromMultipleFiles(
    'output.json',
    {
      "id": "../id",
      "name": "../product_name",
      "description": "../prod_description",
      "count": "../1",
      "preview_link": "../product_imglinks",
      "send_preview_as_document": "../0",
      "article": "../articule",
      "enabled": "../1",
      "category": "../prod_category",
      "purchase_success_command": "",
      "promocodes": "",
      "promocodes_variable": "",
      "promocodes_purchase_success_command": "",
      "promocodes_multiple": "",
      "promocodes_random_order": "",
      "is_parent": "",
      "group_id": "",
      "UAH": "../product_price"
    },
    'data2.json'
);
