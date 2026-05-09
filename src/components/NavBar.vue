<template>
    <div class="navbar">
        <div class="navbar-left">
            <button class="toggle-btn" @click="adminStore.toggleCollapsed">
                <el-icon><Expand /></el-icon>
            </button>
            <div class="page-title-wrap">
                <span class="page-title">{{ route.meta.title }}</span>
            </div>
        </div>
        <div class="navbar-right">
            <el-dropdown>
                <div class="user-info">
                    <el-avatar :size="36" class="user-avatar">
                        <el-icon><User /></el-icon>
                    </el-avatar>
                    <span class="user-name">管理员</span>
                    <el-icon class="arrow-icon"><ArrowDown /></el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleCommand('logout')">
                            <el-icon><SwitchButton /></el-icon>
                            退出登录
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
<script setup>
import { Expand, ArrowDown, User, SwitchButton } from '@element-plus/icons-vue';
import { useAdminStore } from '../store/admin.js'
import { ElMessageBox } from 'element-plus'
import { logout } from '@/api/admin.js'
import { useRouter, useRoute } from 'vue-router'

const adminStore = useAdminStore()
const router = useRouter()
const route = useRoute()

const handleCommand = (command) => {
    if (command === 'logout') {
        ElMessageBox.confirm('确定退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            logout().then(() => {
                localStorage.removeItem('token')
                localStorage.removeItem('userInfo')
                router.push('/author/login')
            })
        }).catch(() => {})
    }
}
</script>
<style lang="scss">
.navbar {
    height: 64px;
    background-color: #fff;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    padding: 0 24px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    align-items: center;
    justify-content: space-between;

    .navbar-left {
        display: flex;
        align-items: center;
        gap: 16px;

        .toggle-btn {
            width: 36px;
            height: 36px;
            border: none;
            background: #f5f7fa;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;

            &:hover {
                background: #e8ecf1;
            }

            .el-icon {
                font-size: 18px;
                color: #003366;
            }
        }

        .page-title-wrap {
            .page-title {
                font-size: 18px;
                font-weight: 600;
                color: #003366;
            }
        }
    }

    .navbar-right {
        .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            padding: 6px 12px;
            border-radius: 8px;
            transition: background 0.2s;

            &:hover {
                background: #f5f7fa;
            }

            .user-avatar {
                background: linear-gradient(135deg, #003366 0%, #004080 100%);
            }

            .user-name {
                font-size: 14px;
                color: #333;
                font-weight: 500;
            }

            .arrow-icon {
                font-size: 12px;
                color: #999;
            }
        }
    }
}

:deep(.el-dropdown-menu__item) {
    display: flex;
    align-items: center;
    gap: 8px;
}
</style>