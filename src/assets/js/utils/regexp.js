/*
 * @Describe:
 * @FilePath: /src/assets/js/utils/regexp.js
 */
// export const normalNameReg = /^[\u4e00-\u9fa5a-zA-Z0-9_*]+$/; // 名字判断 可包含中文 字母 数字，不可包含其它
export const normalNameReg = /^[\u0030-\u0039\uFF41-\uFF5A\uFF21-\uFF3A\u4e00-\u9fa5\uff0b\uff0d\uff3f\da-zA-Z.+-_]*$/; // 名字判断 可包含中文 字母 数字，不可包含其它

export const FileNameReg = /^[\u0030-\u0039\uFF41-\uFF5A\uFF21-\uFF3A\u4e00-\u9fa5\uff0b\uff0d\uff3f\da-zA-Z.+-_\s]*$/;

export const SplitCharsReg = /[^,'\s]/g; // 分隔符不可选内容 使用replace替换为''

export const GroupAndPartSplitCharsReg = /[^【】{}[\]《》()（）\s]/g; // 部件 或 元素组分隔符不可选内容 使用replace替换为''

// eslint-disable-next-line no-control-regex
export const NotChineseWideCharReg = /[^\u4e00-\u9fa5\x00-\xff]/gm; // 非中文全角字符 使用reg.match方法验证

export const MobileReg = /^1[3456789]\d{9}$/; // 手机验证正则

export const pointStartNumberReg = /^\.\d+$/;

export const pointEndReg = /\w+\.$/;

// export const decimalReg = /^(([^0][0-9]+|0)\.([0-9]{1,2}))$/;

// export const integerReg = /^([^0][0-9]+|0)$/;

// export const numberReg = /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^([^0][0-9]+|0)$/;

export default {
  MobileReg,
  normalNameReg,
  NotChineseWideCharReg,
  pointStartNumberReg,
  pointEndReg,
};
