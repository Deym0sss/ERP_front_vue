import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/pages/LoginPage.vue";
import RegistrationPage from "@/pages/RegistrationPage.vue";
import HomePage from "@/pages/HomePage.vue";
import CreateLocation from "@/pages/CreateLocation.vue";
import LocationInfo from "@/pages/LocationInfo.vue";
import StaffPage from "@/pages/StaffPage.vue";

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
    path: "/staff/:locationId",
    component: StaffPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
