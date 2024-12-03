import { defineStore } from "pinia";
import { api } from "~/api";

export const useUserStore = defineStore("user", () => {
  const userData = ref(null); // Переменная для хранения данных пользователя
  const loading = ref(false); // Флаг загрузки
  const error = ref(null); // Переменная для хранения ошибки

  // Метод для получения данных
  const fetchUserData = async () => {
    loading.value = true; // Устанавливаем флаг загрузки
    error.value = null; // Очищаем предыдущую ошибку

    try {
      const response = await api.get("/users"); // Замените `/user` на ваш реальный endpoint
      if (response.status === 200) {
        userData.value = response.data; // Сохраняем данные
        console.log("Данные пользователя получены:", userData.value);
      } else {
        console.error("Ошибка при запросе данных:", response.status);
        throw new Error(`Ошибка: ${response.status}`);
      }
    } catch (err) {
      console.error("Ошибка при запросе:", err);
      error.value = err.message; // Сохраняем ошибку
    } finally {
      loading.value = false; // Сбрасываем флаг загрузки
    }
  };

  return {
    userData,
    loading,
    error,
    fetchUserData,
  };
});
