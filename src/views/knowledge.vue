<template>
  <div class="knowledge-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-icon class="header-icon"><Document /></el-icon>
        <h2>知识文章管理</h2>
      </div>
      <el-button type="primary" @click="handleEdit({})">
        <el-icon><Plus /></el-icon>
        新增文章
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-form">
        <el-input
          v-model="searchForm.title"
          placeholder="请输入文章标题"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="searchForm.categoryId" placeholder="文章分类" clearable>
          <el-option
            v-for="item in catagories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="searchForm.status" placeholder="文章状态" clearable>
          <el-option label="草稿" value="0" />
          <el-option label="已发布" value="1" />
          <el-option label="已删除" value="2" />
        </el-select>
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-container">
      <el-table :data="tableData" stripe>
        <el-table-column label="文章标题" min-width="200">
          <template #default="scope">
            <span class="article-title">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文章分类" width="140">
          <template #default="scope">
            <el-tag size="small">{{ categoryMap[scope.row.categoryId] || '-' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="作者" width="120" prop="authorName" />
        <el-table-column label="阅读量" width="100" prop="readCount" />
        <el-table-column label="发布时间" width="160" prop="updatedAt" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <div class="action-buttons">
              <el-button text type="primary" size="small" @click="handleEdit(scope.row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button
                text
                type="success"
                size="small"
                v-if="scope.row.status === 0 || scope.row.status === 2"
                @click="handlePublish(scope.row)"
              >
                <el-icon><Upload /></el-icon>
                发布
              </el-button>
              <el-button
                text
                type="warning"
                size="small"
                v-if="scope.row.status === 1"
                @click="handleUnpublish(scope.row)"
              >
                <el-icon><Download /></el-icon>
                下线
              </el-button>
              <el-button text type="danger" size="small" @click="handleDelete(scope.row)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        :page-size="pagination.size"
        :page-sizes="[5, 10, 20]"
        v-model:current-page="pagination.currentPage"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- 文章弹窗 -->
    <AticleDialog
      v-model:visible="dialogVisble"
      @success="handleSuccess"
      :catagories="catagories"
      :categoryMap="categoryMap"
      :article="currentArticle"
    />
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import { categoryTree, articlePage, getArticleDetail, changeArticleStatus, deleteArticle } from "@/api/admin.js";
import { onMounted } from "vue";
import AticleDialog from "../components/AticleDialog.vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { Plus, Search, Refresh, Edit, Upload, Download, Delete, Document } from "@element-plus/icons-vue";

const categoryMap = reactive({});
const catagories = ref([]);

// 搜索表单
const searchForm = reactive({
  title: '',
  categoryId: '',
  status: ''
});

// 保存当前搜索条件
const currentSearchForm = ref({});

onMounted(async () => {
  const data = await categoryTree();
  catagories.value = data.map((item) => {
    categoryMap[item.id] = item.categoryName;
    return {
      label: item.categoryName,
      value: item.id,
    };
  });
  handleSearch();
});

// 分页参数
const pagination = reactive({
  currentPage: 1,
  size: 5,
  total: 0,
});

// 列表数据
const tableData = ref([]);

const handleSearch = async () => {
  // 保存当前搜索条件
  currentSearchForm.value = { ...searchForm };

  const params = {
    ...searchForm,
    currentPage: pagination.currentPage,
    size: pagination.size,
  };
  const res = await articlePage(params);
  tableData.value = res.records || [];
  pagination.total = res.total || 0;
};

const handleReset = () => {
  // 重置搜索表单
  searchForm.title = '';
  searchForm.categoryId = '';
  searchForm.status = '';
  pagination.currentPage = 1;
  currentSearchForm.value = {};
  handleSearch();
};

const handlePageChange = (page) => {
  pagination.currentPage = page;
  handleSearch();
};

const handleSizeChange = (size) => {
  pagination.size = size;
  pagination.currentPage = 1;
  handleSearch();
};

// 新增文章成功后的处理
const handleSuccess = () => {
  // 刷新列表数据
  handleSearch(currentSearchForm.value);
};

//新增和修改
const dialogVisble = ref(false);
//子组件接收数据
const currentArticle = ref({});
//编辑
const handleEdit = async (row) => {
  if (!row.id) {
    //新增
    currentArticle.value = {};
    dialogVisble.value = true;
  } else {
    getArticleDetail(row.id).then((res) => {
      console.log(res);
      currentArticle.value = res || {};
      dialogVisble.value = true;
    });
  }
};
//发布和下线
const handlePublish = (row) =>{
  ElMessageBox.confirm(
    `确定发布文章${row.title}吗？`,
    "发布确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(() => {
    // 发布文章的逻辑
    changeArticleStatus(row.id,{status:1}).then((res) => {
        ElMessage.success("发布文章成功");
        handleSearch()
      }
    );
  });
}
const handleUnpublish = (row) =>{
  ElMessageBox.confirm(
    `确定下线文章${row.title}吗？`,
    "下线确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(() => {
    // 下线文章的逻辑
    changeArticleStatus(row.id,{status:2}).then((res) => {
        ElMessage.success("下线文章成功");
        handleSearch()
      }
    );
  });
}
//删除
const handleDelete = (row) =>{
  ElMessageBox.confirm(
    `确定删除文章${row.title}吗？`,
    "删除确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "danger",
    }
  ).then(() => {
    // 删除文章的逻辑
    deleteArticle(row.id).then((res) => {
        ElMessage.success("删除文章成功");
        handleSearch()
      }
    );
  });
}
</script>

<style lang="scss" scoped>
.knowledge-page {
  padding: 20px;

  // 页面头部
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 20px 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .header-icon {
        font-size: 24px;
        color: #003366;
      }

      h2 {
        font-size: 20px;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
      }
    }
  }

  // 搜索区域
  .search-section {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

    .search-form {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;

      .el-input {
        width: 200px;
      }

      .el-select {
        width: 150px;
      }
    }
  }

  // 表格容器
  .table-container {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

    :deep(.el-table) {
      border-radius: 8px;

      th {
        background: #f9fafb;
        color: #374151;
        font-weight: 600;
      }

      .article-title {
        font-weight: 500;
        color: #1f2937;
      }

      .action-buttons {
        display: flex;
        gap: 4px;
      }
    }
  }

  // 分页
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    padding: 16px 0;

    :deep(.el-pagination) {
      .el-pager li {
        border-radius: 6px;
      }
    }
  }
}
</style>
