<template>
  <div class="auth-layout">
    <div class="left-section">
      <div class="bg-decoration">
        <div class="circle c1"></div>
        <div class="circle c2"></div>
        <div class="circle c3"></div>
      </div>
      <div class="content">
        <div class="logo-area">
          <el-image :src="jyuLogo" fit="contain" class="logo-img" />
          <h1 class="school-name">嘉应学院</h1>
          <p class="school-en">Jiaying College</p>
        </div>
        <div class="intro-area">
          <h2 class="title">心理服务平台</h2>
          <p class="desc">守护心灵，温暖同行</p>
          <div class="tags">
            <span class="tag">AI咨询</span>
            <span class="tag">情绪分析</span>
            <span class="tag">知识库</span>
          </div>
        </div>
        <div class="features">
          <div class="feature-item">
            <span class="icon">🌸</span>
            <span>专业倾听</span>
          </div>
          <div class="feature-item">
            <span>🤝</span>
            <span>温暖陪伴</span>
          </div>
          <div class="feature-item">
            <span>🔒</span>
            <span>隐私保护</span>
          </div>
        </div>
      </div>
    </div>
    <div class="right-section">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import jyuLogo from "../assets/images/嘉应学院-logo.svg";
</script>

<style scoped lang="scss">
.auth-layout {
  display: flex;
  min-height: 100vh;

  .left-section {
    flex: 1;
    background: linear-gradient(135deg, #003366 0%, #1e5a8e 50%, #2d7db3 100%);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .bg-decoration {
      position: absolute;
      inset: 0;
      pointer-events: none;

      .circle {
        position: absolute;
        border-radius: 50%;
        opacity: 0.08;
      }
      .c1 {
        width: 400px;
        height: 400px;
        background: white;
        top: -100px;
        right: -50px;
      }
      .c2 {
        width: 300px;
        height: 300px;
        background: white;
        bottom: -80px;
        left: -80px;
      }
      .c3 {
        width: 150px;
        height: 150px;
        background: rgba(255, 255, 255, 0.15);
        top: 40%;
        left: 15%;
      }
    }

    .content {
      position: relative;
      z-index: 1;
      text-align: center;
      color: white;
      max-width: 450px;
      padding: 20px;

      .logo-area {
        margin-bottom: 40px;

        .logo-img {
          width: 90px;
          height: 90px;
          margin-bottom: 16px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          padding: 10px;
        }

        .school-name {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 6px;
          letter-spacing: 3px;
        }

        .school-en {
          font-size: 13px;
          opacity: 0.7;
          letter-spacing: 2px;
          margin: 0;
        }
      }

      .intro-area {
        margin-bottom: 50px;

        .title {
          font-size: 32px;
          font-weight: 600;
          margin: 0 0 10px;
        }

        .desc {
          font-size: 16px;
          opacity: 0.85;
          margin: 0 0 24px;
        }

        .tags {
          display: flex;
          justify-content: center;
          gap: 12px;

          .tag {
            padding: 6px 18px;
            background: rgba(255, 255, 255, 0.12);
            border-radius: 20px;
            font-size: 13px;
            border: 1px solid rgba(255, 255, 255, 0.15);
          }
        }
      }

      .features {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .feature-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 20px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          font-size: 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);

          .icon {
            font-size: 18px;
          }
        }
      }
    }
  }

  .right-section {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #f8f9fa 0%, #e8ecf1 100%);
  }
}

// 响应式
@media (max-width: 900px) {
  .auth-layout {
    flex-direction: column;

    .left-section {
      flex: none;
      min-height: 220px;
      padding: 40px 20px;

      .content {
        .logo-area {
          margin-bottom: 20px;
          .logo-img {
            width: 50px;
            height: 50px;
          }
          .school-name {
            font-size: 20px;
          }
        }
        .intro-area {
          display: none;
        }
        .features {
          display: none;
        }
      }
    }

    .right-section {
      flex: 1;
    }
  }
}
</style>
