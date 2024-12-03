import { defineStore } from "pinia";
import { api } from "~/api/index.js";

export const useAuthStore = defineStore("auth", () => {
  const authData = ref(null); // Данные пользователя
  const authCookie = useCookie("auth"); // Cookie для сохранения токена авторизации
  const authToken = ref(null); // Токен авторизации

  // Авторизация
  const signin = async (credentials) => {
    try {
      const response = await api.post("/auth/signin", credentials);
      authToken.value = response.data.token; // Сохраняем токен
      authData.value = { fio: response.data.fio, id: response.data.id }; // Сохраняем основные данные
      saveAuthData(); // Сохраняем данные в cookie
      await fetchUserData(response.data.id); // Загружаем полные данные пользователя
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      throw error;
    }
  };

  // Регистрация
  const signup = async (data) => {
    try {
      const response = await api.post("/auth/signup", data);
      authToken.value = response.data.token; // Сохраняем токен
      authData.value = { fio: response.data.fio, id: response.data.id }; // Сохраняем основные данные
      saveAuthData(); // Сохраняем данные в cookie
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      throw error;
    }
  };

  // Сохранение данных в cookie
  const saveAuthData = () => {
    if (authData.value && authToken.value) {
      authCookie.value = btoa(JSON.stringify({ authData: authData.value, token: authToken.value }));
    }
  };

  // Чтение данных из cookie
  const readAuthData = () => {
    if (authCookie.value) {
      const savedData = JSON.parse(atob(authCookie.value));
      authData.value = savedData.authData;
      authToken.value = savedData.token;
    }
  };

  // Получение полной информации о пользователе
  const fetchUserData = async (id) => {
    if (!authToken.value) return; // Проверяем, что токен существует
    try {
      const response = await api.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken.value}`, // Передаём токен в заголовках
        },
      });
      authData.value = response.data; // Обновляем данные пользователя
    } catch (error) {
      console.error("Ошибка при загрузке данных пользователя:", error);
    }
  };

  // Инициализация: читаем данные из cookie при загрузке приложения
  readAuthData();

  return {
    authData,
    authToken,
    signin,
    signup,
    fetchUserData,
  };
});
