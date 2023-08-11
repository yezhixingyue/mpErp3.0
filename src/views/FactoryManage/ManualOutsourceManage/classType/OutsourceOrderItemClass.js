import api from '../../../../api';
import messageBox from '../../../../assets/js/utils/message';
import restoreInitDataByOrigin from '../../../../assets/js/utils/reduction';
import { CheckFileOrderStatusEnumObj, CheckFileOrderStatusEnumList } from './EnumList';

const localToFixed = (num) => {
  const _num = +num;
  const str = _num.toFixed(2);
  if (str === 'NaN') return num;
  return str;
};
export default class OutsourceOrderItemClass {
  OrderID = ''

  ProductName = ''

  HaveNumber = true

  ProductAmount = ''

  Unit = ''

  HaveKind = true

  KindCount = ''

  ClassList = []

  SizeList = []

  CraftList = []

  Funds = {
    FinalPrice: '',
    OutPrice: '',
  }

  ProducePeriod = null // 手动赋值

  PayTime = '' // 付款时间

  CheckFileStatus = '' // 外协状态

  Factory = {
    ID: '',
    Name: '',
  }

  _InitialOutPrice = ''

  get _outPrice() {
    return this.Funds.OutPrice;
  }

  set _outPrice(val) {
    this.Funds.OutPrice = val === '' ? val : localToFixed(val);
  }

  get _canComfirm() {
    return this.CheckFileStatus === CheckFileOrderStatusEnumObj.WaitSendFactory.ID;
  }

  get _canCancel() {
    return this.CheckFileStatus === CheckFileOrderStatusEnumObj.OutsourceComfirm.ID;
  }

  get _canForceCancel() {
    return this.CheckFileStatus === CheckFileOrderStatusEnumObj.HaveSendFactory.ID;
  }

  get _statusText() {
    const t = CheckFileOrderStatusEnumList.find(it => it.ID === this.CheckFileStatus);
    return t ? t.Name : '';
  }

  constructor(data) {
    restoreInitDataByOrigin(this, data);
    if (data.ProducePeriod) {
      this.ProducePeriod = data.ProducePeriod;
    }
    if (data && data.Funds) {
      if (typeof data.Funds.OutPrice === 'number') {
        this._InitialOutPrice = data.Funds.OutPrice;
        this._outPrice = data.Funds.OutPrice;
      }
      if (typeof data.Funds.FinalPrice === 'number') {
        this.Funds.FinalPrice = localToFixed(data.Funds.FinalPrice);
      }
    }

    if (this.CheckFileStatus === '' && typeof data.CheckFileStatus === 'number') {
      this.CheckFileStatus = data.CheckFileStatus;
    }
  }

  async changeFactory(id) {
    if (!id && id !== 0) return;
    const temp = {
      FactoryID: id,
      OrderList: [this.OrderID],
    };
    const resp = await api.getOutOrderChangeFactory(temp).catch(() => null);
    if (resp?.data?.Status === 1000) {
      this.Factory.ID = id;
    }
  }

  async changeOutPrice() { // 修改价格
    let price = this._outPrice;
    const initialPrice = this._InitialOutPrice;

    if (price && (price === initialPrice || +price === initialPrice)) { // 没有变化
      this._outPrice = price;
      return;
    }

    const changeFailFunc = () => {
      this._outPrice = initialPrice;
    };
    if (price === '') {
      changeFailFunc();
      // messageBox.failSingleError('价格更改失败', '输入的值为空', changeFailFunc, changeFailFunc);
      return;
    }
    if (Number.isNaN(+price)) {
      messageBox.failSingleError('价格更改失败', '输入的值不是有效的数字', changeFailFunc, changeFailFunc);
      return;
    }

    price = +price;
    const [, float] = `${price}`.split('.');
    if (float && float.length > 2) {
      messageBox.failSingleError('价格更改失败', '价格最多允许两位小数', changeFailFunc, changeFailFunc);
      return;
    }
    const resp = await api.getOutOrderChangePrice(this.OrderID, price).catch(() => null);
    if (!resp || !resp.data) {
      changeFailFunc();
    } else if (resp.data.Status !== 1000) {
      messageBox.failSingleError('价格更改失败', `[ ${resp?.data?.Message || '服务器通信失败'} ]`, changeFailFunc, changeFailFunc);
    } else {
      this._outPrice = price;
      this._InitialOutPrice = price;
    }
  }
}
