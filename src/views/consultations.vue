<template>
  <el-table :data="tableData" style="width: 100%; height: 90%">
    <el-table-column label="会话ID" width="200">
      <template #default="scope">
        <el-avatar :src="scope.row.userNickname" size="medium">{{
          scope.row.userNickname
        }}</el-avatar>
      </template>
    </el-table-column>
    <el-table-column label="情绪日志">
      <template #default="scope">
        <div class="session-title">
          {{ scope.row.sessionTitle }}
        </div>
        <div class="session-preview">
          {{ scope.row.lastMessageContent }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="messageCount" label="消息数量" width="120" />
    <el-table-column prop="lastMessageTime" label="咨询时间" width="200" />
    <el-table-column label="操作" width="100">
      <template #default="scope">
        <el-button
          type="primary"
          text
          @click="viewSessionDetail(scope.row)"
          size="mini"
          >查看</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    v-model:current-page="pagination.currentPage"
    layout="prev, pager, next"
    :total="pagination.total"
    :page-size="pagination.size"
    @current-change="handlePageChange"
  />
  <el-dialog
    v-model="showDetailDialog"
    title="咨询会话详情"
    width="70%"
    :close-on-click-modal="false"
  >
    <div class="session-detail">
      <div class="detail-header">
        <div class="detail-row">
          <div class="detail-label">用户:</div>
          <div class="detail-value">{{ sessionDetail.userNickname }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">开始时间：</div>
          <div class="detail-value">{{ sessionDetail.startedAt }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">消息数:</div>
          <div class="detail-value">{{ sessionDetail.messageCount }}</div>
        </div>
      </div>
      <div class="messages-container">
        <div class="messages-header">
          <h4>对话记录</h4>
          <div class="messages-list" v-loading="loadingMessage">
            <div
              v-for="message in sessionMessage"
              :key="message.id"
              class="message-item"
              :class="message.senderType === 1 ? 'user-message' : 'ai-message'"
            >
              <div class="message-header">
                <span class="sender">{{
                  message.senderType === 1 ? "用户" : "AI"
                }}</span>
                <span class="time">{{ message.createdAt }}</span>
              </div>
              <div class="message-content">{{ message.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="showDetailDialog = false">
        关闭
      </el-button>
    </template>
  </el-dialog>
</template>
<script setup>

import { ref, onMounted, reactive } from "vue";
import { getConsultationPage, getSessionDetail } from "@/api/admin.js";
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
.session-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}
.session-preview {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.session-detail {
  max-height: 70vh;
  overflow-y: auto;
  .detail-header {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .detail-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  .detail-row:last-child {
    margin-bottom: 0;
  }
  .detail-label {
    font-weight: 500;
    color: #495057;
    min-width: 80px;
    margin-right: 8px;
  }

  .detail-value {
    color: #333;
  }
}
.messages-container {
  margin-top: 20px;
  .messages-header {
    margin-bottom: 16px;
    h4 {
      margin: 0;
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }
  }
  .messages-list {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 16px;
    background: #fff;
    .message-item {
      margin-bottom: 12px;
      padding: 12px;
      border-radius: 8px;
      background: #f8f9fa;
      border: 1px solid #e9ecef;

      &.user-message {
        background: #e8f4fd;
      }

      &.ai-message {
        background: #f0f9f0;
      }
    }
    .message-item:last-child {
      margin-bottom: 0;
    }
    .message-item .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      .sender {
        font-weight: 500;
        color: #333;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .time {
        font-size: 12px;
        color: #999;
      }
    }
    .message-item .message-content {
      color: #333;
      line-height: 1.6;
      white-space: pre-wrap;
      margin-top: 8px;
      font-size: 14px;
    }
  }
}
</style>
