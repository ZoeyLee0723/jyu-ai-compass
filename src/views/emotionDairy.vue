<template>
  <div class="diary-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="nav-left">
        <el-image :src="jyuLogo" class="nav-logo" />
        <span class="nav-title">嘉应学院心理服务平台</span>
      </div>
      <div class="nav-right">
        <router-link to="/" class="nav-link">
          <el-icon><HomeFilled /></el-icon>
          返回首页
        </router-link>
      </div>
    </div>

    <!-- 头部 -->
    <div class="header-section">
      <div class="header-bg">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
      </div>
      <div class="header-content">
        <div class="header-icon">
          <el-image :src="like" />
        </div>
        <div class="header-text">
          <h1>情绪日记</h1>
          <p>记录今日情绪，拥抱更好的自己</p>
        </div>
      </div>
    </div>

    <!-- 内容 -->
    <div class="content">
      <div class="main-layout">
        <!-- 左侧边栏 -->
        <aside class="left-sidebar">
          <!-- 情绪评分 -->
          <div class="sidebar-card">
            <div class="card-header">
              <el-icon><Star /></el-icon>
              <span>情绪评分</span>
            </div>
            <div class="card-body">
              <p class="hint-text">今天的情绪分数</p>
              <el-rate
                v-model="diaryForm.moodScore"
                :max="10"
                show-text
                :texts="emotionStatus"
                size="large"
              />
            </div>
          </div>

          <!-- 情绪选择（可折叠） -->
          <div class="sidebar-card">
            <el-collapse v-model="activeCollapse">
              <el-collapse-item name="emotion">
                <template #title>
                  <div class="collapse-header">
                    <el-icon><MagicStick /></el-icon>
                    <span>选择情绪</span>
                  </div>
                </template>
                <div class="emotion-list">
                  <div
                    class="emotion-item"
                    @click="selectEmotion(emotion.name)"
                    v-for="emotion in emotionOptions"
                    :key="emotion.name"
                    :class="{ selected: emotion.name === diaryForm.dominantEmotion }"
                  >
                    <el-image :src="emotion.url" />
                    <span>{{ emotion.name }}</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </aside>

        <!-- 右侧表单 -->
        <main class="right-form">
          <el-card>
            <template #header>
              <div class="card-header">
                <el-icon><EditPen /></el-icon>
                <span>详细记录</span>
              </div>
            </template>
            <div class="form-group">
              <label class="form-label">情绪触发因素</label>
              <el-input
                v-model="diaryForm.emotionTriggers"
                placeholder="发生了什么让你产生这种情绪？"
                type="textarea"
                :rows="2"
                maxLength="500"
                show-word-limit
              />
            </div>
            <div class="form-row">
              <div class="form-group half">
                <label class="form-label">睡眠质量</label>
                <el-select v-model="diaryForm.sleepQuality" placeholder="选择睡眠质量">
                  <el-option label="很差" value="1" />
                  <el-option label="较差" value="2" />
                  <el-option label="一般" value="3" />
                  <el-option label="良好" value="4" />
                  <el-option label="优秀" value="5" />
                </el-select>
              </div>
              <div class="form-group half">
                <label class="form-label">压力水平</label>
                <el-select v-model="diaryForm.stressLevel" placeholder="选择压力水平">
                  <el-option label="很低" value="1" />
                  <el-option label="较低" value="2" />
                  <el-option label="中等" value="3" />
                  <el-option label="较高" value="4" />
                  <el-option label="很高" value="5" />
                </el-select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">今日感想</label>
              <el-input
                v-model="diaryForm.diaryContent"
                placeholder="记录今天的心情和感悟..."
                type="textarea"
                :rows="6"
                maxLength="1200"
                show-word-limit
              />
            </div>
            <div class="action-buttons">
              <el-button type="primary" size="large" @click="submit">
                <el-icon><Check /></el-icon>
                提交记录
              </el-button>
              <el-button size="large" @click="resetForm">重置</el-button>
            </div>
          </el-card>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { addEmotionDairy } from "../api/forntend.js";

const activeCollapse = ref(['emotion']);
import jyuLogo from "@/assets/images/嘉应学院-logo.svg";
import like from "@/assets/images/like.png";
import sad from "@/assets/images/悲伤.png";
import worried from "@/assets/images/焦虑.png";
import happy from "@/assets/images/开心.png";
import surprised from "@/assets/images/惊讶.png";
import misgiving from "@/assets/images/困惑.png";
import fatigue from "@/assets/images/疲惫.png";
import peace from "@/assets/images/平静.png";
import excited from "@/assets/images/兴奋.png";
import { ElMessage } from "element-plus";
import { HomeFilled, Star, MagicStick, EditPen, Check, DataLine } from "@element-plus/icons-vue";

import dayjs from "dayjs";
//情绪数据
const emotionStatus = [
  "绝望崩溃",
  "消沉抑郁",
  "焦虑烦躁",
  "低落不悦",
  "平静淡然",
  "轻松惬意",
  "愉悦舒心",
  "欢欣满足",
  "兴奋欣喜",
  "极致幸福",
];
//选择情绪
const selectEmotion = (emotion) => {
  diaryForm.dominantEmotion = emotion;
};
//情绪选项
const emotionOptions = [
  { name: "开心", url: happy },
  { name: "悲伤", url: sad },
  { name: "焦虑", url: worried },
  { name: "惊讶", url: surprised },
  { name: "困惑", url: misgiving },
  { name: "疲惫", url: fatigue },
  { name: "平静", url: peace },
  { name: "兴奋", url: excited },
];

//表单数据
const diaryForm = reactive({
  diaryDate: dayjs().format("YYYY-MM-DD"),
  moodScore: null,
  dominantEmotion: "",
  emotionTriggers: "",
  diaryContent: "",
  sleepQuality: null,
  stressLevel: null,
});
//提交与重置按钮
const resetForm = () => {
  diaryForm.moodScore = null;
  diaryForm.dominantEmotion = "";
  diaryForm.emotionTriggers = "";
  diaryForm.diaryContent = "";
  diaryForm.sleepQuality = null;
  diaryForm.stressLevel = null;
};
const submit = () => {
  console.log(diaryForm);
  if (
    !diaryForm.moodScore ||
    !diaryForm.dominantEmotion ||
    !diaryForm.emotionTriggers ||
    !diaryForm.diaryContent ||
    !diaryForm.sleepQuality ||
    !diaryForm.stressLevel
  ) {
    ElMessage.error("请填写完整信息");
    return;
  }
  addEmotionDairy(diaryForm).then((res) => {
    ElMessage.success("提交成功");
    resetForm();
  });
};
</script>

<style lang="scss" scoped>
.diary-page {
  min-height: 100vh;
  background: #f8fafc;

  // 顶部导航
  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 32px;
    background: white;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

    .nav-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .nav-logo {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }

      .nav-title {
        font-size: 15px;
        font-weight: 600;
        color: #003366;
      }
    }

    .nav-right {
      .nav-link {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #666;
        text-decoration: none;
        font-size: 14px;
        padding: 8px 16px;
        border-radius: 8px;
        transition: all 0.3s;

        &:hover {
          color: #003366;
          background: rgba(0, 51, 102, 0.05);
        }
      }
    }
  }

  // 头部
  .header-section {
    position: relative;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    padding: 40px 24px;
    overflow: hidden;

    .header-bg {
      position: absolute;
      inset: 0;

      .bg-shape {
        position: absolute;
        border-radius: 50%;
        opacity: 0.1;
      }
      .shape-1 {
        width: 250px;
        height: 250px;
        background: white;
        top: -80px;
        right: -50px;
      }
      .shape-2 {
        width: 180px;
        height: 180px;
        background: white;
        bottom: -40px;
        left: 10%;
      }
    }

    .header-content {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 16px;
      max-width: 800px;
      margin: 0 auto;

      .header-icon {
        width: 64px;
        height: 64px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .header-text {
        h1 {
          font-size: 26px;
          font-weight: 700;
          color: white;
          margin: 0 0 6px;
        }

        p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
        }
      }
    }
  }

  // 内容
  .content {
    max-width: 1000px;
    margin: 0 auto;
    padding: 24px 16px;

    .main-layout {
      display: flex;
      gap: 20px;
    }

    // 左侧边栏
    .left-sidebar {
      width: 280px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    // 右侧表单
    .right-form {
      flex: 1;
      min-width: 0;
    }

    // 卡片样式
    .sidebar-card {
      background: white;
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      overflow: hidden;

      .card-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 14px 16px;
        background: #f9fafb;
        border-bottom: 1px solid #f0f0f0;
        font-size: 14px;
        font-weight: 600;
        color: #1f2937;

        .el-icon {
          font-size: 16px;
          color: #10b981;
        }
      }

      .card-body {
        padding: 16px;

        .hint-text {
          font-size: 13px;
          color: #6b7280;
          margin: 0 0 12px;
        }
      }
    }

    // 情绪列表（左边）
    .emotion-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;

      .emotion-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 8px;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        cursor: pointer;
        background: #f9fafb;
        transition: all 0.3s;

        :deep(.el-image) {
          width: 36px;
          height: 36px;
          margin-bottom: 6px;
        }

        span {
          font-size: 12px;
          color: #374151;
        }

        &:hover {
          border-color: #10b981;
          background: #ecfdf5;
        }

        &.selected {
          border-color: #10b981;
          background: #ecfdf5;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
        }
      }
    }

    // 生活指标（左边）
    .indicator-item {
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      label {
        display: block;
        font-size: 13px;
        color: #374151;
        margin-bottom: 8px;
      }

      :deep(.el-select) {
        width: 100%;
      }
    }

    // 右侧表单卡片
    .right-form {
      :deep(.el-card) {
        border-radius: 14px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      }

      :deep(.el-card__header) {
        padding: 16px 20px;
        border-bottom: 1px solid #f0f0f0;
        font-size: 15px;
        font-weight: 600;
        color: #1f2937;
      }

      :deep(.el-card__body) {
        padding: 20px;
      }

      // 表单样式
      .form-group {
        margin-bottom: 18px;

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 10px;
        }

        :deep(.el-textarea__inner) {
          border-radius: 10px;
          padding: 12px;
        }
      }

      .action-buttons {
        display: flex;
        gap: 12px;
        margin-top: 24px;

        .el-button {
          flex: 1;
          height: 44px;
          border-radius: 10px;
          font-size: 15px;
        }

        .el-button--primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;

          &:hover {
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .diary-page .content .main-layout {
    flex-direction: column;
  }

  .diary-page .content .left-sidebar {
    width: 100%;
  }

  .diary-page .content .emotion-list {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
