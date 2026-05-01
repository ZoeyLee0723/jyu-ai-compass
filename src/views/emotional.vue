<template>
  <div>
    <PageHeader title="情绪日志">
      <template #action-buttons>
        <el-button type="primary">新增文章</el-button>
      </template>
    </PageHeader>
    <Table
      :formitem="formitem"
      @search="handleSearch"
      @reset="handleReset"
    ></Table>
    <el-table :data="tableData" style="width: 100%; margin-top: 25px">
      <el-table-column label="用户ID" width="80" prop="userId">
      </el-table-column>
      <el-table-column label="会话ID" width="80" prop="sessionId">
        <template #default="scope">
          <el-avatar>{{ scope.row.nickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="记录日期" width="120" prop="diaryDate">
      </el-table-column>
      <el-table-column label="情绪评分" prop="moodScreRange">
        <template #default="scope">
          <el-rate v-model="scope.row.moodScore" :max="10" disabled></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="生活指标" width="120">
        <template #default="scope">
          <div>
            <p>睡眠:{{ scope.row.sleepQuality }}/5</p>
            <p>压力:{{ scope.row.stressLevel }}/5</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="情绪触发因素" width="120" prop="emotionTriggers">
      </el-table-column>
      <el-table-column label="日志内容" width="200" prop="diaryContent">
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <el-button text type="primary" @click="viewSessionDetail(scope.row)"
            >详情</el-button
          >
          <el-button text type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="detailDialogVisble"
      title="情绪日志详情"
      width="800px"
      :close-on-click-modal="false"
      class="detail-content"
    >
      <div v-if="currentDetail">
        <div class="detail-section">
          <h4>用户信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{
              currentDetail.username
            }}</el-descriptions-item>
            <el-descriptions-item label="昵称">{{
              currentDetail.nickname
            }}</el-descriptions-item>
            <el-descriptions-item label="用户ID">{{
              currentDetail.userId
            }}</el-descriptions-item>
            <el-descriptions-item label="记录时间">{{
              currentDetail.diaryDate
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>情绪记录</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="情绪评分">
              <el-rate
                v-model="currentDetail.moodScore"
                :max="10"
                disabled
              ></el-rate>
            </el-descriptions-item>
            <el-descriptions-item label="主要情绪">
              <el-tag
                :type="getEmotionTagType(currentDetail.dominantEmotion)"
                >{{ currentDetail.dominantEmotion }}</el-tag
              >
            </el-descriptions-item>
            <el-descriptions-item label="睡眠质量"
              >{{ currentDetail.sleepQuality }}/5</el-descriptions-item
            >
            <el-descriptions-item label="压力水平"
              >{{ currentDetail.stressLevel }}/5</el-descriptions-item
            >
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>日记内容</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="日记内容">{{
              currentDetail.diaryContent
            }}</el-descriptions-item>
            <el-descriptions-item label="情绪触发因素">{{
              currentDetail.emotionTriggers
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>AI情绪分析结果</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="主要情绪">
              <el-tag :type="getAiEmotionTagType(aidata.primaryEmotion)">{{
                aidata.primaryEmotion
              }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="情绪强度">
              <el-progress
                :percentage="aidata.emotionScore"
                :show-text="false"
                status="active"
                :height="20"
                :color="getEmotionScoreColor(aidata.emotionScore)"
                :stroke-width="10"
              ></el-progress>
            </el-descriptions-item>
            <el-descriptions-item label="风险等级">
              <el-tag :type="getEmotionTagType(aidata.riskLevel)">{{
                aidata.riskLevel
              }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="情绪性质">
              <el-tag :type="aidata.isNegative ? 'danger' : 'success'">{{
                aidata.isNegative ? "负面情绪" : "正面情绪"
              }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h5>专业建议</h5>
          <div class="suggestion-content">
            {{ aidata.suggestion || "暂无建议" }}
          </div>
        </div>
        <div class="detail-section">
          <h5>风险描述</h5>
          <div class="suggestion-content">
            {{ aidata.riskDescription || "暂无风险描述" }}
          </div>
        </div>
        <div class="detail-section">
          <h5>改善建议</h5>
          <ul class="suggestion-content">
            <li v-for="item in aidata.improvementSuggestions" :key="item">
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="detail-section">
          <h4>时间信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="创建时间">{{
              currentDetail.createdAt
            }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{
              currentDetail.updatedAt
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="detailDialogVisble = false">
          关闭
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import PageHeader from "../components/pageheader.vue";
import Table from "../components/Table.vue";
import { getEmotionalPage } from "@/api/admin";
import { ref, reactive, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { deleteEmotional } from "@/api/admin";
//数据
const formitem = [
  {
    comp: "input",
    label: "用户ID",
    prop: "userId",
    type: "input",
    placeholder: "请输入用户ID",
  },
  {
    comp: "select",
    label: "情绪评分",
    prop: "moodScreRange",
    type: "select",
    placeholder: "请选择情绪评分",
    options: [
      {
        label: "1-3分",
        value: "1",
      },
      {
        label: "4-6分",
        value: "2",
      },
      {
        label: "7-10分",
        value: "3",
      },
    ],
  },
];
//表格字段
const tableData = ref([]);
//分页参数
const pagination = reactive({
  currentPage: 1,
  size: 5,
  total: 0,
});

//搜索
const handleSearch = async (searchForm = {}) => {
  const params = {
    ...searchForm,
    currentPage: pagination.currentPage,
    size: pagination.size,
  };
  const { records, total } = await getEmotionalPage(params);
  tableData.value = records;
  pagination.total = total;
  console.log("1", records);
};

//分页处理
const handlePageChange = (page) => {
  pagination.currentPage = page;
  handleSearch();
};

//重置处理
const handleReset = () => {
  pagination.currentPage = 1;
  handleSearch({});
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
/* 详情页样式 */
.detail-section {
  margin-bottom: 24px;

  h4 {
    margin: 0 0 16px 0;
    color: #303133;
    font-size: 16px;
  }
}

/* 分页样式 */
.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 表格样式 */
.el-table {
  margin-top: 25px !important;
}

/* 按钮样式 */
.el-button {
  margin-right: 8px;
}

/* 描述列表样式 */
.el-descriptions {
  margin-bottom: 16px;
}

/* 标签样式 */
.el-tag {
  margin-right: 8px;
}

/* 进度条样式 */
.el-progress {
  width: 100%;
}

/* 建议内容样式 */
.suggestion-content {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 12px;
  margin-top: 8px;
  line-height: 1.6;
  color: #495057;
}

/* 列表样式 */
.suggestion-content ul {
  margin: 0;
  padding-left: 20px;
}

.suggestion-content li {
  margin-bottom: 6px;
}
</style>
