<template>
  <div class="knowledge-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="nav-left">
        <el-image :src="jyuLogo" class="nav-logo" />
        <span class="nav-title">嘉应学院心理服务平台</span>
      </div>
      <div class="nav-right">
        <router-link to="/" class="nav-link">
          <el-icon><HomeFilled /></el-icon>
          返回首页
        </router-link>
      </div>
    </div>

    <!-- 头部区域 -->
    <div class="header-section">
      <div class="header-bg">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
      </div>
      <div class="header-content">
        <div class="header-icon">
          <el-image :src="book" />
        </div>
        <div class="header-text">
          <h1>心理知识库</h1>
          <p>探索心理健康知识，提升心理素养</p>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <div class="main-content">
        <!-- 左侧推荐 -->
        <aside class="recommend-section">
          <div class="section-header">
            <el-icon><Reading /></el-icon>
            <span>热门推荐</span>
          </div>
          <div class="recommend-list">
            <div
              class="recommend-item"
              v-for="item in recommendList"
              :key="item.id"
              @click="goToArticle(item.id)"
            >
              <div class="item-title">{{ item.title }}</div>
              <div class="item-meta">
                <span><el-icon><View /></el-icon> {{ item.readCount }}</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- 右侧文章列表 -->
        <main class="article-list">
          <div
            class="article-item"
            v-for="item in articleList"
            :key="item.id"
            @click="goToArticle(item.id)"
          >
            <div class="article-cover">
              <el-image :src="getImage(item.coverImage)" />
            </div>
            <div class="article-info">
              <div class="article-header">
                <h3>{{ item.title }}</h3>
                <el-tag size="small" type="primary">{{ item.categoryName }}</el-tag>
              </div>
              <div class="article-meta">
                <span class="meta-item">
                  <el-icon><User /></el-icon>
                  {{ item.authorName }}
                </span>
                <span class="meta-item">
                  <el-icon><Calendar /></el-icon>
                  {{ dayjs(item.updatedAt).format("YYYY-MM-DD") }}
                </span>
                <span class="meta-item">
                  <el-icon><View /></el-icon>
                  {{ item.readCount }} 阅读
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pagination.total"
          :page-size="pagination.size"
          v-model:current-page="pagination.currentPage"
          @current-change="getPageList"
        />
      </div>
    </div>
  </div>
</template>

<script setup>

import jyuLogo from "@/assets/images/嘉应学院-logo.svg";
import book from "@/assets/images/book.png";
import { getKnowledgeList } from "@/api/forntend.js";
import { onMounted, reactive, ref } from "vue";
import { Histogram, HomeFilled, Reading, View, User, Calendar } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
const router = useRouter()
//左侧推荐文章
const recommendList = ref([]);
//右侧列表数据
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});
const articleList = ref([]);
//获取列表数据
const getPageList = (page, size) => {
  // 如果是size-change事件，重置currentPage为1
  if (size) {
    pagination.currentPage = 1;
    pagination.size = size;
  }
  // 如果是current-change事件，更新currentPage
  if (page) {
    pagination.currentPage = page;
  }
  
  const params = {
    sortField: "publishedAt",
    sortOrder: "desc",
    ...pagination,
  };
  
  getKnowledgeList(params).then((res) => {
    if (res && res.records) {
      articleList.value = res.records;
      pagination.total = res.total;
      console.log("文章列表", res);
    } else {
      console.error("返回数据结构不正确:", res);
      articleList.value = [];
      pagination.total = 0;
    }
  }).catch((error) => {
    console.error("获取文章列表失败:", error);
    articleList.value = [];
    pagination.total = 0;
  });
};
// 处理图片路径
const getImage = (url) => {
  if (url && url.startsWith("/")) {
    return url
      ? "http://159.75.169.224:1235" + url
      : "https://file.itndedu.com/psychology_ai.png";
  }
  return url;
};
//跳转方法
const goToArticle = (id)=>{
  router.push(`/knowledge/article/${id}`)
}
onMounted(() => {
  const params = {
    sortField: "readCount",
    sortOrder: "desc",
    currentPage: 1,
    size: 5,
  };
  getPageList();
  //获取推荐阅读列表
  getKnowledgeList(params)
    .then((res) => {
      console.log("文章", res);
      // 检查返回数据结构
      if (res && res.records) {
        recommendList.value = res.records;
      } else if (res && Array.isArray(res)) {
        // 如果直接返回数组
        recommendList.value = res;
      } else {
        console.error("返回数据结构不正确:", res);
        recommendList.value = [];
      }
    })
    .catch((error) => {
      console.error("获取推荐阅读失败:", error);
      recommendList.value = [];
    });
});

</script>

<style lang="scss" scoped>
.knowledge-page {
  min-height: 100vh;
  background: #f8fafc;

  // 顶部导航
  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 32px;
    background: white;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

    .nav-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .nav-logo {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }

      .nav-title {
        font-size: 15px;
        font-weight: 600;
        color: #003366;
      }
    }

    .nav-right {
      .nav-link {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #666;
        text-decoration: none;
        font-size: 14px;
        padding: 8px 16px;
        border-radius: 8px;
        transition: all 0.3s;

        &:hover {
          color: #003366;
          background: rgba(0, 51, 102, 0.05);
        }
      }
    }
  }

  // 头部区域
  .header-section {
    position: relative;
    background: linear-gradient(135deg, #003366 0%, #1a5a8e 100%);
    padding: 40px 24px;
    overflow: hidden;

    .header-bg {
      position: absolute;
      inset: 0;
      overflow: hidden;

      .bg-shape {
        position: absolute;
        border-radius: 50%;
        opacity: 0.1;
      }
      .shape-1 {
        width: 300px;
        height: 300px;
        background: white;
        top: -100px;
        right: -50px;
      }
      .shape-2 {
        width: 200px;
        height: 200px;
        background: white;
        bottom: -50px;
        left: 10%;
      }
    }

    .header-content {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto;

      .header-icon {
        width: 70px;
        height: 70px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .header-text {
        h1 {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin: 0 0 8px;
        }

        p {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }
      }
    }
  }

  // 内容区域
  .content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;

    .main-content {
      display: flex;
      gap: 24px;
    }

    // 左侧推荐
    .recommend-section {
      width: 260px;
      flex-shrink: 0;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      padding: 20px;

      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        color: #003366;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f0f0f0;

        .el-icon {
          font-size: 18px;
        }
      }

      .recommend-list {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .recommend-item {
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          border-left: 3px solid transparent;

          &:hover {
            background: #f8fafc;
            border-left-color: #003366;
          }

          .item-title {
            font-size: 14px;
            font-weight: 500;
            color: #1f2937;
            margin-bottom: 6px;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .item-meta {
            font-size: 12px;
            color: #9ca3af;

            span {
              display: flex;
              align-items: center;
              gap: 4px;
            }
          }
        }
      }
    }

    // 右侧文章列表
    .article-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .article-item {
        background: white;
        border-radius: 16px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        padding: 16px;
        display: flex;
        gap: 16px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .article-cover {
          width: 180px;
          height: 110px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .article-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .article-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 10px;

            h3 {
              font-size: 17px;
              font-weight: 600;
              color: #1f2937;
              margin: 0;
              flex: 1;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          }

          .article-meta {
            display: flex;
            gap: 16px;

            .meta-item {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 13px;
              color: #6b7280;

              .el-icon {
                font-size: 14px;
              }
            }
          }
        }
      }
    }

    // 分页
    .pagination-wrapper {
      display: flex;
      justify-content: center;
      padding: 30px 0;

      :deep(.el-pagination) {
        .el-pager li {
          border-radius: 8px;
        }
      }
    }
  }
}

// 响应式
@media (max-width: 768px) {
  .knowledge-page {
    .header-section .header-content {
      flex-direction: column;
      text-align: center;
    }

    .content .main-content {
      flex-direction: column;

      .recommend-section {
        width: 100%;
      }

      .article-list .article-item {
        flex-direction: column;

        .article-cover {
          width: 100%;
          height: 160px;
        }
      }
    }
  }
}
</style>
