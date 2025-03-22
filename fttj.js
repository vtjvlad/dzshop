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
            console.log(`🔍 Загружаем: ${url}`);

            page.on("response", async response => {
                const requestUrl = response.url();
                console.log(`📡 Запрос: ${requestUrl}`);

                if (requestUrl.includes("analytics.answear.ua/data")) {
                    try {
                        const json = await response.json();
                        console.log("✅ JSON получен:", json);
                        results.push(json);
                    } catch (err) {
                        console.error("❌ Ошибка парсинга JSON:", err);
                    }
                }
            });

            await page.goto(url, { waitUntil: "networkidle2" });

            // Заменяем waitForTimeout(5000) на setTimeout()
            await new Promise(resolve => setTimeout(resolve, 5000));

        } catch (err) {
            console.error(`❌ Ошибка при обработке URL: ${url}`, err);
        } finally {
            await page.close();
        }
    }

    await browser.close();
    console.log("📦 Итоговые данные:", results);
    return results;
}

// Запуск
fetchJsonFromUrls([
    "https://answear.ua/p/viking-rukavychky-2873",
    "https://answear.ua/p/another-product-1234"
]);
