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
            :rules="[{ required: true, message: 'Please enter title!' }]"
          >
            <label>Title:</label>
            <a-input style="width: 350px" v-model:value="formState.title" />
          </a-form-item>
          <!--  -->
          <a-form-item
            class="form__inputs"
            name="description"
            :rules="[{ message: 'Please enter description!' }]"
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
            name="tag"
            :rules="[{ message: 'Please enter tag!', required: true }]"
          >
            <label>Tag:</label>
            <a-input style="width: 350px" v-model:value="formState.tag" />
          </a-form-item>
          <!--  -->
          <a-form-item
            class="form__inputs"
            name="value"
            :rules="[{ message: 'Please enter amount!', required: true }]"
          >
            <label>Amount:</label>
            <a-input style="width: 350px" v-model:value="formState.value" />
          </a-form-item>
          <!--  -->
          <a-form-item
            class="form__inputs"
            name="cost"
            :rules="[{ message: 'Please enter price!', required: true }]"
          >
            <label>Price:</label>
            <a-input style="width: 350px" v-model:value="formState.cost" />
          </a-form-item>
          <!--  -->
          <a-form-item
            :rules="[{ message: 'Please input your location logo!' }]"
          >
            <div class="upload">
              <div class="upload__label">
                <label
                  >Select img
                  <input
                    class="upload__input"
                    type="file"
                    @change="handleFileChange"
                /></label>
              </div>

              <a-button class="upload__btn" @click="uploadLogo"
                >Upload img</a-button
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

<script>
import router from "@/router/router";
import axios from "axios";
import { reactive, ref } from "vue";

export default {
  data() {
    return {
      locationId: this.$route.query.locationId,
      selectedFile: ref(null),
      imageUrl: ref(""),
      formState: reactive({
        title: "",
        description: "",
        tag: "",
        value: "",
        location: this.locationId,
        cost: "",
      }),
    };
  },
  methods: {
    handleFileChange(event) {
      const files = event?.target?.files;
      if (files && files[0]) {
        this.selectedFile = files[0];
        if (this.selectedFile.type.startsWith("image")) {
          this.imageUrl = URL.createObjectURL(this.selectedFile);
        }
        console.log(this.selectedFile);
      } else {
        console.error("No file selected or invalid input event.");
      }
    },

    async uploadLogo() {
      if (!this.selectedFile) {
        alert("Please select a file before uploading.");
        return;
      }

      const formData = new FormData();
      formData.append("img", this.selectedFile);

      try {
        axios.post("http://localhost:5000/asset/uploadImage", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
      }
    },

    onFinish(values) {
      const creationData = values;
      creationData.img = this.selectedFile.name;
      creationData.location = this.locationId;
      axios
        .post(`http://localhost:5000/asset/create`, creationData)
        .then((response) => {
          router.push(`/location/${this.locationId}`);
          axios.put(`http://localhost:5000/location/edit/${this.locationId}`, {
            assets: response.data._id,
          });
        });
    },
    onFinishFailed(errorInfo) {
      console.error("Failed:", errorInfo);
    },
  },
};
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
