export default class CraftPeriodClass {
  // eslint-disable-next-line max-len
  constructor({ PeriodID = '', ID = '', CraftList = [], Constraint = undefined, Duration = '', IsSignle = false, Index = 0, CraftPeriodProppertyList }) {
    this.PeriodID = PeriodID;
    this.ID = ID;
    this.CraftList = CraftList;
    if (IsSignle) {
      if (Constraint) {
        this.Constraint = JSON.parse(JSON.stringify(Constraint));
      } else {
        this.Constraint = { FilterType: 1, ItemList: [] };
      }
      this.CraftPeriodProppertyList = CraftPeriodProppertyList || [];
    }
    this.Duration = Duration;
    this.DurationDay = this.Duration ? Math.floor(this.Duration / 24) : '';
    this.DurationHour = this.Duration ? Math.floor(this.Duration % 24) : '';
    this.IsSignle = IsSignle;
    this.Index = Index;
  }

  static check(obj) {
    if (obj.CraftList.length === 0) return '请选择工艺';
    // if (obj.IsSignle && obj.Constraint && obj.Constraint.ItemList) {
    //   const t = obj.Constraint.ItemList.find(it => !it.Value);
    //   if (t) return '其它条件中有值未填写';
    // }
    if (!obj.Duration || obj.Duration <= 0) return '请设置工期时间';
    return true;
  }

  static filter(obj) {
    const _obj = obj;
    delete _obj.DurationDay;
    delete _obj.DurationHour;
  }
}
