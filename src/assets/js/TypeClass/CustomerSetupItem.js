import restoreInitDataByOrigin from '../utils/reduction';

export default class CustomerSetupItem {
  Type = ''

  CategoryID = ''

  CategoryName = ''

  Value = ''

  AllowRemove = true

  PermissionList = []

  constructor(data) {
    restoreInitDataByOrigin(this, data);
    if (!data) this.key = Math.random().toString(16).slice(-10);
  }
}
