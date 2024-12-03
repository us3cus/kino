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
              <button
                v-if="!userData"
                @click="router.push('signin')"
                class="btn btn-outline me-2 text-decoration-none"
                type="button"
              >
                Sign In
              </button>
              <button
                v-if="!userData"
                @click="router.push('signup')"
                class="btn btn-sm btn-outline"
                type="button"
              >
                Sign Up
              </button>

              <!-- Кнопка с именем пользователя для авторизованных пользователей -->
              <button
                v-if="userData"
                class="btn btn-sm btn-outline"
                type="button"
              >
                {{ userData.fio }}
              </button>
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
import { storeToRefs } from "pinia";

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  if (authStore.authToken) {
    authStore.fetchUserData(authStore.userData?.id); // Загружаем данные пользователя, если есть токен
  }
});

// Используем storeToRefs для реактивных свойств
const { userData } = storeToRefs(authStore);
</script>
