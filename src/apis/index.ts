// 引入 axios 实例
import { message } from 'ant-design-vue';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { RequestConfig, responseCode } from './type';

// @ts-ignore
interface Response<T> {
    data: T, // 请求的数据，用泛型
    msg: string | null // 返回状态码的信息，如请求成功等
    code: number
    error?:any
}
export interface ResultData<T> {
    results: T,
    count: number
}
export type APiResponse<T> = Promise<Response<T>>;

class Request<T> {
    private _instance: AxiosInstance // axios实例

    constructor(config: AxiosRequestConfig) {
      this._instance = axios.create(config);
      // 添加拦截器
      this._instance.interceptors.request.use((config) =>

        config,
      (error) => Promise.reject(error));
      this._instance.interceptors.response.use((response) => {
        const { data } = response;
        return data;
      }, (error) => {
        // 超出 2xx 范围的状态码都会触发该函数。
        const { status, code } = error.response;
        const { data } = error.response;
        if (status >= responseCode.Error) {
          return message.error('服务端错误error');
        }
        if (data.error) {
          return message.info(data.error);
        }

        // 对响应错误做点什么
        return Promise.reject(
          data,
        );
      });
    }

    request<T>(config: RequestConfig): Promise<T> {
      return new Promise((resolve, reject) => {
        this._instance
          .request<any, any>(config)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
            return err;
          });
      });
    }

    get<T>(config: RequestConfig): Promise<T> {
      return this.request<T>({
        ...config,
        method: 'get',
      });
    }

    post<T>(config: RequestConfig): Promise<T> {
      return this.request<T>({
        ...config,
        method: 'post',
      });
    }

    put<T>(config: RequestConfig): Promise<T> {
      return this.request<T>({
        ...config,
        method: 'put',
      });
    }

    delete<T>(config: RequestConfig): Promise<T> {
      return this.request<T>({
        ...config,
        method: 'delete',
      });
    }

    patch<T>(config: RequestConfig): Promise<T> {
      return this.request<T>({
        ...config,
        method: 'patch',
      });
    }
}

const conf: RequestConfig = {
  baseURL: '/api',
  timeout: 1000,
  withCredentials: true,
};
export default new Request(conf);
