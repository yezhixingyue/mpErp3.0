import api from '@/api/index';
import ConditonClass4ListData from './ConditonClass4ListData';
import CommonClassType from '../CommonClassType';

export default class PrintBeanListClass {
  DataList = []

  DataNumber = 0

  Condition = new ConditonClass4ListData()

  loading = false

  /**
   * 设置列表数据
   *
   * @param {*} [list, num]
   * @memberof PrintBeanListClass
   */
  setList([list, num]) {
    this.DataList = list;
    if (typeof num === 'number') this.DataNumber = num;
  }

  setCondition([[key1, key2], value]) {
    if (!key2) this.Condition[key1] = value;
    else this.Condition[key1][key2] = value;
  }

  setLoading(bool) {
    this.loading = bool;
  }

  clearCondition() {
    this.Condition = new ConditonClass4ListData();
  }

  /**
   * 编辑|新增|删除 列表条目
   *
   * @param {*} [item, isEdit]
   * @memberof PrintBeanListClass
   */
  setItemChange({ item, isEdit, isRemove, index }) {
    if (!isRemove && !isEdit) { // 新增
      this.DataList.unshift(item);
      this.DataNumber += 1;
      return;
    }
    let _index = index;
    if (_index < 0 && item) _index = this.DataList.findIndex(it => it.ID === item.ID);

    if (_index > -1) {
      if (isEdit && item) { // 编辑
        this.DataList.splice(_index, 1, item);
      } else if (isRemove) { // 删除
        this.DataList.splice(_index, 1);
        this.DataNumber -= 1;
      }
    }
  }

  /**
   * 获取列表数据
   *
   * @param {*} setLoading
   * @param {*} setDataList
   * @memberof PrintBeanListClass
   */
  async getList(setLoading, setDataList) {
    const temp = CommonClassType.filter(this.Condition, true);
    setLoading(true);
    const resp = await api.getPrintBeanList(temp).catch(() => null);
    setLoading(false);
    if (resp && resp.data.Status === 1000) {
      setDataList([resp.data.Data, resp.data.DataNumber]);
    }
  }
}
