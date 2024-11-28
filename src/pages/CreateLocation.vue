<template>
  <div>
    <MyHeader />
    <div class="content">
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
            :rules="[{ required: true, message: 'Please input your title!' }]"
          >
            <label>Title:</label>
            <a-input style="width: 350px" v-model:value="formState.title" />
          </a-form-item>
          <!--  -->
          <a-form-item
            class="form__inputs"
            name="description"
            :rules="[{ message: 'Please input your description!' }]"
          >
            <label>Description:</label>
            <a-input
              style="width: 350px"
              v-model:value="formState.description"
            />
          </a-form-item>
          <!--  -->
          <a-form-item
            class="form__inputs"
            name="address"
            :rules="[{ message: 'Please input your address!' }]"
          >
            <label>Address:</label>
            <a-input style="width: 350px" v-model:value="formState.address" />
          </a-form-item>
          <!--  -->
          <a-form-item class="form__inputs" name="staff">
            <label>Staff:</label>
            <a-select
              v-model:value="formState.staff"
              :options="staffOptions"
              mode="multiple"
              :size="size"
              placeholder="Please select"
              style="width: 350px"
              @popupScroll="popupScroll"
            ></a-select>
          </a-form-item>
          <!--  -->
          <a-form-item
            class="form__inputs"
            name="city"
            :rules="[{ message: 'Please input your city!' }]"
          >
            <label>City:</label>
            <a-input style="width: 350px" v-model:value="formState.city" />
          </a-form-item>
          <!--  -->
          <a-form-item
            class="form__inputs"
            name="country"
            :rules="[{ message: 'Please input your country!' }]"
          >
            <label>Country:</label>
            <a-input style="width: 350px" v-model:value="formState.country" />
          </a-form-item>
          <!--  -->
          <a-form-item
            :rules="[{ message: 'Please input your location logo!' }]"
          >
            <div class="upload">
              <div class="upload__label">
                <label
                  >Choose logo
                  <input
                    class="upload__input"
                    type="file"
                    @change="handleFileChange"
                /></label>
              </div>

              <a-button class="upload__btn" @click="uploadLogo"
                >Upload logo</a-button
              >
            </div>
          </a-form-item>
          <!--  -->
          <div class="form__btns">
            <a-form-item>
              <a-button
                style="background-color: #0d99ff"
                type="primary"
                html-type="submit"
                ><label style="background-color: #0d99ff"
                  >Submit</label
                ></a-button
              >
            </a-form-item>
          </div>
        </a-form>
      </div>
      <div v-if="selectedFile">
        <img :src="imageUrl" alt="Selected Logo" class="logo" />
      </div>
      <div v-else class="placeholder">
        <img src="@/assets/noimg.png" alt="Selected Logo" class="logo" />
      </div>
    </div>
  </div>
</template>

<script setup>
import MyHeader from "@/components/UI/MyHeader.vue";

// eslint-disable-next-line no-unused-vars
import router from "@/router/router";
import axios from "axios";
import { onMounted, ref, reactive } from "vue";

const formState = reactive({
  title: "",
  description: "",
  address: "",
  staff: undefined,
  city: "",
  country: "",
});

let staffOptions = ref([]);

const selectedFile = ref(null);
const imageUrl = ref("");

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
  if (selectedFile.value && selectedFile.value.type.startsWith("image")) {
    imageUrl.value = URL.createObjectURL(selectedFile.value);
  }
};

const uploadLogo = async () => {
  if (!selectedFile.value) {
    alert("Please select a file before uploading.");
    return;
  }

  const formData = new FormData();
  formData.append("logo", selectedFile.value);

  try {
    axios.post("http://localhost:5000/location/uploadLogo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};

const onFinish = (values) => {
  const creationData = values;
  creationData.logo = selectedFile.value.name;
  const userId = localStorage.getItem("userId");
  axios
    .post(`http://localhost:5000/location/create`, creationData)
    .then((response) => {
      router.push("/home");

      axios.put(`http://localhost:5000/auth/edit/${userId}`, {
        locationIds: [response.data.location._id],
      });
    });
};
const onFinishFailed = (errorInfo) => {
  console.error("Failed:", errorInfo);
};

const getUsersData = () => {
  axios.get(`http://localhost:5000/auth/users`).then((response) => {
    const transformedData = response.data.map((item) => ({
      label: `${item.surname} ${item.name}`,
      value: item._id,
    }));
    staffOptions.value = transformedData;
  });
};

onMounted(() => {
  getUsersData();
});
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

label {
  font-family: "Poppins";
}
.formContainer {
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 30%;
}
.content {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.logo {
  width: 300px;
  height: 300px;
}
.upload {
  display: flex;
  padding-bottom: 20px;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  width: 350px;
}

.upload__btn {
  width: 100px;
}

.upload__input {
  display: inline-block;
  height: 32px;
  width: 100px;
  padding: 6px 12px;
  text-align: center;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #000;
  transition: all 0.3s;
}

.upload__input:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.upload__input::-webkit-file-upload-button {
  visibility: hidden;
}

.upload__label {
  position: relative;
  display: inline-block;
}

.upload__label span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-size: 14px;
  pointer-events: none;
}

.upload__input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.upload__label {
  border: 1px solid lightgrey;
  width: 100px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form__btns {
  display: flex;
  justify-content: flex-end;
}
</style>
