const fs = require('fs');

function mergeProductLists(inputFilePath, outputFilePath) {
    try {
        // 1. Читаем содержимое файла
        const rawData = fs.readFileSync(inputFilePath, 'utf-8');
        
        // 2. Парсим JSON из файла
        const data = JSON.parse(rawData);
        
        // 3. Проверяем, что данные — это массив
        if (!Array.isArray(data)) {
            throw new Error('Содержимое файла не является массивом');
        }

        // 4. Извлекаем все объекты из внутренних массивов extractedData и объединяем их
        const mergedArray = data.reduce((acc, item) => {
            // Предполагаем, что каждый элемент содержит поле extractedData
            if (item.extractedData && Array.isArray(item.extractedData)) {
                return [...acc, ...item.extractedData];
            }
            // Если extractedData отсутствует, но сам item — это объект продукта, добавляем его
            else if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                return [...acc, item];
            }
            return acc; // Пропускаем некорректные элементы
        }, []);

        // 5. Сохраняем результат в новый файл
        fs.writeFileSync(outputFilePath, JSON.stringify(mergedArray, null, 2));
        console.log(`Объединенный массив сохранен в ${outputFilePath}`);
        
        return mergedArray;
    } catch (error) {
        console.error('Ошибка:', error.message);
        return null;
    }
}

// Пример использования
const inputFile = 'results.json';     // Входной файл
const outputFile = 'merged_results.json'; // Выходной файл

mergeProductLists(inputFile, outputFile);
