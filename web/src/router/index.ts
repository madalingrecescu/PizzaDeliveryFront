import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue"
import Register from "../pages/Register.vue"
import Home from "../pages/Home.vue"
import CreatePizza from "../pages/CreatePizza.vue"
import UpdatePizza from "../pages/UpdatePizza.vue"
import ShoppingCart from "../pages/ShoppingCart.vue"
import CheckOut from "../pages/CheckOut.vue"


const routes: RouteRecordRaw[] = [
    { path: '/', component: Home },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/createPizza", component: CreatePizza },
    { path: "/updatePizza/:pizzaName", component: UpdatePizza },
    { path: "/shoppingCart", component: ShoppingCart},
    { path: "/checkOut",name:'checkOut', component: CheckOut},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
router.beforeEach((to) => {
    const nonAuthenticatedRoutes = ["/login", "/register", "/"];
    const isAuthenticated = localStorage.getItem('token')?.length;
    if(!isAuthenticated && !nonAuthenticatedRoutes.includes(to.path)) {
        return {path: "/login"}
    } else if (isAuthenticated && ["/login","/register"].includes(to.path)) {
        return { path: "/"}
    }
});

export default router;