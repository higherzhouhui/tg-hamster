import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import { addPending, removePending } from './pending';
import WebApp from '@twa-dev/sdk'

// 处理响应
const handleResponse = (data: GlobalRequest.Response<any>) => {
  const {code} = data;
  if (code === 403) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authorization');
      window.location.href = `/`;
    }
  }
};
// 处理错误
const handleError = (res: any) => {
  if (!res) {
    return;
  }
 
};

// 创建请求实例
const instance = axios.create({
  baseURL: '/api',
  timeout: 500000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config: any) => {
    if (typeof window !== 'undefined') {
      const authorization = localStorage.getItem('authorization');
      if (authorization) {
        config.headers = {
          ...config.headers,
          'authorization': `Bearer ${authorization}`,
        };
      }
    }
    removePending(config);
    addPending(config);
    // 发送请求之前做些什么
    return config;
  },
  (err) => {
    // 对请求错误做些什么
    return Promise.reject(err);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const data: GlobalRequest.Response<any> = response.data;
    // 对响应数据做些什么
    removePending(response);
    handleResponse(data);
    return response;
  },
  (err) => {
    // 对响应错误做些什么
    handleError(err.response);
    return Promise.reject(err);
  }
);

async function request<T>(config: AxiosRequestConfig) {
  return instance
    .request<GlobalRequest.Response<T>>(config)
    .then((res) => res.data);
}

export default request;
