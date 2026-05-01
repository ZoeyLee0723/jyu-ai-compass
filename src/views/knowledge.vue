<template>
  <div>
    <PageHeader title="知识文章">
      <template #action-buttons>
        <el-button
          type="primary"
          @click="handleEdit({})"
          @success="handleSuccess"
          >新增文章</el-button
        >
      </template>
    </PageHeader>
    <Table
      :formitem="formitem"
      @search="handleSearch"
      @reset="handleReset"
    ></Table>
    <el-table :data="tableData" style="width: 100%; margin-top: 25px">
      <el-table-column label="文章标题" width="200" fixed="left">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="文章分类" width="180">
        <template #default="scope">
          <span>{{ categoryMap[scope.row.categoryId] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="180" prop="authorName">
      </el-table-column>
      <el-table-column label="阅读量" width="100" prop="readCount">
      </el-table-column>
      <el-table-column label="发布时间" width="180" prop="updatedAt">
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <el-button text type="primary" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            text
            v-if="scope.row.status === 0 || scope.row.status === 2"
            type="success"
            @click="handlePublish(scope.row)"
            >发布</el-button
          >
          <el-button
            text
            v-if="scope.row.status === 1"
            type="warning"
            @click="handleUnpublish(scope.row)"
            >下线</el-button
          >
          <el-button text type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
    <AticleDialog
      v-model:visible="dialogVisble"
      @success="handleSuccess"
      :catagories="catagories"
      :categoryMap="categoryMap"
      :article="currentArticle"
    ></AticleDialog>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import PageHeader from "../components/pageheader.vue";
import Table from "../components/Table.vue";
import { categoryTree, articlePage, getArticleDetail, updateArticle, changeArticleStatus, deleteArticle } from "@/api/admin.js";
import { onMounted } from "vue";
import AticleDialog from "../components/AticleDialog.vue";
import { ElMessageBox, ElMessage } from "element-plus";

const categoryMap = reactive({});
const catagories = ref([]);

// 保存当前搜索条件
const currentSearchForm = ref({});

onMounted(async () => {
  const data = await categoryTree();
  console.log(data);
  catagories.value = data.map((item) => {
    categoryMap[item.id] = item.categoryName;
    return {
      label: item.categoryName,
      value: item.id,
    };
  });
  formitem.value[1].options = catagories.value;
  // 页面加载时自动搜索
  handleSearch({});
});

const formitem = ref([
  {
    comp: "input",
    label: "文章标题",
    prop: "title",
    placeholder: "请输入文章标题",
  },
  {
    comp: "select",
    label: "文章分类",
    prop: "categoryId",
    placeholder: "请选择文章分类",
    options: [],
  },
  {
    comp: "select",
    label: "文章状态",
    prop: "status",
    placeholder: "请选择文章状态",
    options: [
      { label: "草稿", value: "0" },
      { label: "已发布", value: "1" },
      { label: "已删除", value: "2" },
    ],
  },
]);

// 分页参数
const pagination = reactive({
  currentPage: 1,
  size: 5,
  total: 0,
});

// 列表数据
const tableData = ref([]);

const handleSearch = async (formData) => {
  // 保存当前搜索条件
  currentSearchForm.value = { ...formData };

  const params = {
    ...formData,
    ...pagination,
  };
  console.log("请求参数:", params);
  const res = await articlePage(params);
  console.log("响应数据:", res);
  tableData.value = res.records || [];
  pagination.total = res.total || 0;
};

const handleReset = (form) => {
  console.log(form, "重置");
  // 重置分页并重新搜索
  pagination.currentPage = 1;
  currentSearchForm.value = {};
  handleSearch({});
};

const handlePageChange = (page) => {
  pagination.currentPage = page;
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
