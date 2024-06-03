import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IMRProduct } from '../../../js/types';

const _validChars = (val: string, label: string, reg: RegExp) => {
  if (!val) {
    MpMessage.error({ title: '保存失败', msg: `${label}不能为空` });
    return false;
  }

  if (!reg.test(val)) {
    MpMessage.error({ title: '保存失败', msg: `${label}输入格式不正确` });
    return false;
  }

  return true;
};

/** 分隔符校验正则集合 */
export const SplitCharsRegexps = {
  /** 通用分隔符 */
  SplitChars: /^[\s_,，、]{1}$/,
  /** 尺寸连接符 */
  SizeJoinChars: /^[xX+]{1}$/,
  /** 部件开始结束符 */
  PartSplitChars: /^(【】|{}|\[\]|《》|\(\)|（）)$/,
  /** 元素组开始结束符 */
  GroupSplitChars: /^(【】|{}|\[\]|《》|\(\)|（）)$/,
  /** 工艺开始结束符 */
  CraftSplitChars: /^(【】|{}|\[\]|《》|\(\)|（）)$/,
};

/** 分隔符相关设置表单类 */
export class SplitCharsRuleForm {
  /** 通用分隔符 */
  SplitChars = ''

  /** 尺寸连接符 */
  SizeJoinChars = ''

  /** 部件开始结束符 */
  PartSplitChars = ''

  /** 元素组开始结束符 */
  GroupSplitChars = ''

  /** 工艺开始结束符 */
  CraftSplitChars = ''

  constructor(item: IMRProduct) {
    this.SplitChars = item.SplitChars || '';
    this.SizeJoinChars = item.SizeJoinChars || '';
    this.PartSplitChars = item.PartSplitChars || '';
    this.GroupSplitChars = item.GroupSplitChars || '';
    this.CraftSplitChars = item.CraftSplitChars || '';
  }

  /** 校验分隔符填写数据 */
  protected validChars() {
    if (!_validChars(this.SplitChars, '通用分隔符', SplitCharsRegexps.SplitChars)) return false;
    if (!_validChars(this.SizeJoinChars, '尺寸连接符', SplitCharsRegexps.SizeJoinChars)) return false;
    if (!_validChars(this.PartSplitChars, '部件开始结束符', SplitCharsRegexps.PartSplitChars)) return false;
    if (!_validChars(this.GroupSplitChars, '元素组开始结束符', SplitCharsRegexps.GroupSplitChars)) return false;
    if (!_validChars(this.CraftSplitChars, '工艺开始结束符', SplitCharsRegexps.CraftSplitChars)) return false;

    return true;
  }
}
