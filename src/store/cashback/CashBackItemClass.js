import { CategoryEnums } from '../printBean/PrintBeanClassType';
import restoreInitDataByOrigin from '../../assets/js/utils/reduction';
import getEnumList from '../../assets/js/utils/getEnumList';
import messageBox from '../../assets/js/utils/message';
import { getValueIsOrNotNumber } from '../../assets/js/utils/util';
import CashBackRightItemClass from './CashBackRightItemClass';
import ProductSetupItemClass from './CashBackRightItemClass/ProductSetupItemClass';
import PropertyClass from '../../assets/js/TypeClass/PropertyClass';

export const CycleEnums = {
  Month: {
    ID: 0,
    Name: '按月',
  },
  Year: {
    ID: 1,
    Name: '按年',
  },
};

export const CycleEnumList = getEnumList(CycleEnums);

export default class {
  ID = ''

  Title = ''

  Describe = ''

  Priority = ''

  StartTime = '' // "2022-02-15T01:02:13.479Z" -> "2022-02-15" --- 需要转换

  _IsActiveOnLong = false; // 是否长期执行 是则没有结束时间 否则有结束时间 --- 需要转换

  _ExecutionTime = { // 执行时长
    First: '',
    Second: '',
  }

  PeriodType = CycleEnums.Month.ID

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

  Duration = ''

  AreaList = [] // 格式依照3.0格式含新增区域格式传递

  ItemList = []

  _allPropertyList = []

  constructor(data) {
    if (data) {
      restoreInitDataByOrigin(this, data);
      const { StartTime, Duration, ItemList } = data;
      if (StartTime && StartTime.length >= 19) this.StartTime = StartTime.slice(0, 19);
      if (!Duration && Duration !== 0) this._IsActiveOnLong = true;
      if (getValueIsOrNotNumber(Duration, true) && Duration >= 0) {
        const y = Math.floor(Duration / 12);
        const m = Duration % 12;
        this._ExecutionTime.First = y;
        this._ExecutionTime.Second = m;
      }
      if (Array.isArray(ItemList)) {
        this.ItemList = ItemList.map(it => new CashBackRightItemClass(it));
      }
    }
  }

  check(list) { // 右侧未添加校验
    if (!this.Priority && this.Priority !== 0) {
      messageBox.failSingleError('保存失败', '请设置优先级');
      return false;
    }
    if (!getValueIsOrNotNumber(this.Priority, true) || this.Priority < 0) {
      messageBox.failSingleError('保存失败', '优先级必须为大于等于0的整数类型');
      return false;
    }
    if (!this.Title) {
      messageBox.failSingleError('保存失败', '请设置标题');
      return false;
    }
    if (Array.isArray(list) && list.some(it => it.Title === this.Title && it.ID !== this.ID)) {
      messageBox.failSingleError('保存失败', '标题不能重复');
      return false;
    }
    if (!this.Describe) {
      messageBox.failSingleError('保存失败', '请填写描述内容');
      return false;
    }
    if (!this.StartTime) {
      messageBox.failSingleError('保存失败', '请设置开始时间');
      return false;
    }
    if (new Date(this.StartTime) < new Date(new Date().toLocaleDateString()) && !this.ID) {
      messageBox.failSingleError('保存失败', '开始时间不能晚于当前时间');
      return false;
    }
    if (!this._IsActiveOnLong) {
      if ((!this._ExecutionTime.First && this._ExecutionTime.First !== 0) && (!this._ExecutionTime.Second && this._ExecutionTime.Second !== 0)) { // 年 月都未设置
        messageBox.failSingleError('保存失败', '请设置执行时长');
        return false;
      }
      if (this._ExecutionTime.First && (!getValueIsOrNotNumber(this._ExecutionTime.First, true) || this._ExecutionTime.First < 0)) {
        messageBox.failSingleError('保存失败', '执行时长[年]设置不正确');
        return false;
      }
      if (this._ExecutionTime.Second && (!getValueIsOrNotNumber(this._ExecutionTime.Second, true) || this._ExecutionTime.Second < 0)) {
        messageBox.failSingleError('保存失败', '执行时长[月]设置不正确');
        return false;
      }
      // if (!this._ExecutionTime.First && !this._ExecutionTime.Second) {
      //   messageBox.failSingleError('保存失败', '执行时长必须大于0');
      //   return false;
      // }
      // if (this.PeriodType === CycleEnums.Year.ID) { // 需要这样判断吗？  -- 先注释
      //   const num = +this._ExecutionTime.First * 12 + +this._ExecutionTime.Second;
      //   if (num < 12) {
      //     messageBox.failSingleError('保存失败', '统计周期按年时，执行时长应至少为1年或12个月');
      //     return false;
      //   }
      // }
    }
    if (this.Category === CategoryEnums.Customer.ID && (!this.Customer || !this.Customer.CustomerID)) { // 单个客户
      messageBox.failSingleError('保存失败', '请选择客户');
      return false;
    }
    if (this.Category === CategoryEnums.CustomerType.ID) {
      if (this.CustomerTypeList.length === 0) {
        messageBox.failSingleError('保存失败', '请选择客户类型');
        return false;
      } if (this.GradeList.length === 0) {
        messageBox.failSingleError('保存失败', '请选择客户等级');
        return false;
      } if (this.AreaList.length === 0) {
        messageBox.failSingleError('保存失败', '请选择销售区域');
        return false;
      }
    }
    if (this.ItemList.length === 0) {
      messageBox.failSingleError('保存失败', '请添加返现规则');
      return false;
    }
    if (this.ItemList.some(it => it.RangeList.length === 0 || it.FundList.length === 0)) {
      messageBox.failSingleError('保存失败', '返现规则设置不完整，请检查');
      return false;
    }

    return true;
  }

  transfromToSubmit() {
    const temp = {
      ...this,
      StartTime: `${this.StartTime.slice(0, 16)}:00`,
    };
    if (this._IsActiveOnLong) {
      temp.Duration = '';
    } else {
      const { First, Second } = temp._ExecutionTime;
      let num = 0;
      if (getValueIsOrNotNumber(First, true) && First > 0) {
        num += +First * 12;
      }
      if (getValueIsOrNotNumber(Second, true) && Second > 0) {
        num += +Second;
      }
      temp.Duration = num;
    }
    delete temp._IsActiveOnLong;
    delete temp._ExecutionTime;
    if (temp.Category === CategoryEnums.Customer.ID) {
      delete temp.CustomerTypeList;
      delete temp.GradeList;
      delete temp.AreaList;
      delete temp.IsIncludeIncreasedArea;
    } else if (temp.Category === CategoryEnums.CustomerType.ID) {
      delete temp.Customer;
    }

    delete temp._allPropertyList;

    return temp;
  }

  addNewRightItem() {
    this.ItemList.push(new CashBackRightItemClass());
  }

  setProductRangeItemForRightItem(productRangeItem, index, level2Index) { // 设置右侧产品
    if (level2Index === -1) {
      // 添加
      this.ItemList[index].RangeList.push(new ProductSetupItemClass(productRangeItem));
    } else if (this.ItemList[index].RangeList[level2Index]) {
      // 编辑
      const { ProductClassList, IsIncludeIncreasedProduct } = productRangeItem;
      this.ItemList[index].RangeList[level2Index].ProductClassList = ProductClassList;
      this.ItemList[index].RangeList[level2Index].IsIncludeIncreasedProduct = IsIncludeIncreasedProduct;
      this.ItemList[index].RangeList[level2Index].Constraint = null; // 编辑产品时清空筛选条件
    }
  }

  removeProductRangeItemForRightItem(index, level2Index) {
    this.ItemList[index].RangeList.splice(level2Index, 1);
  }

  setFundItemForRightItem(fundItemData, index, level2Index) { // 设置右侧返现
    if (level2Index === -1) {
      // 添加
      this.ItemList[index].FundList.push(fundItemData);
    } else if (this.ItemList[index].FundList[level2Index]) {
      // 编辑
      this.ItemList[index].FundList.splice(level2Index, 1, fundItemData);
    }
  }

  removeFundItemForRightItem(index, level2Index) {
    this.ItemList[index].FundList.splice(level2Index, 1);
  }

  setConstraintForRightItem(Constraint, i, level2Index) {
    this.ItemList[i].RangeList[level2Index].Constraint = Constraint;
  }

  async getAllPropertyList() {
    const arr = [];
    if (Array.isArray(this.ItemList)) {
      const ids = [];
      this.ItemList.forEach(lv1 => {
        lv1.RangeList.forEach(lv2 => {
          let id = '';
          const { ProductClassList, IsIncludeIncreasedProduct, Constraint } = lv2;
          if (!IsIncludeIncreasedProduct && ProductClassList.length === 1) {
            const [{ IsIncludeIncreased, List }] = ProductClassList;
            if (!IsIncludeIncreased && List.length === 1) {
              if (!List[0].IsIncludeIncreased && List[0].List.length === 1) {
                id = List[0].List[0].ID;
              }
            }
          }
          if (!ids.includes(id) && Constraint) ids.push(id);
        });
      });
      if (ids.length > 0) {
        await Promise.all(ids.map(async id => {
          const temp = { UseModule: 49 };
          if (id) temp.ProductID = id;
          const res = await PropertyClass.getPropertyList(temp);
          if (res) {
            arr.push({ PropertyList: res, id });
          }
        }));
      }
    }
    return arr;
  }

  addItemToAllPropertyList(item) {
    this._allPropertyList.push(item);
  }
}
