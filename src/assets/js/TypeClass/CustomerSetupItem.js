import restoreClassByOriginData from '../utils/reduction';

export default class CustomerSetupItem {
  Type = ''

  CategoryID = ''

  CategoryName = ''

  Value = ''

  AllowRemove = true

  constructor(data) {
    restoreClassByOriginData(this, data);
    if (!data) this.key = Math.random().toString(16).slice(-10);
  }
}
