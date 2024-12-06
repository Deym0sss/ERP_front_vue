<template>
  <MyHeader />
  <div class="content">
    <a-table :columns="columns" :data-source="dataSource" bordered>
      <template #bodyCell="{ column, text, record }">
        <template v-if="['value'].includes(column.dataIndex)">
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
    <div class="btnContainer">
      <a-button @click="onSubmit" class="submitBtn">Submit</a-button>
    </div>
  </div>
</template>
<script setup>
import router from "@/router/router";
import axios from "axios";
import { cloneDeep } from "lodash-es";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: "25%",
  },
  {
    title: "Tag",
    dataIndex: "tag",
    key: "tag",
    width: "15%",
  },
  {
    title: "Amount",
    dataIndex: "value",
    key: "value",
    width: "20%",
  },
  {
    title: "Price",
    dataIndex: "cost",
    key: "cost",
    width: "20%",
  },
  {
    title: "operation",
    dataIndex: "operation",
  },
];
const route = useRoute();
const locationId = route.params.locationId;
const dataSource = ref();
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

const getAssetsInfo = () => {
  axios
    .get(`http://localhost:5000/asset/all/${locationId}`)
    .then((response) => {
      dataSource.value = response.data.assets;
    });
};

const onSubmit = () => {
  const inventoryResult = dataSource.value.map((asset) => {
    return { assetId: asset._id, value: asset.value };
  });

  axios
    .put(`http://localhost:5000/asset/inventory`, inventoryResult)
    .then(router.push(`/location/${locationId}`));
};

onMounted(() => {
  getAssetsInfo();
});
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.btnContainer {
  display: flex;
  justify-content: flex-end;
}
.submitBtn {
  border: 1px solid #0a6bb1;
  background-color: #0d99ff;
  margin: 20px 20px;
  font-family: "Poppins";
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
}

.submitBtn:hover {
  border: 1px solid white;
  color: white;
}
</style>
