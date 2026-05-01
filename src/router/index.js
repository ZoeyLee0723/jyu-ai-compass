import { createRouter, createWebHistory } from "vue-router";
import backendlayout from "../components/backendlayout.vue";
import dashboard from "../views/dashboard.vue";
import consultations from "../views/consultations.vue";
import knowledge from "../views/knowledge.vue";
import emotional from "../views/emotional.vue";
import AuthorLayout from "../components/AuthorLayout.vue";
import login from "../views/login.vue";
import register from "../views/register.vue";
import frontendlayout from "../components/FrontendLayout.vue";
import home from "../views/home.vue";
import consultation from "../views/consultation.vue";
import emotionDairy from "../views/emotionDairy.vue";
import frontendknowledge from "../views/frontendknowledge.vue";
import articleDetail from "../views/articleDetail.vue";
const frontendroutes = [
  {
    path: "/",
    component: frontendlayout,
    children: [
      {
        path:'',
        component:home,
      },
      {
        path:'/consultation',
        component:consultation,
      },
      {
        path:'/emotion-dairy',
        component:emotionDairy,
      },
      {
        path:'/knowledge',
        component:frontendknowledge,
      },
      {
        path:'/knowledge/article/:id',
        component:articleDetail,
        props:true
      }
        
      
    ],
  },
 
];
const backendroutes = [
  // {
  //   path: "/",
  //   redirect: "/author/login", // 首页重定向到登录页
  // },
  {
    path: "/backend",
    name: "Home",
    component: backendlayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: dashboard,
        meta: {
          title: "数据分析",
          icon: "Notification",
          requiresAuth: true
        },
      },
      {
        path: "consultations",
        name: "Consultations",
        component: consultations,
        meta: {
          title: "咨询管理",
          icon: "ChatRound",
          requiresAuth: true
        },
      },
      {
        path: "knowledge",
        name: "Knowledge",
        component: knowledge,
        meta: {
          title: "知识文章",
          icon: "MessageBox",
          requiresAuth: true
        },
      },
      {
        path: "emotional",
        name: "Emotional",
        component: emotional,
        meta: {
          title: "情感分析",
          icon: "Service",
          requiresAuth: true
        },
      },
    ],
  },
  {
    path: "/author",
    name: "Author",
    component: AuthorLayout,
    redirect: "/author/login", // author 路由默认显示登录页
    children: [
      {
        path: "/author/login",
        name: "AuthorLogin",
        component: login,
        meta: {
          title: "登录",
        },
      },
      {
        path: "/author/register",
        name: "AuthorRegister",
        component: register,
        meta: {
          title: "注册",
        },
      },
    ],
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes: [...backendroutes, ...frontendroutes],
});

//路由前置守卫
router.beforeEach((to, from, next) => {
  // 检查路由是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const token = localStorage.getItem('token');
  
  if (requiresAuth) {
    if (token) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.userType === 2) {
          // 管理员用户可以访问所有需要认证的路由
          next();
        } else if (userInfo.userType === 1) {
          if(to.path.startsWith('/backend') || to.path.startsWith('/author')){
            next('/')
          }else{
            next()
          }
        } else {
          // 没有用户信息，跳转到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          next('/author/login');
        }
      } catch (error) {
        // 解析失败，清除 token 并跳转到登录页
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        next('/author/login');
      }
    } else {
      // 没有 token，跳转到登录页
      next('/author/login');
    }
  } else {
    // 不需要认证的路由直接通过
    next();
  }
});

export default router;
