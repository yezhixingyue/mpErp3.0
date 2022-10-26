let _aMapServiceHost = '';

if (process.env.NODE_ENV === 'production' && process.env.BUILD_TYPE === 'prod') {
  // 打包正式环境
  _aMapServiceHost = 'order.ybz888.com';
} else if (process.env.NODE_ENV === 'production') {
  // 打包测试环境
} else {
  // 开发环境
}

export const amapAppkey = '5133382d95bf0ad64b941ae71d8ae861';
export const projectType = 'erp';
export const aMapServiceHost = _aMapServiceHost; // 高德代理服务器地址 默认为空：自动识别当前域名 【 设置时不应包含http协议（自动识别），如：order.ybz888.com 或 '' 】

export default {
  IsFileInLan: false, // 是否广域网上传文件 --- 弃用，使用下面一个
  Position: 0, // 文件上传位置， 0 办公楼 | 255 其它
  amapAppkey,
  aMapServiceHost,
};
