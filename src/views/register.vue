<template>
  <div class="register-form">
    <div class="form-card">
      <div class="form-header">
        <div class="back-home" @click="goHome">
          <el-icon><HomeFilled /></el-icon>
          <span>返回首页</span>
        </div>
        <div class="title-text">
          <h2>创建账户</h2>
          <p>加入嘉应学院心理服务平台</p>
        </div>
      </div>
      <div class="form-container">
        <el-form
          :model="formData"
          :rules="rules"
          ref="submitformRef"
          label-position="top"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="formData.username"
              placeholder="请输入用户名"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="formData.email"
              placeholder="请输入邮箱"
              size="large"
              :prefix-icon="Message"
            />
          </el-form-item>
          <div class="form-row">
            <el-form-item label="昵称" prop="nickname">
              <el-input
                v-model="formData.nickname"
                placeholder="请输入昵称（可选）"
                size="large"
                :prefix-icon="UserFilled"
              />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="formData.phone"
                placeholder="请输入手机号（可选）"
                size="large"
                :prefix-icon="Phone"
              />
            </el-form-item>
          </div>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="formData.password"
              placeholder="请输入密码"
              size="large"
              type="password"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="formData.confirmPassword"
              placeholder="请确认密码"
              size="large"
              type="password"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="agreeTerms">我已阅读并同意服务条款</el-checkbox>
          </el-form-item>

          <el-button
            type="primary"
            @click="submitForm(submitformRef)"
            class="btn"
            >
            注 册
          </el-button>
        </el-form>
        <div class="footer">
          <p>已有账号？<router-link to="/author/login">立即登录</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { register } from "@/api/forntend.js";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { HomeFilled, User, Message, UserFilled, Phone, Lock } from "@element-plus/icons-vue";

const router = useRouter();
const agreeTerms = ref(false);

const goHome = () => {
  router.push("/");
};

//表单数据
const formData = reactive({
  username: "",
  email: "",
  nickname: "",
  phone: "",
  password: "",
  confirmPassword: "",
  gender: 0,
  userType: 1, //1是普通用户
});
//规则
const rules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  confirmPassword: [{ required: true, message: "请确认密码", trigger: "blur" }],
});
//获取表单
const submitformRef = ref(null);
//提交表单
const submitForm = async (formEl) => {
  if (!formEl) {
    return;
  }
  formEl.validate(async (valid) => {
    if (valid) {
      register(formData)
        .then(() => {
          ElMessage.success("注册成功");
          router.push("/author/login");
        })
        .catch((res) => {
          console.log(res);
          ElMessage.error("注册失败");
          router.push("/author/register");
        });
    }
  });
};
</script>

<style lang="scss" scoped>
.register-form {
  width: 100%;
  max-width: 480px;
  padding: 16px;

  .form-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 20px 60px rgba(0, 51, 102, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.9);

    .form-header {
      margin-bottom: 20px;

      .back-home {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #666;
        font-size: 13px;
        cursor: pointer;
        margin-bottom: 12px;
        transition: color 0.3s;

        &:hover {
          color: #003366;
        }
      }

      .title-text {
        text-align: center;

        h2 {
          font-size: 22px;
          font-weight: 700;
          color: #003366;
          margin: 0 0 6px;
        }

        p {
          font-size: 13px;
          color: #999;
          margin: 0;
        }
      }
    }

    .form-container {
      :deep(.el-form-item) {
        margin-bottom: 14px;
      }

      :deep(.el-form-item__label) {
        font-size: 13px;
        color: #333;
        font-weight: 500;
      }

      :deep(.el-input__wrapper) {
        border-radius: 10px;
        box-shadow: 0 0 0 1px #e0e0e0 inset;
        padding: 2px 10px;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 0 0 1px #003366 inset;
        }

        &.is-focus {
          box-shadow: 0 0 0 1px #003366 inset;
        }
      }

      :deep(.el-input__inner) {
        height: 34px;
      }

      :deep(.el-checkbox__label) {
        color: #666;
        font-size: 12px;
      }

      .form-row {
        display: flex;
        gap: 12px;

        :deep(.el-form-item) {
          flex: 1;
        }
      }

      .btn {
        margin-top: 4px;
        width: 100%;
        height: 40px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        background: linear-gradient(135deg, #003366 0%, #1e5a8e 100%);
        border: none;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 51, 102, 0.3);
        }
      }

      .footer {
        margin-top: 16px;
        text-align: center;
        font-size: 13px;
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

@media (max-width: 520px) {
  .register-form .form-card {
    padding: 20px 16px;

    .form-container .form-row {
      flex-direction: column;
      gap: 0;
    }
  }
}
</style>
