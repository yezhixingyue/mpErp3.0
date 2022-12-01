if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_BASE_URL === 'prod') {
  // 打包正式环境
} else if (process.env.NODE_ENV === 'production') {
  // 打包测试环境
} else {
  // 开发环境
}

export const amapAppkey = '5133382d95bf0ad64b941ae71d8ae861';
export const projectType = 'erp';
export const securityJsCode = '2ee878caa1e9a356e068582cdd5faa46'; // 高德key对应的密钥，前台不要配置（采用高德推荐的安全模式），后台配置（减少维护复杂度）
export const aMapServiceHost = ''; // 高德代理服务器地址 默认为空：自动识别当前域名 【 设置时不应包含http协议（自动识别），如：order.ybz888.com 或 '' 】

export default {
  IsFileInLan: false, // 是否广域网上传文件 --- 弃用，使用下面一个
  Position: 0, // 文件上传位置， 0 办公楼 | 255 其它
  projectType,
  amapAppkey,
  securityJsCode,
  aMapServiceHost,
};
