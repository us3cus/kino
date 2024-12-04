<script setup lang="ts">
import { ref, onMounted } from "vue";
import { api } from "~/api"; // Убедитесь, что ваш API настроен
import { useAuthStore } from "~/stores/auth";

const reviews = ref([]); // Список отзывов
const isLoading = ref(false); // Флаг загрузки
const errorMessage = ref(null); // Сообщение об ошибке

const authStore = useAuthStore(); // Доступ к ID пользователя и токену

// Функция для загрузки отзывов
const fetchReviews = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    const userId = authStore.authData?.id; // Получаем ID пользователя из authStore

    if (!userId) {
      throw new Error("ID пользователя отсутствует. Попробуйте войти снова.");
    }

    const response = await api.get(`/users/${userId}/reviews`, {
      headers: {
        Authorization: `Bearer ${authStore.authToken}`, // Токен авторизации
      },
    });

    if (response.status === 200) {
      reviews.value = response.data.reviews || []; // Сохраняем отзывы, проверяя наличие данных
    }
  } catch (error) {
    console.error("Ошибка при загрузке отзывов:", error.response || error);

    if (error.response?.status === 404) {
      errorMessage.value = "Пользователь не найден.";
    } else {
      errorMessage.value = "Произошла ошибка при загрузке отзывов. Попробуйте позже.";
    }
  } finally {
    isLoading.value = false;
  }
};

// Функция для удаления отзыва
const deleteReview = async (reviewId) => {
  errorMessage.value = null;

  try {
    const userId = authStore.authData?.id; // Получаем ID пользователя из authStore

    if (!userId) {
      throw new Error("ID пользователя отсутствует. Попробуйте войти снова.");
    }

    await api.delete(`/users/${userId}/reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${authStore.authToken}`, // Токен авторизации
      },
    });

    // Убираем удалённый отзыв из списка
    reviews.value = reviews.value.filter((review) => review.id !== reviewId);
    alert("Отзыв успешно удалён!");
  } catch (error) {
    console.error("Ошибка при удалении отзыва:", error.response || error);

    if (error.response?.status === 404) {
      errorMessage.value = error.response.data.message || "Отзыв не найден.";
    } else {
      errorMessage.value = "Произошла ошибка при удалении отзыва. Попробуйте позже.";
    }
  }
};

// Загружаем отзывы при монтировании компонента
onMounted(() => {
  fetchReviews();
});
</script>

<template>
  <div>
    <h1>My Reviews</h1>

    <!-- Сообщение об ошибке -->
    <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>

    <!-- Состояние загрузки -->
    <p v-if="isLoading">Отзывы загружаются...</p>

    <!-- Отображение отзывов -->
    <ul v-else>
      <li v-for="review in reviews" :key="review.id" class="mb-3">
        <h4>{{ review.film?.name || "Unknown Film" }}</h4>
        <p>{{ review.message }}</p>
        <p><strong>Approved:</strong> {{ review.is_approved ? "Yes" : "No" }}</p>
        <p><strong>Date:</strong> {{ new Date(review.created_at).toLocaleDateString() }}</p>
        <button @click="deleteReview(review.id)" class="btn btn-danger btn-sm">
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>
