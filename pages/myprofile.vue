<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "#vue-router";
import { api } from "~/api";
import {useUserStore} from "~/stores/user"; // Убедитесь, что ваш API настроен

const userStore = useUserStore();
const { userData } = storeToRefs(userStore);

const fio = ref("");
const email = ref("");
const birthday = ref("");
const gender = ref(0);
const authStore = useAuthStore();
const router = useRouter();
const ratings = ref([]); // Список рейтингов

const editUser = async () => {
  // Проверка ограничений перед отправкой запроса
  if (fio.value.length < 2 || fio.value.length > 150) {
    throw new Error("FIO должно быть длиной от 2 до 150 символов.");
  }
  if (email.value.length < 4 || email.value.length > 50) {
    throw new Error("E-mail должен быть длиной от 4 до 50 символов.");
  }

  const response = await api.put("/users", {
    fio: fio.value,
    email: email.value,
    birthday: birthday.value,

  }, {
    headers: {
      Authorization: `Bearer ${authStore.authToken}`, // Передаём токен
    },
  });
  router.push("/myprofile"); // Перенаправляем пользователя

};
import { ref, onMounted } from "vue";


const reviews = ref([]); // Список отзывов
const isLoading = ref(false); // Флаг загрузки
const errorMessage = ref(null); // Сообщение об ошибке

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

// Загружаем отзывы при монтировании компонента
onMounted(() => {
  fetchReviews();
  fetchRatings();
  });
</script>

<template>
  <ul v-if="userData && userData.fio">
    <li>
      {{ userData.fio }}
    </li>
    <li>
      {{ userData.reviewCount }}
    </li>
    <li>
      {{ userData.ratingCount }}
    </li>
  </ul>
  <p v-else>Данные пользователя загружаются...</p>
  <ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">MY PROFILE</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">MY REVIEWS</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">MY SCORES</button>
    </li>
  </ul>
  <div class="tab-content" id="myTabContent">
    <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">

      <ul v-if="userData && userData.fio">
        <li>
          {{ userData.email }}
        </li>
        <li>
          {{ userData.birthday }}
        </li>
        <li>
          {{ userData.gender.name }}
        </li>
      </ul>
      <button @click="router.push('/edit')"
              class="btn btn-sm btn-outline" type="button">
        edit
      </button>
      <button @click="deleteAccount"
              class="btn btn-sm btn-outline" type="button">
        delete account
      </button>

    </div>
    <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
      <div>
    
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
    </div>
    <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
      <div>
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
    </div>
  </div>

</template>

<style scoped>

</style>