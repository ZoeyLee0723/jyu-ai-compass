<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="navbar-left">
        <el-image
          :src="jyuLogo"
          alt="嘉应学院校徽"
          style="width: 40px; height: 40px; object-fit: contain;"
        />
        <span class="navbar-title">嘉应学院心理服务平台</span>
      </div>
      <div class="navbar-right">
        <el-button type="text" @click="handleLogin">登录</el-button>
        <el-button type="primary" @click="handleRegister">注册</el-button>
      </div>
    </nav>

    <!-- 英雄区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">守护心灵，温暖同行</h1>
        <p class="hero-subtitle">
          基于大模型的智能问答系统，为嘉应学院学子提供心理健康辅助服务
        </p>
        <div class="hero-actions">
          <el-button size="large" type="primary" @click="handleConsult">
            立即咨询
          </el-button>
        </div>
      </div>
      <div class="hero-background"></div>
    </div>

    <!-- 功能卡片区域 -->
    <div class="features-section">
      <h2 class="section-title">我们的服务</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <i class="el-icon-s-comment"></i>
          </div>
          <h3 class="feature-title">在线咨询</h3>
          <p class="feature-description">
            与AI心理助手实时对话，获取即时支持
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="el-icon-data-line"></i>
          </div>
          <h3 class="feature-title">心理测试</h3>
          <p class="feature-description">
            通过专业量表了解自己的心理状态
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="el-icon-document"></i>
          </div>
          <h3 class="feature-title">心理知识</h3>
          <p class="feature-description">
            学习心理健康知识，提升心理素质
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="el-icon-calendar"></i>
          </div>
          <h3 class="feature-title">预约咨询</h3>
          <p class="feature-description">
            预约专业心理咨询师进行面对面交流
          </p>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <footer class="footer">
      <div class="footer-content">
        <p>© 2024 嘉应学院心理服务平台</p>
        <p>由嘉应学院心理中心支持</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import jyuLogo from "@/assets/images/嘉应学院-logo.svg";

const handleLogin = () => {
  console.log('登录');
};

const handleRegister = () => {
  console.log('注册');
};

const handleConsult = () => {
  console.log('立即咨询');
};
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: 'Microsoft YaHei', sans-serif;
}

/* 导航栏样式 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #003366;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 1rem;

    .navbar-title {
      font-size: 1.2rem;
      font-weight: bold;
    }
  }

  .navbar-right {
    display: flex;
    gap: 1rem;
  }
}

/* 英雄区域样式 */
.hero-section {
  position: relative;
  height: 400px;
  background: linear-gradient(135deg, #003366 0%, #1e5a8e 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .hero-content {
    z-index: 2;
    text-align: center;
    max-width: 600px;
    padding: 0 2rem;

    .hero-title {
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
  }

  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23003366" fill-opacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,117.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
    background-size: cover;
    opacity: 0.3;
  }
}

/* 功能卡片区域样式 */
.features-section {
  padding: 4rem 2rem;
  background-color: white;

  .section-title {
    text-align: center;
    font-size: 2rem;
    color: #003366;
    margin-bottom: 3rem;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .feature-card {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

    .feature-icon {
      font-size: 2.5rem;
      color: #003366;
      margin-bottom: 1rem;
    }

    .feature-title {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 1rem;
      color: #333;
    }

    .feature-description {
      color: #666;
      line-height: 1.5;
    }
  }
}

/* 底部信息样式 */
.footer {
  background-color: #003366;
  color: white;
  padding: 2rem;
  text-align: center;

  .footer-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
