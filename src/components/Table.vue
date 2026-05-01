<template>
  <el-form ref="ruleFormRef" :model="form">
    <el-row :gutter="24">
      <template v-for="item in formitemAttrs" :key="item.prop">
        <el-col :span="item.col">
          <el-form-item :label="item.label" :prop="item.prop" style="width: 20vw;">
            <!-- input 类型 -->
            <el-input
              v-if="item.comp === 'input'"
              v-model="form[item.prop]"
              :placeholder="item.placeholder"
            />

            <!-- select 类型 -->
            <el-select
              v-else-if="item.comp === 'select'"
              v-model="form[item.prop]"
              :placeholder="item.placeholder || '请选择你要查询的字段'"
            >
              <el-option label="全选" value="" />
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <el-row>
      <el-button type="primary" @click="handleSearch"> 查询 </el-button>
      <el-button @click="handleReset"> 重置 </el-button>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";

const ruleFormRef = ref(null);

const props = defineProps({
  formitem: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["search", "reset"]);

// 初始化表单数据
const form = ref({});

// 设置初始值
const initForm = () => {
  const initialForm = {};
  props.formitem.forEach((item) => {
    initialForm[item.prop] = "";
  });
  form.value = initialForm;
};

const handleSearch = () => {
  console.log('Table - 搜索表单数据:', form.value);
  emit("search", form.value);
};

const handleReset = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.resetFields();
  // 手动重置 form 值（因为 resetFields 可能不会立即更新 form）
  initForm();
  ElMessage.success("重置成功");
  // 触发重置事件，让父组件重新搜索
  emit("reset", form.value);
};

const formitemAttrs = computed(() => {
  const { formitem } = props;
  return formitem.map((item) => ({
    ...item,
    col: { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 },
  }));
});

// 组件挂载时初始化表单
onMounted(() => {
  initForm();
});
</script>

<style></style>
