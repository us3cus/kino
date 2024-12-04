<template>
  <div>
    <header>
      <nav class="navbar navbar-expand-lg bg-body-tertiary mb-3">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Navbar</a>
          <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <button
                    type="button"
                    @click="router.push('/')"
                    class="nav-link active"
                    aria-current="page"
                >
                  Home
                </button>
              </li>
            </ul>
            <div class="ms-auto d-flex">
              <!-- Кнопки для неавторизованных пользователей -->
              <div v-if="!userData">
                <button
                    @click="router.push('signin')"
                    class="btn btn-outline me-2 text-decoration-none"
                    type="button"
                >
                  Sign In
                </button>
                <button
                    @click="router.push('signup')"
                    class="btn btn-sm btn-outline"
                    type="button"
                >
                  Sign Up
                </button>
              </div>

              <!-- Кнопка с именем пользователя для авторизованных пользователей -->
              <div v-else>
                <button @click="router.push('/myprofile')"
                    class="btn btn-sm btn-outline" type="button">
                  {{ userData.fio }}
                </button>
                <button @click="handleLogout"
                        class="btn btn-sm btn-outline" type="button">
                  sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main class="main my-4 mx-5">
      <NuxtPage />
    </main>

    <footer class="bg-dark text-white p-3 mt-3">
      <div class="container text-center">
        <p class="lead">&copy; Copyright</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "#vue-router";
import { useAuthStore } from "~/stores/auth";
import { useUserStore } from "~/stores/user";
import { storeToRefs } from "pinia";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

// Реактивные данные из хранилищ
const { authData, authToken } = storeToRefs(authStore);
const { userData } = storeToRefs(userStore);

const handleLogout = () => {
  authStore.logout(); // Вызываем функцию выхода
  userStore.userData = null;
  router.push('/');
};

// Загружаем данные пользователя при наличии токена

  if (authToken.value && authData.value?.id) {
    try {
      userStore.setAuthToken(authToken.value); // Устанавливаем токен в userStore
      await userStore.fetchUserData(authData.value.id); // Загружаем данные пользователя
    } catch (error) {
      console.error("Ошибка загрузки данных пользователя:", error);
    }
  }
</script>
