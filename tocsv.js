const fs = require('fs');

/**
 * Конвертирует JSON-массив в CSV без лишних разделителей.
 * @param {string} jsonPath - Путь к JSON-файлу.
 * @param {string} csvPath - Путь для сохранения CSV-файла.
 */
function convertJsonToCsv(jsonPath, csvPath) {
    try {
        // Читаем JSON-файл
        const jsonData = fs.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(jsonData);

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('JSON-файл должен содержать массив объектов.');
        }

        // Получаем заголовки (ключи объектов)
        const headers = Object.keys(data[0]);

        // Функция для безопасной обработки значений
        const formatValue = (value) => {
            if (typeof value === 'number') return value; // Числа без кавычек
            if (typeof value === 'string') {
                if (value.includes(',')) return `"${value}"`; // Экранируем строки с запятыми
                return value;
            }
            return ''; // Пустые значения
        };

        // Преобразуем массив объектов в строки CSV
        const csvRows = data.map(row => 
            headers.map(header => formatValue(row[header] ?? '')).join(';')
        );

        // Формируем итоговый CSV-файл
        const csvContent = [headers.join(';'), ...csvRows].join('\n');

        // Записываем CSV-файл
        fs.writeFileSync(csvPath, csvContent, 'utf8');
        console.log(`CSV-файл успешно создан: ${csvPath}`);
    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}

// Пример использования
convertJsonToCsv('prods.json', 'items2.csv');
