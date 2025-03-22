// Предположим, у нас есть три асинхронные функции, которые получают данные из MongoDB
async function getUser(userId) {
  // Имитируем запрос к MongoDB
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: userId, name: 'Иван', age: 30 });
    }, 200);
  });
}

async function getUserProducts(userId) {
  // Имитируем запрос к MongoDB
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Продукт 1', price: 10 },
        { id: 2, name: 'Продукт 2', price: 20 },
      ]);
    }, 300);
  });
}

async function getUserOrders(userId) {
  // Имитируем запрос к MongoDB
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, orderId: 'ORD123', total: 30 },
        { id: 2, orderId: 'ORD456', total: 40 },
      ]);
    }, 250);
  });
}

// Функция для сбора данных
async function collectUserData(userId) {
  try {
    // Выполняем асинхронные функции параллельно
    const [user, products, orders] = await Promise.all([
      getUser(userId),
      getUserProducts(userId),
      getUserOrders(userId),
    ]);

    // Собираем данные в один массив
    const userData = {
      user,
      products,
      orders,
    };

    // Передаем данные дальше
    return userData;
  } catch (error) {
    console.error('Ошибка при сборе данных:', error);
    throw error; // Пробрасываем ошибку дальше, если необходимо
  }
}

// Пример использования
async function processUserData() {
  const userId = 'user123';
  try {
    const userData = await collectUserData(userId);
    console.log('Собранные данные:', userData);
    // Здесь можно передать данные в другую функцию или выполнить другие действия
  } catch (error) {
    console.error('Ошибка при обработке данных:', error);
  }
}

processUserData();

