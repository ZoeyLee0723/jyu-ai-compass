<template>
  <div class="dashboard-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-icon class="header-icon"><DataAnalysis /></el-icon>
        <div class="header-text">
          <h2>数据概览</h2>
          <p>欢迎回来，查看平台实时数据统计</p>
        </div>
      </div>
      <div class="header-right">
        <el-button text @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card" v-if="aiData.systemOverview">
        <div class="stat-icon users">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-label">用户总数</span>
          <span class="stat-value">{{ aiData.systemOverview.totalUsers }}</span>
          <span class="stat-extra">活跃 {{ aiData.systemOverview.activeUsers }} 人</span>
        </div>
      </div>
      <div class="stat-card" v-if="aiData.systemOverview">
        <div class="stat-icon diaries">
          <el-icon><Notebook /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-label">情绪日志</span>
          <span class="stat-value">{{ aiData.systemOverview.totalDiaries }}</span>
          <span class="stat-extra">今日 +{{ aiData.systemOverview.todayNewDiaries }}</span>
        </div>
      </div>
      <div class="stat-card" v-if="aiData.systemOverview">
        <div class="stat-icon sessions">
          <el-icon><ChatDotRound /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-label">咨询会话</span>
          <span class="stat-value">{{ aiData.systemOverview.totalSessions }}</span>
          <span class="stat-extra">今日 +{{ aiData.systemOverview.totalNewSessions }}</span>
        </div>
      </div>
      <div class="stat-card" v-if="aiData.systemOverview">
        <div class="stat-icon mood">
          <el-icon><Sunny /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-label">平均情绪</span>
          <span class="stat-value">{{ aiData.systemOverview.avgMoodScore }}</span>
          <span class="stat-extra">满分 10 分</span>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <div class="chart-row">
        <div class="chart-card">
          <div class="chart-body">
            <div ref="emotionChartRef" style="width: 100%; height: 260px"></div>
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-body">
            <div class="mini-stats" v-if="aiData.consultationStats">
              <div class="mini-stat">
                <span class="num">{{ aiData.consultationStats.totalSessions }}</span>
                <span class="txt">总会话数</span>
              </div>
              <div class="mini-stat">
                <span class="num">{{ aiData.consultationStats.avgDurationMinutes }}</span>
                <span class="txt">平均时长(分)</span>
              </div>
              <div class="mini-stat">
                <span class="num">{{ aiData.systemOverview.activeUsers }}</span>
                <span class="txt">活跃用户</span>
              </div>
            </div>
            <div ref="consultationChartRef" style="width: 100%; height: 220px"></div>
          </div>
        </div>
      </div>
      <div class="chart-card full-width">
        <div class="chart-body">
          <div ref="userActivityChartRef" style="width: 100%; height: 350px"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getAnalyticsOverview } from "@/api/admin";
import { ref, onMounted, nextTick } from "vue";
import { DataAnalysis, Refresh, User, Notebook, ChatDotRound, Sunny } from "@element-plus/icons-vue";
import * as echarts from "echarts";

const initChart = () => {
  nextTick(() => {
    initEmotionChart();
    initConsultationChart();
    initUserActivityChart();
  });
};
//数据定义
const aiData = ref({});
//情绪数据
let emotionChart = null;
const emotionChartRef = ref(null);
//情绪图表
const initEmotionChart = () => {
  if (!emotionChartRef.value) {
    return;
  }
  //销毁之前的
  if (emotionChart) {
    emotionChart.dispose();
  }
  //创建echart实例
  emotionChart = echarts.init(emotionChartRef.value);
  //获取情绪趋势的数据
  const TrendData = aiData.value.emotionTrend || [];
  //图表配置
  const option = {
    title: {
      text: "情绪趋势分析",
      textStyle: {
        color: "#2d3436",
        fontSize: 16,
        fontWeight: 700,
      },
      left: "center",
      top: 10,
    },
    tooltip: {
      trigger: "axis",
      borderColor: "#FAB1A0",
      borderWidth: 1,
      textStyle: {
        color: "#2d3436",
        fontSize: 12,
      },
    },
    legend: {
      data: ["平均情绪评分", "记录数量"],
      top: 40,
      textStyle: {
        color: "#2d3436",
        fontSize: 12,
      },
      left: "center",
      top: 40,
    },
    xAxis: {
      type: "category",
      data: TrendData.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: "#2d3436",
        },
      },
    },
    yAxis: [
      {
        type: "value",
        name: "平均情绪评分",
        position: "left",
        axisLine: {
          lineStyle: {
            color: "#2d3436",
          },
        },
      },
      {
        type: "value",
        name: "记录数量",
        position: "right",
        axisLine: {
          lineStyle: {
            color: "#2d3436",
          },
        },
      },
    ],
    series: [
      {
        name: "平均情绪评分",
        type: "line",
        data: TrendData.map((item) => item.avgMoodScore),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#FAB1A0",
        },
        itemStyle: {
          color: "#FAB1A0",
        },
      },
      {
        name: "记录数量",
        type: "line",
        smooth: true,
        data: TrendData.map((item) => item.recordCount),
        lineStyle: {
          width: 3,
          color: "#48dbfb",
        },
        itemStyle: {
          color: "#48dbfb",
        },
      },
    ],
    grid: {
      //控制容器样式
      top: 80,
      bottom: "3%",
      left: "3%",
      right: "4%",
    },
  };
  //渲染图表
  emotionChart.setOption(option);
};
//咨询会话数据
let consultationChart = null;
const consultationChartRef = ref(null);
//咨询会话图表
const initConsultationChart = () => {
  if (!consultationChartRef.value) {
    return;
  }
  //销毁之前的
  if (consultationChart) {
    consultationChart.dispose();
  }
  //创建echart实例
  consultationChart = echarts.init(consultationChartRef.value);
  //获取数据
  const dailyTrend = aiData.value.consultationStats?.dailyTrend || [];
  const option = {
    title: {
      text: "咨询会话趋势",
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: "#2d3436",
      },
      left: "center",
      top: 10,
    },
    tooltip: {
      // 提示框
      trigger: "axis", // 触发类型：坐标轴触发
      borderColor: "#fab1a0",
      borderWidth: 1,
      textStyle: {
        color: "#2d3436",
      },
    },
    legend: {
      // 图例组件
      data: ["会话数量", "平均时长"],
      top: 40,
    },
    grid: {
      // 设置显示容器位置
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: 80,
    },
    xAxis: {
      type: "category",
      data: dailyTrend.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: "rgba(79, 172, 254, 0.3)",
        },
      },
    },
    yAxis: [
      {
        type: "value",
        name: "会话数量",
        position: "left",
        axisLabel: {
          color: "#636e72",
        },
        axisLine: {
          lineStyle: {
            color: "rgba(79, 172, 254, 0.3)",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(79, 172, 254, 0.1)",
          },
        },
      },
      {
        type: "value",
        name: "平均时长(分钟)",
        position: "right",
        axisLabel: {
          color: "#636e72",
        },
        axisLine: {
          lineStyle: {
            color: "rgba(79, 172, 254, 0.3)",
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: "会话数量",
        type: "line", // 折线图
        data: dailyTrend.map((item) => item.sessionCount),
        smooth: true, // 平滑曲线
        lineStyle: {
          width: 3,
          color: "#4facfe",
        },
        itemStyle: {
          color: "#4facfe",
        },
      },
      {
        name: "平均时长",
        type: "line", // 折线图
        data: dailyTrend.map((item) => item.avgDurationMinutes),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#00f2fe",
        },
        itemStyle: {
          color: "#00f2fe",
        },
      },
    ],
  };
  //渲染图表
  consultationChart.setOption(option);
};
//用户活跃度图表
let userActivityChart = null;
const userActivityChartRef = ref(null);
//用户活跃度图表
const initUserActivityChart = () => {
  if (!userActivityChartRef.value) {
    return;
  }
  //销毁之前的
  if (userActivityChart) {
    userActivityChart.dispose();
  }
  //创建echart实例
  userActivityChart = echarts.init(userActivityChartRef.value);
  //获取数据
  const activityData = aiData.value.userActivity || [];

  const option = {
    title: {
      text: "用户活跃度趋势",
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: "#2d3436",
      },
      left: "center",
      top: 10,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#fab1a0",
      borderWidth: 1,
      textStyle: {
        color: "#2d3436",
      },
    },
    legend: {
      data: ["活跃用户", "新增用户", "日记用户", "咨询用户"],
      top: 40,
      textStyle: {
        color: "#636e72",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: 80,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: activityData.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      axisLabel: {
        color: "#636e72",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#636e72",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.1)",
        },
      },
    },
    series: [
      {
        name: "活跃用户",
        type: "line",
        data: activityData.map((item) => item.activeUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#a29bfe",
        },
        itemStyle: {
          color: "#a29bfe",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(162, 155, 254, 0.4)" },
              { offset: 1, color: "rgba(162, 155, 254, 0.1)" },
            ],
          },
        },
      },
      {
        name: "新增用户",
        type: "line",
        data: activityData.map((item) => item.newUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#fdcb6e",
        },
        itemStyle: {
          color: "#fdcb6e",
        },
      },
      {
        name: "日记用户",
        type: "line",
        data: activityData.map((item) => item.diaryUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#00b894",
        },
        itemStyle: {
          color: "#00b894",
        },
      },
      {
        name: "咨询用户",
        type: "line",
        data: activityData.map((item) => item.consultationUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#fab1a0",
        },
        itemStyle: {
          color: "#fab1a0",
        },
      },
    ],
  };
  //渲染图表
  userActivityChart.setOption(option);
};

const refreshData = () => {
  getAnalyticsOverview()
    .then((res) => {
      aiData.value = res;
      initChart();
    })
    .catch((error) => {
      console.error("获取分析数据失败:", error);
    });
};

onMounted(() => {
  getAnalyticsOverview()
    .then((res) => {
      aiData.value = res;
      initChart();
    })
    .catch((error) => {
      console.error("获取分析数据失败:", error);
      initChart();
    });
});
</script>
<style scoped lang="scss">
.dashboard-page {
  padding: 24px 24px 40px;
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #e8ecf1 100%);

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 20px 24px;
    background: linear-gradient(135deg, #003366 0%, #004080 100%);
    border-radius: 12px;
    color: #fff;

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .header-icon {
        font-size: 36px;
        opacity: 0.9;
      }

      .header-text {
        h2 {
          margin: 0 0 4px;
          font-size: 20px;
          font-weight: 600;
        }

        p {
          margin: 0;
          font-size: 13px;
          opacity: 0.8;
        }
      }
    }

    .header-right {
      :deep(.el-button) {
        color: #fff;
        
        &:hover {
          background: rgba(255,255,255,0.15);
        }
      }
    }
  }

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      }

      .stat-icon {
        width: 52px;
        height: 52px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: #fff;

        &.users {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.diaries {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.sessions {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &.mood {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }

      .stat-info {
        display: flex;
        flex-direction: column;

        .stat-label {
          font-size: 13px;
          color: #7f8c8d;
        }

        .stat-value {
          font-size: 26px;
          font-weight: 700;
          color: #2c3e50;
        }

        .stat-extra {
          font-size: 12px;
          color: #95a5a6;
        }
      }
    }
  }

  .charts-section {
    .chart-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .chart-card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      overflow: hidden;

      &.full-width {
        margin-bottom: 0;
      }

      .chart-body {
        padding: 16px;

        .mini-stats {
          display: flex;
          justify-content: space-around;
          padding: 12px 0;
          margin-bottom: 12px;
          border-bottom: 1px solid #f5f5f5;

          .mini-stat {
            text-align: center;

            .num {
              display: block;
              font-size: 22px;
              font-weight: 700;
              color: #003366;
            }

            .txt {
              font-size: 12px;
              color: #7f8c8d;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 768px) {
  .dashboard-page {
    .stats-cards {
      grid-template-columns: 1fr !important;
    }

    .charts-section .chart-row {
      grid-template-columns: 1fr !important;
    }
  }
}
</style>
