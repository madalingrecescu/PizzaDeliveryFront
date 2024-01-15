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

const pizzasFromOrder = ref<PizzasOrderResponse[]>([]);
const totalCost = ref<number>(0);
const shoppingCartId = ref<number>(0);
const username = ref('');
const token = localStorage.getItem('token');
const router = useRouter();

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

// onBeforeRouteUpdate(async () => {
//     // Check if the last pizza is deleted
//     if (pizzasFromOrder.value.length === 0) {
//         // Redirect to the home page
//         router.push("/");
//     }
// });

const deletePizza = async (pizzaName: string) => {
    try {
        await axios.delete(
            'http://localhost:4000/deletePizzaOrder',
            {
                data: {
                    shopping_cart_id: shoppingCartId.value,
                    pizza_name: pizzaName,
                }
            }
        );
        // Refresh the pizza list after deletion
         refreshPizzas();
    } catch (error) {
        console.error('Error deleting pizza:', error);
    }
};

const refreshPizzas = async () => {
    console.log("a intrat aici" + pizzasFromOrder.value.length)
    if (pizzasFromOrder.value.length === 1) {
        router.push("/")
    }
    try {
        const response = await axios.post<GetAllPizzasFromShoppingCartResponse>(
            'http://localhost:4000/getShoppingCartOrders',
            { token }
        );
        pizzasFromOrder.value = response.data.pizzas;
        totalCost.value = response.data['total-cost'];
        shoppingCartId.value = response.data['shopping_cart_id'];
    } catch (error) {
        console.error('Error refreshing pizzas:', error);
    }
};

const confirmDeletePizza = async (pizzaName: string) => {
  const confirmResult = window.confirm(`Are you sure you want to remove ${pizzaName} from your shopping cart?`);

  if (confirmResult) {
    await deletePizza(pizzaName);
  }
};


</script>

<template>
    <div class="screen-1">
        <h1>Shopping Cart</h1>
        <div v-if="pizzasFromOrder.length === 0">No pizzas in the shopping cart</div>
        <div v-else>
            <ul>
                <li v-for="(pizza, index) in pizzasFromOrder" :key="index" class="pizza">
                    <div class="pizza-quantity-concatenated">
                        {{ `${pizza.quantity} x ${pizza.pizza_name}` }}
                    </div>
                    <button class="delete-button" @click="() => confirmDeletePizza(pizza.pizza_name)">
                        Remove all
                    </button>
                </li>

            </ul>
            <p>Total Cost: {{ totalCost }} RON</p>
            <button class="checkout-button" @click="router.push('/checkOut')">Checkout</button>
        </div>
    </div>
</template>
  
<style>
.screen-1 {
    background: hsl(213deg 85% 97%);
    padding: 10em;
    display: flex;
    flex-direction: column;
    border-radius: 30px;
    box-shadow: 0 0 2em hsl(231deg 62% 94%);
    gap: 2em;
}

.pizza {
    font-size: 1.3em;
    background-color: #fff;
    padding: 2em;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    margin-bottom: 1em;
}
.pizza-quantity-concatenated {
  margin-right: 30px; 
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

.delete-button {
    position: relative;
    background-color: #ff0000;
    color: #fff;
    border: none;
    border-radius: 2px;
    padding: 1px 3px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    font-size: 0.7em;
}

.delete-button:hover {
    background-color: darkred;
}
</style>
  