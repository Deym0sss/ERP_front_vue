<template>
  <div class="wrapper">
    <MyHeader />
    <div class="content">
      <div class="content__locationInfo">
        <div class="content__locationInfo__element" v-if="locationInfo">
          <label>Title</label>
          <p>{{ this.locationInfo.title }}</p>
        </div>
        <div class="content__locationInfo__element" v-if="locationInfo">
          <label>Description</label>
          <p>{{ this.locationInfo.description }}</p>
        </div>
        <div class="content__locationInfo__element" v-if="locationInfo">
          <label>Address</label>
          <p>{{ this.locationInfo.address }}</p>
        </div>
        <div class="content__locationInfo__element" v-if="locationInfo">
          <label>City</label>
          <p>{{ this.locationInfo.city }}</p>
        </div>
        <div class="content__locationInfo__element" v-if="locationInfo">
          <label>Country</label>
          <p>{{ this.locationInfo.country }}</p>
        </div>
      </div>
      <!--  -->
      <div class="content__staff">
        <label>Workers</label>
        <hr />
        <div
          class="content__staff__info"
          v-for="user in staffInfo"
          :key="user._id"
        >
          <div class="content__staff__Info__element" v-if="locationInfo">
            <p>{{ user.name }} {{ user.surname }} - {{ user.role }};</p>
          </div>
        </div>
        <a-button @click="goToStaffInfo" class="staffBtn">Manage</a-button>
      </div>

      <div class="content__logo">
        <img v-if="logoUrl" :src="logoUrl" alt="Logo" />
      </div>
    </div>
    <!--  -->
    <div class="table">
      <a-table bordered :dataSource="dataSource" :columns="columns" />
    </div>
    <!--  -->
    <div class="location__btns">
      <div>
        <a-button class="location__btns__element" @click="goToCreateAsset"
          >Add asset</a-button
        >
      </div>
      <div>
        <a-button class="location__btns__element" @click="goToInventory"
          >Inventorize</a-button
        >
      </div>
      <div>
        <a-button class="location__btns__element" @click="goToOrdersInfo"
          >Orders</a-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router/router";
import axios from "axios";

export default {
  name: "LocationInfo",
  data() {
    return {
      locationInfo: null,
      locationId: this.$route.params.locationId,
      staffInfo: null,
      logoUrl: null,
      dataSource: null,
      columns: [
        {
          title: "Title",
          dataIndex: "title",
          key: "title",
        },
        {
          title: "Tag",
          dataIndex: "tag",
          key: "tag",
        },
        {
          title: "Amount",
          dataIndex: "Value",
          key: "value",
        },
        {
          title: "Cost",
          dataIndex: "cost",
          key: "cost",
        },
      ],
    };
  },
  methods: {
    getLocationInfo() {
      axios
        .get(`http://localhost:5000/location/ids/${this.locationId}`)
        .then((response) => {
          this.locationInfo = JSON.parse(
            JSON.stringify(response.data.locations[0])
          );
        });
    },

    getStaffInfo() {
      axios
        .get(`http://localhost:5000/auth/all/${this.locationId}`)
        .then((response) => {
          this.staffInfo = JSON.parse(JSON.stringify(response.data.users));
          this.getLogo();
        });
    },

    getLogo() {
      if (this.locationInfo) {
        axios
          .get(`http://localhost:5000/logos/${this.locationInfo.logo}`, {
            responseType: "blob",
          })
          .then((response) => {
            const logoUrl = URL.createObjectURL(response.data);
            this.logoUrl = logoUrl;
          });
      }
    },
    goToStaffInfo() {
      router.push(`/staff/${this.locationId}`);
    },
    goToCreateAsset() {
      router.push("/asset/create");
    },
    goToInventory() {
      router.push("/location/create/inventory");
    },
    goToOrdersInfo() {
      router.push("/orders");
    },
  },
  mounted() {
    this.getLocationInfo();
    this.getStaffInfo();
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
.content__staff {
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
.staffBtn {
  width: 100px;
  margin-top: auto;
  margin-left: auto;
  border: 1px solid rgb(247, 189, 83);
  background-color: rgb(238, 202, 134);
  font-family: "Poppins";
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
}
.staffBtn:hover {
  border: 1px solid white;
  color: white;
}
.table {
  margin: 20px;
}
.location__btns {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 20px;
}
.location__btns__element {
  margin-left: 10px;
  border: 1px solid #0a6bb1;
  background-color: #0d99ff;
  font-family: "Poppins";
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
}

.location__btns__element:hover {
  border: 1px solid white;
  color: white;
}
</style>
