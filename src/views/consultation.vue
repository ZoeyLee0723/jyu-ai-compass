<template>
  <div class="consultation-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="nav-left">
        <el-button text @click="sidebarCollapsed = !sidebarCollapsed" class="collapse-btn">
          <el-icon size="20">
            <DArrowLeft v-if="!sidebarCollapsed" />
            <DArrowRight v-else />
          </el-icon>
        </el-button>
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

    <div class="main-container">
      <!-- 左侧边栏 -->
      <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }" v-show="!sidebarCollapsed">
        <!-- AI助手信息 -->
        <div class="assistant-card">
          <div class="assistant-avatar">
            <el-image :src="robot" class="avatar-img" />
            <div class="online-badge"></div>
          </div>
          <div class="assistant-info">
            <h3>智能助手</h3>
            <p class="assistant-status">
              <span class="status-dot"></span>
              在线 · AI心理咨询
            </p>
          </div>
        </div>

        <!-- 情绪分析面板 -->
        <div class="emotion-panel">
          <div class="panel-header">
            <el-icon><DataAnalysis /></el-icon>
            <span>情绪分析</span>
          </div>
          <div class="emotion-display">
            <div class="emotion-circle" :class="getEmotionClass(currentEmotion.primaryEmotion)">
              <span class="emotion-emoji">{{ getEmotionEmoji(currentEmotion.primaryEmotion) }}</span>
              <span class="emotion-label">{{ currentEmotion.primaryEmotion || '中性' }}</span>
            </div>
            <div class="emotion-score-bar">
              <div class="score-label">
                <span>情绪得分</span>
                <span class="score-value">{{ currentEmotion.emotionScore || 50 }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: (currentEmotion.emotionScore || 50) + '%' }"></div>
              </div>
            </div>
          </div>
          <div class="emotion-tags">
            <span class="tag" :class="{ active: !currentEmotion.isNegative }">
              {{ currentEmotion.isNegative ? '需要关注' : '情绪良好' }}
            </span>
            <span class="tag risk" :class="'risk-' + currentEmotion.riskLevel">
              {{ getRiskText(currentEmotion.riskLevel) }}
            </span>
          </div>
          <div class="suggestion-box" v-if="currentEmotion.suggestion">
            <div class="suggestion-header">
              <span>💡</span> 建议
            </div>
            <p class="suggestion-text">{{ currentEmotion.suggestion }}</p>
          </div>
        </div>

        <!-- 会话历史 -->
        <div class="session-panel">
          <div class="panel-header">
            <el-icon><ChatLineSquare /></el-icon>
            <span>会话历史</span>
            <el-button text size="small" @click="createNewFrontendSeesion">
              <el-icon><Plus /></el-icon>
              新建
            </el-button>
          </div>
          <div class="session-list">
            <div
              class="session-item"
              v-for="item in sessionList"
              :key="item.id"
              :class="{ active: currentSession && currentSession.sessionId === 'session_' + item.id }"
              @click="handleSeesionClick(item)"
            >
              <div class="session-content">
                <div class="session-title">{{ item.seesionTitle || '新会话' }}</div>
                <div class="session-preview">{{ item.lastMessageContent || '暂无消息' }}</div>
                <div class="session-meta">
                  <span><el-icon><Clock /></el-icon> {{ item.startedAt }}</span>
                  <span><el-icon><ChatLineSquare /></el-icon> {{ item.messageCount || 0 }}</span>
                </div>
              </div>
              <el-button class="delete-btn" text size="small" @click.stop="handleDeleteSession(item.id)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </aside>

      <!-- 聊天主区域 -->
      <main class="chat-area">
        <div class="chat-header">
          <div class="header-info">
            <div class="chat-avatar-lg">
              <el-image :src="robot" />
            </div>
            <div class="chat-meta">
              <h2>与智能助手对话</h2>
              <p>AI将为您提供心理支持与建议</p>
            </div>
          </div>
        </div>

        <div class="chat-messages">
          <!-- 欢迎消息 -->
          <div class="message ai-message">
            <div class="message-avatar">
              <el-image :src="robot" />
            </div>
            <div class="message-bubble">
              <p>你好！我是嘉应学院心理助手的AI小助手 🌸</p>
              <p>今天有什么想聊的吗？我在这里倾听你。</p>
              <span class="message-time">刚刚</span>
            </div>
          </div>

          <!-- 消息列表 -->
          <div
            class="message"
            v-for="msg in messages"
            :key="msg.id"
            :class="msg.senderType === 1 ? 'user-message' : 'ai-message'"
          >
            <div class="message-avatar" v-if="msg.senderType === 2">
              <el-image :src="robot" />
            </div>
            <div class="message-bubble">
              <div
                class="typing-indicator"
                v-if="msg.senderType === 2 && isAityping && !msg.content"
              >
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
              </div>
              <MarkdownRenderer
                v-else-if="msg.senderType === 2 && !msg.isError"
                :content="msg.content"
                :is-ai-message="true"
              />
              <p v-else-if="msg.content" v-html="formatMessageContent(msg.content)"></p>
              <div class="error-msg" v-if="msg.isError">{{ msg.content }}</div>
              <span class="message-time">{{ msg.createdAt }}</span>
            </div>
            <div class="message-avatar" v-if="msg.senderType === 1">
              <el-image :src="users" />
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <div class="input-wrapper">
            <el-input
              v-model="userMessage"
              type="textarea"
              :rows="2"
              :disabled="isAityping"
              placeholder="输入您想聊的话题..."
              @keydown.enter="handleKeyDown"
              class="message-input"
            />
            <div class="input-footer">
              <span class="hint">Enter 发送 / Shift+Enter 换行</span>
              <span class="char-count">{{ userMessage.length }}/200</span>
            </div>
          </div>
          <el-button
            class="send-btn"
            type="primary"
            :disabled="isAityping || !userMessage.trim()"
            @click="sendMessage"
          >
            <el-icon><Position /></el-icon>
            发送
          </el-button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import robot from "@/assets/images/robot-fill.png";
import like from "@/assets/images/like.png";
import users from "@/assets/images/users.png";
import jyuLogo from "@/assets/images/嘉应学院-logo.svg";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import {
  ChatRound,
  Clock,
  DeleteFilled,
  Plus,
  Promotion,
  HomeFilled,
  DataAnalysis,
  ChatLineSquare,
  Delete,
  Position,
  DArrowLeft,
  DArrowRight,
} from "@element-plus/icons-vue";
import { ref, onMounted, nextTick } from "vue";
import {
  startSession,
  getSessionList,
  deleteSession,
  getSessionDetail,
  getSeesionEmotion,
} from "@/api/forntend.js";
import { ElMessage } from "element-plus";
import { id } from "element-plus/es/locale/index.mjs";
import { useRouter } from "vue-router";

const router = useRouter();
const sidebarCollapsed = ref(false);

const getEmotionEmoji = (emotion) => {
  const emojiMap = {
    '开心': '😊', '快乐': '😊', '愉快': '😄',
    '悲伤': '😢', '难过': '😢', '忧郁': '😔',
    '愤怒': '😠', '生气': '😠',
    '焦虑': '😰', '紧张': '😰', '担心': '😟',
    '恐惧': '😨', '害怕': '😨',
    '惊讶': '😲', '意外': '😲',
    '平静': '😌', '放松': '😌',
    '中性': '😐', '麻木': '😐',
  };
  return emojiMap[emotion] || '😐';
};

const getEmotionClass = (emotion) => {
  const classMap = {
    '开心': 'happy', '快乐': 'happy', '愉快': 'happy',
    '悲伤': 'sad', '难过': 'sad', '忧郁': 'sad',
    '愤怒': 'angry',
    '焦虑': 'anxious', '紧张': 'anxious', '担心': 'anxious',
    '恐惧': 'fear',
    '平静': 'calm', '放松': 'calm',
  };
  return classMap[emotion] || 'neutral';
};
//新建会话
const createNewFrontendSeesion = () => {
  //新的会话对象
  const newSession = {
    sessionId: `temp_${Date.now()}`,
    status: "TEMP",
    sessionTitle: "新会话",
  };
  //清空消息列表
  messages.value = [];
  //重置情绪状态
  currentEmotion.value = {
    primaryEmotion: "中性",
    emotionScore: 50,
    isNegative: false,
    riskLevel: 0,
    suggestion: "情绪状态平稳",
    improvementSuggestions: [],
    riskDescription: "",
  };
  //设置当前会话
  currentSession.value = newSession;
};
//情绪花园
const currentEmotion = ref({
  primaryEmotion: "中性",
  emotionScore: 50,
  isNegative: false,
  riskLevel: 0,
  suggestion: "情绪状态平稳",
  improvementSuggestions: [],
  riskDescription: "",
});
//获取情绪会话分析结果
const loadSeesionEmotion = (sessionId) => {
  //确保传入id正确
  const actualSessionId = sessionId.toString().startsWith("session_")
    ? sessionId
    : `session_${sessionId}`;
  getSeesionEmotion(actualSessionId).then((res) => {
    console.log("res", res);
    if (res) {
      // 处理字段名映射，确保前端和后端字段名一致
      const processedData = {
        ...res,
        // 确保 improvementSuggestions 字段存在
        improvementSuggestions:
          res.improvementSuggestions || res.imporvementSuggetions || [],
      };
      currentEmotion.value = {
        ...currentEmotion.value,
        ...processedData,
      };
    }
  });
};
//点点点映射方法
const getIntensityClass = (score) => {
  if (score >= 61) {
    return 3;
  }
  if (score >= 31) {
    return 2;
  }
  return 1;
};
//获取风险等级
const getRiskText = (level) => {
  switch (level) {
    case 0:
      return "正常";
    case 2:
      return "预警";
    case 1:
      return "需要关注";
    case 3:
      return "危险";
    default:
      return "未知风险";
  }
};
//当前会话对象
const currentSession = ref(null);
//列表历史数据
const sessionList = ref([]);
//默认对话消息数据结构
const messages = ref([]);
//用户输入消息
const userMessage = ref("");
//是否正在输入中
const isAityping = ref(false);
//回车
const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

//用户发送消息
const sendMessage = () => {
  if (!userMessage.value.trim()) {
    return;
  }
  if (isAityping.value) {
    ElMessage.warning("请稍后，智能助手正在思考中...");
    return;
  }
  //用户的输入
  const userInput = userMessage.value.trim();
  //清空输入框
  userMessage.value = "";

  //添加用户消息到消息列表
  const userMessageItem = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    senderType: 1,
    content: userInput,
    createdAt: new Date().toISOString(),
  };
  messages.value.push(userMessageItem);

  //如果没有会话或者是临时会话，就需要创建一个新的会话
  if (!currentSession.value || currentSession.value.status === "TEMP") {
    startNewSeesion(userInput);
  } else {
    //如果会话已存在，直接调用 startAIResponse
    startAIResponse(currentSession.value.sessionId, userInput);
  }
};

//创建新会话函数
const startNewSeesion = (userInput) => {
  //构建会话参数
  const sessionParams = {
    initialMessage: userInput,
  };
  if (currentSession.value && currentSession.value.sessionTitle === "新会话") {
    sessionParams.sessionTitle = `AI助手-${Date.now()}`;
  } else if (currentSession.value && currentSession.value.sessionTitle) {
    sessionParams.sessionTitle = currentSession.value.sessionTitle;
  } else {
    sessionParams.sessionTitle = `AI助手-${Date.now()}`;
  }
  //创建会话接口
  startSession(sessionParams).then((res) => {
    console.log(res);
    const sessionData = {
      sessionId: res.sessionId,
      status: res.status,
      sessionTitle: sessionParams.sessionTitle,
    };
    //如果是临时会话，需要更新数据
    if (currentSession.value && currentSession.value.status === "TEMP") {
      //更新为正式对话
      Object.assign(currentSession.value, sessionData);
    } else {
      currentSession.value = sessionData;
    }
    //在会话创建成功后调用 startAIResponse
    startAIResponse(currentSession.value.sessionId, userInput);
  });
  //更新会话列表
  getSessionPage();
};
//流失对话
const startAIResponse = (sessionId, userMessage) => {
  if (isAityping.value) {
    ElMessage.warning("请稍后，智能助手正在思考中...");
    return;
  }
  if (!sessionId || !userMessage) {
    ElMessage.error("缺少必要参数");
    return;
  }
  isAityping.value = true;
  const aiMessage = {
    id: `ai_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    senderType: 2,
    content: "",
    createdAt: new Date().toISOString(),
  };
  //添加到消息列表
  messages.value.push(aiMessage);
  //调用流失接口
  const ctrl = new AbortController();
  fetchEventSource(`/api/psychological-chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Token: localStorage.getItem("token"),
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      sessionId,
      userMessage,
    }),
    signal: ctrl.signal,
    onopen: (response) => {
      console.log("连接成功", response);
      if (response.headers.get("Content-Type") !== "text/event-stream") {
        ElMessage.error("服务器返回非流式数据");
        handleError("服务器返回非流式数据");
        ctrl.abort();
        return;
      }
    },
    onmessage: (event) => {
      const raw = event.data.trim();
      if (!raw) return;
      const eventName = event.event;
      //获取到当前会话的AI消息
      const aiMessage = messages.value[messages.value.length - 1];
      if (eventName === "done") {
        isAityping.value = false;
        ctrl.abort();
        //开始情绪分析
        loadSeesionEmotion(currentSession.value.sessionId);
        return;
      }
      try {
        const payload = JSON.parse(raw);
        const ok = payload.code === "200";
        if (ok && payload.data) {
          aiMessage.content += payload.data.content || "";
        } else if (!ok) {
          handleError(payload.message || "未知错误");
          ctrl.abort();
        }
      } catch (error) {
        handleError("解析响应数据失败");
        ctrl.abort();
      }
    },
    onerror: (error) => {
      handleError(error.message || "连接失败");
      throw error;
    },
    onclose: () => {
      loadSeesionEmotion(currentSession.value.sessionId);
    },
  }).then((res) => {
    console.log(res);
  });
};

//错误处理函数
const handleError = (error) => {
  const aiMessage = messages.value[messages.value.length - 1];
  if (aiMessage) {
    aiMessage.content = error || "AI回复失败，请稍后";
    aiMessage.isError = true;
  }
  isAityping.value = false;
  ElMessage.error(error || "AI回复失败，请稍后");
};
//获取会话列表
const getSessionPage = () => {
  getSessionList({
    PageNum: 1,
    pageSize: 10,
  }).then((res) => {
    console.log(res);
    sessionList.value = res.records || [];
  });
};
//点击获取会话数据
const handleSeesionClick = (item) => {
  //获取会话详情
  getSessionDetail(item.id).then((res) => {
    console.log(res);
    messages.value = res || [];
  });
  //获取会话情绪分析结果
  loadSeesionEmotion(item.id);
  //需要更新当前会话对象的数据
  const sessionData = {
    sessionId: "session_" + item.id,
    status: "ACTIVE",
    sessionTitle: item.sessionTitle,
  };
  //更新当前会话对象
  currentSession.value = sessionData;
};
//删除会话
const handleDeleteSession = (sessionId) => {
  console.log(sessionId);
  deleteSession(sessionId).then(() => {
    ElMessage.success("会话删除成功");
    getSessionPage();
  });
};
//格式化方法
const formatMessageContent = (content) => {
  // 替换换行符为 <br>
  content = content.replace(/\n/g, "<br>");
  // 替换代码块为 Markdown 格式
  // content = content.replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>');
  return content;
};
onMounted(() => {
  getSessionPage();
  createNewFrontendSeesion();
});
</script>

<style scoped lang="scss">
.consultation-page {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;

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

      .collapse-btn {
        padding: 6px;
        &:hover {
          background: rgba(0, 51, 102, 0.05);
        }
      }

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

  // 主容器
  .main-container {
    flex: 1;
    display: flex;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    padding: 24px;
    gap: 24px;
  }

  // 左侧边栏
  .sidebar {
    width: 300px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: all 0.3s ease;

    &.collapsed {
      width: 0;
      padding: 0;
      overflow: hidden;
    }

    // AI助手卡片
    .assistant-card {
      background: linear-gradient(135deg, #003366 0%, #1a5a8e 100%);
      border-radius: 12px;
      padding: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: white;

      .assistant-avatar {
        position: relative;

        .avatar-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .online-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid #003366;
        }
      }

      .assistant-info {
        h3 {
          font-size: 15px;
          font-weight: 600;
          margin: 0 0 2px;
        }

        .assistant-status {
          font-size: 11px;
          opacity: 0.8;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 4px;

          .status-dot {
            width: 6px;
            height: 6px;
            background: #22c55e;
            border-radius: 50%;
          }
        }
      }
    }

    // 情绪分析面板
    .emotion-panel {
      background: white;
      border-radius: 12px;
      padding: 14px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

      .panel-header {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        font-weight: 600;
        color: #003366;
        margin-bottom: 12px;

        .el-icon {
          font-size: 16px;
        }
      }

      .emotion-display {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 12px;

        .emotion-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px solid #e0e0e0;
          flex-shrink: 0;

          .emotion-emoji {
            font-size: 20px;
          }

          .emotion-label {
            font-size: 10px;
            font-weight: 600;
          }

          &.happy { background: #fef3c7; border-color: #fcd34d; }
          &.sad { background: #dbeafe; border-color: #93c5fd; }
          &.angry { background: #fee2e2; border-color: #fca5a5; }
          &.anxious { background: #fef3c7; border-color: #fcd34d; }
          &.fear { background: #f3e8ff; border-color: #c4b5fd; }
          &.calm { background: #d1fae5; border-color: #6ee7b7; }
          &.neutral { background: #f3f4f6; border-color: #d1d5db; }
        }

        .emotion-score-bar {
          flex: 1;

          .score-label {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #666;
            margin-bottom: 6px;

            .score-value {
              font-weight: 600;
              color: #003366;
            }
          }

          .progress-bar {
            height: 6px;
            background: #f3f4f6;
            border-radius: 3px;
            overflow: hidden;

            .progress-fill {
              height: 100%;
              background: linear-gradient(90deg, #003366, #1a5a8e);
              border-radius: 3px;
              transition: width 0.5s;
            }
          }
        }
      }

      .emotion-tags {
        display: flex;
        gap: 6px;
        margin-bottom: 10px;

        .tag {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;

          &.active {
            background: #d1fae5;
            color: #059669;
          }

          &.risk {
            background: #fef3c7;
            color: #d97706;
            &.risk-3, &.risk-2 {
              background: #fee2e2;
              color: #dc2626;
            }
          }
        }
      }

      .suggestion-box {
        background: #f8fafc;
        border-radius: 10px;
        padding: 10px;
        border: 1px solid #e2e8f0;

        .suggestion-header {
          font-size: 12px;
          font-weight: 600;
          color: #003366;
          margin-bottom: 6px;
        }

        .suggestion-text {
          font-size: 12px;
          color: #64748b;
          margin: 0;
          line-height: 1.4;
        }
      }
    }

    // 会话面板
    .session-panel {
      background: white;
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      max-height: 260px;

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        font-weight: 600;
        color: #003366;
        margin-bottom: 10px;

        .el-icon {
          font-size: 16px;
          margin-right: 4px;
        }
      }

      .session-list {
        flex: 1;
        overflow-y: auto;

        .session-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 6px;
          border: 2px solid transparent;

          &:hover {
            background: #f8fafc;
          }

          &.active {
            background: #eff6ff;
            border-color: #3b82f6;
          }

          .session-content {
            flex: 1;
            min-width: 0;

            .session-title {
              font-size: 13px;
              font-weight: 500;
              color: #1f2937;
              margin-bottom: 2px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .session-preview {
              font-size: 11px;
              color: #6b7280;
              margin-bottom: 4px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .session-meta {
              display: flex;
              gap: 8px;
              font-size: 10px;
              color: #9ca3af;

              span {
                display: flex;
                align-items: center;
                gap: 2px;
              }
            }
          }

          .delete-btn {
            opacity: 0;
            transition: opacity 0.3s;
          }

          &:hover .delete-btn {
            opacity: 1;
          }
        }
      }
    }
  }

  // 聊天主区域
  .chat-area {
    flex: 1;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .chat-header {
      padding: 14px 20px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .header-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .chat-avatar-lg {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .chat-meta {
          h2 {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 2px;
          }

          p {
            font-size: 12px;
            color: #6b7280;
            margin: 0;
          }
        }
      }
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #f9fafb;

      .message {
        display: flex;
        gap: 10px;
        margin-bottom: 16px;
        animation: fadeIn 0.3s ease;

        &.ai-message {
          .message-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;
            background: linear-gradient(135deg, #003366, #1a5a8e);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .message-bubble {
            background: white;
            border-radius: 4px 16px 16px 16px;
            padding: 12px 14px;
            max-width: 70%;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            border: 1px solid #e5e7eb;

            p {
              margin: 0 0 6px;
              line-height: 1.5;
              color: #1f2937;
              font-size: 14px;
            }

            p:last-child {
              margin-bottom: 0;
            }

            .message-time {
              font-size: 10px;
              color: #9ca3af;
              margin-top: 6px;
            }
          }
        }

        &.user-message {
          flex-direction: row-reverse;

          .message-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;
          }

          .message-bubble {
            background: linear-gradient(135deg, #003366, #1a5a8e);
            border-radius: 16px 4px 16px 16px;
            padding: 12px 14px;
            max-width: 70%;
            box-shadow: 0 2px 8px rgba(0, 51, 102, 0.2);

            p {
              margin: 0;
              line-height: 1.5;
              color: white;
              font-size: 14px;
            }

            .message-time {
              font-size: 10px;
              color: rgba(255, 255, 255, 0.7);
              margin-top: 4px;
            }
          }
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 10px 14px;

          .typing-dot {
            width: 6px;
            height: 6px;
            background: #9ca3af;
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out;

            &:nth-child(1) { animation-delay: 0s; }
            &:nth-child(2) { animation-delay: 0.2s; }
            &:nth-child(3) { animation-delay: 0.4s; }
          }
        }

        .error-msg {
          background: #fef2f2;
          color: #dc2626;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
        }
      }
    }

    .chat-input-area {
      padding: 12px 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 12px;
      align-items: flex-end;
      background: white;

      .input-wrapper {
        flex: 1;

        :deep(.el-textarea__inner) {
          border-radius: 12px;
          padding: 10px 14px;
          resize: none;
          border: 1px solid #e5e7eb;
          font-size: 14px;

          &:focus {
            border-color: #003366;
            box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.1);
          }
        }

        .input-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
          font-size: 11px;
          color: #9ca3af;

          .char-count {
            color: #6b7280;
          }
        }
      }

      .send-btn {
        height: 38px;
        padding: 0 18px;
        border-radius: 19px;
        background: linear-gradient(135deg, #003366 0%, #1a5a8e 100%);
        border: none;
        font-size: 13px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: all 0.3s;

        &:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 51, 102, 0.3);
        }

        &:disabled {
          background: #9ca3af;
        }
      }
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.8); }
  40% { transform: scale(1); }
}

// 响应式
@media (max-width: 1024px) {
  .consultation-page {
    .main-container {
      flex-direction: column;
      padding: 16px;
      gap: 16px;

      .sidebar {
        width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 10px;

        .assistant-card, .emotion-panel {
          flex: 1;
          min-width: 200px;
        }

        .session-panel {
          max-height: 180px;
        }
      }

      .chat-area {
        min-height: 400px;
      }
    }
  }
}
</style>
