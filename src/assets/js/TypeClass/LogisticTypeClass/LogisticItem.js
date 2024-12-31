import restoreInitDataByOrigin from '../../utils/reduction';

export default class LogisticItem {
  ID = ''

  Name = ''

  // 分类 自建|物流|快递等
  Type = ''

  // 可用平台 拼多多订单|淘宝订单|京东订单|线下订单
  PlatformTypes = []

  // 下单提示
  PlaceOrderTip = ''

  // 是否启用
  IsEnabled = false

  // 关联物流配送信息
  StationSN = '' // 网点编号

  StationName = ''

  DistrictSN = '' // 片区编号

  DistrictName = ''

  RecordCount = 0

  // 关联快印仓产品
  ExpressProductID = ''

  // 关联快递打单列表
  RelationList = []

  constructor(data) {
    restoreInitDataByOrigin(this, data);
    this.RelationList = this.RelationList.map(it => ({ ...it, key: Math.random().toString(16).slice(-10) }));
  }
}
