import { defineStore } from "pinia";
import { api } from "~/api";

export const useUserStore = defineStore("user", () => {
  const userData = ref(null); // Хранение данных пользователя
  const loading = ref(false); // Флаг загрузки
  const error = ref(null); // Хранение ошибок
  const authToken = ref(null); // Токен авторизации

  // Метод для получения данных пользователя
  const fetchUserData = async (id) => {
    if (!authToken.value) {
      error.value = "Токен авторизации отсутствует";
      console.error("Токен отсутствует");
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await api.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken.value}`, // Передаём токен в заголовке
        },
      });

      if (response.status === 200) {
        userData.value = response.data; // Сохраняем данные пользователя
        console.log("Данные пользователя получены:", userData.value);
      } else {
        throw new Error(`Ошибка: ${response.status}`);
      }
    } catch (err) {
      console.error("Ошибка при запросе данных пользователя:", err);
      error.value = err.response?.data?.message || err.message; // Сохраняем текст ошибки
    } finally {
      loading.value = false;
    }
  };

  // Метод для установки токена
  //
  const setAuthToken = (token) => {
    if (!token) {
     console.error("Попытка установить пустой токен");
      return;
    }
    authToken.value = token;
  };

  return {
    userData,
    loading,
    error,
    fetchUserData,
    setAuthToken,
  };
});
