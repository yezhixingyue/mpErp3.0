/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
import type { AxiosRequestConfig } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    closeTip?: boolean; // 是否展示错误提示： 默认展示，传递true时不展示
    closeLoading?: boolean; // 是否展示loading： 传递true时不展示  其它情况均展示
    // [自定义属性声明]
  }

  export interface AxiosHeaders {
    Authorization?: string
  }
}
