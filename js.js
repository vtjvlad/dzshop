
const fs = require('fs');
const jsonFilePath = './data2.json';
const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
console.log(jsonData);

