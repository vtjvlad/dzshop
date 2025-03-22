/**
 * @jest-environment jsdom
 */

const { register, login } = require("./public/auth2.js");

beforeEach(() => {
  document.body.innerHTML = `
    <form id="registrationForm">
      <input id="reg-username" />
      <input id="reg-email" />
      <input id="reg-password" />
      <button type="submit">Register</button>
    </form>

    <form id="loginForm">
      <input id="login-input" />
      <input id="login-password" />
      <button type="submit">Login</button>
    </form>

    <button id="telegramAuthButton"></button>
  `;

  global.fetch = jest.fn();
});

beforeEach(() => {
  document.body.innerHTML = `
    <form id="registrationForm"></form>
    <form id="loginForm"></form>
  `;
});

beforeEach(() => {
  document.body.innerHTML = `
    <form id="registrationForm"></form>
    <form id="loginForm"></form>
  `;

  require("./auth2"); // Импортируем после создания DOM
});




describe("Тестирование регистрации", () => {
  test("Успешная регистрация", async () => {
    document.getElementById("reg-username").value = "testUser";
    document.getElementById("reg-email").value = "test@example.com";
    document.getElementById("reg-password").value = "password";

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: "Success" }),
    });

    const event = { preventDefault: jest.fn() };
    await register(event);

    expect(fetch).toHaveBeenCalledWith("https://dzshop24.com/register", expect.any(Object));
  });

  test("Ошибка регистрации", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Ошибка" }),
    });

    const event = { preventDefault: jest.fn() };
    await register(event);

    expect(fetch).toHaveBeenCalled();
  });
});


const { JSDOM } = require("jsdom");

const apiUrl = "https://dzshop24.com";
global.fetch = jest.fn();

beforeEach(() => {
  // Создаём виртуальный DOM
  const dom = new JSDOM(`
    <form id="registrationForm">
      <input id="reg-username" />
      <input id="reg-email" />
      <input id="reg-password" />
    </form>

    <form id="loginForm">
      <input id="login-input" />
      <input id="login-password" />
    </form>

    <button id="telegramAuthButton"></button>
  `);
  global.document = dom.window.document;
  global.localStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
  };
});

describe("Тестирование регистрации", () => {
  test("Успешная регистрация", async () => {
    document.getElementById("reg-username").value = "testUser";
    document.getElementById("reg-email").value = "test@example.com";
    document.getElementById("reg-password").value = "password";

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: "Регистрация успешна!" }),
    });

    const event = { preventDefault: jest.fn() };
    await register(event);

    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/register`, expect.any(Object));
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test("Ошибка регистрации", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Ошибка регистрации" }),
    });

    const event = { preventDefault: jest.fn() };
    await register(event);

    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/register`, expect.any(Object));
  });
});

describe("Тестирование входа", () => {
  test("Успешный вход", async () => {
    document.getElementById("login-input").value = "testUser";
    document.getElementById("login-password").value = "password";

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: "testToken" }),
    });

    const event = { preventDefault: jest.fn() };
    await login(event);

    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/login`, expect.any(Object));
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "testToken");
  });

  test("Ошибка входа", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Неверный логин или пароль" }),
    });

    const event = { preventDefault: jest.fn() };
    await login(event);

    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/login`, expect.any(Object));
  });
});

describe("Тестирование Telegram авторизации", () => {
  test("Успешная авторизация", async () => {
    global.window = {
      Telegram: {
        WebApp: {
          initDataUnsafe: {
            user: { id: 123, username: "tg_user", first_name: "John", last_name: "Doe" },
          },
        },
      },
    };

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: "tgToken" }),
    });

    const button = document.getElementById("telegramAuthButton");
    const event = new Event("click");
    button.dispatchEvent(event);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/auth/telegram`, expect.any(Object));
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "tgToken");
  });
});
