<template>
  <div class="wrapper">
    <MyHeader />
    <div class="content" v-show="logoUrl">
      <!-- Location Info -->
      <div
        v-show="locationInfo"
        v-memo="[locationInfo]"
        class="content__locationInfo"
      >
        <div
          v-for="(value, key) in locationInfoFields"
          :key="key"
          class="content__locationInfo__element"
        >
          <label>{{ key }}</label>
          <p>{{ value }}</p>
        </div>
      </div>

      <!-- Staff Info -->
      <div v-show="staffInfo" class="content__staff">
        <label>Workers</label>
        <hr />
        <div
          v-for="user in staffInfo"
          :key="user._id"
          class="content__staff__info"
        >
          <p>{{ user.name }} {{ user.surname }} - {{ user.role }}</p>
        </div>
        <a-button @click="goToStaffInfo" class="staffBtn">Manage</a-button>
      </div>

      <!-- Logo -->
      <div v-show="locationInfo">
        <img
          loading="lazy"
          v-show="logoUrl"
          class="content__logo"
          :src="logoUrl"
          alt="Logo"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="table">
      <a-table
        :pagination="true"
        bordered
        :dataSource="dataSource"
        :columns="columns"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <span class="table-actions">
              <a-button @click="onOpenAsset(record)">Open</a-button>
              <a-button @click="onDeleteAsset(record)">Delete</a-button>
            </span>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Buttons -->
    <div class="location__btns">
      <a-button class="location__btns__delete">Delete location</a-button>
      <div class="location__btns__manage">
        <a-button class="location__btns__element" @click="goToCreateAsset"
          >Add asset</a-button
        >
        <a-button class="location__btns__element" @click="goToInventory"
          >Inventorize</a-button
        >
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
        { title: "Title", dataIndex: "title", key: "title", width: "25%" },
        { title: "Tag", dataIndex: "tag", key: "tag" },
        { title: "Amount", dataIndex: "value", key: "value", width: "15%" },
        { title: "Cost", dataIndex: "cost", key: "cost" },
        { title: "Action", key: "action", width: "15%" },
      ],
    };
  },
  computed: {
    locationInfoFields() {
      if (!this.locationInfo) return {};
      return {
        Title: this.locationInfo.title,
        Description: this.locationInfo.description,
        Address: this.locationInfo.address,
        City: this.locationInfo.city,
        Country: this.locationInfo.country,
      };
    },
  },
  methods: {
    getLocationInfo() {
      axios
        .get(`http://localhost:5000/location/ids/${this.locationId}`)
        .then((response) => {
          this.locationInfo = response.data.locations[0];
        });
    },
    getStaffInfo() {
      axios
        .get(`http://localhost:5000/auth/all/${this.locationId}`)
        .then((response) => {
          this.staffInfo = response.data.users;
          this.getLogo();
        });
    },
    getAssetsInfo() {
      axios
        .get(`http://localhost:5000/asset/all/${this.locationId}`)
        .then((response) => {
          this.dataSource = response.data.assets;
        });
    },
    getLogo() {
      if (this.locationInfo) {
        axios
          .get(`http://localhost:5000/logos/${this.locationInfo.logo}`, {
            responseType: "blob",
          })
          .then((response) => {
            this.logoUrl = URL.createObjectURL(response.data);
          });
      }
    },
    goToStaffInfo() {
      router.push(`/staff/${this.locationId}`);
    },
    goToCreateAsset() {
      router.push({
        path: "/asset/create",
        query: { locationId: this.locationId },
      });
    },
    goToInventory() {
      router.push(`/location/create/inventory/${this.locationId}`);
    },
    goToOrdersInfo() {
      router.push(`/orders/${this.locationId}`);
    },
    onDeleteAsset(asset) {
      axios
        .delete(`http://localhost:5000/asset/${asset._id}`)
        .then(() => {
          this.getAssetsInfo();
          this.$message.success("Asset deleted");
          axios.put(`http://localhost:5000/location/removeAsset`, {
            assetId: asset._id,
            locationId: this.locationId,
          });
        })
        .catch((error) => {
          this.$message.error("Error");
          console.error(error);
        });
    },
    onOpenAsset(asset) {
      router.push(`/asset/${asset._id}`);
    },
  },
  mounted() {
    this.getLocationInfo();
    this.getStaffInfo();
    this.getAssetsInfo();
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
  height: 30px;
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
  justify-content: space-between;
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
.location__btns__delete {
  margin-left: 10px;
  border: 1px solid red;
  border-radius: 8px;
  background-color: #cc2f07;
  font-family: "Poppins";
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
}

.location__btns__delete:hover {
  border: 1px solid white;
  color: white;
}
.location__btns__manage {
  display: flex;
  flex-direction: row;
}
.content__logo {
  width: 300px;
  height: 300px;
}
</style>
