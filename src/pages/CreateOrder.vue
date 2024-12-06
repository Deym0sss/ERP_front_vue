<template>
  <MyHeader />
  <div class="formContainer">
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
        name="title"
        :rules="[{ required: true, message: 'Please input  title!' }]"
      >
        <label>Title:</label>
        <a-input style="width: 350px" v-model:value="formState.title" />
      </a-form-item>
      <!--  -->
      <a-form-item
        class="form__inputs"
        name="paymentStatus"
        :rules="[{ message: 'Set Payment status!', required: true }]"
      >
        <label>Payment status:</label>
        <a-input style="width: 350px" v-model:value="formState.paymentStatus" />
      </a-form-item>
      <!--  -->
      <a-form-item
        class="form__inputs"
        name="createdAt"
        :rules="[{ message: 'Please pick date!', required: true }]"
      >
        <label>Choose date:</label>
        <a-date-picker
          style="width: 350px"
          v-model:value="formState.createdAt"
        />
      </a-form-item>
      <!--  -->
      <div class="table">
        <a-button class="btn" @click="addAsset">Add asset to order</a-button>
        <a-table
          class="assets__table"
          :columns="columns"
          :data-source="dataSource"
          bordered
        >
          <template #bodyCell="{ column, text, record }">
            <!-- Title -->
            <template v-if="column.dataIndex === 'title'">
              <div>
                <a-select
                  v-if="editableData[record.key]"
                  v-model:value="editableData[record.key][column.dataIndex]"
                  style="width: 100%"
                  :options="assetsOptions"
                />
                <template v-else>
                  {{ getLabelByValue(text) }}
                </template>
              </div>
            </template>
            <!-- Value -->
            <template v-else-if="column.dataIndex === 'value'">
              <div>
                <a-input
                  v-if="editableData[record.key]"
                  v-model:value="editableData[record.key][column.dataIndex]"
                  style="margin: -5px 0"
                />
                <template v-else>
                  {{ text }}
                </template>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <div class="editable-row-operations">
                <span v-if="editableData[record.key]">
                  <a-typography-link @click="save(record.key)"
                    >Save</a-typography-link
                  >
                  <a-popconfirm
                    title="Sure to cancel?"
                    @confirm="cancel(record.key)"
                  >
                    <a>Cancel</a>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a @click="edit(record.key)">Edit</a>
                </span>
              </div>
            </template>
          </template>
        </a-table>
      </div>
      <!--  -->
      <div class="btnContainer">
        <a-form-item>
          <a-button class="btn" type="primary" html-type="submit"
            ><label>Submit</label></a-button
          >
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>

<script setup>
import router from "@/router/router";
import axios from "axios";
import { cloneDeep } from "lodash-es";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";

const formState = reactive({
  title: "",
  paymentStatus: "",
  createdAt: "",
});
const columns = [
  { title: "Title", dataIndex: "title", width: "25%" },
  { title: "Amount", dataIndex: "value", width: "15%" },
  { title: "Operation", dataIndex: "operation", width: "10%" },
];

const route = useRoute();
const locationId = route.params.locationId;
const assetsOptions = ref([]);
const assetsInfo = ref([]);
const dataSource = ref([]);
const count = computed(() =>
  dataSource.value ? dataSource.value.length + 1 : 0
);
const editableData = reactive({});

const edit = (key) => {
  editableData[key] = cloneDeep(
    dataSource.value.filter((item) => key === item.key)[0]
  );
};
const save = (key) => {
  Object.assign(
    dataSource.value.filter((item) => key === item.key)[0],
    editableData[key]
  );
  delete editableData[key];
};
const cancel = (key) => {
  delete editableData[key];
};

const onFinish = (values) => {
  const creationData = values;
  creationData.status = "new";
  creationData.location = locationId;
  creationData.assets = dataSource.value.map((item) => {
    return { asset: item.title, quantity: item.value };
  });
  axios
    .post(`http://localhost:5000/order/create`, creationData)
    .then((response) => {
      try {
        axios
          .put(`http://localhost:5000/location/edit/${locationId}`, {
            orders: response.data.order._id,
          })
          .then(() => {
            router.push(`/orders/${locationId}`);
          });
      } catch (error) {
        console.log(error);
      }
    });
};
const onFinishFailed = (errorInfo) => {
  console.error("Failed:", errorInfo);
};

const getAssetsInfo = () => {
  axios
    .get(`http://localhost:5000/asset/all/${locationId}`)
    .then((response) => {
      assetsInfo.value = response.data.assets;
      assetsOptions.value = assetsInfo.value.map((asset) => ({
        label: asset.title,
        value: asset._id,
      }));
    });
};

const getLabelByValue = (value) => {
  const option = assetsOptions.value.find((opt) => opt.value === value);
  return option ? option.label : value;
};

const addAsset = () => {
  const newData = { key: `${count.value}`, title: "", value: "" };
  if (dataSource.value) {
    dataSource.value.push(newData);
  } else {
    dataSource.value = [newData];
  }
};

onMounted(() => {
  getAssetsInfo();
});
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.btn {
  margin: 20px 20px;
  color: black;
  border: 1px solid #0a6bb1;
  background-color: #0d99ff;
  font-family: "Poppins";
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
}

.btn:hover {
  border: 1px solid white;
  color: white;
}
.btnContainer {
  display: flex;
  justify-content: flex-end;
}
.assets__table {
  margin: 20px;
}
.form__inputs {
  margin: 20px;
}
</style>
