
export default class SchemaItemClass {
  // eslint-disable-next-line max-len
  constructor({ PeriodID = '', ID = '', IncludeLimitArea = true, AreaList = [], ExpressList = [], LatestPayTime = { First: '', Second: '' }, Constraint = undefined,
    ProduceDuration = '', ProductIncrement = '', ProductIncrementDuration = '', CraftPeriodType = 0,
    DeliveryDuration = '', CraftIncrement = '', CraftIncrementDuration = '', IncludeExpress = true }) {
    this.PeriodID = PeriodID;
    this.ID = ID;
    this.IncludeLimitArea = IncludeLimitArea;
    this.AreaList = AreaList;
    this.ExpressList = ExpressList;
    this.LatestPayTime = LatestPayTime;
    if (Constraint) {
      this.Constraint = JSON.parse(JSON.stringify(Constraint));
      this.Constraint.ItemList.forEach(it => {
        if (!it.selfID) {
          const _it = it;
          _it.selfID = `${Math.random()}`.substring(2);
        }
      });
    } else {
      this.Constraint = { FilterType: 1, ItemList: [] };
    }
    this.ProduceDuration = ProduceDuration;
    this.ProduceDurationDay = this.ProduceDuration ? Math.floor(this.ProduceDuration / 24) : '';
    this.ProduceDurationHour = this.ProduceDuration ? Math.floor(this.ProduceDuration % 24) : '';
    this.DeliveryDuration = DeliveryDuration;
    this.DeliveryDurationDay = this.DeliveryDuration ? Math.floor(this.DeliveryDuration / 24) : '';
    this.DeliveryDurationHour = this.DeliveryDuration ? Math.floor(this.DeliveryDuration % 24) : '';
    this.ProductIncrement = ProductIncrement;
    this.ProductIncrementDuration = ProductIncrementDuration;
    this.CraftPeriodType = CraftPeriodType;
    this.CraftIncrement = CraftIncrement;
    this.CraftIncrementDuration = CraftIncrementDuration;
    this.IncludeExpress = IncludeExpress;
  }

  static check(obj) {
    if (obj.AreaList.length === 0 && obj.IncludeLimitArea) return '请选择区域';
    if (obj.ExpressList.length === 0) return '请选择配送方式';
    if (!obj.LatestPayTime.First && obj.LatestPayTime.First !== 0) return '请设置付款时间';
    if (!obj.LatestPayTime.Second && obj.LatestPayTime.Second !== 0) return '请设置付款时间';
    // const t = obj.Constraint.ItemList.find(it => !it.Value && it.Value !== 0);
    // if (t) return '其它条件中有值未填写';
    if (!obj.ProduceDuration || obj.ProduceDuration <= 0) return '请设置生产工期时间';
    if (obj.ProductIncrement && +obj.ProductIncrement === 0) return '数量递增 - 产品数量应大于0';
    if (obj.ProductIncrementDuration && +obj.ProductIncrementDuration === 0) return '数量递增 - 工期时间应大于0';
    if (obj.ProductIncrement && !obj.ProductIncrementDuration) return '请设置数量递增 - 工期时间';
    if (!obj.ProductIncrement && obj.ProductIncrementDuration) return '请设置数量递增 - 产品数量';
    if (obj.CraftPeriodType === 3) {
      if (obj.CraftIncrement && +obj.CraftIncrement === 0) return '工艺工期 - 工艺种类数量应大于0';
      if (obj.CraftIncrementDuration && +obj.CraftIncrementDuration === 0) return '工艺工期 - 工期时间应大于0';
      if (!obj.CraftIncrement) return '请设置工艺工期 - 工艺种类数量';
      if (!obj.CraftIncrementDuration) return '请设置工艺工期 - 工期时间';
    }
    if (obj.IncludeExpress) {
      if (!obj.DeliveryDuration || obj.DeliveryDuration <= 0) return '请设置配送工期时间';
    }
    return true;
  }

  static filter(obj) {
    const _obj = obj;
    delete _obj.ProduceDurationDay;
    delete _obj.ProduceDurationHour;
    delete _obj.DeliveryDurationDay;
    delete _obj.DeliveryDurationHour;
    if (!obj.IncludeExpress) {
      delete _obj.DeliveryDuration;
    }
    if (obj.CraftPeriodType === 3) {
      delete _obj.CraftIncrement;
      delete _obj.CraftIncrementDuration;
    }
  }
}
