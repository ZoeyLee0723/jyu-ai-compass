<template>
  <div class="page-header">
    <p class="page-title">{{ props.title }}</p>
    <div class="action-buttons">
      <slot name="action-buttons"></slot>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>
<style lang="scss" scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
  .page-title {
    font-size: 26px;
    font-weight: bold;
    color: #1f2937;
  }
}
</style>