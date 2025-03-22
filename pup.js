const puppeteer = require("puppeteer");

async function autoClickNav(targetUrl) {
     const browser = await puppeteer.launch({
        executablePath: "/snap/bin/chromium", // Укажи свой путь, если нужно
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    console.log("Открываем главную страницу...");
    await page.goto("https://answear.ua", { waitUntil: "domcontentloaded" });

    console.log("Ищем нужный элемент в навбаре...");
    const navSelector = await page.evaluate((targetUrl) => {
        const links = document.querySelectorAll("a");
        for (let link of links) {
            if (link.href.includes(targetUrl)) {
                return link.getAttribute("href");
            }
        }
        return null;
    }, targetUrl);

    if (navSelector) {
        console.log(`✅ Найден элемент: ${navSelector}`);
        await page.click(`a[href="${navSelector}"]`);

        console.log("⏳ Ждём загрузку...");
        await page.waitForNavigation({ waitUntil: "networkidle2" });

        console.log("✅ Успешный переход!");
    } else {
        console.log("❌ Не удалось найти ссылку в навбаре.");
    }

    await browser.close();
}

// Используем функцию для автоматического перехода
autoClickNav("/new/dity"); // Меняй URL на нужный