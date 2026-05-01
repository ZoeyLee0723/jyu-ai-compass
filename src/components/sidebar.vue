<template>
    <el-aside :width="isCollapsed ? '64px' : '264px'" class="sidebar-container">
        <div class="sidebar-header">
            <div class="brand" :class="{ 'collapsed': isCollapsed }">
                <el-image :src="logo" class="brand-logo" />
                <div class="brand-info" v-show="!isCollapsed">
                    <h1 class="brand-title">心理健康助手</h1>
                    <p class="brand-subtitle">管理后台</p>
                </div>
            </div>
        </div>
        <el-menu 
            :default-active="activeIndex" 
            class="sidebar-menu" 
            :collapse="isCollapsed" 
            :collapse-transition="false"
            background-color="#001529"
            text-color="#a6adb4"
            active-text-color="#ffffff"
        >
            <el-menu-item 
                v-for="item in menuItems" 
                :key="item.path" 
                :index="item.path"
                @click="handleClick(item.path)"
                class="menu-item"
            >
                <el-icon class="menu-icon">
                    <component :is="item.icon" />
                </el-icon>
                <template #title>
                    <span class="menu-title">{{ item.title }}</span>
                </template>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script setup>
import { useAdminStore } from '../store/admin.js'
const adminStore = useAdminStore()
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import logo from '@/assets/images/机器人.png'

const router = useRouter()
const route = useRoute()

// 当前激活的菜单项
const activeIndex = computed(() => route.path)

// 获取后台路由的 children
const menuItems = computed(() => {
    // 找到 /backend 路由
    const backendRoute = router.options.routes.find(r => r.path === '/backend')
    if (!backendRoute || !backendRoute.children) {
        return []
    }
    return backendRoute.children.map(route => ({
        path: route.path,
        title: route.meta?.title || route.name,
        icon: ElementPlusIconsVue[route.meta?.icon] || ElementPlusIconsVue.Menu
    }))
})

const handleClick = (path) => {
    router.push(path)
}

// 第一时间获取isCollapsed状态,以便告诉pinia当前状态
const isCollapsed = computed(() => adminStore.isCollapsed)
</script>

<style scoped lang="scss">
.sidebar-container {
    height: 100vh;
    background: linear-gradient(180deg, #001529 0%, #002140 100%);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    transition: width 0.3s ease;
    display: flex;
    flex-direction: column;

    .sidebar-header {
        padding: 20px 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.3s ease;

            &.collapsed {
                justify-content: center;
            }

            .brand-logo {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                flex-shrink: 0;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
            }

            .brand-info {
                overflow: hidden;
                white-space: nowrap;

                .brand-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #ffffff;
                    margin: 0;
                    line-height: 1.4;
                }

                .brand-subtitle {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.6);
                    margin: 4px 0 0 0;
                    line-height: 1.2;
                }
            }
        }
    }

    .sidebar-menu {
        flex: 1;
        border-right: none;
        background: transparent !important;
        padding: 12px 8px;

        .menu-item {
            height: 48px;
            line-height: 48px;
            margin: 4px 0;
            border-radius: 8px;
            transition: all 0.3s ease;

            &:hover {
                background-color: rgba(64, 158, 255, 0.15) !important;
                color: #ffffff !important;

                .menu-icon {
                    transform: scale(1.1);
                }
            }

            &.is-active {
                background: linear-gradient(90deg, #409eff 0%, #1890ff 100%) !important;
                color: #ffffff !important;
                box-shadow: 0 2px 8px rgba(64, 158, 255, 0.4);

                .menu-icon {
                    color: #ffffff;
                }
            }

            .menu-icon {
                font-size: 18px;
                margin-right: 12px;
                transition: transform 0.3s ease;
            }

            .menu-title {
                font-size: 14px;
                font-weight: 500;
            }
        }
    }
}

// 折叠状态下的样式调整
:deep(.el-menu--collapse) {
    .menu-item {
        padding: 0 20px !important;
        
        .menu-icon {
            margin: 0;
            font-size: 20px;
        }
    }
}
</style>
