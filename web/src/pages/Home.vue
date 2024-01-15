<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

interface Pizza {
  pizzaId: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export type UserDataResponse = {
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
};

const pizzaItems = ref<Pizza[]>([]);
const router = useRouter();
const promptMessage = ref<string>('');
const promptPizzaName = ref<string>('');
const userData = ref<UserDataResponse | null>(null);

onMounted(async () => {
  
  const response = await axios.get("http://localhost:4000/pizzas")
    .then(res => res.data)
    .catch(error => console.error);
  console.log(response);

  const pizzas = response.map((item: any) => ({
    pizzaId: item.pizzaId,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.imageName,
  }));

  pizzaItems.value = pizzas;

  fetchUserRole();
});

const fetchUserRole = async () => {
  // Assume you have an endpoint to fetch the user role
  const token = localStorage.getItem('token');

  if (token) {
    try {
      // Get user data from the backend using the token
      const userResponse = await axios.get<UserDataResponse>('http://localhost:3000/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      userData.value = userResponse.data;
      
      // Log the role here when it's available
      console.log(userData.value?.role);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
};

const getImagePath = (imageName: string) => {
  return `/src/assets/pizza_pictures/${imageName}.png`;
};

const navigateToUpdate = (pizza: Pizza) => {
  router.push(`/updatePizza/${pizza.name}`);
};

const deletePizza = async (name: string) => {
  try {
    await axios.delete(`http://localhost:4000/deletePizza/${name}`);
    pizzaItems.value = pizzaItems.value.filter(pizza => pizza.name !== name);
  } catch (error) {
    console.error('Error deleting pizza:', error);
  }
};

const confirmDeletePizza = async (pizzaName: string) => {
  const confirmResult = window.confirm(`Are you sure you want to remove ${pizzaName} from the menu?`);

  if (confirmResult) {
    await deletePizza(pizzaName);
  }
};

const addToCart = async (pizzaName: string) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirect to login if token is not present
    router.push('/login');
    return;
  }

  try {
    await axios.post('http://localhost:4000/addToOrder', {
      name: pizzaName,
      token: token,
    });

    promptMessage.value = pizzaName + ' pizza added to Shopping Cart';
    promptPizzaName.value = pizzaName;

    setTimeout(() => {
      promptMessage.value = '';
      promptPizzaName.value = '';
    }, 2000);

    console.log('Pizza added to the shopping cart');
  } catch (error) {
    console.error('Error adding pizza to the shopping cart:', error);
  }
};
</script>


<template>
  <div class="screen-1">
    <h1>Pizza Menu</h1>
    <div v-if="userData && userData.role === 'admin'">
      <button class="create-button " @click="router.push('/createPizza')">Create new pizza</button>
    </div>
    <div class="pizza-container">
      <div v-for="pizza in pizzaItems" :key="pizza.pizzaId" class="pizza-item">
        <div class="prompt" v-if="promptMessage && pizza.name === promptPizzaName">
          {{ promptMessage }}
        </div>
        <h2>{{ pizza.name }}</h2>
        <img :src="getImagePath(pizza.image)" alt="Pizza Image" />
        <p>{{ pizza.description }}</p>
        <p>{{ pizza.price }} RON</p>
        <div class="button-container">
          <button class="add-to-cart-button" @click="addToCart(pizza.name)">+</button>
        </div>
        <div class="button-container" v-if="userData && userData.role === 'admin'">
          <button class="update-button" @click="navigateToUpdate(pizza)">Update</button>
        </div>
        <div class="button-container" v-if="userData && userData.role === 'admin'">
          <button class="delete-button" @click="confirmDeletePizza(pizza.name)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.screen-1 {
  background: hsl(212, 100%, 97%);
  padding: 6m;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  box-shadow: 0 0 2em hsl(231deg 62% 94%);
  gap: 1em;
}

.pizza-container {
  display: flex;
  flex-wrap: wrap;
}

.pizza-item {
  width: 27%;
  box-sizing: border-box;
  margin: 3%;
  padding: 11px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  position: relative;
}

.add-to-cart-button {
  position: relative;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 1s ease-in-out;
}

.add-to-cart-button::after {
  content: ' Add to Cart';
  display: none;
}

.add-to-cart-button:hover::after {
  display: inline-block;
}

.add-to-cart-button:hover {
  width: 120px;
}

img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}

.update-button {
  position: relative;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

}

.update-button:hover {
  background-color: darkgreen;
}

.create-button {
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
}

.delete-button {
  position: relative;
  background-color: #ff0000;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  width: 70px;

}

.delete-button:hover {
  background-color: darkred;

}

.prompt {
  background-color: #4caf50;
  color: #fff;
}
</style>
  