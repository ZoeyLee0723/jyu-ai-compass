import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    isCollapsed: ref(false)
  }),
 
  actions: {
    toggleCollapsed() {
      this.isCollapsed = !this.isCollapsed
    }
  }
})
