<template>
  <div class="frontend-layout">
    <!-- <div class="navbar-container">
      <div class="brand-section">
        <el-image
          :src="robot"
          alt="logo"
          class="brand-logo"
          style="width: 50px; height: 50px"
        />
        <h1 class="brand-name">心理健康AI助手</h1>
      </div>
      <div class="nav-section">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/consultation" class="nav-link" v-if="isLoggedIn"
          >AI咨询</router-link
        >
        <router-link to="/emotion-dairy" class="nav-link" v-if="isLoggedIn"
          >情绪日记</router-link
        >
        <router-link to="/knowledge" class="nav-link">知识库</router-link>
        <el-button size="medium" class="logout-btn" v-if="isLoggedIn" @click="handleLogout"
          >退出登录</el-button
        >
        <template v-else>
          <router-link to="/author/login" class="nav-link">登录</router-link>
          <router-link to="/author/register" class="nav-link">
            <el-button size="medium" class="register-btn" type="primary"
              >注册</el-button
            >
          </router-link>
        </template>
      </div>
    </div> -->
    <div class="main-container">
      <router-view></router-view>
    </div>
    <!-- <div class="footer-container">
      <div class="footer-bottom">
        <p>李宗奕制作</p>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import robot from "@/assets/images/机器人.png";
import { logout } from "@/api/admin.js";
import { useRouter } from "vue-router";
const router = useRouter();
//登录逻辑变量
const isLoggedIn = ref(false);
//退出登录
const handleLogout = () => {
  logout().then(() => {
    // 退出登录成功，跳转到登录页
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    router.push("/author/login");
  });
};

onMounted(() => {
  // 检查本地存储是否有 token
  isLoggedIn.value = localStorage.getItem("token") !== null;
});
</script>

<style scoped lang="scss">
.frontend-layout {
  background-color: #fff;
  .navbar-container {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .brand-section {
      display: flex;
      align-items: center;
      .brand-name {
        margin-left: 10px;
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }
    }
    .nav-section {
      display: flex;
      align-items: center;
      gap: 40px;
      .nav-link {
        color: #4b5563;
        font-size: 16px;
        font-weight: 500;
        &:hover {
          color: #4a90e2;
        }
      }
    }
  }

  .footer-container {
    background: #1f2937;
    color: white;
    padding: 15px 0;
    margin-top: auto;
    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 10px;
      text-align: center;
    }
  }
}
</style>
