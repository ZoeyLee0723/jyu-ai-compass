<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <el-icon>
          <Back />
        </el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录账户</h2>
        <p>请输入您的用户名和密码</p>
      </div>
    </div>
    <div class="form-container">
      <el-form
        ref="ruleFormRef"
        :model="FormData"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input
            v-model="FormData.username"
            size="large"
            placeholder="请输入用户名或邮箱"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="FormData.password"
            type="password"
            size="large"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-button class="btn" type="primary" size="large" @click="submitForm(ruleFormRef)" >登录</el-button>
        <div class="footer">
            <p>还没有账号？<router-link to="/author/register">去注册</router-link></p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { Back } from "@element-plus/icons-vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { login } from "@/api/admin";

const router = useRouter();

const FormData = ref({
  username: "",
  password: "",
});

const rules = ref({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const ruleFormRef = ref();

const submitForm = async (formEl) => {
  if (!formEl) {
    return;
  }
  
  await formEl.validate((valid) => {
    if (valid) {
      console.log('表单验证通过');
      login(FormData.value).then(res => {
        // request.js 已经返回了 data.data，所以直接访问 res.token
        if (!res.token) {
          ElMessage.error('登录失败');
          return;
        }
        localStorage.setItem("token", res.token);
        localStorage.setItem("userInfo", JSON.stringify(res.userInfo));
        if (res.userInfo.userType === 2) {
          router.push({ path: "/backend/dashboard" });
        } else {
          router.push({ path: "/" });
        }
      }).catch(err => {
        console.error('登录失败', err);
      });
    } else {
      console.log('表单验证失败');
    }
  });
};
</script>

<style scoped lang="scss">
.container {
  width: 384px;
  .title {
    .back-home {
      margin-bottom: 20px;
    }
    .title-text {
      margin-bottom: 10px;
      text-align: center;
      h2 {
        font-size: 36px;
        font-weight: bold;
        color: #333;
      }
      p {
        font-size: 18px;
        color: #666;
      }
    }
  }
  .form-container {
    .btn {
      margin-top: 40px;
      width: 100%;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
    }
  }
}
</style>
