<template>
  <MyHeader />
  <div class="table">
    <a-table bordered :dataSource="dataSource" :columns="columns"
      ><template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <span
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-around;
              width: 200px;
            "
          >
            <a-button @click="onOpenOrder(record)">Open</a-button>
            <a-button @click="onDeleteOrder(record)">Delete</a-button>
          </span>
        </template>
      </template></a-table
    >
  </div>
  <div class="btnContainer">
    <a-button @click="createOrder" class="btn">Create order</a-button>
  </div>
</template>

<script>
import router from "@/router/router";
import axios from "axios";

export default {
  data() {
    return {
      locationId: this.$route.params.locationId,
      dataSource: null,
      columns: [
        {
          title: "Title",
          dataIndex: "title",
          key: "title",
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
        },
        {
          title: "Payment status",
          dataIndex: "paymentStatus",
          key: "paymentStatus",
        },
        {
          title: "Actions",
          key: "actions",
          width: "10%",
        },
      ],
    };
  },
  methods: {
    getOrders() {
      axios
        .get(`http://localhost:5000/order/all/${this.locationId}`)
        .then((response) => {
          this.dataSource = response.data.orders;
        });
    },
    onOpenOrder(order) {
      router.push(`/order/${order._id}`);
    },
    onDeleteOrder(order) {
      axios
        .delete(`http://localhost:5000/order/${order._id}`)
        .then((response) => {
          console.log(response.data);
          axios
            .put(`http://localhost:5000/location/removeOrder`, {
              orderId: order._id,
              locationId: this.locationId,
            })
            .then(() => {
              this.getOrders();
            });
        });
    },
    createOrder() {
      router.push(`/orders/create/${this.locationId}`);
    },
  },
  mounted() {
    this.getOrders();
  },
};
</script>
<style scoped>
.btnContainer {
  display: flex;
  justify-content: flex-end;
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
</style>
