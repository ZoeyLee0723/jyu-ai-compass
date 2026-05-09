<template>
  <div class="emotional-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <el-icon><Reading /></el-icon>
        </div>
        <div class="header-text">
          <h2>情绪日志管理</h2>
          <p>嘉应学院心理健康平台 · 情绪日志查看</p>
        </div>
      </div>
      <div class="header-right">
        <el-button text @click="handleSearch">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户ID">
          <el-input v-model="searchForm.userId" placeholder="请输入用户ID" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="情绪评分">
          <el-select v-model="searchForm.moodScreRange" placeholder="请选择" clearable style="width: 120px">
            <el-option label="1-3分" value="1" />
            <el-option label="4-6分" value="2" />
            <el-option label="7-10分" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchBtn">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <div class="table-card">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="用户" width="100">
          <template #default="scope">
            <el-avatar :size="32">{{ scope.row.nickname?.charAt(0) || 'U' }}</el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="用户ID" width="80" />
        <el-table-column prop="diaryDate" label="记录日期" width="120" />
        <el-table-column label="情绪评分" width="120">
          <template #default="scope">
            <div class="emotion-score">
              <el-rate 
                v-model="scope.row.moodScore" 
                :max="10" 
                disabled 
                :show-score="false"
                :allow-half="false"
              />
              <span class="score-text">{{ scope.row.moodScore }}分</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="生活指标" width="100">
          <template #default="scope">
            <div class="life-indicators">
              <span>睡眠 {{ scope.row.sleepQuality || 0 }}/5</span>
              <span>压力 {{ scope.row.stressLevel || 0 }}/5</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="emotionTriggers" label="触发因素" width="120" show-overflow-tooltip />
        <el-table-column prop="diaryContent" label="日志内容" show-overflow-tooltip />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <div class="action-btns">
              <el-button text type="primary" size="small" @click="viewSessionDetail(scope.row)">
                详情
              </el-button>
              <el-button text type="danger" size="small" @click="handleDelete(scope.row)">
                删除
              </el-button>
            </div>
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
      v-model="detailDialogVisble"
      title="情绪日志详情"
      width="800px"
      :close-on-click-modal="false"
      class="detail-dialog"
    >
      <div v-if="currentDetail" class="detail-content">
        <div class="detail-section">
          <div class="section-title">
            <el-icon><User /></el-icon>
            用户信息
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{ currentDetail.username }}</el-descriptions-item>
            <el-descriptions-item label="昵称">{{ currentDetail.nickname }}</el-descriptions-item>
            <el-descriptions-item label="用户ID">{{ currentDetail.userId }}</el-descriptions-item>
            <el-descriptions-item label="记录时间">{{ currentDetail.diaryDate }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="detail-section">
          <div class="section-title">
            <el-icon>< Sunny /></el-icon>
            情绪记录
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="情绪评分">
              <el-rate v-model="currentDetail.moodScore" :max="10" disabled :show-score="true" />
            </el-descriptions-item>
            <el-descriptions-item label="主要情绪">
              <el-tag :type="getEmotionTagType(currentDetail.dominantEmotion)">{{ currentDetail.dominantEmotion }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="睡眠质量">{{ currentDetail.sleepQuality }}/5</el-descriptions-item>
            <el-descriptions-item label="压力水平">{{ currentDetail.stressLevel }}/5</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <div class="section-title">
            <el-icon><Document /></el-icon>
            日记内容
          </div>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="日记内容">{{ currentDetail.diaryContent }}</el-descriptions-item>
            <el-descriptions-item label="情绪触发因素">{{ currentDetail.emotionTriggers }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section" v-if="aidata">
          <div class="section-title">
            <el-icon><DataAnalysis /></el-icon>
            AI 情绪分析
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="主要情绪">
              <el-tag :type="getAiEmotionTagType(aidata.primaryEmotion)">{{ aidata.primaryEmotion }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="情绪强度">
              <el-progress :percentage="aidata.emotionScore" :show-text="true" :stroke-width="10" :color="getEmotionScoreColor(aidata.emotionScore)" />
            </el-descriptions-item>
            <el-descriptions-item label="风险等级">
              <el-tag :type="getEmotionTagType(aidata.riskLevel)">{{ aidata.riskLevel }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="情绪性质">
              <el-tag :type="aidata.isNegative ? 'danger' : 'success'">{{ aidata.isNegative ? '负面情绪' : '正面情绪' }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section" v-if="aidata?.suggestion">
          <div class="section-title">专业建议</div>
          <div class="suggestion-box">{{ aidata.suggestion }}</div>
        </div>

        <div class="detail-section" v-if="aidata?.improvementSuggestions?.length">
          <div class="section-title">改善建议</div>
          <ul class="suggestion-list">
            <li v-for="(item, index) in aidata.improvementSuggestions" :key="index">{{ item }}</li>
          </ul>
        </div>

        <div class="detail-section">
          <div class="section-title">
            <el-icon><Clock /></el-icon>
            时间信息
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="创建时间">{{ currentDetail.createdAt }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ currentDetail.updatedAt }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisble = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { getEmotionalPage } from "@/api/admin";
import { ref, reactive, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { deleteEmotional } from "@/api/admin";
import { Reading, Search, View, Delete, User, Sunny, Document, DataAnalysis, Clock, Refresh } from "@element-plus/icons-vue";

const searchForm = reactive({
  userId: '',
  moodScreRange: ''
});

const tableData = ref([]);

const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});

const handleSearchBtn = () => {
  pagination.currentPage = 1;
  handleSearch();
};

const handleSearch = async (form = searchForm) => {
  const params = {
    ...form,
    currentPage: pagination.currentPage,
    size: pagination.size,
  };
  const { records, total } = await getEmotionalPage(params);
  tableData.value = records;
  pagination.total = total;
};

const handlePageChange = (page) => {
  pagination.currentPage = page;
  handleSearch();
};

const handleReset = () => {
  searchForm.userId = '';
  searchForm.moodScreRange = '';
  pagination.currentPage = 1;
  handleSearch();
};

//详情状态
const detailDialogVisble = ref(false);
//详情数据
const currentDetail = ref({});
const viewSessionDetail = (row) => {
  currentDetail.value = row;
  if (row.aiEmotionAnalysis) {
    aidata.value = JSON.parse(row.aiEmotionAnalysis);
  } else {
    aidata.value = {};
  }
  detailDialogVisble.value = true;
};
//AI风险数据
const aidata = ref();
//情绪映射
const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    快乐: "success",
    平静: "info",
    兴奋: "warning",
    愤怒: "danger",
    悲伤: "info",
    焦虑: "warning",
  };
  return emotionTypes[emotion] || "success";
};

const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    快乐: "success",
    平静: "success",
    兴奋: "warning",
    满足: "success",
    愤怒: "danger",
    悲伤: "info",
    焦虑: "warning",
    恐惧: "danger",
    沮丧: "info",
    压力: "warning",
  };
  return emotionTagMap[emotion] || "info";
};

const getEmotionScoreColor = (score) => {
  if (score >= 80) return "#f56c6c";
  if (score >= 60) return "#e6a23c";
  if (score >= 40) return "#909399";
  return "#67c23a";
};

const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: "success",
    1: "info",
    2: "warning",
    3: "danger",
  };
  return riskTagMap[riskLevel] || "info";
};

const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: "正常",
    1: "关注",
    2: "预警",
    3: "危机",
  };
  return riskTextMap[riskLevel] || "未知风险等级";
};
//删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    "确认删除该条情绪日志吗？",
    "删除确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(() => {
    deleteEmotional(row.id).then(() => {
      ElMessage.success("删除成功");
      handleSearch();
    });
  });
};

onMounted(() => {
  handleSearch();
});
</script>
<style scoped lang="scss">
.emotional-page {
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

    .header-right {
      :deep(.el-button) {
        color: #fff;
        
        &:hover {
          background: rgba(255,255,255,0.15);
        }
      }
    }
  }

  .search-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    padding: 20px;
    margin-bottom: 16px;
  }

  .table-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    padding: 20px;

    .action-btns {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .emotion-score {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;

      :deep(.el-rate) {
        height: auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 80px;

        .el-rate__item {
          font-size: 10px;
          padding: 0 1px;
        }

        .el-rate__icon {
          font-size: 10px !important;
          margin-right: 0;
        }
      }

      .score-text {
        font-size: 11px;
        color: #666;
        margin-top: 2px;
      }
    }

    .life-indicators {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 12px;
      color: #666;
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
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    padding: 16px 20px;
    margin: 0;
    
    .el-dialog__title {
      color: #fff;
      font-size: 18px;
    }

    .el-dialog__headerbtn {
      top: 18px;
      .el-dialog__close {
        color: #fff;
      }
    }
  }

  .detail-content {
    max-height: 65vh;
    overflow-y: auto;
    padding-right: 8px;

    .detail-section {
      margin-bottom: 20px;
      padding: 16px;
      background: #fafbfc;
      border-radius: 10px;

      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 600;
        color: #10b981;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #e8f5e9;
      }

      :deep(.el-descriptions) {
        background: #fff;
        border-radius: 8px;
        padding: 12px;
      }

      .suggestion-box {
        background: linear-gradient(135deg, #f0f9f0 0%, #e8f5e9 100%);
        border: 1px solid #cce8cc;
        border-radius: 10px;
        padding: 16px;
        color: #333;
        line-height: 1.7;
      }

      .suggestion-list {
        margin: 0;
        padding-left: 20px;
        background: linear-gradient(135deg, #f0f9f0 0%, #e8f5e9 100%);
        border: 1px solid #cce8cc;
        border-radius: 10px;
        padding: 16px;

        li {
          margin-bottom: 10px;
          color: #333;
          line-height: 1.6;
        }
      }
    }
  }
}
</style>
