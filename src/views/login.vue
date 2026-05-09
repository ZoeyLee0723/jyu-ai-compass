<template>
  <div class="login-form">
    <div class="form-card">
      <div class="form-header">
        <div class="back-home" @click="goHome">
          <el-icon><HomeFilled /></el-icon>
          <span>返回首页</span>
        </div>
        <div class="title-text">
          <h2>欢迎登录</h2>
          <p>请输入您的账号信息</p>
        </div>
      </div>
      <div class="form-container">
        <el-form
          ref="ruleFormRef"
          :model="FormData"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="FormData.username"
              size="large"
              placeholder="请输入用户名或邮箱"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="FormData.password"
              type="password"
              size="large"
              placeholder="请输入密码"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>
          <div class="form-options">
            <el-checkbox v-model="rememberMe">记住我</el-checkbox>
            <span class="forgot-link">忘记密码？</span>
          </div>
          <el-button class="btn" type="primary" size="large" @click="submitForm(ruleFormRef)">
            登 录
          </el-button>
          <div class="footer">
            <p>还没有账号？<router-link to="/author/register">立即注册</router-link></p>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { HomeFilled, User, Lock } from "@element-plus/icons-vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { login } from "@/api/admin";

const router = useRouter();
const rememberMe = ref(false);

const FormData = ref({
  username: "",
  password: "",
});

const rules = ref({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const ruleFormRef = ref();

const goHome = () => {
  router.push("/");
};

const submitForm = async (formEl) => {
  if (!formEl) {
    return;
  }

  await formEl.validate((valid) => {
    if (valid) {
      console.log('表单验证通过');
      login(FormData.value).then(res => {
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
.login-form {
  width: 100%;
  max-width: 420px;
  padding: 20px;

  .form-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0, 51, 102, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.9);

    .form-header {
      margin-bottom: 32px;

      .back-home {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #666;
        font-size: 14px;
        cursor: pointer;
        margin-bottom: 20px;
        transition: color 0.3s;

        &:hover {
          color: #003366;
        }
      }

      .title-text {
        text-align: center;

        h2 {
          font-size: 28px;
          font-weight: 700;
          color: #003366;
          margin: 0 0 8px;
        }

        p {
          font-size: 14px;
          color: #999;
          margin: 0;
        }
      }
    }

    .form-container {
      :deep(.el-form-item) {
        margin-bottom: 24px;
      }

      :deep(.el-form-item__label) {
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }

      :deep(.el-input__wrapper) {
        border-radius: 12px;
        box-shadow: 0 0 0 1px #e0e0e0 inset;
        padding: 4px 12px;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 0 0 1px #003366 inset;
        }

        &.is-focus {
          box-shadow: 0 0 0 1px #003366 inset;
        }
      }

      :deep(.el-input__inner) {
        height: 40px;
      }

      .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        :deep(.el-checkbox__label) {
          color: #666;
          font-size: 13px;
        }

        .forgot-link {
          font-size: 13px;
          color: #003366;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .btn {
        width: 100%;
        height: 48px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        background: linear-gradient(135deg, #003366 0%, #1e5a8e 100%);
        border: none;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 51, 102, 0.3);
        }
      }

      .footer {
        margin-top: 24px;
        text-align: center;
        font-size: 14px;
        color: #666;

        a {
          color: #003366;
          font-weight: 500;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .login-form {
    .form-card {
      padding: 28px 20px;
    }
  }
}
</style>
