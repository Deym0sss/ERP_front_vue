<template>
  <MyHeader />
  <div class="content">
    <div class="content__staff">
      <div class="content__staff__info">
        <div class="content__staff__Info__element" v-if="this.orderInfo">
          <label>Title</label>
          <p>{{ this.orderInfo.title }}</p>
        </div>
        <div class="content__staff__Info__element" v-if="this.orderInfo">
          <label>Status</label>
          <p>{{ this.orderInfo.status }}</p>
        </div>
        <div class="content__staff__Info__element" v-if="this.orderInfo">
          <label>Payment status</label>
          <p>{{ this.orderInfo.paymentStatus }}</p>
        </div>
        <div class="content__staff__Info__element" v-if="this.orderInfo">
          <label>Creation data</label>
          <p>{{ this.orderInfo.createdAt.split("T")[0] }}</p>
        </div>
      </div>
    </div>
    <div class="table">
      <a-table
        bordered
        :dataSource="this.dataSource"
        :columns="this.columns"
      ></a-table>
    </div>
    <div class="btnContainer">
      <a-button class="btn" :disabled="payDisabled" @click="setPaymentStatus"
        >Pay</a-button
      >
      <a-button
        class="btn"
        v-if="orderInfo?.status === `new`"
        @click="setStatusInProgress"
        >Start</a-button
      >
      <a-button
        class="btn"
        v-if="orderInfo?.status === `in progress`"
        @click="handleClick"
        >Start</a-button
      >
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      payDisabled: false,
      orderInfo: null,
      dataSource: null,
      columns: [
        {
          title: "Title",
          dataIndex: "title",
          key: "title",
          width: "60%",
        },
        {
          title: "Amount",
          dataIndex: "value",
          key: "value",
          width: "40%",
        },
      ],
      orderId: this.$route.params.orderId,
    };
  },
  methods: {
    handleClick() {
      this.setStatusDone();
      this.updateAmount();
    },
    getOrderInfo() {
      axios
        .get(`http://localhost:5000/order/ids/${this.orderId}`)
        .then((response) => {
          this.orderInfo = response.data.orders[0];
          this.getAssetTitles(this.assetsIdsToString(this.orderInfo));
          this.checkPaymentStatus();
        });
    },

    assetsIdsToString(order) {
      const assetString = order.assets.map((item) => item.asset).join(",");
      return assetString;
    },

    getAssetTitles(ids) {
      axios.get(`http://localhost:5000/asset/ids/${ids}`).then((response) => {
        const assetsInfo = response.data.assets;

        const result = assetsInfo
          .map((asset) => {
            const order = this.orderInfo.assets.find(
              (order) => order.asset === asset._id
            );

            if (order) {
              return {
                title: asset.title,
                value: order.quantity,
              };
            }
            return null;
          })
          .filter((item) => item !== null);
        this.dataSource = result;
      });
    },

    checkPaymentStatus() {
      if (this.orderInfo.paymentStatus === "paid") {
        this.payDisabled = true;
      }
    },

    setPaymentStatus() {
      axios
        .put(`http://localhost:5000/order/edit/${this.orderId}`, {
          paymentStatus: "paid",
        })
        .then(() => {
          this.getOrderInfo();
        });
    },
    setStatusInProgress() {
      axios
        .put(`http://localhost:5000/order/edit/${this.orderId}`, {
          status: "in progress",
        })
        .then(() => {
          this.getOrderInfo();
        });
    },
    setStatusDone() {
      axios
        .put(`http://localhost:5000/order/edit/${this.orderId}`, {
          status: "done",
        })
        .then(() => {
          this.getOrderInfo();
        });
    },

    updateAmount() {
      console.log(this.orderInfo.assets);

      const tempDataSource = this.orderInfo.assets.map(
        ({ asset, quantity }) => ({
          key: asset,
          value: quantity,
        })
      );
      axios
        .put(`http://localhost:5000/asset/editForOrder`, {
          assets: tempDataSource,
        })
        .then((response) => {
          console.log(response.data);
        });
    },
  },
  mounted() {
    this.getOrderInfo();
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
label {
  font-family: "Poppins";
  font-weight: 600;
  font-size: 24px;
}
p {
  font-family: "Poppins";
}
.content__staff {
  display: flex;
  flex-direction: column;
  margin: 20px 20px;
  width: 30%;
  height: 1vm;
  border-radius: 10px;
  background-color: antiquewhite;
  padding: 15px;
  border: 2px solid wheat;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}
.btnContainer {
  display: flex;
  justify-content: flex-end;
  padding-right: 10%;
}
.btn {
  margin: 20px 20px;
  border: 1px solid #0a6bb1;
  background-color: #0d99ff;
  font-family: "Poppins";
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
}

.btn:hover {
  border: 1px solid white;
  color: white;
}
.table {
  width: 60%;
  margin: 20px 20px;
}
</style>
