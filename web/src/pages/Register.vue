<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const username = ref('');
const email = ref('');
const password = ref('');
const phoneNumber = ref('');

const registrationData = ref({});
const router = useRouter();

const errorMessages = ref<string[]>([]);

const isValidEmail = (email) => {
  // Regular expression for a basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
const validateFields = () => {
  errorMessages.value = [];

  if (!username.value) {
    errorMessages.value.push('Username field is required');
  } else if (username.value.length > 50) {
    errorMessages.value.push('Username should contain a maximum of 50 characters');
  }

  if (!email.value) {
    errorMessages.value.push('Email address field is required');
  } else if (email.value.length > 50) {
    errorMessages.value.push('Email address should contain a maximum of 50 characters');
  } else if (!isValidEmail(email.value)) {
    errorMessages.value.push('Invalid email address format');
  }

  if (!password.value) {
    errorMessages.value.push('Password field is required');
  } else if (password.value.length < 6) {
    errorMessages.value.push('Password must contain at least 6 characters');
  }
  const phoneRegex = /^[0-9]+(\.[0-9]+)?$/;
  if (!phoneNumber.value) {
    errorMessages.value.push('Phone Number field is required');
  } else if (!phoneRegex.test(phoneNumber.value)) {
    errorMessages.value.push('Phone nuber should contain only numbers');
  } else if (phoneNumber.value.length != 10) {
    errorMessages.value.push("Phone number should be 10 characters long");
  } else if (phoneNumber.value[0] != "0") {
    errorMessages.value.push("Phone number must start with 0")
  }

  return errorMessages.value.length === 0;
}

const onSubmit = async () => {
  try {
    if (!validateFields()) {
      return;
    }
    const response = await axios.post('http://localhost:3000/register', {
      username: username.value,
      email: email.value,
      password: password.value,
      phoneNumber: phoneNumber.value,
    });

    registrationData.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }

  router.push("/login")
};


</script>

<template>
  <div class="screen-1">
    <div class="title-container">
      <h1 class="title">Register</h1>
    </div>
    <div class="register-container">
      <div class="username">
        <label for="username">Username</label>
        <div class="sec-2">
          <ion-icon name="person-outline"></ion-icon>
          <input v-model="username" id="username" type="text" class="w-full p-2 border border-gray-300 rounded-md mt-1" />
        </div>
        <span class="error-message" v-if="errorMessages.includes('Username field is required')">Username field is
          required</span>
        <span class="error-message"
          v-if="errorMessages.includes('Username should contain a maximum of 50 characters')">Username should contain a
          maximum of 50 characters</span>
      </div>

      <div class="email">
        <label for="email">Email Address</label>
        <div class="sec-2">
          <ion-icon name="mail-outline"></ion-icon>
          <input v-model="email" id="email" type="email" class="w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <span class="error-message" v-if="errorMessages.includes('Email address field is required')">Email address field
          is required</span>
        <span class="error-message"
          v-if="errorMessages.includes('Email address should contain a maximum of 50 characters')">Email address should
          contain a maximum of 50 characters</span>
        <span class="error-message" v-if="errorMessages.includes('Invalid email address format')">Invalid email address
          format</span>
      </div>

      <div class="password">
        <label for="password">Password</label>
        <div class="sec-2">
          <ion-icon name="lock-closed-outline"></ion-icon>
          <input v-model="password" id="password" type="password" class="w-full p-2 border border-gray-300 rounded-md" />
          <ion-icon class="show-hide" name="eye-outline"></ion-icon>
        </div>
        <span class="error-message" v-if="errorMessages.includes('Password field is required')">Password field is
          required</span>
        <span class="error-message" v-if="errorMessages.includes('Password must contain at least 6 characters')">Password
          must contain at least 6 characters</span>
      </div>

      <div class="phoneNumber">
        <label for="phoneNumber">Phone Number</label>
        <div class="sec-2">
          <ion-icon name="call-outline"></ion-icon>
          <input v-model="phoneNumber" id="phoneNumber" type="tel" class="w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <span class="error-message" v-if="errorMessages.includes('Phone Number field is required')">Phone number field is
          required</span>
        <span class="error-message" v-if="errorMessages.includes('Phone nuber should contain only numbers')">Phone number
          should contain only numbers</span>
        <span class="error-message" v-if="errorMessages.includes('Phone number should be 10 characters long')">Phone
          number should be 10 characters long</span>
        <span class="error-message" v-if="errorMessages.includes('Phone number must start with 0')">Phone number must
          start with 0</span>
      </div>

      <button class="register" @click="onSubmit">Register</button>
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
  margin-top: 10em;
}

.error-message {
  color: red;
  font-size: 12px;
  display: block;
  margin-top: 5px;
}

.username {
  background: hsl(0deg 0% 100%);
  box-shadow: 0 0 2em hsl(231deg 62% 94%);
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  border-radius: 20px;
  color: hsl(0deg 0% 30%);
  margin-top: -10em;
}

.phoneNumber {
  background: hsl(0deg 0% 100%);
  box-shadow: 0 0 2em hsl(231deg 62% 94%);
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  border-radius: 20px;
  color: hsl(0deg 0% 30%);
  margin-top: 1em;
}

.screen-1 {
  background: hsl(213deg 85% 97%);
  padding: 14em;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  box-shadow: 0 0 2em hsl(231deg 62% 94%);
  gap: 2em;
}

.email {
  background: hsl(0deg 0% 100%);
  box-shadow: 0 0 2em hsl(231deg 62% 94%);
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  border-radius: 20px;
  color: hsl(0deg 0% 30%);
  margin-top: 1em;

}

.password {
  background: hsl(0deg 0% 100%);
  box-shadow: 0 0 2em hsl(231deg 62% 94%);
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  border-radius: 20px;
  color: hsl(0deg 0% 30%);
  margin-top: 1em;

}

.register {
  padding: 1em;
  background: hsl(233deg 36% 38%);
  color: hsl(0 0 100);
  border: none;
  border-radius: 30px;
  font-weight: 600;
  margin-top: 1em;

}

button {
  cursor: pointer;
}</style>