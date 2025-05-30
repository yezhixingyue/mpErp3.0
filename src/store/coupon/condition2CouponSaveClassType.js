import validateCheck from '@/assets/js/validator/validateCheck';
import messageBox from '@/assets/js/utils/message';

function showError(err) {
  messageBox.failSingle(err);
}

function checkDate(date1, date2, type, key) {
  // console.log(date1, date2, type);
  if (!key && (!date1.split('T')[0] || !date1.split('T')[1] || !date1.split('T')[1].split('.')[0])) {
    showError(`请输入优惠券${type}开始时间`);
    return false;
  }
  // new Date(new Date().toLocaleDateString()).getTime()
  const dateBegin = date1.replace('Z', '');
  const dateEnd = date2.replace('Z', '');
  if (!key && (new Date(dateBegin) - Date.now() < 0)) {
    showError(`${type}开始时间不能早于当前时间`);
    return false;
  }
  if (!dateEnd.split('T')[0] || !dateEnd.split('T')[1] || !dateEnd.split('T')[1].split('.')[0]) {
    showError(`请输入优惠券${type}结束时间`);
    return false;
  }
  if (new Date(dateEnd) <= new Date(dateBegin)) {
    showError(`${type}结束时间应当晚于开始时间`);
    return false;
  }
  return true;
}

export default class Condition2CouponSaveClassType {
    CouponID = '' // 优惠券ID

    Type = 1

    ApplyUser = { // 申请人
      StaffID: '',
    }

    ProvideStartTime = 'T00:00:00.000Z' // 优惠券发放时间

    ProvideEndTime = 'T23:59:59.997Z' // 优惠券结束领取时间

    Data = {
      Amount: '', // 金额
      MinPayAmount: '', // 满多少可用
      TotalNumber: '', // 发放数量
    }

    ProductList = [ // 产品
    ]

    StartNow = false

    ProvideNow = false

    ValidStartTime = 'T00:00:00.000Z' // 有效期开始时间

    ValidEndTime = 'T23:59:59.997Z' // 有效期结束时间

    CustomerTypeList = [ // 下单渠道
    ]

    GradeList = [ // 客户等级
    ]

    OrderTypeList = [ // 下单类型
    ]

    // SellAreaArray = [ // 区域
    // ]

    IsIncludeIncreasedArea = false // // 销售区域列表 是否包含新建区域

    AreaList = [] // // 销售区域列表

    IsIncludeIncreasedProduct = false;

    ProductClassList = [];

    IsCustomerReceive = false; // 是否允许客户领取

    MaxReceiveNumber = ''; // 客户最大领取数量

    UseNewCustomer = false; // 是否新人券

    SendNumber = ''; // 新人券数量

    constructor(data) {
      if (data) {
        this.backfill(data);
      }
    }

    static check(obj) {
      // 券的面值 满减金额 及 数量 校验
      const { Amount, MinPayAmount, TotalNumber } = obj.Data;
      const AmountRules = [
        {
          strategy: 'isNotEmpty',
          errorMsg: '请输入金额!',
        },
        {
          strategy: 'isNotNum',
          errorMsg: '金额应当为数字类型',
        },
        {
          strategy: 'Minimum:0',
          errorMsg: '金额不能小于0',
        },
      ];
      if (!validateCheck(Amount, AmountRules, showError)) return false;
      const MinPayAmountRules = [
        {
          strategy: 'isNotEmpty',
          errorMsg: '满多少可用值未设置!',
        },
        {
          strategy: 'isNotNum',
          errorMsg: '满多少可用值为数字类型',
        },
        {
          strategy: 'Minimum:0',
          errorMsg: '满多少可用值不能小于0',
        },
      ];
      if (!validateCheck(MinPayAmount, MinPayAmountRules, showError)) return false;
      const TotalNumberRules = [
        {
          strategy: 'isNotEmpty',
          errorMsg: '发放数量不能为空!',
        },
        {
          strategy: 'isPositiveInt',
          errorMsg: '发放数量应为正整数类型',
        },
      ];
      if (!validateCheck(TotalNumber, TotalNumberRules, showError)) return false;

      // 时间校验
      const {
        ProvideStartTime, ProvideEndTime, ValidStartTime, ValidEndTime, ProvideNow, StartNow,
      } = obj;

      if (!checkDate(ProvideStartTime, ProvideEndTime, '领取', ProvideNow)) return false;
      if (!checkDate(ValidStartTime, ValidEndTime, '有效期', StartNow)) return false;
      if (
        (new Date(ValidStartTime) < new Date(ProvideStartTime)) && !(ProvideNow && StartNow)
      ) {
        showError('有效期开始时间不能早于领取开始时间');
        return false;
      }
      if (new Date(ValidEndTime) < new Date(ProvideEndTime)) {
        showError('发放结束时间应早于有效期截至时间');
        return false;
      }

      if (!obj.ApplyUser.StaffID) {
        showError('请输入申请人');
        return false;
      }

      // if (obj.ProductList.length === 0) {
      //   showError('请添加活动商品');
      //   return false;
      // }
      if (obj.UseNewCustomer && !obj.SendNumber) {
        showError('请输入新人券发放数量');
        return false;
      }
      if (obj.OrderTypeList.length === 0) {
        showError('请选择下单渠道');
        return false;
      }
      if (obj.CustomerTypeList.length === 0) {
        showError('请选择客户类型');
        return false;
      }
      if (obj.GradeList.length === 0) {
        showError('请选择客户等级');
        return false;
      }

      const { IsCustomerReceive, MaxReceiveNumber } = obj;
      const MaxReceiveNumberRules = [
        {
          strategy: 'isNotEmpty',
          errorMsg: '请输入每个客户的最大可领取数量!',
        },
        {
          strategy: 'isNotNum',
          errorMsg: '客户最大可领取数量应当为数字类型',
        },
        {
          strategy: 'Minimum:0',
          errorMsg: '客户最大可领取数量不能小于0',
        },
        {
          strategy: 'isPositiveInt',
          errorMsg: '客户最大可领取数量应为正整数',
        },
      ];
      if (IsCustomerReceive && !validateCheck(MaxReceiveNumber, MaxReceiveNumberRules, showError)) return false;

      if (IsCustomerReceive && MaxReceiveNumber > TotalNumber) {
        showError('客户最大可领取数量已超出发放数量');
        return false;
      }

      if (obj.AreaList.length === 0) {
        showError('请选择销售区域');
        return false;
      }

      if (obj.ProductClassList.length === 0) {
        showError('请选择销售区域');
        return false;
      }

      return true;
    }

    static filter(obj) {
      const _obj = obj;
      if (!_obj.CouponID) delete _obj.CouponID;
      return _obj;
    }

    backfill(data) {
      this.ApplyUser = {};
      this.ApplyUser = data.ApplyUser;
      this.CouponID = data.CouponID;

      this.GradeList = data.GradeList.map(it => ({ ID: it.ID }));
      this.CustomerTypeList = data.CustomerTypeList.map(it => ({ ID: it.ID }));
      this.OrderTypeList = data.OrderTypeList.map(it => ({ ID: it.ID }));

      const { Amount, MinPayAmount, TotalNumber } = data.Data;
      this.Data = {};
      this.Data.Amount = Amount;
      this.Data.MinPayAmount = MinPayAmount;
      this.Data.TotalNumber = TotalNumber;

      this.ProductList = data.ProductList;

      const { ProvideStartTime, ProvideEndTime, ValidStartTime, ValidEndTime } = data;
      this.ProvideStartTime = ProvideStartTime;
      this.ProvideEndTime = ProvideEndTime;
      this.ValidStartTime = ValidStartTime;
      this.ValidEndTime = ValidEndTime;

      // this.SellAreaArray = data.SellAreaArray;

      this.AreaList = data.AreaList;

      this.IsIncludeIncreasedArea = data.IsIncludeIncreasedArea;

      this.IsIncludeIncreasedProduct = data.IsIncludeIncreasedProduct;

      this.ProductClassList = data.ProductClassList;

      const { IsCustomerReceive, MaxReceiveNumber, SendNumber, UseNewCustomer } = data;
      this.IsCustomerReceive = IsCustomerReceive || false;
      this.MaxReceiveNumber = (MaxReceiveNumber || MaxReceiveNumber === 0) ? MaxReceiveNumber : '';
      this.UseNewCustomer = UseNewCustomer;
      this.SendNumber = (SendNumber || SendNumber === 0) ? SendNumber : '';
    }
}
