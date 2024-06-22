import CommonClassType from '@/store/CommonClassType';

/** 序列化有无变更下拉筛选列表 */
export const HaveChangeOPtionList = [
  { ID: '', Name: '不限' },
  { ID: false, Name: '无' },
  { ID: true, Name: '有变更' },
];

/** 制作需求设置 - 外购长产品名称序列化设置条件类 */
export class Condition {
  ProductClass: { First: '' | number; Second: '' | number } = {
    First: '',
    Second: '',
  }

  HaveChange: '' | boolean = ''

  Page = 1

  PageSize = 20

  getParams() {
    return CommonClassType.filter(this, true);
  }

  setCondition(data) {
    CommonClassType.setCondition(data, this);
  }
}
