const TelegramBot = require("node-telegram-bot-api");

const BOT_TOKEN = "7545431135:AAGJLSyS90mwX-GxSrRFsrONWSuEVvJ3qrI";
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.on("message", (msg) => {
    console.log("Ваш chat_id:", msg.chat.id);
});
