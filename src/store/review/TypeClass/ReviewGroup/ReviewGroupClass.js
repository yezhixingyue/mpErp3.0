import restoreInitDataByOrigin from '../../../../assets/js/utils/reduction';
import messageBox from '../../../../assets/js/utils/message';
import api from '../../../../api';

export default class ReviewGroupClass {
  TotalNumber = 0

  OnlineNumber = 0 // 在线人数

  StopDistributionNumber = 0 // 停止分配人数

  ID = ''

  Name = ''

  originData = null

  constructor(data) {
    restoreInitDataByOrigin(this, data);
    this.originData = data || null;
  }

  checker(list) {
    if (!this.Name && this.Name !== 0) {
      messageBox.failSingleError('保存失败', '未设置组名称');
      return false;
    }
    // if (this.originData && this.originData.Name === this.Name) {
    //   messageBox.failSingleError('保存失败', '数据未改动');
    //   return false;
    // }
    if (Array.isArray(list) && list.length > 0) {
      const t = list.find(it => it.ID !== this.ID && it.Name === this.Name);
      if (t) {
        messageBox.failSingleError('保存失败', '组名称不能重复，请检查');
        return false;
      }
    }
    return true;
  }

  async save(cb) {
    const resp = await api.getMemberGroupSave(this).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      const title = this.ID ? '修改成功' : '添加成功';
      if (!this.ID) this.ID = resp.data.Data;
      const callback = () => {
        if (cb) cb(this);
      };
      messageBox.successSingle(title, callback, callback);
    }
  }
}
