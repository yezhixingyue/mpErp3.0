// export const normalNameReg = /^[\u4e00-\u9fa5a-zA-Z0-9_*]+$/; // 名字判断 可包含中文 字母 数字，不可包含其它
export const normalNameReg = /^[\u0030-\u0039\uFF41-\uFF5A\uFF21-\uFF3A\u4e00-\u9fa5\uff0b\uff0d\uff3f\da-zA-Z+-_]*$/; // 名字判断 可包含中文 字母 数字，不可包含其它

// eslint-disable-next-line no-control-regex
export const NotChineseWideCharReg = /[^\u4e00-\u9fa5\x00-\xff]/gm; // 非中文全角字符 使用reg.match方法验证

export default {
  normalNameReg,
  NotChineseWideCharReg,
};
