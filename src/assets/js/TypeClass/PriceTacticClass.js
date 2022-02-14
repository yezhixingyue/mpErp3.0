import api from '../../../api';

const _setAsideList = Symbol('setAsideList');

/**
 * 销售价格默认值 枚举列表
 */
export const DefaultPriceEmuns = {
  OnSellPrice: {
    ID: 1,
    Name: '在售价格',
  },
  FuturePrice: {
    ID: 2,
    Name: '将来的价格',
  },
  CopyPrice: {
    ID: 3,
    Name: '复制价格',
  },
  NonePrice: {
    ID: 4,
    Name: '无价格',
  },
};

const transformToSubmit = obj => {
  if (typeof obj === 'object') {
    const { DefaultPrice, CustomerGradeID, ActivateTime, PolicyTableList } = obj;
    const temp = {
      ActivateTime: ActivateTime ? `${ActivateTime.slice(0, 10)}T00:00:00` : ActivateTime,
      CustomerGradeID,
      DefaultPrice,
      PolicyList: PolicyTableList.map(({ PercentValue, ProductClass }) => ({ ProductClass, PercentValue: +PercentValue })),
    };
    return temp;
  }
  return null;
};

/**
 * 类 - 价格策略
 */
export default class PriceTactic {
  CustomerGradeID = '' // 当前客户等级ID

  ActivateTime = '' // 顶部生效时间

  DefaultPrice = ''

  PolicyTableList = [];

  AsideList = [];

  constructor(PricePolicyData, CoverageList, userRankList, classifyList) {
    if (PricePolicyData) {
      const { CustomerGradeID, ActivateTime, DefaultPrice, PolicyList } = PricePolicyData;
      this.CustomerGradeID = CustomerGradeID;
      this.ActivateTime = ActivateTime ? ActivateTime.slice(0, 10) : ActivateTime;
      this.DefaultPrice = DefaultPrice;
      this.setPolicyTableList(PolicyList, classifyList);
    }
    this[_setAsideList](CoverageList, userRankList);
  }

  [_setAsideList](CoverageList, userRankList) { // 设置侧边等级列表数据
    if (Array.isArray(CoverageList) && Array.isArray(userRankList)) {
      const list = userRankList.map(it => {
        const { CategoryID, CategoryName } = it;
        let HaveActivatePolicy = false;
        let FutureTime = '';
        const t = CoverageList.find(_it => _it.RuleID === CategoryID);
        if (t) {
          FutureTime = t.FutureTime ? t.FutureTime.slice(0, 10) : '';
          HaveActivatePolicy = t.HaveActivatePolicy;
        }
        return {
          CategoryID,
          CategoryName,
          HaveActivatePolicy,
          FutureTime,
        };
      });
      this.AsideList = list;
    }
  }

  setPolicyTableList(PolicyList, classifyList) { // 设置表体数据
    if (!Array.isArray(PolicyList) || !Array.isArray(classifyList)) return;
    const list = PolicyList.map(it => {
      const { Key, Value } = it.ProductClass;
      let FirstLevelName = '';
      let SecondLevelName = '';
      const t = classifyList.find(_it => _it.ID === Key);
      if (t) {
        FirstLevelName = t.ClassName;
        const t2 = t.children.find(_it => _it.ID === Value);
        if (t2) SecondLevelName = t2.ClassName;
      }
      return { ...it, FirstLevelName, SecondLevelName };
    });
    this.PolicyTableList = list;
  }

  static transformToSubmit(obj) {
    if (typeof obj === 'object') {
      const { DefaultPrice, CustomerGradeID, ActivateTime, PolicyTableList } = obj;
      const temp = {
        ActivateTime: ActivateTime ? `${ActivateTime.slice(0, 10)}T00:00:00` : ActivateTime,
        CustomerGradeID,
        DefaultPrice,
        PolicyList: PolicyTableList.map(({ PercentValue, ProductClass }) => ({ ProductClass, PercentValue: +PercentValue })),
      };
      return temp;
    }
    return null;
  }

  static async submit(obj) {
    const temp = transformToSubmit(obj);
    if (temp) {
      const resp = await api.getCustomerPricePolicySetup(temp).catch(() => null);
      return resp && resp.data.Status === 1000;
    }
    return false;
  }
}
