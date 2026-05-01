<template>
  <div class="consultation-container">
    <div class="sidebar">
      <!-- ai助手信息 -->
      <div class="ai-assistant-info">
        <div class="breathing-circle">
          <el-image
            :src="robot"
            alt="ai助手"
            style="width: 25px; height: 25px"
          />
        </div>
        <p class="assistant-name">智能助手</p>
        <div class="online-status">
          <div class="status-dot"></div>
          <span>在线</span>
        </div>
      </div>
      <!-- 情绪花园 -->
      <div class="emotion-garden">
        <div class="garden-header">
          <div class="garden-title">情绪花园</div>
        </div>
        <div class="emotion-info">
          <div class="emotion-name">{{ currentEmotion.primaryEmotion }}</div>
          <div class="emotion-score">{{ currentEmotion.emotionScore }}</div>
        </div>
        <div class="warm-tips">
          <div class="emtion-status-text">
            <span class="status-label"> 当前情绪 </span>
            <span class="status-emotion">
              {{ currentEmotion.isNegative ? "需要关注" : "很不错" }}
            </span>
          </div>
          <div class="emotion-intensity">
            <span class="intensity-dots">
              <span
                v-for="dot in 3"
                :key="dot"
                class="dot"
                :class="{
                  active: getIntensityClass(currentEmotion.emotionScore) >= dot,
                }"
              ></span>
            </span>
            <span class="intensity-text">
              {{ getRiskText(currentEmotion.riskLevel) }}
            </span>
          </div>
          <!-- 温暖卡片 -->
          <div class="warm-suggestion">
            <div class="suggetsion-icon">💝</div>
            <div class="suggestion-content">
              <div class="suggestion-title">给你的小建议</div>
              <div class="suggestion-text">{{ currentEmotion.suggestion }}</div>
            </div>
          </div>
          <!-- 行动建议 -->
          <div
            class="healing-actions"
            v-if="currentEmotion.improvementSuggestions.length > 0"
          >
            <div class="action-title">行动建议</div>
            <div class="action-list">
              <div
                class="action-item"
                v-for="action in currentEmotion.improvementSuggestions"
                :key="action"
              >
                <div class="action-icon">✨</div>
                <div class="action-text">{{ action }}</div>
              </div>
            </div>
          </div>
          <!-- 风险提示 -->
          <div
            class="risk-notice"
            v-if="currentEmotion.isNegative && currentEmotion.riskLevel > 1"
          >
            <div class="notice-icon">🤗</div>
            <div class="notice-content">
              <div class="notice-title">温馨提示</div>
              <div class="notice-text">
                {{ currentEmotion.riskDescription }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 会话列表 -->
      <div class="session-history">
        <h4 class="session-title">会话列表</h4>
        <div class="session-list">
          <div
            class="session-item"
            v-for="item in sessionList"
            :key="item.id"
            @click="handleSeesionClick(item)"
          >
            <div class="session-info">
              <div class="session-title">
                <span>{{ item.seesionTitle }}</span>
                <div class="session-meta">
                  <span class="session-time">{{ item.startedAt }}</span>
                </div>
                <div class="session-preview">
                  {{ item.lastMessageContent }}
                </div>
                <div class="session-stats">
                  <span>
                    <el-icon><ChatRound /></el-icon>
                    {{ item.messageCount || 0 }}
                  </span>
                  <span>
                    <el-icon><Clock /></el-icon>
                    {{ item.durationMinutes || 0 }}分钟
                  </span>
                </div>
              </div>
              <div class="session-actions">
                <el-button
                  type="danger"
                  size="mini"
                  text
                  @click="handleDeleteSession(item.id)"
                >
                  <el-icon><DeleteFilled /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-main">
      <div class="chat-header">
        <div class="header-left">
          <div class="chat-avatar">
            <el-image :src="like" alt="" style="width: 30px; height: 30px" />
          </div>
          <div class="chat-info">
            <h2>智能助手</h2>
            <p>它可以帮助您解决问题、提供建议、完成任务等。</p>
          </div>
        </div>
        <el-button circle @click="createNewFrontendSeesion" title="创建新会话">
          <el-icon><Plus /></el-icon>
        </el-button>
      </div>
      <div class="chat-messages">
        <!-- 欢迎消息 -->
        <div class="message-item ai-message">
          <div class="message-avatar">
            <el-image :src="robot" alt="" style="width: 18px; height: 18px" />
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <p>你好！有什么想分享的吗</p>
            </div>
            <div class="message-time">刚刚</div>
          </div>
        </div>
        <!-- 历史记录消息 -->
        <div
          class="message-item"
          v-for="msg in messages"
          :key="msg.id"
          :class="msg.senderType === 1 ? 'user-message' : 'ai-message'"
        >
          <div class="message-avatar">
            <el-image
              v-if="msg.senderType === 1"
              :src="users"
              alt=""
              style="width: 18px; height: 18px"
            />
            <el-image
              v-else
              :src="robot"
              alt=""
              style="width: 18px; height: 18px"
            />
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <!-- ai思考模块 -->
              <div
                class="typing-indicator"
                v-if="msg.senderType === 2 && !isAityping && !msg.content"
              >
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
              </div>
              <!-- 报错模块 -->
              <div class="error-indicator" v-else-if="msg.isError">
                <p>报错：{{ msg.content }}</p>
              </div>
              <!-- AI正常消息模块 -->
              <MarkdownRenderer
                v-else-if="msg.senderType === 2 && !msg.isError"
                :content="msg.content"
                :is-ai-message="true"
              />
              <!-- 用户正常消息模块 -->
              <p
                v-else-if="msg.content"
                v-html="formatMessageContent(msg.content)"
              ></p>
            </div>
            <div class="message-time">
              {{
                msg.senderType === 2 && isAityping ? "正在输入" : msg.createdAt
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="chat-input">
        <div class="input-container">
          <el-input
            v-model="userMessage"
            placeholder="请输入"
            clearable
            type="textarea"
            :rows="3"
            :disabled="isAityping"
            @keydown.enter="handleKeyDown"
            class="message-input"
          ></el-input>
          <div class="input-footer">
            <span>按enter发送，shift+enter换行</span>
            <span>{{ userMessage.length }}/200 </span>
          </div>
        </div>
        <el-button
          class="send-btn"
          @click="sendMessage"
          :disabled="isAityping || userMessage.length === 0"
        >
          <el-icon><Promotion /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import robot from "@/assets/images/robot-fill.png";
import like from "@/assets/images/like.png";
import users from "@/assets/images/users.png";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import {
  ChatRound,
  Clock,
  DeleteFilled,
  Plus,
  Promotion,
} from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
import {
  startSession,
  getSessionList,
  deleteSession,
  getSessionDetail,
  getSeesionEmotion,
} from "@/api/forntend.js";
import { ElMessage } from "element-plus";
import { id } from "element-plus/es/locale/index.mjs";
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
    console.log('res', res);
    if (res) {
      // 处理字段名映射，确保前端和后端字段名一致
      const processedData = {
        ...res,
        // 确保 improvementSuggestions 字段存在
        improvementSuggestions: res.improvementSuggestions || res.imporvementSuggetions || []
      };
      currentEmotion.value = {
        ...currentEmotion.value,
        ...processedData
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
.consultation-container {
  margin: 0 auto;
  width: 1200px;
  display: flex;
  gap: 20px;
  padding: 20px;
  .sidebar {
    width: 320px;
    .ai-assistant-info {
      margin-bottom: 20px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.9) 0%,
        rgba(255, 252, 248, 0.95) 100%
      );
      border-radius: 16px;
      padding: 16px;
      box-shadow:
        0 8px 32px rgba(251, 146, 60, 0.06),
        0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(251, 146, 60, 0.08);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      .breathing-circle {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;
        animation: breathing 4s ease-in-out infinite;
        box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
        position: relative;
      }
      .assistant-name {
        font-size: 16px;
        font-weight: 700;
        background: linear-gradient(135deg, #fb923c, #f59e0b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        background-clip: text;
        margin: 0 0 12px;
      }
      .online-status {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #059669;
        font-size: 12px;
        font-weight: 600;
        .status-dot {
          width: 8px;
          height: 8px;
          background: #059669;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse 2s infinite;
          box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
        }
      }
    }
    .session-history {
      background: white;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      min-height: 250px;
      display: flex;
      flex-direction: column;
      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .session-list {
        overflow-y: auto;
        max-height: 200px;
        scrollbar-width: thin;
        scrollbar-color: rgba(64, 150, 255, 0.3) transparent;
        .session-item {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          &:hover {
            background: #f8f9ff;
            border-color: #e6f0ff;
          }
          &.active {
            background: #e6f0ff;
            border-color: #4096ff;
          }
          .session-info {
            flex: 1;
            .session-title {
              font-weight: 500;
              font-size: 14px;
              color: #333;
              margin-bottom: 4px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              .session-meta {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 6px;
                .session-time {
                  font-size: 12px;
                  color: #999;
                }
              }
              .session-preview {
                width: 200px;
                font-size: 12px;
                color: #666;
                margin-bottom: 6px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .session-stats {
                display: flex;
                align-items: center;
                gap: 12px;
                span {
                  font-size: 12px;
                  color: #999;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                }
              }
            }
            .session-actions {
              position: absolute;
              top: 10px;
              right: 12px;
            }
          }
        }
        .no-sessions-text {
          text-align: center;
          font-size: 14px;
          color: #999;
        }
      }
    }
    .emotion-garden {
      background: linear-gradient(
        135deg,
        #fef9e7 0%,
        #fcf4e6 50%,
        #f6f0e8 100%
      );
      border-radius: 20px;
      padding: 16px;
      margin-bottom: 20px;
      box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;
      min-height: 300px;

      .garden-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        position: relative;
        z-index: 2;
        .garden-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #8b4513;
        }
      }
      .emotion-info {
        margin: 0 auto;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.8);
        background: linear-gradient(
          135deg,
          #ff9a9e 0%,
          #fecfef 50%,
          #fecfef 100%
        );
        color: #fff;
        .emotion-name {
          font-size: 15px;
          font-weight: 600;
          line-height: 1;
          margin-bottom: 2px;
        }
        .emotion-score {
          font-size: 14px;
          font-weight: 700;
          opacity: 0.9;
        }
      }
      .warm-tips {
        text-align: center;
        margin-bottom: 16px;
        .emotion-status-text {
          margin-bottom: 12px;
          .status-label {
            font-size: 14px;
            color: #8b7355;
            margin-right: 8px;
          }
          .status-emotion {
            font-size: 16px;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 16px;
            display: inline-block;
          }
        }
        .emotion-intensity {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          .intensity-dots {
            display: flex;
            gap: 4px;
            .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #e0e0e0;
              transition: all 0.3s ease;
              &.active {
                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                transform: scale(1.2);
                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
              }
            }
          }
          .intensity-text {
            font-size: 12px;
            color: #8b7355;
            font-weight: 500;
          }
        }
        .warm-suggestion {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95),
            rgba(255, 255, 255, 0.8)
          );
          border-radius: 16px;
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          .suggestion-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .suggestion-content {
            text-align: left;
            flex: 1;
            .suggestion-title {
              font-size: 14px;
              font-weight: 600;
              color: #8b7355;
              margin-bottom: 6px;
            }
            .suggestion-text {
              font-size: 13px;
              color: #6b5b47;
              line-height: 1.5;
            }
          }
        }
        .healing-actions {
          margin-bottom: 16px;
          .action-title {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #8b7355;
            margin-bottom: 16px;
          }
          .action-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            .action-item {
              background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.9),
                rgba(255, 255, 255, 0.7)
              );
              border-radius: 12px;
              padding: 12px;
              display: flex;
              align-items: center;
              gap: 10px;
              border: 1px solid rgba(255, 255, 255, 0.5);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
              text-align: left;
              .action-icon {
                font-size: 14px;
                color: #ffd700;
                flex-shrink: 0;
              }
              .action-text {
                font-size: 12px;
                color: #6b5b47;
                line-height: 1.4;
                flex: 1;
              }
            }
          }
        }
        .risk-notice {
          background: linear-gradient(135deg, #fff9e6, #ffeaa7);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border: 1px solid rgba(255, 234, 167, 0.6);
          box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);
          .notice-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .notice-content {
            flex: 1;
            .notice-title {
              font-size: 14px;
              font-weight: 600;
              color: #d4840f;
              margin-bottom: 6px;
            }
            .notice-text {
              font-size: 13px;
              color: #b8740c;
              line-height: 1.5;
            }
          }
        }
      }
    }
  }
  .chat-main {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 252, 250, 0.98) 100%
    );
    border-radius: 20px;
    box-shadow:
      0 12px 40px rgba(251, 146, 60, 0.08),
      0 4px 16px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(251, 146, 60, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;
    .chat-header {
      background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
      color: white;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      flex-shrink: 0;
      .header-left {
        display: flex;
        align-items: center;
        .chat-avatar {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 1;
        }
        .chat-info {
          h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 4px;
          }
          p {
            font-size: 14px;
          }
        }
      }
    }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.02) 0%,
        rgba(255, 252, 248, 0.05) 100%
      );
      min-height: 0;
      max-height: calc(100vh - 200px);
      scrollbar-width: thin;
      scrollbar-color: rgba(251, 146, 60, 0.3) transparent;
      .message-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
        }
        &.ai-message {
          .message-avatar {
            background: linear-gradient(135deg, #fb923c, #f59e0b);
            box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
          }
        }
        &.user-message {
          .message-avatar {
            background: linear-gradient(135deg, #6b7280, #4b5563);
            box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
          }
        }
        .message-content {
          max-width: 70%;
          .message-bubble {
            border-radius: 16px;
            padding: 12px 16px;
            position: relative;
            animation: fadeInUp 0.4s ease-out;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
            .typing-indicator {
              display: flex;
              gap: 4px;
              padding: 8px 0;
              .typing-dot {
                width: 8px;
                height: 8px;
                background: #ccc;
                border-radius: 50%;
                animation: typing 1.5s ease-in-out infinite;
                &:nth-child(2) {
                  animation-delay: 0.2s;
                }
                &:nth-child(3) {
                  animation-delay: 0.4s;
                }
              }
            }
            /* 错误消息样式 */
            .error-message {
              background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
              border: 1px solid #f87171;
              border-radius: 12px;
              padding: 12px 16px;
              color: #991b1b;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 8px;
            }
          }
          .message-time {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
          }
        }
        &.ai-message {
          justify-content: flex-start;
          .message-content {
            .message-bubble {
              background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.9) 0%,
                rgba(255, 252, 248, 0.95) 100%
              );
              border: 1px solid rgba(251, 146, 60, 0.1);
              border-bottom-left-radius: 4px;
              color: #333;
            }
          }
        }
        &.user-message {
          justify-content: flex-end;
          .message-content {
            .message-bubble {
              background: linear-gradient(
                135deg,
                #4096ff 0%,
                #667eea 100%
              );
              border: 1px solid rgba(64, 150, 255, 0.2);
              border-bottom-right-radius: 4px;
              color: white;
            }
            .message-time {
              color: #666;
            }
          }
        }
      }
    }
    .chat-input {
      border-top: 1px solid rgba(251, 146, 60, 0.1);
      padding: 20px 24px;
      display: flex;
      gap: 12px;
      align-items: flex-end;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 252, 248, 0.7) 100%
      );
      backdrop-filter: blur(10px);
      flex-shrink: 0;
      .input-container {
        flex: 1;
      }
      .input-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #78716c;
        font-weight: 500;
      }
      .send-btn {
        height: 60px;
        width: 60px;
        border-radius: 16px;
        background: linear-gradient(
          135deg,
          #fb923c 0%,
          #f59e0b 100%
        ) !important;
        border: none !important;
        box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
        transition: all 0.3s ease;
      }
    }
  }
}
</style>
