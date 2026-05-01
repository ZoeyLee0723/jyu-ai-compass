<template>
  <div class="common-layout">
    <el-container class="sidebar-container">
      <Sidebar></Sidebar>
      <el-container class="main-wrapper">
        <el-header class="header-container"><NavBar></NavBar></el-header>
        <el-main class="main-container">
          <router-view class="content-container">
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import Sidebar from './sidebar.vue'
import NavBar from './NavBar.vue'
import Dashboard from '../views/dashboard.vue'
</script>
<style lang="scss" scoped>
.common-layout {
  height: 100vh;
  overflow: hidden;

  .sidebar-container {
    height: 100%;
  }

  .main-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .header-container {
    height: 64px;
    padding: 0;
    flex-shrink: 0;
  }

  .main-container {
    flex: 1;
    overflow: hidden;
    padding: 0;
    background-color: #f0f2f5;
  }

  .content-container {
    height: 100%;
    overflow-y: auto;
    background-color: white;
    padding: 20px;
    box-sizing: border-box;
  }
}
</style>
