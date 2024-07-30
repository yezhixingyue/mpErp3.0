import { MpMessage } from '@/assets/js/utils/MpMessage';
import api from '../../../../api';
import messageBox from '../../../../assets/js/utils/message';
import restoreInitDataByOrigin from '../../../../assets/js/utils/reduction';
import { CheckFileOrderStatusEnumObj, CheckFileOrderStatusEnumList } from './EnumList';
import { IOutsourceProgress } from './type';

const localToFixed = (num) => {
  const _num = +num;
  const str = _num.toFixed(2);
  if (str === 'NaN') return num;
  return +str;
};
export default class OutsourceOrderItemClass {
  OrderID = ''

  ProductName = ''

  Content = ''

  Checker = ''

  HaveNumber = true

  ProductAmount = ''

  Unit = ''

  HaveKind = true

  KindCount = ''

  ClassList = []

  // SizeList = []

  // CraftList = []

  Funds: { FinalPrice: '' | number; OutPrice: '' | number } = {
    FinalPrice: '',
    OutPrice: '',
  }

  ProducePeriod = null // 手动赋值

  PayTime = '' // 付款时间

  CheckFileStatus: number | '' = '' // 外购状态

  Factory = {
    ID: '',
    Name: '',
  }

  Describe = '' // 文件下载名称

  _InitialOutPrice: number | '' = ''

  get _outPrice() {
    return this.Funds.OutPrice;
  }

  set _outPrice(val) {
    this.Funds.OutPrice = val === '' ? val : localToFixed(val);
  }

  get _canChangePriceFactory() { // 是否可以更改价格和工厂
    if (this.CheckFileStatus === '' || this._isVisible) return false;
    return [CheckFileOrderStatusEnumObj.WaitSendFactory.ID, CheckFileOrderStatusEnumObj.OutsourceComfirm.ID].includes(this.CheckFileStatus);
  }

  get _canComfirm() { // 可外购
    return this.CheckFileStatus === CheckFileOrderStatusEnumObj.WaitSendFactory.ID;
  }

  get _canHelpOrder() { // 可代为接单
    return this.CheckFileStatus === CheckFileOrderStatusEnumObj.OutsourceComfirm.ID;
  }

  // get _canCancel() {
  //   return this.CheckFileStatus === CheckFileOrderStatusEnumObj.OutsourceComfirm.ID;
  // }

  get _canForceCancel() {
    return this.CheckFileStatus === CheckFileOrderStatusEnumObj.HaveSendFactory.ID;
  }

  get _status() {
    return CheckFileOrderStatusEnumList.find(it => it.ID === this.CheckFileStatus);
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

  private _isVisible = false

  changeFactory(id, factorys) { // 更改工厂
    if (!id && id !== 0) return;

    const target = factorys.find(it => it.FactoryID === id);

    if (!target) return;

    this._isVisible = true;

    const onclose = () => {
      this._isVisible = false;
    };

    const callback = async () => {
      const temp = {
        FactoryID: id,
        OrderList: [this.OrderID],
      };

      const resp = await api.getOutOrderChangeFactory(temp).catch(() => null);

      if (resp?.data?.Status === 1000) {
        const cb = () => {
          this.Factory.ID = id;
          this.Factory.Name = target.FactoryName;
        };
        cb();
        MpMessage.success({
          title: '工厂变更成功',
        });
      }

      onclose();
    };

    MpMessage.confirm({
      title: `该订单将由 <i class='is-pink factory-change-title'>${this.Factory.Name}</i> 变更为 <i class='is-blue factory-change-title'>${target.FactoryName}</i>`,
      msg: '请确定是否确定执行',
      onOk: callback,
      onCancel: onclose,
    });
  }

  async changeOutPrice() { // 修改价格
    let price = this._outPrice;
    const initialPrice = this._InitialOutPrice;

    if (price && (price === initialPrice || +price === initialPrice)) { // 没有变化
      this._outPrice = price;
      return;
    }

    const creatPromise = (title: string, msg: string) => new Promise((resolve) => {
      const changeFailFunc = () => {
        this._outPrice = initialPrice;
        resolve(true);
      };

      messageBox.failSingleError(title, msg, changeFailFunc, changeFailFunc);
    });

    const changeFailFunc = () => {
      this._outPrice = initialPrice;
    };

    if (price === '') {
      await creatPromise('价格更改失败', '外购价格不能为空，请填写外购价格');
      return;
    }

    if (Number.isNaN(+price)) {
      await creatPromise('价格更改失败', '输入的值不是有效的数字');
      return;
    }

    price = +price;
    const [, float] = `${price}`.split('.');
    if (float && float.length > 1) {
      messageBox.failSingleError('价格更改失败', '价格最多允许1位小数', changeFailFunc, changeFailFunc);
      await creatPromise('价格更改失败', '价格最多允许1位小数');
      return;
    }

    const resp = await api.getOutOrderChangePrice(this.OrderID, price).catch(() => null);

    if (!resp || !resp.data) {
      changeFailFunc();
    } else if (resp.data.Status !== 1000) {
      await creatPromise('价格更改失败', `[ ${resp?.data?.Message || '服务器通信失败'} ]`);
    } else {
      this._outPrice = price;
      this._InitialOutPrice = price;
    }
  }

  ProgressRecordList: IOutsourceProgress[] = []

  /** 获取当前订单进度列表数据 */
  async getProgressRecordList() {
    this.ProgressRecordList = [];
    const resp = await api.getOutOrderProgress(this.OrderID).catch(() => null);
    if (resp?.data?.Status === 1000) {
      this.ProgressRecordList = resp.data.Data || [];
    }
  }

  OrderDetail = null

  /** 获取订单详情 */
  async getOrderDetail() {
    this.OrderDetail = null;
    const resp = await api.getOrderDetail(this.OrderID).catch(() => null);
    if (resp?.data?.Status === 1000) {
      this.OrderDetail = resp.data.Data;
    }
  }
}
