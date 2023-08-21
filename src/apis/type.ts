/**
 # @Time : 2023/1/20 18:26
 # @Site : https://www.codeminer.cn
 """
 file-name:apis
 ex:
 """
 */
import { RawAxiosRequestConfig } from 'axios';

/**
 * 响应code
 */
export const enum responseCode {

  Ok = 200,
  BadRequest = 400,
  Unauthorized=401,
  Forbidden = 403,
  RETRY_HTTP_CODES = 429, // 请求过多
  Error = Ok + 300
}

export interface RequestConfig extends RawAxiosRequestConfig{
 'jwt-token'?:string,
  isAuth:boolean
}
