<template>
  <el-dialog
    :title="isEdit ? '编辑文章' : '新增文章'"
    v-model="dialogVisble"
    width="50%"
    @close="handleClose"
  >
    <el-form :model="formData" :rules="rules" ref="formRef">
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入文章标题"
          maxlength="200"
          show-word-limit
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="categoryId">
        <el-select
          v-model="formData.categoryId"
          placeholder="请选择文章分类"
          clearable
        >
          <el-option
            v-for="item in props.catagories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input
          type="textarea"
          v-model="formData.summary"
          placeholder="请输入文章摘要"
          maxlength="1000"
          show-word-limit
          :rows="4"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select
          v-model="formData.tags"
          placeholder="请选择或输入文章标签"
          multiple
          clearable
          filterable
          allow-create
          style="width: 100%"
        >
          <el-option
            v-for="item in commonTags"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片" prop="coverImage">
        <div class="cover-upload">
          <el-upload
            class="avatar-uploader"
            action=""
            :before-upload="beforeUpload"
            :http-request="handleUploadRequest"
            :show-file-list="false"
            accept="image/*"
          >
            <div class="cover-placeholder" v-if="!imgUrl">
              <p>点击上传封面图片</p>
            </div>
            <img v-else :src="imgUrl" alt="封面图片" class="cover-image" />
          </el-upload>
          <div v-if="imgUrl">
            <el-button type="danger" @click="removeImage">删除图片</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor
          v-model="formData.content"
          placeholder="请输入文章内容"
          :maxCharCount="2000"
          @change="handleContentChange"
          @created="handleEditorCreated"
          :minHeight="editorMinHeight"
        />
      </el-form-item>
    </el-form>
    <div v-if="btnPreview" class="preview-content">
      <h3>预览效果</h3>
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button type="primary" @click="btnPreview = !btnPreview">
        {{ btnPreview ? "关闭预览" : "预览效果" }}</el-button
      >
      <el-button type="primary" @click="handleSubmit" :loading="loading"
        >{{ isEdit ? "编辑" : "新增" }}文章</el-button
      >
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref, nextTick, watch } from "vue";
import { ElMessage } from "element-plus";
import { uploadFile, createArticle, updateArticle } from "@/api/admin";
import { fileBaseURL } from "@/config/index";
import RichTextEditor from "@/components/RichTextEditor.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  catagories: {
    type: Array,
    default: () => [],
  },
  categoryMap: {
    type: Object,
    default: () => ({}),
  },
  article: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:visible", "success"]);
const handleClose = () => {
  //重置
  formRef.value.resetFields();
  businessId.value = null;
  removeImage();
  formData.tags = [];
  emit("update:visible", false);
};
//监听编辑数据
watch(
  () => props.article,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        // 先复制所有字段
        Object.assign(formData, newVal);
        // 然后处理 tags 字段，确保它是数组
        if (formData.tags && typeof formData.tags === 'string') {
          formData.tags = formData.tags.split(',');
        }
        businessId.value = newVal.id;
        imgUrl.value = fileBaseURL + newVal.coverImage;
      });
    }
  },
);
//判断是否编辑
const isEdit = computed(() => !!props.article?.id);
const dialogVisble = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val),
});

// 表单数据
const formData = reactive({
  title: "",
  content: "",
  coverImage: "",
  categoryId: "",
  summary: "",
  tags: [],
  id: "",
});

const rules = reactive({
  title: [
    { required: true, message: "请输入文章标题", trigger: "blur" },
    { max: 200, message: "文章标题最多200个字符", trigger: "blur" },
  ],
  categoryId: [
    { required: true, message: "请选择文章分类", trigger: "change" },
  ],
});

// 图片上传
const imgUrl = ref("");

// 编辑器最小高度
const editorMinHeight = ref("300px");

// 常用标签
const commonTags = [
  "情绪管理",
  "焦虑",
  "抑郁",
  "压力",
  "睡眠",
  "冥想",
  "正念",
  "放松",
  "心理健康",
  "自我成长",
  "人际关系",
  "工作压力",
  "学习方法",
  "生活技巧",
];

const beforeUpload = function (file) {
  const isImage = file.type.startsWith("image/");
  const islimt5m = file.size / 1024 / 1024 < 5;
  if (!isImage) {
    ElMessage.error("请上传图片文件");
    return false;
  }
  if (!islimt5m) {
    ElMessage.error("图片大小不能超过5MB");
    return false;
  }
  return true;
};
const businessId = ref(null);
const handleUploadRequest = async function ({ file }) {
  businessId.value = crypto.randomUUID();
  const fileRes = await uploadFile(file, {
    businessId: businessId.value,
  });
  imgUrl.value = `${fileBaseURL}${fileRes.filePath}`;
  formData.coverImage = imgUrl.value;
};

const removeImage = function () {
  imgUrl.value = "";
  formData.coverImage = "";
};

const handleContentChange = function (data) {
  formData.content = data.html;
};

const handleEditorCreated = function (editor) {
  if (formData.content && editor) {
    nextTick(() => {
      editor.setHTML(formData.content);
    });
  }
};

// 预览效果
const btnPreview = ref(false);

// 提交表单加载状态
const loading = ref(false);
const formRef = ref(null);

// 提交表单
const handleSubmit = async function () {
  try {
    const valid = await formRef.value.validate();
    if (!valid) {
      return;
    }
    loading.value = true;
    const submitData = {
      ...formData,
      tags: formData.tags.join(","),
    };
    // request.js 成功时返回 data.data，失败时会 reject
    if(!isEdit.value){
      await createArticle(submitData);
      ElMessage.success("新增文章成功");
    }else{
      await updateArticle(props.article.id, submitData);
      loading.value = false;
      emit("success");
    }
    dialogVisble.value = false;
    loading.value = false;
    emit("success");
  } catch (error) {
    ElMessage.error(error?.msg || (isEdit.value ? "编辑文章失败" : "新增文章失败"));
    loading.value = false;
  }
};

</script>

<style scoped lang="scss">
.cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 120px;
  border: 1px dashed #ccc;
  border-radius: 5px;
}

.cover-image {
  width: 200px;
  height: 120px;
  display: block;
}
</style>
