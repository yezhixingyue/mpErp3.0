/* eslint-disable max-len */

export default class PromoteAddObj {
    PromoteID = ''; // 新增活动时不传，修改活动时传

    Title = '' // 活动标题

    ApplyUser = { // 申请人
      StaffID: '',
    }

    Status = '' // 活动状态？

    StartNow = false // 是否立刻生效 true

    PeriodType = 0 // 0 天 1 周

    PeriodList = [
      { Label: '时间段', Value: '', StartTime: '', EndTime: '' }, // 按天时间段
      { Label: '周一', Value: 1, isChecked: false, StartTime: '', EndTime: '' }, // 周一
      { Label: '周二', Value: 2, isChecked: false, StartTime: '', EndTime: '' },
      { Label: '周三', Value: 3, isChecked: false, StartTime: '', EndTime: '' },
      { Label: '周四', Value: 4, isChecked: false, StartTime: '', EndTime: '' },
      { Label: '周五', Value: 5, isChecked: false, StartTime: '', EndTime: '' },
      { Label: '周六', Value: 6, isChecked: false, StartTime: '', EndTime: '' },
      { Label: '周日', Value: 7, isChecked: false, StartTime: '', EndTime: '' }, // 周日
    ]

    // ValidStartTime = 'T00:00:00.000Z' // 活动开始时间
    ValidStartTime = '' // 活动开始时间

    // ValidEndTime = 'T23:59:59.997Z' // 活动结束时间
    ValidEndTime = '' // 活动结束时间

    CustomerTypeList = [ // 客户类型列表
    ]

    GradeList = [ // 客户等级列表
    ]

    OrderTypeList = [ // 下单方式列表
    ]

    // SellAreaArray = [ // 销售区域列表
    // ]

    IsIncludeIncreasedArea = false // // 销售区域列表 是否包含新建区域

    AreaList = [] // // 销售区域列表

    ProductList = [ // 产品信息
    ]

    commonPropertyList = [] // 公共属性列表（条件弹窗使用）

    static check(obj) {
      if (!obj.Title || obj.Title.length > 20) return '活动标题不能为空且不能超过20个字符!';
      if (!obj.ValidStartTime) return '请输入活动开始时间';
      if (!obj.ValidEndTime) return '请输入活动结束时间';
      let _ValidStartTime = obj.ValidStartTime;
      let _ValidEndTime = obj.ValidEndTime;
      if (obj.PeriodType === 0) {
        const t = obj.PeriodList.find(it => it.Value === '');
        if (t) {
          const { StartTime, EndTime } = t;
          if (!StartTime || !EndTime) {
            return '时间段时间未设置';
          }
          _ValidStartTime = `${_ValidStartTime.split('T')[0]}T${StartTime}:00.000`;
          _ValidEndTime = `${_ValidEndTime.split('T')[0]}T${EndTime}:59.997`;
        }
      }
      if (new Date(_ValidStartTime.replace('Z', '')) - Date.now() <= 0) return '活动开始时间不能早于当前时间';
      if (new Date(_ValidEndTime) <= new Date(_ValidStartTime)) return '活动结束时间不能早于活动开始时间';
      if (new Date(_ValidEndTime.replace('Z', '')) - Date.now() <= 0) return '活动结束时间不能早于当前时间';
      const _PeriodList = obj.PeriodList.filter(it => (it.Value && obj.PeriodType === 1 && it.isChecked) || (!it.Value && obj.PeriodType === 0));
      if (_PeriodList.length === 0) return '请设置周期';
      let t = _PeriodList.find(it => !it.StartTime || !it.EndTime);
      if (t) return '请补充周期开始时间或结束时间';
      t = _PeriodList.find(it => it.StartTime.split(':').join('') >= it.EndTime.split(':').join(''));
      if (t) return `周期中${t.Label}开始时间不能早于等于结束时间`;
      if (!obj.ApplyUser.StaffID) return '请输入申请人';
      if (obj.OrderTypeList.length === 0) return '请选择下单渠道';
      if (obj.CustomerTypeList.length === 0) return '请选择客户类型';
      if (obj.GradeList.length === 0) return '请选择客户等级';
      if (obj.AreaList.length === 0) return '请选择销售区域';
      if (obj.ProductList.length === 0) return '请添加活动商品';
      for (let i = 0; i < obj.ProductList.length; i += 1) {
        if (obj.ProductList[i].ItemList.length === 0) return `第[ ${i + 1} ]个价格表缺少活动价格设置`;
      }
      return true;
    }

    static filter(obj) {
      const _obj = { ...obj };
      if (!_obj.PromoteID) delete _obj.PromoteID;
      if (!_obj.Status) delete _obj.Status;
      if (_obj.commonPropertyList) delete _obj.commonPropertyList;
      _obj.PeriodList = obj.PeriodList.filter(it => (it.Value && obj.PeriodType === 1 && it.isChecked) || (!it.Value && obj.PeriodType === 0));
      // if (_obj.StartNow) delete _obj.ValidStartTime;
      _obj.ProductList = obj.ProductList.map(it => {
        const _it = { ...it };
        delete _it.PropertyList;
        return _it;
      });
      return _obj;
    }

    static clear() {
      return new PromoteAddObj();
    }

    static back(obj) {
      // const _SellAreaArray = obj.SellAreaArray.map(item => ({ CountyID: item.CountyID }));
      const _ProductList = [];
      obj.ProductList.forEach((level1, i1) => {
        _ProductList[i1] = {};
        _ProductList[i1].ProductClassList = Array.isArray(level1.ProductClassList) ? [...level1.ProductClassList] : [];
        _ProductList[i1].ItemList = Array.isArray(level1.ItemList) ? [...level1.ItemList] : [];
        _ProductList[i1].PropertyList = [];
        _ProductList[i1].IsIncludeIncreasedProduct = level1.IsIncludeIncreasedProduct || false;
      });
      const _PeriodList = [
        { Label: '时间段', Value: '', StartTime: '', EndTime: '' }, // 按天时间段
        { Label: '周一', Value: 1, isChecked: false, StartTime: '', EndTime: '' }, // 周一
        { Label: '周二', Value: 2, isChecked: false, StartTime: '', EndTime: '' },
        { Label: '周三', Value: 3, isChecked: false, StartTime: '', EndTime: '' },
        { Label: '周四', Value: 4, isChecked: false, StartTime: '', EndTime: '' },
        { Label: '周五', Value: 5, isChecked: false, StartTime: '', EndTime: '' },
        { Label: '周六', Value: 6, isChecked: false, StartTime: '', EndTime: '' },
        { Label: '周日', Value: 7, isChecked: false, StartTime: '', EndTime: '' }, // 周日
      ];
      obj.PeriodList.forEach(it => {
        const t = _PeriodList.find(_it => _it.Value === it.Value || (!_it.Value && !it.Value));
        if (t) {
          t.isChecked = true;
          t.StartTime = it.StartTime;
          t.EndTime = it.EndTime;
        }
      });
      const _obj = {
        PromoteID: obj.PromoteID,
        Title: obj.Title,
        ApplyUser: {
          StaffID: obj.ApplyUser.StaffID,
        },
        Status: obj.Status,
        // StartNow: false,
        ValidStartTime: obj.ValidStartTime,
        ValidEndTime: obj.ValidEndTime,
        CustomerTypeList: obj.CustomerTypeList.map(it => ({ ID: it.ID })),
        GradeList: obj.GradeList.map(it => ({ ID: it.ID })),
        OrderTypeList: obj.OrderTypeList.map(it => ({ ID: it.ID })),
        // SellAreaArray: _SellAreaArray,
        ProductList: _ProductList,
        commonPropertyList: [],
        PeriodType: obj.PeriodType,
        PeriodList: _PeriodList,
        AreaList: obj.AreaList,
        IsIncludeIncreasedArea: obj.IsIncludeIncreasedArea,
      };
      return _obj;
    }

    /**
     * @description: 如果仅有一个产品则返回其ID，如果有多个产品或者允许有新加产品的话则返回''；可以根据返回值来判断是否为多产品
     * @param {*} data
     * @return {*}
     */
    static getUniqueProductID(data, mapObj = { IncreasedLabel: 'IsIncludeIncreasedProduct', listLabel: 'ProductClassList' }) {
      const ProductClassList = data[mapObj.listLabel];
      const IsIncludeIncreasedProduct = data[mapObj.IncreasedLabel];
      if ((!ProductClassList || ProductClassList.length === 0) && !IsIncludeIncreasedProduct) return null;
      if (!IsIncludeIncreasedProduct
        && ProductClassList.length === 1
        && ProductClassList[0].List.length === 1 && !ProductClassList[0].IsIncludeIncreased
        && ProductClassList[0].List[0].List.length === 1 && !ProductClassList[0].List[0].IsIncludeIncreased) {
        const ProductID = ProductClassList[0].List[0].List[0].ID || '';
        return ProductID;
      }
      return '';
    }
}
