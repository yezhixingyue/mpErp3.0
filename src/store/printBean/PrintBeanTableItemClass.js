import restoreClassByOriginData from '../../assets/js/utils/reduction';

/**
 * 设置印豆时，右侧的单个类对象
 *
 * @export
 * @class PrintBeanTableItem
 */
export default class PrintBeanTableItem {
  ID = '' // number

  BeanNumber = ''

  Price = ''

  TotalNumber = '' // 总份数 不填则表示不限

  SellNumber = 0 // 已售份数 -- 预留

  BuyMaxNumber = ''

  DayBuyMaxNumber = ''

  key = ''

  constructor(data) {
    if (data) {
      restoreClassByOriginData(this, data);
    } else { // 没有ID时则生成key
      this.key = Math.random().toString(32).slice(-10);
    }
  }
}
