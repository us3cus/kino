


<script setup lang="ts">
import { ref, onMounted } from "vue";
import { api } from "~/api"; // Убедитесь, что ваш API настроен
import { useAuthStore } from "~/stores/auth";

const ratings = ref([]); // Список рейтингов
const isLoading = ref(false); // Флаг загрузки
const errorMessage = ref(null); // Сообщение об ошибке

const authStore = useAuthStore(); // Доступ к ID пользователя и токену

// Функция для загрузки рейтингов
const fetchRatings = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    const userId = authStore.authData?.id; // Получаем ID пользователя из authStore

    if (!userId) {
      throw new Error("ID пользователя отсутствует. Попробуйте войти снова.");
    }

    const response = await api.get(`/users/${userId}/ratings`, {
      headers: {
        Authorization: `Bearer ${authStore.authToken}`, // Токен авторизации
      },
    });

    if (response.status === 200) {
      ratings.value = response.data.ratings || []; // Сохраняем рейтинги, проверяя наличие данных
    }
  } catch (error) {
    console.error("Ошибка при загрузке рейтингов:", error.response || error);

    if (error.response?.status === 404) {
      errorMessage.value = "Пользователь не найден.";
    } else {
      errorMessage.value = "Произошла ошибка при загрузке рейтингов. Попробуйте позже.";
    }
  } finally {
    isLoading.value = false;
  }
};

// Функция для удаления рейтинга
const deleteRating = async (ratingId) => {
  errorMessage.value = null;

  try {
    const userId = authStore.authData?.id; // Получаем ID пользователя из authStore

    if (!userId) {
      throw new Error("ID пользователя отсутствует. Попробуйте войти снова.");
    }

    await api.delete(`/users/${userId}/ratings/${ratingId}`, {
      headers: {
        Authorization: `Bearer ${authStore.authToken}`, // Токен авторизации
      },
    });

    // Убираем удалённый рейтинг из списка
    ratings.value = ratings.value.filter((rating) => rating.id !== ratingId);
    alert("Рейтинг успешно удалён!");
  } catch (error) {
    console.error("Ошибка при удалении рейтинга:", error.response || error);

    if (error.response?.status === 404) {
      errorMessage.value = error.response.data.message || "Рейтинг не найден.";
    } else {
      errorMessage.value = "Произошла ошибка при удалении рейтинга. Попробуйте позже.";
    }
  }
};

// Загружаем рейтинги при монтировании компонента
onMounted(() => {
  fetchRatings();
});
</script>
<template>
  <div>
    <h1>My Ratings</h1>

    <!-- Сообщение об ошибке -->
    <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>

    <!-- Состояние загрузки -->
    <p v-if="isLoading">Рейтинги загружаются...</p>

    <!-- Отображение рейтингов -->
    <ul v-else>
      <li v-for="rating in ratings" :key="rating.id" class="mb-3">
        <h4>{{ rating.film?.name || "Unknown Film" }}</h4>
        <p><strong>Score:</strong> {{ rating.score }}</p>
        <p><strong>Date:</strong> {{ new Date(rating.created_at).toLocaleDateString() }}</p>
        <button @click="deleteRating(rating.id)" class="btn btn-danger btn-sm">
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>
