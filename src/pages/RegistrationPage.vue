<template>
  <div class="registerForm">
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        class="form__inputs"
        name="email"
        :rules="[{ required: true, message: 'Please input your email!' }]"
      >
        <label>Email:</label>
        <a-input style="width: 350px" v-model:value="formState.email" />
      </a-form-item>

      <a-form-item
        class="form__inputs"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <label>Password:</label>
        <a-input-password
          style="width: 350px"
          v-model:value="formState.password"
        />
      </a-form-item>
      <a-form-item
        class="form__inputs"
        name="name"
        :rules="[{ required: true, message: 'Please input your name!' }]"
      >
        <label>Name:</label>
        <a-input style="width: 350px" v-model:value="formState.name" />
      </a-form-item>
      <a-form-item
        class="form__inputs"
        name="surname"
        :rules="[{ required: true, message: 'Please input your surname!' }]"
      >
        <label>Surname:</label>
        <a-input style="width: 350px" v-model:value="formState.surname" />
      </a-form-item>
      <a-form-item
        class="form__inputs"
        name="phone"
        :rules="[{ required: true, message: 'Please input your phone!' }]"
      >
        <label>Phone:</label>
        <a-input style="width: 350px" v-model:value="formState.phone" />
      </a-form-item>
      <div class="form__btns">
        <a-button
          style="background-color: #0d99ff"
          type="primary"
          @click="onLogin"
          ><label style="background-color: #0d99ff">Login</label></a-button
        >
        <a-form-item>
          <a-button
            style="background-color: #0d99ff"
            type="primary"
            html-type="submit"
            ><label style="background-color: #0d99ff">Submit</label></a-button
          >
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>
<script setup>
import router from "@/router/router";
import axios from "axios";
import { reactive } from "vue";
const formState = reactive({
  email: "",
  password: "",
  name: "",
  surname: "",
  phone: "",
});
const onFinish = (values) => {
  axios.post(`http://localhost:5000/auth/register`, values).then(() => {
    localStorage.setItem("userName", values.name);
    localStorage.setItem("userSurname", values.surname);
    axios
      .post(`http://localhost:5000/auth/id`, { email: values.email })
      .then((res) => {
        localStorage.setItem("userId", res.data.userId);
        router.push("/home");
      });
  });
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const onLogin = () => {
  router.push("/login");
};
</script>
<style>
.registerForm {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  padding-top: 20%;
}
.form__btns {
  display: flex;
  flex-direction: row;
  width: 350px;
  justify-content: space-between;
}
.form__inputs {
  display: flex;
  flex-direction: row;
}
</style>
