export default class Condition4InvoiceMakeUpList {
  Page = 1

  PageSize = 20

  setCondition([[key1, key2], value]) {
    if (!key1) return;
    if (!key2) {
      this[key1] = value;
    } else {
      this[key1][key2] = value;
    }
  }
}
