/**
 * 存放一些配置性相关信息的文件 -- 旧配置在assets/js/setup.js文件中，后续新配置放入本文件中
 */

// ---------------------------------- ↓  开发平台相关
export const docBaseURL = process.env.VUE_APP_DOC_API_URL; // 文档服务器调用接口地址
export const docClientURL = process.env.VUE_APP_DOC_CLIENT_URL; // 文章预览地址

// ---------------------------------- 设备管理接口
export const equipmentURL = process.env.VUE_APP_EQUIPMENT_API_URL;

// ----------------- 帮助文档与文档管理相关设置
export const siteType = process.env.VUE_APP_ENV_SITE_TYPE;
