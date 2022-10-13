## 名片之家 - 转换器项目

### 项目构成
> vue2.7 + ts + pania + axios + elementui   


### 搭建工具
> webpack

### vue-router meta类型修改(router.d.ts中添加内容项)
```javascript
export interface RouteMeta extends Record<string | number | symbol, any> {
  /** 页面标题 */
  title: string,
  /** 是否需要登录权限 */
  requiresAuth: boolean,
}
```