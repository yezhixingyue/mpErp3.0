import messageBox from '../../../../assets/js/utils/message';
import restoreInitDataByOrigin from '../../../../assets/js/utils/reduction';

export default class ReviewAllocationItemClass {
  IsDistributionSelf = false

  OffLineDistributionGroupList = []

  OtherOrderDistributionGroupList = []

  constructor(data) {
    restoreInitDataByOrigin(this, data);
  }

  checker() {
    if (this.IsDistributionSelf && this.OffLineDistributionGroupList.length === 0) {
      messageBox.failSingleError('保存失败', '未设置代客下单人员不在线时要分配的审稿组');
      return false;
    }
    if (this.OtherOrderDistributionGroupList.length === 0) {
      const title = this.IsDistributionSelf ? '其它订单' : '订单';
      messageBox.failSingleError('保存失败', `未设置${title}分配审稿组`);
      return false;
    }
    return true;
  }

  static getDisplayContent(item) {
    let str = '';
    if (item) {
      const { IsDistributionSelf, OtherOrderDistributionGroupList } = item;
      if (IsDistributionSelf) {
        str += '代客下单分配给下单人员，';
      }
      if (Array.isArray(OtherOrderDistributionGroupList)) {
        const names = OtherOrderDistributionGroupList.filter(it => it && it.Name).map(it => it.Name).join('、');
        if (names) {
          const label = IsDistributionSelf ? '其他订单分配给：' : '全部订单分配给：';
          str += `${label}${names}`;
        }
      }
    }
    if (!str) str = ' --';
    return str;
  }
}
