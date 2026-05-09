<template>
  <el-dialog
    :title="isEdit ? '编辑文章' : '新增文章'"
    v-model="dialogVisble"
    width="55%"
    class="aticle-dialog"
    @close="handleClose"
  >
    <div class="dialog-content">
      <el-form :model="formData" :rules="rules" ref="formRef" label-position="top">
        <div class="form-row">
          <el-form-item label="文章标题" prop="title" class="form-item-full">
            <el-input
              v-model="formData.title"
              placeholder="请输入文章标题"
              maxlength="200"
              show-word-limit
              clearable
            />
          </el-form-item>
        </div>
        <div class="form-row two-cols">
          <el-form-item label="文章分类" prop="categoryId" class="form-item">
            <el-select
              v-model="formData.categoryId"
              placeholder="请选择文章分类"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in props.catagories"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="标签" prop="tags" class="form-item">
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
        </div>
        <el-form-item label="文章摘要" prop="summary">
          <el-input
            type="textarea"
            v-model="formData.summary"
            placeholder="请输入文章摘要"
            maxlength="1000"
            show-word-limit
            :rows="3"
          />
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
                <el-icon class="upload-icon"><Upload /></el-icon>
                <p>点击上传封面</p>
                <span>建议尺寸 800x400</span>
              </div>
              <div v-else class="cover-preview">
                <img :src="imgUrl" alt="封面图片" />
                <div class="cover-overlay">
                  <el-icon><Plus /></el-icon>
                </div>
              </div>
            </el-upload>
            <el-button v-if="imgUrl" type="danger" size="small" @click="removeImage">
              <el-icon><Delete /></el-icon>
              删除图片
            </el-button>
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
      <div v-if="btnPreview" class="preview-section">
        <div class="preview-header">
          <el-icon><View /></el-icon>
          <span>预览效果</span>
        </div>
        <div class="preview-content" v-html="formData.content"></div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="btnPreview = !btnPreview">
          <el-icon><View /></el-icon>
          {{ btnPreview ? "关闭预览" : "预览" }}
        </el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          <el-icon><Check /></el-icon>
          {{ isEdit ? "保存修改" : "发布文章" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref, nextTick, watch } from "vue";
import { ElMessage } from "element-plus";
import { uploadFile, createArticle, updateArticle } from "@/api/admin";
import { fileBaseURL } from "@/config/index";
import RichTextEditor from "@/components/RichTextEditor.vue";
import { Upload, Delete, View, Check, Plus } from "@element-plus/icons-vue";

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
:deep(.aticle-dialog) {
  .el-dialog__header {
    background: linear-gradient(135deg, #003366 0%, #004080 100%);
    padding: 16px 20px;
    margin: 0;
    
    .el-dialog__title {
      color: #fff;
      font-size: 18px;
      font-weight: 600;
    }

    .el-dialog__headerbtn {
      top: 16px;

      .el-dialog__close {
        color: #fff;
      }
    }
  }

  .el-dialog__body {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .dialog-content {
    .form-row {
      margin-bottom: 16px;

      &.two-cols {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
    }

    .el-form-item {
      margin-bottom: 16px;

      .el-form-item__label {
        font-weight: 500;
        color: #333;
      }
    }

    .cover-upload {
      display: flex;
      align-items: center;
      gap: 16px;

      .avatar-uploader {
        .cover-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 200px;
          height: 120px;
          border: 2px dashed #d0dbe7;
          border-radius: 8px;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            border-color: #003366;
            background: #f0f4f8;
          }

          .upload-icon {
            font-size: 32px;
            color: #999;
            margin-bottom: 8px;
          }

          p {
            margin: 0;
            color: #666;
            font-size: 14px;
          }

          span {
            font-size: 12px;
            color: #999;
          }
        }

        .cover-preview {
          position: relative;
          width: 200px;
          height: 120px;
          border-radius: 8px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .cover-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;

            .el-icon {
              font-size: 24px;
              color: #fff;
            }
          }

          &:hover .cover-overlay {
            opacity: 1;
          }
        }
      }
    }

    .preview-section {
      margin-top: 20px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e8ecf1;

      .preview-header {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #003366;
        font-weight: 600;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #e8ecf1;
      }

      .preview-content {
        padding: 16px;
        background: #fff;
        border-radius: 6px;
        min-height: 100px;
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .el-button {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
}
</style>
