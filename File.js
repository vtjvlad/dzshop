const puppeteer = require("puppeteer");
const fs = require("fs");

async function fetchAnalyticsData(urls) {
    const browser = await puppeteer.launch({
        executablePath: "/snap/bin/chromium", // Укажи свой путь, если нужно
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const results = [];

    for (const url of urls) {
        const page = await browser.newPage();

        try {
                await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
);

await page.goto(url, { waitUntil: "domcontentloaded" });
await new Promise(resolve => setTimeout(resolve, 3000)); // Ждём 3 сек, пока JS отработает
            console.log(`Открываю главную страницу сайта...`);
            await page.goto("https://answear.ua/c/dity", { waitUntil: "networkidle2" });

            // Эмулируем небольшую задержку, как если бы пользователь осматривал страницу
           await new Promise(resolve => setTimeout(resolve, 3000));

            console.log(`Переход на страницу: ${url}`);
            await page.goto(url, { waitUntil: "networkidle2" });

            // Таймаут для обработки ответа
            const timeoutPromise = new Promise((resolve) =>
                setTimeout(resolve, 5000, "timeout")
            );
						
						// Логируем все запросы
            page.on("request", (request) => {
                console.log("Запрос:", request.url());
            });
						
						

            // Перехват ответа
            const responsePromise = new Promise((resolve) => {
                page.on("response", async (response) => {
                    const requestUrl = response.url();
                    if (requestUrl.includes("https://answear.ua/api/product")) {
                        try {
                            const textResponse = await response.text();
                            const jsonResponse = JSON.parse(textResponse);
                            results.push(jsonResponse);
                            console.log(`✅ Получены данные с ${requestUrl}`);
                            resolve("success");
                        } catch (err) {
                            console.error(`❌ Ошибка парсинга JSON от ${requestUrl}:`, err);
                            resolve("error");
                        }
                    }
                });
            });

            // Ожидаем ответа или таймаута
            const result = await Promise.race([responsePromise, timeoutPromise]);
            if (result === "timeout") {
                console.warn(`⏳ Ответ не получен за 5 сек для ${url}`);
            }

        } catch (error) {
            console.error(`❌ Ошибка при обработке URL: ${url}`, error);
        } finally {
            await page.close();
        }
    }

    await browser.close();

    // Записываем результат в файл
    fs.writeFileSync("answeardata.json", JSON.stringify(results, null, 2), "utf8");

    console.log("✅ Данные сохранены в answeardata.json");

    return results;
}

// Список страниц
const urls = [
    "https://answear.ua/new/dity",
    "https://answear.ua/new/dity/khlopchyk",
];

fetchAnalyticsData(urls)
    .then(() => console.log("Все полученные данные сохранены."))
    .catch((error) => console.error("Ошибка при получении данных:", error));