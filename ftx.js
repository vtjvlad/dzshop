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
            console.log(`Открываю страницу: ${url}`);

            // Логируем все запросы
            page.on("request", (request) => {
                console.log("Запрос:", request.url());
            });

            // Перехватываем ответ
            const responsePromise = new Promise((resolve) => {
                page.on("response", async (response) => {
                    const requestUrl = response.url();

                    if (requestUrl.includes("https://answear.ua/api/product")) {
                        try {
                            const jsonResponse = await response.json();
                            results.push(jsonResponse);
                            console.log(`Получены данные с ${requestUrl}:`, jsonResponse);
                            resolve();
                        } catch (err) {
                            console.error(`Ошибка парсинга JSON от ${requestUrl}:`, err);
                            resolve();
                        }
                    }
                });
            });

    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
);

await page.goto(url, { waitUntil: "domcontentloaded" });
await new Promise(resolve => setTimeout(resolve, 3000)); // Ждём 3 сек, пока JS отработает

            // Загружаем страницу и ждем ответа
          //  await page.goto(url, { waitUntil: "networkidle2" });
          //  await responsePromise; // Ожидаем, пока не придет ответ

        } catch (error) {
            console.error(`Ошибка при обработке URL: ${url}`, error);
        } finally {
            await page.close();
        }
    }

    await browser.close();

    // Записываем результат в файл data.json
    const jsonData = JSON.stringify(results, null, 2);
    fs.writeFileSync("answeardata.json", jsonData, "utf8");

    console.log("✅ Данные сохранены в data.json");

    return results;
}

// Список страниц
const urls = [

    "https://answear.ua/new/dity", 
    // "https://answear.ua/p/viking-rukavychky-2873",
    // "https://answear.ua/p/another-product-1234",
];

fetchAnalyticsData(urls)
    .then((data) => console.log("Все полученные данные сохранены."))
    .catch((error) => console.error("Ошибка при получении данных:", error));
