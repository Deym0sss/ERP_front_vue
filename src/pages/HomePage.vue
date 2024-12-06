<template>
  <div class="home">
    <MyHeader></MyHeader>
    <div class="content">
      <div class="locations" v-if="locationsData !== null">
        <div
          class="card"
          v-for="location in locationsData"
          :key="location._id"
          @click="goToLocationInfo(location._id)"
        >
          <p class="cardTitle">{{ location.title }}</p>
        </div>
        <div class="card create-location-card" @click.stop="createLocation">
          <p class="cardTitle">Create location</p>
        </div>
      </div>
      <div v-else>
        <p>Loading locations...</p>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router/router";
import axios from "axios";

export default {
  name: "HomePage",
  data() {
    return {
      userData: null,
      locations: null,
      locationsData: null,
    };
  },
  methods: {
    createLocation() {
      router.push("/location/create");
    },
    goToLocationInfo(locationId) {
      router.push(`/location/${locationId}`);
    },
    getUserData() {
      axios
        .get(`http://localhost:5000/auth/${localStorage.getItem("userId")}`)
        .then((response) => {
          this.userData = response.data;
          this.locations = response.data.locationIds;
          this.getLocationsInfo();
        });
    },
    async getLocationsInfo() {
      if (this.locations && this.locations.length > 0) {
        const locaitonIdsString = this.locations.join(",");
        await axios
          .get(`http://localhost:5000/location/ids/${locaitonIdsString}`)
          .then((response) => {
            this.locationsData = JSON.parse(
              JSON.stringify(response.data.locations)
            );
            console.log(this.locationsData);
          });
      }
    },
  },
  mounted() {
    this.getUserData();
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
.content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 10%;
}

.locations {
  display: flex;
  flex-wrap: wrap;
  margin: 5%;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

.card {
  width: 300px;
  height: 300px;
  border: 2px solid #0d99ff;
  background-color: #0d99ff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.cardTitle {
  width: 100%;
  font-family: "Poppins";
  background-color: #0d99ff;
  color: white;
  text-align: center;
  font-size: 36px;
}

.create-location-card {
  width: 300px;
  height: 300px;
  border: 2px solid #0d99ff;
  background-color: #0d99ff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-align: center;
}
</style>
