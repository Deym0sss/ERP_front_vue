<template>
  <div class="header">
    <div>
      <img class="homeImg" :src="home" alt="none" @click="toHome" />
    </div>
    <div>
      <p class="userInfo">{{ userName }} {{ userSurname }}</p>
      <div
        class="avatar-container"
        @click="togglePopover"
        style="background-color: #bde3ff"
      >
        <img class="avatar" :src="image" alt="none" />
        <div v-if="visible" class="popover" @click.stop="hide">
          <a style="background-color: white">Log out</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router/router";

export default {
  name: "MyHeader",
  data() {
    return {
      image: require("@/assets/user.png"),
      home: require("@/assets/home.png"),
      userName: null,
      userSurame: null,
      visible: false,
    };
  },
  mounted() {
    this.userName = localStorage.getItem("userName");
    this.userSurname = localStorage.getItem("userSurname");
  },
  methods: {
    togglePopover() {
      this.visible = !this.visible;
    },
    hide() {
      this.visible = false;
      router.push("/login");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userSurname");
    },
    toHome() {
      router.push("/home");
    },
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 23px;
  width: 100%;
  height: 100px;
  background-color: #bde3ff;
  color: #0d99ff;
  position: relative;
}
.userInfo:first-child {
  margin-left: auto;
}
.userInfo {
  font-family: "Poppins", sans-serif;
  justify-content: center;
  display: flex;
  background-color: #bde3ff;
  width: 100px;
}
.avatar-container {
  position: relative;
  text-align: center;
  cursor: pointer;
}
.avatar {
  background-color: #bde3ff;
  width: 40px;
  height: 40px;
}
.popover {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
}
span {
  background-color: white;
}
p {
  font-family: "Poppins";
}
.homeImg {
  width: 50px;
  height: 50px;
}
</style>
