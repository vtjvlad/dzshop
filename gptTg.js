require("dotenv").config();
const axios = require("axios");
const readline = require("readline");


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Введите запрос для GPT (нажмите Ctrl+C для выхода):");

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

    // Проверка на наличие данных в ответе
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
