<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "#vue-router";
import { api } from "~/api";
import { useAuthStore } from "~/stores/auth";

const film = ref(null); // Хранение данных фильма
const errorMessage = ref(null); // Сообщение об ошибке
const reviews = ref([]); // Список отзывов
const isLoading = ref(false); // Флаг загрузки
const newReviewMessage = ref(""); // Текст нового отзыва


const authStore = useAuthStore(); // Доступ к ID пользователя и токену
const route = useRoute(); // Доступ к параметрам маршрута


const fetchFilm = async () => {
  try {
    const filmId = route.params.id; // Получаем ID фильма из маршрута

    if (!filmId) {
      throw new Error("ID фильма отсутствует.");
    }

    const response = await api.get(`/films/${filmId}`);

    if (response.status === 200) {
      film.value = response.data; // Сохраняем данные фильма
    }
  } catch (error) {
    console.error("Ошибка при загрузке фильма:", error.response || error);
    errorMessage.value =
      error.response?.data?.message || "Произошла ошибка. Попробуйте позже.";
  }
};
// Функция для загрузки отзывов
const fetchReviews = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    const filmId = route.params.id; // ID фильма из маршрута

    if (!filmId) {
      throw new Error("ID фильма отсутствует.");
    }

    const response = await api.get(`/films/${filmId}/reviews`);

    if (response.status === 200) {
      reviews.value = response.data.reviews; // Сохраняем список отзывов
    }
  } catch (error) {
    console.error("Ошибка при загрузке отзывов:", error.response || error);

    if (error.response?.status === 404) {
      errorMessage.value = error.response.data.message || "Фильм не найден.";
    } else {
      errorMessage.value = "Произошла ошибка при загрузке отзывов.";
    }
  } finally {
    isLoading.value = false;
  }
};

// Функция для отправки нового отзыва
const sendReview = async () => {
  errorMessage.value = null;

  try {
    const filmId = route.params.id; // ID фильма из маршрута
    const userId = authStore.authData?.id; // ID пользователя из authStore

    if (!filmId || !userId) {
      throw new Error("ID фильма или пользователя отсутствует.");
    }

    if (newReviewMessage.value.length < 4 || newReviewMessage.value.length > 1024) {
      throw new Error("Отзыв должен содержать от 4 до 1024 символов.");
    }

    const response = await api.post(`/users/${userId}/reviews`, {
      film_id: filmId,
      message: newReviewMessage.value,
    }, {
      headers: {
        Authorization: `Bearer ${authStore.authToken}`, // Токен авторизации
      },
    });

    if (response.status === 201) {
      reviews.value.unshift(response.data); // Добавляем новый отзыв в начало списка
      newReviewMessage.value = ""; // Очищаем поле ввода
      alert("Отзыв успешно отправлен! Ожидайте одобрения.");
    }
  } catch (error) {
    console.error("Ошибка при отправке отзыва:", error.response || error);
    errorMessage.value = error.response?.data?.message || "Произошла ошибка при отправке отзыва.";
  }
};

onMounted(() => {
  fetchFilm();
  fetchReviews();
});
</script>

<template>
  <div>
    <!-- Ошибка -->
    <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>

    <!-- Данные фильма -->
    <div v-else-if="film">
      <div class="row">
        <div class="col-md-2">
          <h2>{{ film.ratingAvg }}</h2>
        </div>
        <div class="col-md-8">
          <iframe
            v-if="film.link_video"
            :src="film.link_video"
            width="750"
            height="450"
          ></iframe>
          <p v-else>Видео отсутствует</p>
        </div>
        <div class="col-md-2">
          <ul class="rating-stars">
            <li
              class="star-item"
              v-for="i in 5"
              :key="i"
              :class="{ active: i <= Math.round(film.ratingAvg) }"
            >
              <i class="bi bi-star"></i>
            </li>
          </ul>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <h1>{{ film.name }}</h1>
        </div>

        <div class="col-md-8 fs-5">
          {{ film.duration }} min {{ film.country.name }} {{ film.year_of_issue }}
          {{ film.age }}+ {{ film.created_at | formatDate }}&nbsp;
          {{ film.categories.map((c) => c.name).join(", ") }}
        </div>

        <div class="col-md-4 text-end">
          <a :href="film.link_kinopoisk || '#'" target="_blank">Kinopoisk</a>
        </div>
      </div>

      <div>
        <!-- Сообщение об ошибке -->
        <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
    
        <!-- Отзывы -->
        <div v-else>
          <div class="row">
            <div class="col-md-10">
              <label for="reviewTextarea" class="form-label">Add review</label>
              <textarea
                class="form-control"
                id="reviewTextarea"
                rows="3"
                v-model="newReviewMessage"
              ></textarea>
            </div>
            <div class="col-md-2 d-flex flex-column-reverse">
              <button @click="sendReview" class="btn btn-outline-success">Send</button>
            </div>
          </div>
    
          <div class="row">
            <div class="col-12 fs-4 mt-2">Reviews</div>
            <!-- Отображение списка отзывов -->
            <div class="row" v-for="review in reviews" :key="review.id">
              <div class="col">
                <div class="row">
                  <div class="col-md-10 fs-5 fw-bold">
                    {{ review.user.fio }}
                  </div>
                  <div class="col-md-2 text-end">
                    {{ new Date(review.created_at).toLocaleDateString() }}
                  </div>
                </div>
                <div class="row">
                  <div class="col fs-6">
                    {{ review.message }}
                  </div>
                </div>
              </div>
              <div class="col-12">
                <hr class="border border-success border-2 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>

<style scoped>
.rating-stars .star-item {
  display: inline-block;
}

.rating-stars .star-item .bi-star {
  font-size: 24px;
  color: #ccc;
}

.rating-stars .star-item.active .bi-star {
  color: #ffc107;
}
</style>

<style scoped>
.rating-stars {
  list-style-type: none;
}
.star-item {
  font-size: 2.5rem;
}
.star-link {
  color: #490495;
}
.star-link:hover {
  color: #ff00cd;
}
</style>