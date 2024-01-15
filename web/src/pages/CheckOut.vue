<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';


export type PizzasOrderResponse = {
  pizza_name: string;
  quantity: number;
};

type GetAllPizzasFromShoppingCartResponse = {
    pizzas: PizzasOrderResponse[];
    'total-cost': number;
    'shopping_cart_id': number;
    'username': string;
};

const router = useRouter();

const paymentMethod = ref<string>('cash');
const address = ref('');

const pizzasFromOrder = ref<PizzasOrderResponse[]>([]);
const totalCost = ref<number>(0);
const shoppingCartId = ref<number>(0);
const username = ref('');
const token = localStorage.getItem('token');

const isCashChecked = ref(true);
const isCardChecked = ref(false);
// const router = useRouter();

export type UserDataResponse = {
  username: string;
  email: string;
  phoneNumber: string;
  // Add other user-related fields here
};

const userData = ref<UserDataResponse | null>(null); // Use null initially

onMounted(async () => {
    try {
        const response = await axios.post<GetAllPizzasFromShoppingCartResponse>(
            'http://localhost:4000/getShoppingCartOrders',
            {
                token: token,
            }
        );

        pizzasFromOrder.value = response.data.pizzas;
        totalCost.value = response.data['total-cost'];
        shoppingCartId.value = response.data['shopping_cart_id'];
        username.value = response.data['username'];
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});


onMounted(async () => {
  try {
    // Get user data from the backend using the token
    const userResponse = await axios.get<UserDataResponse>('http://localhost:3000/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    userData.value = userResponse.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
});

const handlePaymentMethod = (selectedMethod: 'cash' | 'card') => {
  isCashChecked.value = selectedMethod === 'cash';
  isCardChecked.value = selectedMethod === 'card';
};

const placeOrder = async () => {
  if (!address.value || !paymentMethod.value) {
    window.alert('Please enter your address and select a payment method before placing the order.');
    return;
  }


  const selectedPaymentMethod = isCashChecked.value ? 'Cash' : 'Card';
  const confirmationMessage = `Your order is getting ready and will be at "${address.value}" in no time. Your total is ${totalCost.value} and the payment method is by ${selectedPaymentMethod}.`;

  // Apply custom styles to the alert

  // Show the alert with the custom style
 

  const isConfirmed = window.confirm(confirmationMessage);

if (isConfirmed) {

  try {
      // Make a POST request to the backend
      const response = await axios.post('http://localhost:4000/order', {
        token: localStorage.token,
      });
      console.log('Order placed successfully:', response.data);
      router.push('/');
    } catch (error) {
      // Handle errors from the backend
      console.error('Error placing order:', error);
    }
  } else {
  console.log('Order canceled by the user.');
}

};
</script>

<template>
  <div class="checkout-container">
    <h1>Checkout</h1>

    <div v-if="userData">
      <p>Username: {{ userData.username }}</p>
      <p>Email: {{ userData.email }}</p>
      <p>Phone Number: {{ userData.phoneNumber }}</p>
    </div>

    <div v-if="pizzasFromOrder.length > 0">
      <h2>Pizza Order:</h2>
      <ul>
        <li v-for="(pizza, index) in pizzasFromOrder" :key="index">
          {{ pizza.pizza_name }} x {{ pizza.quantity }}
        </li>
      </ul>
    </div>

    <p>Total Cost: {{ totalCost }} RON</p>

    <label for="address">Address:</label>
    <input type="text" id="address" v-model="address" />

    <p>How would you like to pay?</p>
    <div>
    <label>
      <input type="checkbox" v-model="isCashChecked" @change="handlePaymentMethod('cash')"> Cash
    </label>
    <label>
      <input type="checkbox" v-model="isCardChecked" @change="handlePaymentMethod('card')"> Card
    </label>
  </div>

    <button class="checkout-button" @click="placeOrder">Place Order</button>
  </div>
</template>

<style scoped>
.checkout-container {
  background: hsl(213deg 85% 97%);
  padding: 2em;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 2em;
}

.checkout-button {
  background-color: #4caf50;
  color: #fff;
  padding: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2em;
  margin-top: 1em;
}

.checkout-button:hover {
  background-color: #45a049;
}

</style>