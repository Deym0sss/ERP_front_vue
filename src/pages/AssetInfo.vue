<template>
  <MyHeader />
  <div class="content">
    <div class="content__locationInfo">
      <div class="content__locationInfo__element" v-if="assetInfo">
        <label>Title</label>
        <p>{{ this.assetInfo.title }}</p>
      </div>
      <a-divider />
      <div class="content__locationInfo__element" v-if="assetInfo">
        <label>Description</label>
        <p>{{ this.assetInfo.description }}</p>
      </div>
      <a-divider />
      <div class="content__locationInfo__element" v-if="assetInfo">
        <label>Tag</label>
        <p>{{ this.assetInfo.tag }}</p>
      </div>
      <a-divider />
      <div class="content__locationInfo__element" v-if="assetInfo">
        <label>Amount</label>
        <p>{{ this.assetInfo.value }}</p>
      </div>
      <a-divider />
      <div class="content__locationInfo__element" v-if="assetInfo">
        <label>Price</label>
        <p>{{ this.assetInfo.cost }}</p>
      </div>
    </div>
    <div>
      <img class="image" v-if="imgUrl" :src="imgUrl" alt="Image" />
    </div>
  </div>
  <div class="btnContainer">
    <a-button class="btn" @click="goToLocation">Back to location</a-button>
  </div>
</template>

<script>
import router from "@/router/router";
import axios from "axios";

export default {
  data() {
    return {
      imgUrl: null,
      assetId: this.$route.params.assetId,
      assetInfo: null,
    };
  },
  methods: {
    getAssetInfo() {
      axios
        .get(`http://localhost:5000/asset/ids/${this.assetId}`)
        .then((response) => {
          this.assetInfo = response.data.assets[0];
          console.log(this.assetInfo);

          this.getImg();
        });
    },
    getImg() {
      if (this.assetInfo) {
        axios
          .get(`http://localhost:5000/images/${this.assetInfo.img}`, {
            responseType: "blob",
          })
          .then((response) => {
            this.imgUrl = URL.createObjectURL(response.data);
          });
      }
    },
    goToLocation() {
      router.push(`/location/${this.assetInfo.location}`);
    },
  },
  mounted() {
    this.getAssetInfo();
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
.content {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 5%;
}
.content__locationInfo {
  display: flex;
  flex-direction: column;
  width: 30%;
  height: 1vm;
  border-radius: 10px;
  background-color: antiquewhite;
  padding: 15px;
  border: 2px solid wheat;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}
label {
  font-family: "Poppins";
  font-weight: 600;
  font-size: 24px;
}
p {
  font-family: "Poppins";
}
.image {
  width: 300px;
  height: 300px;
}
.btnContainer {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 20px;
}
.btn {
  border: 1px solid #0a6bb1;
  background-color: #0d99ff;
  margin-right: 18%;
  font-family: "Poppins";
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
}
.btn:hover {
  border: 1px solid white;
  color: white;
}
</style>
