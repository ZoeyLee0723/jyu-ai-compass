<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="navbar-left">
        <el-image
          :src="jyuLogo"
          alt="嘉应学院校徽"
          class="logo-img"
        />
        <span class="navbar-title">嘉应学院心理服务平台</span>
      </div>
      <div class="navbar-right">
        <router-link to="/" class="nav-link active">首页</router-link>
        <router-link to="/consultation" class="nav-link" v-if="isLoggedIn">AI咨询</router-link>
        <router-link to="/emotion-dairy" class="nav-link" v-if="isLoggedIn">情绪日记</router-link>
        <router-link to="/knowledge" class="nav-link">知识库</router-link>
        <el-button
          size="medium"
          class="logout-btn"
          v-if="isLoggedIn"
          @click="handleLogout"
          >退出登录</el-button
        >
        <template v-else>
          <router-link to="/author/login" class="nav-link">登录</router-link>
          <router-link to="/author/register" class="nav-link">
            <el-button size="medium" class="register-btn" type="primary">立即注册</el-button>
          </router-link>
        </template>
      </div>
    </nav>

    <!-- 英雄区域 -->
    <div class="hero-section">
      <div class="hero-bg">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
        <div class="bg-shape shape-3"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">🌟 嘉应学院心理服务中心</div>
        <h1 class="hero-title">守护心灵，温暖同行</h1>
        <p class="hero-subtitle">
          基于AI大模型的心理健康智能助手，为每一位嘉应学子提供专业、温暖的心理支持
        </p>
        <div class="hero-actions">
          <el-button size="large" type="primary" class="primary-btn" @click="handleConsult">
            <el-icon><ChatDotRound /></el-icon>
            开始咨询
          </el-button>
          <el-button size="large" class="secondary-btn" @click="router.push('/knowledge')">
            <el-icon><Reading /></el-icon>
            了解更多
          </el-button>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-num">10000+</span>
            <span class="stat-label">服务学生</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">5000+</span>
            <span class="stat-label">AI对话次数</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">95%</span>
            <span class="stat-label">满意度</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能卡片区域 -->
    <div class="features-section">
      <div class="section-header">
        <h2 class="section-title">我们的服务</h2>
        <p class="section-desc">全方位的心理健康支持，陪伴每一位嘉应学子</p>
      </div>
      <div class="features-grid">
        <div class="feature-card card-1">
          <div class="card-icon">
            <el-icon><ChatDotRound /></el-icon>
          </div>
          <div class="card-content">
            <h3>AI智能咨询</h3>
            <p>随时随地与AI心理助手对话，获得专业倾听与建议</p>
          </div>
          <div class="card-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
        <div class="feature-card card-2">
          <div class="card-icon">
            <el-icon><Notebook /></el-icon>
          </div>
          <div class="card-content">
            <h3>情绪日记</h3>
            <p>记录每日情绪变化，AI智能分析，提供个性化建议</p>
          </div>
          <div class="card-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
        <div class="feature-card card-3">
          <div class="card-icon">
            <el-icon><Reading /></el-icon>
          </div>
          <div class="card-content">
            <h3>心理知识库</h3>
            <p>丰富的心理健康文章与专业知识，提升心理素养</p>
          </div>
          <div class="card-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
        <div class="feature-card card-4">
          <div class="card-icon">
            <el-icon><DataAnalysis /></el-icon>
          </div>
          <div class="card-content">
            <h3>情绪分析报告</h3>
            <p>可视化情绪数据，了解自己的情绪状态与变化趋势</p>
          </div>
          <div class="card-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 特色优势区域 -->
    <div class="advantage-section">
      <div class="advantage-content">
        <div class="advantage-item">
          <div class="advantage-icon">🔒</div>
          <h4>隐私保护</h4>
          <p>严格保护用户隐私，心理咨询内容完全保密</p>
        </div>
        <div class="advantage-item">
          <div class="advantage-icon">⏰</div>
          <h4>24/7在线</h4>
          <p>随时随地获取心理支持，无需等待</p>
        </div>
        <div class="advantage-item">
          <div class="advantage-icon">🎯</div>
          <h4>个性化</h4>
          <p>根据个人情况，提供定制化建议</p>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <footer class="footer">
      <div class="footer-main">
        <div class="footer-left">
          <div class="footer-logo">
            <el-image :src="jyuLogo" class="footer-logo-img" />
            <div class="footer-brand">
              <span class="brand-name">嘉应学院心理服务平台</span>
              <span class="brand-en">JYU Psychological Service Platform</span>
            </div>
          </div>
          <p class="footer-desc">守护每一位嘉应学子的心灵健康</p>
        </div>
        <div class="footer-links">
          <div class="link-group">
            <h5>关于我们</h5>
            <a href="#">平台介绍</a>
            <a href="#">团队成员</a>
            <a href="#">联系我们</a>
          </div>
          <div class="link-group">
            <h5>快速链接</h5>
            <a href="#">AI咨询</a>
            <a href="#">知识库</a>
            <a href="#">情绪日记</a>
          </div>
          <div class="link-group">
            <h5>帮助中心</h5>
            <a href="#">使用指南</a>
            <a href="#">常见问题</a>
            <a href="#">反馈建议</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 嘉应学院心理服务平台 | 由嘉应学院心理中心支持</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import jyuLogo from "@/assets/images/嘉应学院-logo.svg";
import { ref, onMounted } from "vue";
import { logout } from "@/api/admin.js";
import { useRouter } from "vue-router";
import { ChatDotRound, Reading, Notebook, DataAnalysis, ArrowRight } from "@element-plus/icons-vue";

const router = useRouter();
const isLoggedIn = ref(false);

const handleLogout = () => {
  logout().then(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    router.push("/author/login");
  });
};

onMounted(() => {
  isLoggedIn.value = localStorage.getItem("token") !== null;
});

const handleConsult = () => {
  if (isLoggedIn.value) {
    router.push("/consultation");
  } else {
    router.push("/author/login");
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
}

/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 3rem;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .logo-img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid #003366;
    }

    .navbar-title {
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 1px;
      color: #003366;
    }
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;

    .nav-link {
      color: #666;
      font-size: 15px;
      font-weight: 500;
      text-decoration: none;
      padding: 6px 12px;
      border-radius: 6px;
      transition: all 0.3s;

      &:hover {
        color: #003366;
        background: rgba(0, 51, 102, 0.05);
      }

      &.active {
        color: #003366;
        background: rgba(0, 51, 102, 0.08);
      }
    }

    .logout-btn {
      background-color: transparent;
      border: 1px solid #e0e0e0;
      color: #666;

      &:hover {
        background-color: #f5f5f5;
        border-color: #ccc;
        color: #333;
      }
    }

    .register-btn {
      background: linear-gradient(135deg, #003366 0%, #1a5a8e 100%);
      color: white;
      border: none;
      font-weight: 600;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 51, 102, 0.3);
      }
    }
  }
}

/* 英雄区域样式 */
.hero-section {
  position: relative;
  min-height: 560px;
  background: linear-gradient(135deg, #003366 0%, #1a4a7a 50%, #0d2840 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 2rem 60px;
  overflow: hidden;

  .hero-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;

    .bg-shape {
      position: absolute;
      border-radius: 50%;
      opacity: 0.08;
    }
    .shape-1 {
      width: 500px;
      height: 500px;
      background: white;
      top: -150px;
      right: -100px;
    }
    .shape-2 {
      width: 400px;
      height: 400px;
      background: white;
      bottom: -100px;
      left: -100px;
    }
    .shape-3 {
      width: 200px;
      height: 200px;
      background: rgba(255, 255, 255, 0.12);
      top: 40%;
      left: 10%;
    }
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 720px;

    .hero-badge {
      display: inline-block;
      padding: 8px 20px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 30px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      margin-bottom: 20px;
      backdrop-filter: blur(5px);
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #fff 0%, #e8f4fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 2px;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 2.5rem;
      line-height: 1.8;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 40px;

      .primary-btn {
        height: 50px;
        padding: 0 32px;
        background: linear-gradient(135deg, #fff 0%, #e8f4fc 100%);
        color: #003366;
        border: none;
        font-size: 16px;
        font-weight: 600;
        border-radius: 25px;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .el-icon {
          margin-right: 6px;
        }
      }

      .secondary-btn {
        height: 50px;
        padding: 0 32px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        font-size: 16px;
        font-weight: 500;
        border-radius: 25px;
        transition: all 0.3s;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .el-icon {
          margin-right: 6px;
        }
      }
    }

    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 60px;

      .stat-item {
        text-align: center;

        .stat-num {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
  }
}

/* 功能卡片区域样式 */
.features-section {
  padding: 60px 2rem 80px;
  background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);

  .section-header {
    text-align: center;
    margin-bottom: 48px;

    .section-title {
      font-size: 2rem;
      color: #003366;
      margin: 0 0 12px;
      font-weight: 700;
    }

    .section-desc {
      font-size: 15px;
      color: #666;
      margin: 0;
    }
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    max-width: 1000px;
    margin: 0 auto;
  }

  .feature-card {
    position: relative;
    background: white;
    border-radius: 20px;
    padding: 28px 32px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 4px 20px rgba(0, 51, 102, 0.06);
    border: 1px solid rgba(0, 51, 102, 0.08);
    transition: all 0.4s ease;
    cursor: pointer;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(180deg, #003366, #1a5a8e);
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 51, 102, 0.12);
      border-color: rgba(0, 51, 102, 0.15);

      &::before {
        opacity: 1;
      }

      .card-arrow {
        transform: translateX(4px);
        opacity: 1;
      }
    }

    .card-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .el-icon {
        font-size: 26px;
      }
    }

    &.card-1 .card-icon {
      background: linear-gradient(135deg, #e8f4fc 0%, #d0e8f8 100%);
      color: #003366;
    }
    &.card-2 .card-icon {
      background: linear-gradient(135deg, #fef3e2 0%, #fde4cc 100%);
      color: #d4840f;
    }
    &.card-3 .card-icon {
      background: linear-gradient(135deg, #e8f8f0 0%, #d0f0e0 100%);
      color: #059669;
    }
    &.card-4 .card-icon {
      background: linear-gradient(135deg, #fdf2f2 0%, #fce4e4 100%);
      color: #dc2626;
    }

    .card-content {
      flex: 1;

      h3 {
        font-size: 17px;
        font-weight: 600;
        color: #003366;
        margin: 0 0 8px;
      }

      p {
        font-size: 14px;
        color: #666;
        margin: 0;
        line-height: 1.5;
      }
    }

    .card-arrow {
      color: #003366;
      opacity: 0;
      transition: all 0.3s;

      .el-icon {
        font-size: 18px;
      }
    }
  }
}

/* 特色优势区域 */
.advantage-section {
  background: #003366;
  padding: 50px 2rem;

  .advantage-content {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    gap: 60px;
  }

  .advantage-item {
    text-align: center;
    color: white;

    .advantage-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }

    h4 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px;
    }

    p {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      max-width: 200px;
    }
  }
}

/* 底部信息样式 */
.footer {
  background: #0d2840;
  color: white;
  padding: 50px 2rem 20px;

  .footer-main {
    max-width: 1100px;
    margin: 0 auto 40px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .footer-left {
      .footer-logo {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;

        .footer-logo-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;

          .brand-name {
            font-size: 16px;
            font-weight: 600;
          }

          .brand-en {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }

      .footer-desc {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        margin: 0;
      }
    }

    .footer-links {
      display: flex;
      gap: 60px;

      .link-group {
        h5 {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 14px;
          color: rgba(255, 255, 255, 0.9);
        }

        a {
          display: block;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          margin-bottom: 10px;
          transition: color 0.3s;

          &:hover {
            color: white;
          }
        }
      }
    }
  }

  .footer-bottom {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    p {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.4);
      margin: 0;
    }
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .navbar {
    padding: 0.75rem 1rem;

    .navbar-right {
      gap: 0.5rem;

      .nav-link {
        padding: 6px 8px;
        font-size: 14px;
      }
    }
  }

  .hero-section {
    min-height: 480px;
    padding: 80px 1rem 40px;

    .hero-content {
      .hero-title {
        font-size: 2rem;
      }

      .hero-actions {
        flex-direction: column;
        align-items: center;
      }

      .hero-stats {
        gap: 30px;

        .stat-item .stat-num {
          font-size: 1.5rem;
        }
      }
    }
  }

  .features-section .features-grid {
    grid-template-columns: 1fr;
  }

  .advantage-section .advantage-content {
    flex-direction: column;
    gap: 30px;
  }

  .footer .footer-main {
    flex-direction: column;
    gap: 30px;

    .footer-links {
      flex-wrap: wrap;
      gap: 30px;
    }
  }
}
</style>
