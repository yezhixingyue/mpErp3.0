import restoreInitDataByOrigin from '../../utils/reduction';

export default class LogisticItem {
  ID = ''

  Name = ''

  // 分类 自建|物流|快递等
  Type = ''

  // 是否启用
  IsEnabled = false

  // 关联物流配送的网点信息
  StationSN = ''

  StationName = ''

  constructor(data) {
    restoreInitDataByOrigin(this, data);
  }
}
