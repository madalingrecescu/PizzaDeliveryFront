<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const username = ref("")
const password = ref("")

const router = useRouter();

const errorMessages = ref<string[]>([]);

const validateFields = () => {
  errorMessages.value = [];

  if (!username.value) {
    errorMessages.value.push('Username field is required');
  } else if (username.value.length > 50) {
    errorMessages.value.push('Username should contain a maximum of 50 characters');
  }

  if (!password.value) {
    errorMessages.value.push('Password field is required');
  } else if (password.value.length < 6) {
    errorMessages.value.push('Password must contain at least 6 characters');
  }

  return errorMessages.value.length === 0;
}
const onSubmit = async () => {
  if (!validateFields()) {
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/login', {
      username: username.value,
      password: password.value,
    });

    localStorage.setItem('token', response.data.access_token);
    router.push("/");
    router.go(); // Reloads the current route

  } catch (error) {
    // Check if the error is due to invalid credentials
    if (error.response && error.response.status === 401) {
      errorMessages.value.push('Invalid username or password');
    } else {
      console.error('Error during login:', error);
    }
  }
};

</script>

<template>
  <div class="screen-1">
    <div class="title-container">
      <h1>Login</h1>
    </div>
    <div class="login-container">

      <div class="username">
        <label for="username">Username</label>
        <div class="sec-2">
          <ion-icon name="mail-outline"></ion-icon>
          <input v-model="username" id="username" type="email" class="w-full p-2 border border-gray-300 rounded-md" />
          <span class="error-message" v-if="errorMessages.includes('Username field is required')">Username field is
            required</span>
          <span class="error-message"
            v-if="errorMessages.includes('Username should contain a maximum of 50 characters')">Username should contain a
            maximum of 50 characters</span>
        </div>
      </div>

      <div class="password">
        <label for="password">Password</label>
        <div class="sec-2">
          <ion-icon name="lock-closed-outline"></ion-icon>
          <input v-model="password" id="password" type="password" class="w-full p-2 border border-gray-300 rounded-md" />
          <ion-icon class="show-hide" name="eye-outline"></ion-icon>
          <span class="error-message" v-if="errorMessages.includes('Password field is required')">Password field is
            required</span>
          <span class="error-message"
            v-if="errorMessages.includes('Password must contain at least 6 characters')">Password must contain at least 6
            characters</span>
        </div>
      </div>

      <span class="error-message" v-if="errorMessages.includes('Invalid username or password')">Invalid username or password</span>

      <button class="login" @click="onSubmit">Login</button>

    </div>
  </div>
</template>
  
<style scoped>
.title-container {
  margin-top: -15em;
  display: flex;
  justify-content: center;
}

.register-container {
  margin-top: 12em;
}

.screen-1 {
  background: hsl(213deg 85% 97%);
  padding: 16em;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  box-shadow: 0 0 2em hsl(231deg 62% 94%);
  gap: 2em;
}

.username {
  background: hsl(0deg 0% 100%);
  box-shadow: 0 0 2em hsl(231deg 62% 94%);
  padding: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  border-radius: 20px;
  color: hsl(0deg 0% 30%);
  margin-top: 3em;
}

.password {
  background: hsl(0deg 0% 100%);
  box-shadow: 0 0 2em hsl(231deg 62% 94%);
  padding: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  border-radius: 20px;
  color: hsl(0deg 0% 30%);
  margin-top: 2em;
}

.login {
  padding: 1em;
  background: hsl(233deg 36% 38%);
  color: hsl(0 0 100);
  border: none;
  border-radius: 30px;
  font-weight: 600;
  margin-top: 2em;
}



.error-message {
  color: red;
  font-size: 12px;
  display: block;
  margin-top: 5px;
}


button {
  cursor: pointer;
}</style>