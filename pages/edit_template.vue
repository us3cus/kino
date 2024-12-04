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
      <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profile</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">Contact</button>
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

    </div>
    <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">...</div>
  </div>

</template>

<style scoped>

</style>