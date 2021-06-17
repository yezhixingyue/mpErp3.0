// export const normalNameReg = /^[\u4e00-\u9fa5a-zA-Z0-9_*]+$/; // 名字判断 可包含中文 字母 数字，不可包含其它
export const normalNameReg = /^[\u0030-\u0039\uFF41-\uFF5A\uFF21-\uFF3A\u4e00-\u9fa5\uff0b\uff0d\uff3f\da-zA-Z+-_]*$/; // 名字判断 可包含中文 字母 数字，不可包含其它

export default {
  normalNameReg,
};
