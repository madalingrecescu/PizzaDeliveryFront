<!-- Navbar.vue -->

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, watchEffect } from 'vue'

const router = useRouter();

const isLoggedIn = ref(false);

// Check the initial login status
if (localStorage.getItem('token') !== null) {
  isLoggedIn.value = true;
}

watchEffect(() => {
  isLoggedIn.value = localStorage.getItem('token') !== null;
});

const handleLogout = () => {
  localStorage.removeItem('token');
  isLoggedIn.value = false;
  router.push('/');
};

const goToCart = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirect to login if token is not present
    router.push('/login');
    return;
  }
  router.push('/shoppingCart')
}
</script>

<template>
  <div class="navbar">
    <div class="navbar-left">
      <button class="home-button" @click="router.push('/')">Home</button>
    </div>
    <div class="navbar-right">
      <template v-if="isLoggedIn">
        <button class="logout-button" @click="handleLogout">Logout</button>
      </template>
      <template v-else>
        <button class="login-button" @click="router.push('/login')">Login</button>
        <button class="register-button" @click="router.push('/register')">Register</button>
      </template>
      <button class="cart-button" @click=goToCart>
        <img src="../assets/shopping_cart/shopping-cart.png" alt="Shopping Cart" class="cart-icon" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 1em;
  background-color: darkcyan;
  color: #fff;
  box-shadow: 0 25px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.cart-icon {
  width: 20px;
  height: 20px;
}

.home-button,
.login-button,
.register-button,
.cart-button,
.logout-button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  margin: 0 10px;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out;
}

.home-button:hover,
.login-button:hover,
.register-button:hover,
.cart-button:hover {
  background-color: #2c6463;
}
</style>
