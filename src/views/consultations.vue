<template>
  <div class="consultations-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-icon class="header-icon"><ChatDotRound /></el-icon>
        <div class="header-text">
          <h2>咨询会话管理</h2>
          <p>查看所有用户的心理咨询会话记录</p>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-card">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="用户" width="180">
          <template #default="scope">
            <div class="user-cell">
              <el-avatar :size="36">{{ scope.row.userNickname?.charAt(0) }}</el-avatar>
              <span>{{ scope.row.userNickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="会话标题">
          <template #default="scope">
            <div class="session-title">{{ scope.row.sessionTitle }}</div>
            <div class="session-preview">{{ scope.row.lastMessageContent }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="messageCount" label="消息数" width="100" align="center" />
        <el-table-column prop="lastMessageTime" label="最后活跃" width="160" />
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <el-button type="primary" text @click="viewSessionDetail(scope.row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          :page-size="pagination.size"
          :total="pagination.total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="showDetailDialog"
      title="会话详情"
      width="70%"
      :close-on-click-modal="false"
      class="detail-dialog"
    >
      <div class="session-detail">
        <div class="detail-info">
          <div class="info-item">
            <span class="label">用户：</span>
            <span class="value">{{ sessionDetail.userNickname }}</span>
          </div>
          <div class="info-item">
            <span class="label">开始时间：</span>
            <span class="value">{{ sessionDetail.startedAt }}</span>
          </div>
          <div class="info-item">
            <span class="label">消息数：</span>
            <span class="value">{{ sessionDetail.messageCount }}</span>
          </div>
        </div>
        <div class="messages-box">
          <h4>对话记录</h4>
          <div class="messages-list" v-loading="loadingMessage">
            <div
              v-for="message in sessionMessage"
              :key="message.id"
              class="message-item"
              :class="message.senderType === 1 ? 'user' : 'ai'"
            >
              <div class="msg-header">
                <el-icon v-if="message.senderType === 1"><User /></el-icon>
                <el-icon v-else><ChatDotRound /></el-icon>
                <span>{{ message.senderType === 1 ? "用户" : "AI 助手" }}</span>
                <span class="msg-time">{{ message.createdAt }}</span>
              </div>
              <div class="msg-content">{{ message.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import { getConsultationPage, getSessionDetail } from "@/api/admin.js";
import { ChatDotRound, View, User } from "@element-plus/icons-vue";
// 表格数据
const tableData = ref([]);
//详情页转台
const showDetailDialog = ref(false);
//会话详情
const sessionDetail = ref({});
//加载状态
const loadingMessage = ref(false);
//详情信息
const sessionMessage = ref([]);
//分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});
//分页函数
const handlePageChange = (page) => {
  pagination.currentPage = page;
  handleSearch();
};
//查询函数
const handleSearch = () => {
  getConsultationPage(pagination).then((res) => {
    const { records, total } = res;
    console.log(res);
    tableData.value = records;
    pagination.total = total;
  });
};
//详情查看
const viewSessionDetail = (row) => {
  loadingMessage.value = true;
  getSessionDetail(row.id).then((res) => {
    loadingMessage.value = false;
    sessionMessage.value = res;
    sessionDetail.value = row;
    showDetailDialog.value = true;
  });
};
onMounted(() => {
  handleSearch();
});
</script>
<style scoped lang="scss">
.consultations-page {
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #e8ecf1 100%);

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 20px 24px;
    background: linear-gradient(135deg, #003366 0%, #004080 100%);
    border-radius: 12px;
    color: #fff;

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .header-icon {
        font-size: 32px;
        opacity: 0.9;
      }

      .header-text {
        h2 {
          margin: 0 0 4px;
          font-size: 20px;
          font-weight: 600;
        }

        p {
          margin: 0;
          font-size: 13px;
          opacity: 0.8;
        }
      }
    }
  }

  .table-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    padding: 20px;

    .user-cell {
      display: flex;
      align-items: center;
      gap: 10px;

      span {
        font-weight: 500;
        color: #333;
      }
    }

    .session-title {
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }

    .session-preview {
      font-size: 13px;
      color: #666;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .pagination-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;
    }
  }
}

:deep(.detail-dialog) {
  .el-dialog__header {
    background: linear-gradient(135deg, #003366 0%, #004080 100%);
    color: #fff;
    
    .el-dialog__title {
      color: #fff;
    }
  }

  .session-detail {
    .detail-info {
      display: flex;
      gap: 32px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 20px;

      .info-item {
        .label {
          font-weight: 500;
          color: #666;
        }

        .value {
          color: #333;
        }
      }
    }

    .messages-box {
      h4 {
        margin: 0 0 12px;
        color: #003366;
        font-size: 15px;
      }

      .messages-list {
        max-height: 400px;
        overflow-y: auto;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 16px;
        background: #fafafa;

        .message-item {
          margin-bottom: 12px;
          padding: 12px;
          border-radius: 8px;
          background: #fff;
          border: 1px solid #e9ecef;

          &.user {
            background: #e8f4fd;
            border-color: #bddbf5;
          }

          &.ai {
            background: #f0f9f0;
            border-color: #cce8cc;
          }

          .msg-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;

            .msg-time {
              margin-left: auto;
              font-size: 12px;
              color: #999;
              font-weight: normal;
            }
          }

          .msg-content {
            color: #333;
            line-height: 1.6;
            white-space: pre-wrap;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
