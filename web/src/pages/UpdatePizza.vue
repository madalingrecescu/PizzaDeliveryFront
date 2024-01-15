<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface UpdatePizzaRequest {
  name: string;
  description: string;
  price: number;
  imageName?: string;
}

const name = ref('');
const description = ref('');
const price = ref('');
const image = ref<File | undefined>(undefined);
const imageName = ref<string | undefined>(undefined);
const errorMessages = ref<string[]>([]);

const route = useRoute();
const router = useRouter();
const pizzaName = route.params.pizzaName;

onMounted(async () => {
  if (pizzaName) {
    try {
      const response = await axios.get(`http://localhost:4000/pizzas/name/${pizzaName}`);
      const pizzaData = response.data;

      name.value = pizzaData.name;
      description.value = pizzaData.description;
      price.value = pizzaData.price.toString();
    } catch (error) {
      console.error('Failed to fetch pizza data:', error);
    }
  }
});

const validateFields = () => {
  errorMessages.value = [];

  if (!name.value) {
    errorMessages.value.push('Name is required');
  } else if (name.value.length > 50) {
    errorMessages.value.push('Name should contain a maximum of 50 characters');
  }

  if (description.value.length > 200) {
    errorMessages.value.push('Description should contain a maximum of 200 characters');
  }

  const priceRegex = /^[0-9]+(\.[0-9]+)?$/;
  if (!priceRegex.test(price.value) || parseFloat(price.value) <= 0) {
    errorMessages.value.push('Price should be a number greater than 0');
  }

  if (!image.value) {
    errorMessages.value.push('A picture must be selected');
  }

  return errorMessages.value.length === 0;
};

const onSubmit = async () => {
  try {
    if (!validateFields()) {
      return;
    }

    const requestData: UpdatePizzaRequest = {
      name: name.value,
      description: description.value,
      price: parseFloat(price.value),
    };

    if (imageName.value) {
      requestData.imageName = imageName.value;
    }

    const response = await axios.put(`http://localhost:4000/updatePizza/${pizzaName}`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Pizza-Name': pizzaName,
      },
    });

    console.log(response.data);

    // Redirect to the home page after a successful update
    router.push('/');
  } catch (error) {
    console.error(error);
  }
};

const handleImageUpload = (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];

  if (file) {
    imageName.value = file.name.replace(/\.[^/.]+$/, '');
    image.value = file;
  }
};
</script>

<template>
  <div class="screen-1">
    <div class="name input-container">
      <label for="name">Name</label>
      <div class="sec-2">
        <ion-icon name="person-outline"></ion-icon>
        <input v-model="name" id="name" type="text" class="w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <span
        v-if="errorMessages.includes('Name is required') || errorMessages.includes('Name should contain a maximum of 50 characters')"
        class="error">{{ errorMessages.find(message => message.includes('Name')) }}</span>
    </div>

    <div class="description input-container">
      <label for="description">Description</label>
      <div class="sec-2">
        <ion-icon name="mail-outline"></ion-icon>
        <input v-model="description" id="description" type="text" class="w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <span v-if="errorMessages.includes('Description should contain a maximum of 200 characters')" class="error">{{
        errorMessages.find(message => message.includes('Description')) }}</span>
    </div>

    <div class="price input-container">
      <label for="price">Price</label>
      <div class="sec-2">
        <ion-icon name="lock-closed-outline"></ion-icon>
        <input v-model="price" id="price" type="text" class="w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <span v-if="errorMessages.includes('Price should be a number greater than 0')" class="error">{{
        errorMessages.find(message => message.includes('Price')) }}</span>
    </div>

    <div class="image-upload input-container">
      <label for="image">Select Image</label>
      <input type="file" id="image" @change="handleImageUpload" accept="image/*" />
      <span v-if="errorMessages.includes('A picture must be selected')" class="error">{{ errorMessages.find(message =>
        message.includes('picture')) }}</span>
    </div>

    <button class="create-pizza" @click="onSubmit">Update Pizza</button>
  </div>
</template>

<style scoped>
.input-container {
  margin-bottom: 10px;
}

.error {
  color: red;
  font-size: 12px;
  display: block;
  margin-top: 5px;
}

input.error {
  border: 1px solid red;
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

.create-pizza {
  padding: 1em;
  background: hsl(233deg 36% 38%);
  color: hsl(0 0 100);
  border: none;
  border-radius: 30px;
  font-weight: 600;
  margin-top: 4em;
}

.footer {
  display: flex;
  font-size: 0.7em;
  color: hsl(0deg 0% 37%);
  gap: 14em;
  padding-bottom: 10em;

  span {
    cursor: pointer
  }
}

.button {
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
}</style>