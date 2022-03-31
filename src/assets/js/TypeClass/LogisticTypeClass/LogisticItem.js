import restoreInitDataByOrigin from '../../utils/reduction';

export default class LogisticItem {
  ID = ''

  Name = ''

  // 分类 自建|物流|快递等
  Type = ''

  // 是否启用
  IsEnabled = false

  // 关联物流配送信息
  StationSN = '' // 网点编号

  StationName = ''

  DistrictSN = '' // 片区编号

  DistrictName = ''

  // 关联快递打单列表
  RelationList = []

  constructor(data) {
    restoreInitDataByOrigin(this, data);
  }
}
