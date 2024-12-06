import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/pages/LoginPage.vue";
import RegistrationPage from "@/pages/RegistrationPage.vue";
import HomePage from "@/pages/HomePage.vue";
import CreateLocation from "@/pages/CreateLocation.vue";
import LocationInfo from "@/pages/LocationInfo.vue";
import StaffPage from "@/pages/StaffPage.vue";
import CreateAsset from "@/pages/CreateAsset.vue";
import AssetInfo from "@/pages/AssetInfo.vue";
import InventoryPage from "@/pages/InventoryPage.vue";
import OrdersPage from "@/pages/OrdersPage.vue";
import CreateOrder from "@/pages/CreateOrder.vue";
import OrderInfo from "@/pages/OrderInfo.vue";

const routes = [
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/registration",
    component: RegistrationPage,
  },
  {
    path: "/home",
    component: HomePage,
  },
  {
    path: "/location/create",
    component: CreateLocation,
  },
  {
    path: "/location/:locationId",
    component: LocationInfo,
  },
  {
    path: "/location/create/inventory/:locationId",
    component: InventoryPage,
  },
  {
    path: "/staff/:locationId",
    component: StaffPage,
  },
  {
    path: "/asset/create",
    component: CreateAsset,
  },
  {
    path: "/asset/:assetId",
    component: AssetInfo,
  },
  {
    path: "/orders/:locationId",
    component: OrdersPage,
  },
  {
    path: "/orders/create/:locationId",
    component: CreateOrder,
  },
  {
    path: "/order/:orderId",
    component: OrderInfo,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
