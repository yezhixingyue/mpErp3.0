import ProductSetupItemClass from './ProductSetupItemClass';
import getEnumList from '../../../assets/js/utils/getEnumList';

export const ReturnTypeEnums = {
  fixed: {
    ID: 0,
    Name: '按固定比例',
  },
  increase: {
    ID: 1,
    Name: '按递增方式',
  },
};

export const ReturnTypeEnumList = getEnumList(ReturnTypeEnums);

export default class {
  ReturnCashID = ''

  RangeList = []

  FundList = []

  key = ''

  ID = ''

  constructor(data) {
    if (data && typeof data === 'object') {
      const { ReturnCashID, RangeList, FundList, ID } = data;
      this.ReturnCashID = ReturnCashID;
      this.RangeList = RangeList.map(it => new ProductSetupItemClass(it));
      this.FundList = FundList;
      this.ID = ID || '';
    }
    // if (this.RangeList.length === 0) this.RangeList.push(new ProductSetupItemClass());
    // if (this.FundList.length === 0) this.FundList.push(new FundSetupItemClass());
    if (!this.ID) this.key = Math.random().toString(16).slice(-10);
  }
}
