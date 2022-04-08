/* eslint-disable brace-style */
// import messageBox from '../../assets/js/utils/message';
import restoreInitDataByOrigin from '../../assets/js/utils/reduction';
import getEnumList from '../../assets/js/utils/getEnumList';
import { getValueIsOrNotNumber } from '../../assets/js/utils/util';
import PrintBeanTableItem from './PrintBeanTableItemClass';
import api from '../../api/index';

export const CategoryEnums = {
  CustomerType: {
    ID: 0,
    Name: '按客户类别',
  },
  Customer: {
    ID: 1,
    Name: '按单个客户',
  },
};

export const CategoryEnumsList = getEnumList(CategoryEnums);

/**
 * 印豆类
 *
 * @export
 * @class PrintBeanClass
 */
export default class PrintBeanClass {
  ID = ''

  Title = ''

  Describe = ''

  Priority = ''

  StartTime = '' // "2022-02-15T01:02:13.479Z" -> "2022-02-15" --- 需要转换

  EndTime = '' // --- 需要转换 -- 需校验开始时间不能大于结束时间

  _IsActiveOnLong = false; // 是否长期执行 是则没有结束时间 否则有结束时间 --- 需要转换

  Category = CategoryEnums.CustomerType.ID

  Customer = {
    CustomerID: '',
    CustomerName: '',
    CustomerSN: '',
    Mobile: '',
  }

  CustomerTypeList = [] // { ID: 0 , Name: 'string' }

  GradeList = [] // { ID: 0 , Name: 'string' }

  IsIncludeIncreasedArea = false

  AreaList = [] // 格式依照3.0格式含新增区域格式传递

  ItemList = []

  constructor(data) {
    if (data) {
      restoreInitDataByOrigin(this, data);
      const { StartTime, EndTime, ItemList } = data;
      if (StartTime && StartTime.length >= 19) this.StartTime = StartTime.slice(0, 19);
      if (EndTime && EndTime.length >= 19) this.EndTime = EndTime.slice(0, 19);
      if (!EndTime) this._IsActiveOnLong = true;
      if (Array.isArray(ItemList)) this.ItemList = ItemList.map(it => new PrintBeanTableItem(it));
    }
  }

  checker(DataList) {
    let msg = '';
    if (!getValueIsOrNotNumber(this.Priority, true) || this.Priority < 0) {
      msg = '优先级不正确（ 应为0或正整数 ）';
    }
    else if (!this.Title) {
      msg = '请输入标题';
    }
    else if (Array.isArray(DataList) && DataList.some(it => it.Title === this.Title && it.ID !== this.ID)) {
      msg = '标题不能重复';
    }
    else if (!this.Describe) {
      msg = '请输入描述';
    }
    else if (!this.StartTime) {
      msg = '请设置开始时间';
    }
    else if (new Date(this.StartTime) < new Date() && !this.ID) {
      msg = '开始时间不能晚于当前时间';
    }
    else if (!this._IsActiveOnLong && !this.EndTime) {
      msg = '请设置结束时间';
    }
    else if (!this._IsActiveOnLong && new Date(this.StartTime) >= new Date(`${this.EndTime.slice(0, 16)}:59`)) {
      msg = '结束时间应晚于开始时间';
    }
    else if (this.Category === CategoryEnums.Customer.ID && (!this.Customer || !this.Customer.CustomerID)) { // 单个客户
      msg = '请选择客户';
    }
    else if (this.Category === CategoryEnums.CustomerType.ID) {
      if (this.CustomerTypeList.length === 0) {
        msg = '请选择客户类型';
      } else if (this.GradeList.length === 0) {
        msg = '请选择客户等级';
      } else if (this.AreaList.length === 0) {
        msg = '请选择销售区域';
      }
    }
    if (!msg && this.ItemList.length === 0) {
      msg = '请设置印豆条目信息';
    }
    return { result: !msg, error: msg };
  }

  transfromToSubmit() {
    const temp = {
      ...this,
      StartTime: `${this.StartTime.slice(0, 16)}:00`,
      EndTime: this._IsActiveOnLong ? null : `${this.EndTime.slice(0, 16)}:59`,
    };
    delete temp._IsActiveOnLong;
    if (temp.Category === CategoryEnums.Customer.ID) {
      delete temp.CustomerTypeList;
      delete temp.GradeList;
      delete temp.AreaList;
      delete temp.IsIncludeIncreasedArea;
    } else if (temp.Category === CategoryEnums.CustomerType.ID) {
      delete temp.Customer;
    }
    return temp;
  }

  async submit() {
    const _data = this.transfromToSubmit();
    const _temp = { ..._data };
    if (_temp.Category === CategoryEnums.Customer.ID) {
      _temp.Customer = { CustomerID: _data.Customer.CustomerID };
    }
    const resp = await api.getPrintBeanSave(_temp).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      return {
        result: true,
        itemData: { ..._data, ID: resp.data.Data },
      };
    }
    return { result: false, itemData: null };
  }
}
