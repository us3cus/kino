<template>
  <div class="rating">
    <span
        v-for="star in stars"
        :key="star"
        class="star"
        :class="{ active: star <= hoverIndex, selected: star <= rating }"
        @mouseover="setHover(star)"
        @mouseleave="resetHover"
        @click="handleRating(star)"
    >
      ★
    </span>
    <p v-if="responseMessage" :class="{ success: isSuccess, error: !isSuccess }">
      {{ responseMessage }}
    </p>
  </div>
</template>


<script setup lang="ts">
import { ref } from "vue";
import { api } from "~/api"; // Убедитесь, что axios настроен корректно
import { useUserStore } from "~/stores/user";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore(); // Доступ к ID пользователя и токену
const userStore = useUserStore(); // Доступ к данным пользователя

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  filmId: {
    type: Number,
    required: true,
  },
});

const stars = [1, 2, 3, 4, 5];
const rating = ref(0); // Текущий рейтинг
const hoverIndex = ref(0); // Индекс текущей наведённой звезды
const responseMessage = ref(""); // Сообщение об ответе
const isSuccess = ref(false); // Флаг успешности

const setHover = (index: number) => {
  hoverIndex.value = index; // Устанавливаем индекс при наведении
};

const resetHover = () => {
  hoverIndex.value = 0; // Сбрасываем индекс при снятии курсора
};

const handleRating = async (index: number) => {
  rating.value = index; // Устанавливаем выбранный рейтинг

  try {
    // Отправка POST-запроса с помощью axios
    const response = await api.post(
        `/users/${userStore.userData?.id}/ratings`,
        {
          film_id: props.filmId,
          ball: rating.value,
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.authToken}`, // Токен пользователя
          },
        }
    );

    if (response.status === 201) {
      responseMessage.value = `Рейтинг успешно добавлен: ${rating.value}`;
      isSuccess.value = true;
    } else {
      throw new Error("Ошибка при добавлении рейтинга.");
    }
  } catch (error: any) {
    responseMessage.value = error.response?.data?.message || "Ошибка при добавлении рейтинга.";
    isSuccess.value = false;
  }
};
</script>


<style scoped>
.rating {
  display: flex;
  font-size: 2rem;
  cursor: pointer;
}

.star {
  color: #ccc;
  transition: color 0.2s;
}

.star.active {
  color: gold;
}

.star.selected {
  color: orange;
}

p.success {
  color: green;
}

p.error {
  color: red;
}
</style>
