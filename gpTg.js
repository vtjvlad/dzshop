// 1. интегрируемм OPENAI API с Telegram API
// 2.  получаем апи ключь от OPENAI API из файла .env
// 3. создайом запрос к GPT-4o модели
// 4.  получаем ответ от GPT-4o модели
// 5.  получаем бота из файла sendTg.js
// 6.  отправляем ответ от GPT-4o модели в телеграм
// 7.  обрабатываем ошибки
// 8.  выводим сообщение о пустом ответе
// 9.  выводим сообщение об ошибке
// 10.  выводим сообщение о вводе следующего запроса
// 11.  выводим сообщение о вводе запроса для GPT
// 12.  выводим сообщение о выходе


// 1.. 2 --

require("dotenv").config();

// 3 -- 4 --AAAAAA

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const axios = require("axios");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
}); 

console.log("Введите запрос для GPT (нажмите Ctrl+C для выход:");

rl.on("line", async (input) => {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o",
                messages: [{ role: "user", content: input }],
                max_tokens: 1137,
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // 5 -- 6 --

        const message = response.data.choices?.[0]?.message?.content;
        if (message) {
            console.log("Ответ GPT:", message.trim());
            const sendNotification = require("./sendTg.js");
            sendNotification(`${message.trim()}`);
        } else {
            console.log("GPT вернул пустой ответ.");
        }
    } catch (error) {
        console.error("Ошибка:", error.response ? error.response.data : error.message);
    }
    console.log("\nВведите следующий запрос:");

});

// 7 -- 8 -- 9 -- 10 -- 11 -- 12 --





















    // cost response = await fetch('https://openai.com/v1/chat/completions', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'authorization': `Bearer ${OPENAI_API_KEY}`
    //     },
    //     body: JSON.stringify({
    //         model: "gpt-4o",
    //         messages: [{ role: "user", content: message }],
    //         max_tokens: 1137,
    //     }) 
    // });
    // return response.json();
    //
