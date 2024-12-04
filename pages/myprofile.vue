<script setup lang="ts">
import { useRouter } from "#vue-router";
import { useAuthStore } from "~/stores/auth";
import { useUserStore } from "~/stores/user";
import { storeToRefs } from "pinia";
import { api } from "~/api";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

// Реактивные данные из хранилищ
const { authData, authToken } = storeToRefs(authStore);
const { userData } = storeToRefs(userStore);

// Загружаем данные пользователя при наличии токена
onMounted(async () => {
  if (authToken.value && authData.value?.id) {
    try {
      userStore.setAuthToken(authToken.value); // Устанавливаем токен в userStore
      await userStore.fetchUserData(authData.value.id); // Загружаем данные пользователя
    } catch (error) {
      console.error("Ошибка загрузки данных пользователя:", error);
    }
  }
});
// Функция удаления аккаунта
const deleteAccount = async () => {
  try {
    // Логирование для отладки
    console.log("Токен авторизации:", authStore.authToken);
    console.log("ID пользователя:", authStore.authData?.id);

    if (!authStore.authToken) {
      throw new Error("Токен авторизации отсутствует. Пожалуйста, войдите снова.");
    }

    if (!authStore.authData?.id) {
      throw new Error("ID пользователя отсутствует. Пожалуйста, войдите снова.");
    }

    const userId = authStore.authData.id;

    // Отправляем запрос на удаление аккаунта с ID в URL
    await api.delete(`/api/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${authStore.authToken}`, // Передаём токен
      },
    });

    // Очищаем локальные данные
    authStore.authToken = null;
    authStore.authData = null;
    userStore.resetStore();

    // Удаляем токен из localStorage
    localStorage.removeItem("authToken");

    // Перенаправляем на страницу регистрации или входа
    router.push("/signup");
  } catch (error) {
    console.error("Ошибка при удалении аккаунта:", error.response || error);

    // Обработка различных ошибок
    if (error.response?.status === 401 || error.response?.data?.message === "Unauthenticated.") {
      alert("Ошибка авторизации. Пожалуйста, войдите снова.");
      router.push("/signin");
    } else if (error.response?.status === 404) {
      alert("Пользователь не найден. Возможно, аккаунт уже удален.");
      router.push("/signup");
    } else {
      alert("Произошла ошибка при удалении аккаунта. Попробуйте позже.");
    }
  }
};

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


</template>

<style scoped>
</style>
