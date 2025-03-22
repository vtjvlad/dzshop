
function createCollector() {
    let storage = [];

    return {
        add: (item) => storage.push(item),
        get: () => storage,
        clear: () => storage.length = 0
    };
}

module.exports = createCollector;
