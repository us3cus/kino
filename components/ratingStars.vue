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
import { useFetch, useRoute } from "#app";

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
const rating = ref(0);
const hoverIndex = ref(0);
const responseMessage = ref("");
const isSuccess = ref(false);

const setHover = (index: number) => {
  hoverIndex.value = index;
};

const resetHover = () => {
  hoverIndex.value = 0;
};

const handleRating = async (index: number) => {
  rating.value = index;

  try {
    const response = await $fetch(`/users/${props.userId}/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        film_id: props.filmId,
        ball: rating.value,
      },
    });

    if (response?.status === 201) {
      responseMessage.value = `Рейтинг успешно добавлен: ${response.score} для фильма "${response.film.name}"`;
      isSuccess.value = true;
    } else {
      throw new Error(response?.message || "Ошибка при добавлении рейтинга.");
    }
  } catch (error: any) {
    responseMessage.value = error.message || "Ошибка при добавлении рейтинга.";
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
