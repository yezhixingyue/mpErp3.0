/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
import { Route } from 'vue-router';

declare module 'Route' {
  export interface Route {
    /** 必填 */
    name: string
    // [自定义属性声明]
  }
}
