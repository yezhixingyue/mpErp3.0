import validateCheck from '@/assets/js/validator/validateCheck';
import messageBox from '@/assets/js/utils/message';

function showError(err) {
  messageBox.failSingle(err);
}
// objForListDataClassType.backfill
export default class objForListDataClassType {
    ID = ''

    MinAmount = ''

    Percent = ''

    IsChargeFreight = true

    CustomerTypeList = [
    //   {
    //     ID: '',
    //     Name: ''
    //   }
    ]

    GradeList = [
    //   {
    //     ID: '',
    //     Name: ''
    //   }
    ]

    LogisticsList = [
    //   {
    //     ID: '',
    //     Name: ''
    //   }
    ]

    IsIncludeIncreasedArea = false;

    AreaList = []

    IsIncludeIncreasedProduct = false;

    ProductClassList = []

    static check(obj) {
      if (obj.ProductClassList.length === 0 && !obj.IsIncludeIncreasedProduct) {
        showError('请选择产品!');
        return false;
      }

      if (obj.AreaList.length === 0 && !obj.IsIncludeIncreasedArea) {
        showError('请选择销售区域!');
        return false;
      }

      const { MinAmount, Percent } = obj;

      const AmountRules = [
        {
          strategy: 'isNotEmpty',
          errorMsg: '请输入单笔订单金额!',
        },
        {
          strategy: 'isNotNum',
          errorMsg: '单笔订单金额应为数字类型',
        },
        {
          strategy: 'Minimum:0',
          errorMsg: '单笔订单金额不能小于0',
        },
      ];
      if (!validateCheck(MinAmount, AmountRules, showError)) return false;

      const PercentRules = [
        {
          strategy: 'isNotEmpty',
          errorMsg: '定金百分比不能为空!',
        },
        {
          strategy: 'Minimum',
          errorMsg: '定金百分比不能小于0',
        },
        {
          strategy: 'Maximum:100',
          errorMsg: '定金百分比最大值为100',
        },
      ];
      if (!validateCheck(Percent, PercentRules, showError)) return false;

      if (obj.CustomerTypeList.length === 0) {
        showError('请选择客户类型!');
        return false;
      }

      if (obj.GradeList.length === 0) {
        showError('请选择客户等级!');
        return false;
      }

      if (obj.LogisticsList.length === 0) {
        showError('请选择物流方式!');
        return false;
      }

      return true;
    }

    static filter(obj) {
      const _obj = JSON.parse(JSON.stringify(obj));
      if (!_obj.ID) delete _obj.ID;
      return _obj;
    }

    static clear() {
      return {
        CustomerTypeList: [],
        GradeList: [],
        ID: '',
        IsChargeFreight: true,
        LogisticsList: [],
        MinAmount: '',
        Percent: '',
        IsIncludeIncreasedArea: false,
        AreaList: [],
        IsIncludeIncreasedProduct: false,
        ProductClassList: [],
      };
    }

    static backfill(data) {
      const _obj = {
        CustomerTypeList: data.CustomerTypeList,
        GradeList: data.GradeList || [],
        ID: data.ID,
        IsChargeFreight: data.IsChargeFreight,
        LogisticsList: data.LogisticsList,
        MinAmount: data.MinAmount,
        Percent: data.Percent,
        IsIncludeIncreasedArea: data.IsIncludeIncreasedArea,
        AreaList: data.AreaList,
        IsIncludeIncreasedProduct: data.IsIncludeIncreasedProduct,
        ProductClassList: data.ProductClassList,
      };
      return _obj;
    }
}
