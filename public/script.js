//
// fetch('https://vtjvlad.ddns.net/api/products')
//   .then(response => {
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     return response.json(); // Преобразуем ответ в JSON
//   })
//   .then((products) => {
//     console.log(products); // data - массив объектов (если API возвращает массив)
//   })
//   .catch(error => console.error('Ошибка:', error));
//
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    loadCart(); // <-- Добавьте эту строку
    updateCartCount();
});

const storedProducts = localStorage.getItem('products');
const products = storedProducts ? JSON.parse(storedProducts) : [];



function displayProducts() {
    const catalogSection = document.querySelector("#catalog .products");
    catalogSection.innerHTML = "";

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.setAttribute("onclick", "toggleFlip(event)");

        productCard.innerHTML = `
        <div class="product-inner">
        <div class="product-front">
        <img src="${product.preview_link}" alt="${product.name}">
        <h3>${product.name}</h3>
        <div class="price"><p>${product.UAH} грн.</p> </div>
        <button class="add-to-cart" onclick="event.stopPropagation(); addToCart('${product._id}')">В корзину</button>
        </div>
        <div class="product-back">
        <h3>Описание продукта</h3>
        <p>${product.description}</p>
        </div>
        </div>
        `;

        catalogSection.appendChild(productCard);
    });
}

function toggleFlip(event) {
    if (!event.target.classList.contains('add-to-cart') && event.target.tagName !== 'IMG') {
        event.currentTarget.classList.toggle('flipped');
    }
}

/* const burgerButton = document.getElementById('burgerButton');
const menu = document.getElementById('menu');
burgerButton.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'flex' ? 'none': 'flex';
});

document.getElementById('burgerButton').addEventListener('click', function() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
    this.classList.toggle('active'); // Добавляем анимацию для кнопки
}); */

const burgerButton = document.getElementById('burgerButton');
const menu = document.getElementById('menu');

// Переключение бургер-меню
burgerButton.addEventListener('click', () => {
    if (menu.classList.contains('active')) {
        // Закрытие меню
        menu.style.maxHeight = '0';
        menu.style.padding = '0';
        setTimeout(() => {
            menu.classList.remove('active'); // Убираем класс после завершения анимации
            menu.style.maxHeight = '700px'; // Сбрасываем инлайновый стиль
            menu.style.padding = '';
        }, 300); // Учитываем длительность анимации
    } else {
        // Открытие меню
        menu.classList.add('active');
        menu.style.maxHeight = menu.scrollHeight + 'px'; // Автоматическая высота
        menu.style.padding = '10px'; // Добавляем отступы
    }
    burgerButton.classList.toggle('active'); // Поворот кнопки
});

// Закрытие меню при выборе элемента
menu.querySelectorAll('a').forEach((menuItem) => {
    menuItem.addEventListener('click', () => {
        menu.style.maxHeight = '0';
        menu.style.padding = '0';
        setTimeout(() => {
            menu.classList.remove('active'); // Убираем класс после завершения анимации
            menu.style.maxHeight = '700px'; // Сбрасываем инлайновый стиль
            menu.style.padding = '';
        }, 300); // Учитываем длительность анимации
        burgerButton.classList.remove('active'); // Возвращаем кнопку в исходное состояние
    });
});


function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach((section) => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    const navbar = document.querySelector('.navbar');
    if (sectionId === 'catalog') {
        navbar.style.display = 'flex';
    } else {
        navbar.style.display = 'none';
    }
    const navbarbot = document.querySelector('.navbarbot');
    const sectionsWithNavbar = ['user',
        'catalog',
        'cart',
        'payment',
        'delivery',
        'home']; // вкладки, где отображается нижний бар

    if (sectionsWithNavbar.includes(sectionId)) {
        navbarbot.style.display = 'flex';
    } else {
        navbarbot.style.display = 'none';
    }
}


let cart = [];

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
        const productCard = event.target.closest('.product-card');
        const productName = productCard.querySelector('h3').innerText;
        const productPrice = productCard.querySelector('.price').innerText;

        addToCart(productName, productPrice);
        event.stopPropagation();
    });
});

// function updateCartDisplay() {
//     const cartSection = document.getElementById('cart');
//     const cartList = cartSection.querySelector('.cart-items');
//
//     // Очистка текущего отображения
//     cartList.innerHTML = '';
//
//     let totalAmount = 0; // Общая сумма товаров
//
//     cart.forEach(item => {
//         const cartItem = document.createElement('div');
//         cartItem.classList.add('cart-item');
//         cartItem.innerHTML = `
//         <p>${item.name}</p>
//         <p>Цена: ${item.price} руб.</p>
//         <p>Количество: ${item.quantity}</p>
//         <button class="remove-from-cart" onclick="removeFromCart('${item.name}')">Удалить</button>
//         `;
//
//         cartList.appendChild(cartItem);
//
//         // Увеличиваем общую сумму на цену текущего товара с учетом его количества
//         totalAmount += item.price * item.quantity;
//     });
//
//     // Отображаем общую сумму и кнопку для оплаты, если корзина не пуста
//     if (cart.length > 0) {
//         const totalAmountDisplay = document.createElement('div');
//         totalAmountDisplay.classList.add('total-amount');
//         totalAmountDisplay.innerText = `Сумма к оплате: ${totalAmount} грн.`;
//
//         const checkoutButton = document.createElement('button');
//         checkoutButton.classList.add('checkout-button');
//         checkoutButton.innerText = 'Оплатить';
//         checkoutButton.onclick = () => {
//             // Здесь можно вызвать функцию для обработки оплаты
//             const isUserReady = confirm('Перейти к оплате');
//
//             showOrderForm();
//         };
//
//         cartList.appendChild(totalAmountDisplay);
//         cartList.appendChild(checkoutButton);
//     }
// }
//
// function updateCartCount() {
//     const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
//     document.getElementById('cart-count').innerText = cartCount;
// }
//



function renderCategoryProducts(categoryId, container) {
    container.innerHTML = ""; // Очищаем контейнер
    categories[categoryId].forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
        <img src="${product.preview_link}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <span class="price">${product.UAH} </span>
        `;
        container.appendChild(productCard);
    });
}






// Вызов функции при загрузке страницы
displayProducts();

// Функция для показа формы оформления заказа
function showOrderForm() {
    console.log("показ чекаута");
    const orderForm = document.getElementById('order-form');
    orderForm.style.display = 'block';
}

// Добавление обработчика для кнопки "Оплатить"
function addCheckoutButtonListener() {
    console.log("чекаут");
    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            showOrderForm(); // Показываем форму оформления заказа
        });
    }
}





document.getElementById('checkout-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('payment-method').value;

    const orderData = {
        name,
        phone,
        email,
        address,
        paymentMethod,
        cart: getCartItems() //  Функция для получения товаров из корзины (см. ниже)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/checkout`, {  // Замените на ваш URL для оформления заказа
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}` // Используйте функцию для получения токена
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Заказ успешно оформлен:', data);
alert(`Заказ успешно оформлен! Номер вашего заказа: ${data.orderId}`);

                // Опционально: Перенаправление на страницу благодарности
                window.location.href = 'thenk-you.html'; // <-- Добавлена переадресация

            // Опционально: Перенаправление на страницу платежного шлюза
            // window.location.href = data.paymentUrl;

            // Очистка корзины (если нужно)
            clearCart();
            loadCart();
            showSection('home'); // Перенаправляем на главную страницу после оформления заказа
        } else {
            const error = await response.json();
            console.error('Ошибка при оформлении заказа:', error);
            alert(`Ошибка при оформлении заказа: ${error.message}`);
        }
    } catch (error) {
        console.error('Ошибка при отправке данных заказа:', error);
        alert('Ошибка при отправке данных заказа. Пожалуйста, попробуйте позже.');
    }
});

// Функция для очистки корзины (пример, нужно реализовать в cart.js, если вы храните корзину на клиенте)
function clearCart() {
    // Реализация очистки корзины (например, удаление из localStorage или Cookie)
    localStorage.removeItem('cart'); // Пример для localStorage
}

// Функция для получения товаров из корзины (нужно реализовать в cart.js)
function getCartItems() {
    // Пример: получение товаров из localStorage
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
}









// Функция для обработки отправки формы
// document.getElementById('checkout-form').addEventListener('submit', (event) => {
//     event.preventDefault();
//
//     const name = document.getElementById('name').value;
//     const phone = document.getElementById('phone').value;
//     const email = document.getElementById('email').value;
//     const address = document.getElementById('address').value;
//     const paymentMethod = document.getElementById('payment-method').value;
//
//     // Здесь можно выполнить действия для отправки заказа на сервер
//     console.log("Заказ оформлен:", {
//         name, phone, email, address, paymentMethod,
//     });
//     alert("Ваш заказ успешно оформлен!");
//
//     // Очистка корзины и скрытие формы
//     cart = [];
//     loadCart();
//     document.getElementById('order-form').style.display = 'none';
// });
//
// Вызов функции для добавления обработчика после обновления корзины
loadCart();
addCheckoutButtonListener();

document.querySelector('.burger-menu').addEventListener('click', function() {
    this.classList.toggle('active');
});

const toggleNavbarButton = document.getElementById('toggleNavbar');
const navbar = document.querySelector('.navbar');

toggleNavbarButton.addEventListener('click', () => {
    navbar.classList.toggle('hidden');

    // Обновляем текст кнопки в зависимости от состояния
    toggleNavbarButton.innerText = navbar.classList.contains('hidden')
    ? 'Показать навигацию': 'Скрыть навигацию';
});

/*

const categories = {
    category1: [
        {
            id: 1,
            name: "Товар 1",
            price: 100,
            description: "Описание товара 1",
            image: "img/product1.jpg"
        },
        {
            id: 2,
            name: "Товар 2",
            price: 200,
            description: "Описание товара 2",
            image: "img/product2.jpg"
        }
    ],
    category2: [
        {
            id: 3,
            name: "Товар 3",
            price: 300,
            description: "Описание товара 3",
            image: "img/product3.jpg"
        },
        {
            id: 4,
            name: "Товар 4",
            price: 400,
            description: "Описание товара 4",
            image: "img/product4.jpg"
        }
    ]
};
*/
function toggleCategory(header, categoryId) {
    const categoryCard = header.parentElement; // Родительский элемент (карточка категории)
    const categoryContent = document.getElementById(categoryId);
    const background = categoryCard.getAttribute('data-bg'); // Получаем фон категории



    if (categoryCard.classList.contains('expanded')) {
        // Закрываем категорию
        categoryCard.classList.remove('expanded');
    } else {
        // Закрываем другие категории
        document.querySelectorAll('.category-card').forEach(card => card.classList.remove('expanded'));

        // Открываем текущую категорию
        categoryCard.classList.add('expanded');

        // Устанавливаем фон для контента и шапки
        header.style.backgroundImage = `url(${background})`;
        if (categoryContent) {
            categoryContent.style.backgroundImage = `url(${background})`;
        }

        // Загружаем товары, если они ещё не были загружены
        if (categoryContent && categoryContent.innerHTML.trim() === "") {
            renderCategoryProducts(categoryId, categoryContent);
        }
    }
}


