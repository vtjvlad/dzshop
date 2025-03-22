const puppeteer = require("puppeteer");

async function fetchJsonFromUrls(urls) {
    const browser = await puppeteer.launch({
        executablePath: "/snap/bin/chromium", // Укажи путь, если требуется
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    let results = [];

    for (let url of urls) {
        const page = await browser.newPage();

        try {
            console.log(`Загружаем: ${url}`);

            let responseJson = null;
            const responsePromise = new Promise(resolve => {
                page.on("response", async response => {
                    if (response.url().includes("analytics.answear.ua/data")) {
                        try {
                            responseJson = await response.json();
                            console.log("✅ Найден JSON:", responseJson);
                            results.push(responseJson);
                        } catch (err) {
                            console.error("❌ Ошибка парсинга JSON:", err);
                        }
                        resolve();
                    }
                });
            });

            await page.goto(url, { waitUntil: "networkidle2" });

            // Ждём ответ или тайм-аут (5 сек)
            await Promise.race([responsePromise, new Promise(r => setTimeout(r, 5000))]);

        } catch (err) {
            console.error(`Ошибка при обработке URL: ${url}`, err);
        } finally {
            await page.close();
        }
    }

    await browser.close();
    console.log("📦 Все полученные данные:", results);
    return results;
}

// Тестируем
fetchJsonFromUrls([
    "https://answear.ua/p/viking-rukavychky-2873",
    "https://answear.ua/p/another-product-1234"
]);
