<template>
  <div class="wrapper">
    <MyHeader />
    <a-table
      :columns="columns"
      :data-source="dataSource"
      style="padding: 20px"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <span>
            <a-button @click="onDelete(record)">Delete</a-button>
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      locationUrl: this.$route.params.locationId,
      dataSource: null,
      columns: [
        {
          title: "Surname",
          dataIndex: "surname",
          key: "surname",
        },
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "Role",
          dataIndex: "role",
          key: "role",
        },
        {
          title: "Action",
          key: "action",
          width: "8%",
        },
      ],
    };
  },
  methods: {
    getUsersBylocation() {
      axios
        .get(`http://localhost:5000/auth/all/${this.locationUrl}`)
        .then((response) => {
          this.dataSource = response.data.users;
        });
    },
    onDelete(user) {
      axios
        .put(`http://localhost:5000/auth/edit`, {
          userId: user._id,
          locationId: this.locationUrl,
        })
        .then(() => {
          this.getUsersBylocation();
          this.$message.success("User deleted");
        })
        .catch((error) => {
          this.$message.error("Error");
          console.error(error);
        });
    },
  },
  mounted() {
    this.getUsersBylocation();
  },
};
</script>

<style scoped>
.table {
  padding: 20px;
}
</style>
