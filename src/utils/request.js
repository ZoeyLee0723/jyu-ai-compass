import axios from "axios";
import router from "@/router";
import { ElMessage } from "element-plus";

const service = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    const { data, config } = response;
    
    // 将 code 转为字符串进行比较，兼容数字和字符串
    const code = String(data.code);
    
    // 请求成功 (200 或 0)
    if (code === "200" || code === "0") {
      return data.data || data;
    }
    
    // 登录过期 (-1 或 401)
    if (code === "-1" || code === "401") {
      if (!config.url?.includes("/login")) {
        ElMessage.error(data.msg || "登录过期，请重新登录");
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        router.push({ path: "/login" });
      } else {
        ElMessage.error(data.msg || '登录失败');
      }
      return Promise.reject(data);
    }
    
    // 其他错误
    ElMessage.error(data.msg || "请求失败");
    return Promise.reject(data);
  },
  (error) => {
    ElMessage.error(error.message || "网络错误");
    return Promise.reject(error);
  }
);

export default service;
