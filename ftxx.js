async function fetchJsonFromUrls(urls) {
    try {
        const responses = await Promise.all(urls.map(url => fetch(url).then(res => res.json())));
        return responses;
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        return [];
    }
}

// Пример запросов к API аналитики
const analyticsUrls = [
    "https://analytics.answear.ua/data?v=2&event_name=page_view&product_id=2873",
    "https://analytics.answear.ua/data?v=2&event_name=page_view&product_id=1234"
];

fetchJsonFromUrls(analyticsUrls).then(results => {
    console.log("Полученные данные:", results);
});
