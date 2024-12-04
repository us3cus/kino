<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "#vue-router";
import { api } from "~/api"; // Убедитесь, что ваш API настроен

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
  <template>
    <div class="row">
      <div class="col w-75">
        <form @submit.prevent="editUser">
          <h1>Edit Account Info</h1>
          <div class="mb-3">
            <label for="fio" class="form-label">FIO</label>
            <input
                v-model="fio"
                type="text"
                class="form-control"
                id="fio"
                placeholder="Ivanov Ivan Ivanovich"
            />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">E-Mail</label>
            <input
                v-model="email"
                type="email"
                class="form-control"
                id="email"
                placeholder="mail@email.com"
            />
          </div>
          <div class="mb-3">
            <label for="birthday" class="form-label">Birthday</label>
            <input
                v-model="birthday"
                type="date"
                class="form-control"
                id="birthday"
            />
          </div>
          <div>
            <button type="submit" class="btn btn-primary">Update</button>
          </div>
        </form>
      </div>
    </div>
  </template>

</template>

<style scoped>

</style>