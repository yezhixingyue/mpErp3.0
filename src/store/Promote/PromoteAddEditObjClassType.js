/* eslint-disable max-len */

export default class PromoteAddObj {
    PromoteID = ''; // 新增活动时不传，修改活动时传

    Title = '' // 活动标题

    ApplyUser = { // 申请人
      StaffID: '',
    }

    Status = '' // 活动状态？

    StartNow = false // 是否立刻生效 true

    ValidStartTime = 'T00:00:00.000Z' // 活动开始时间

    ValidEndTime = 'T23:59:59.997Z' // 活动结束时间

    CustomerTypeList = [ // 客户类型列表
    //   {
    //     ID: '',
    //   },
    ]

    CustomerGradeList = [ // 客户等级列表
    //   {
    //     ID: '',
    //   },
    ]

    OrderTypeList = [ // 下单方式列表
    //   {
    //     ID: 1,
    //   },
    ]

    SellAreaArray = [ // 销售区域列表
      // {
      //   CountyID: 1616,
      // },
      // {
      //   CountyID: 1623,
      // },
      // {
      //   CountyID: 41,
      // },
      // {
      //   CountyID: 3196,
      // },
    ]


    ProductList = [ // 产品信息
      // {
      // LimitList: [
      // {
      //   FirstLevelID: 0, // 产品一级分类ID
      //   SecondLevelID: 0, // 产品二级分类ID
      //   ProductID: '', // 产品ID
      //   ProductName: 'string',
      // },
      // ],
      // List: [
      //   {
      //     Constraint: {
      //       FilterType: '', // 为1时表示需要满足所有条件 为2时满足任一条件
      //       ItemList: [
      //         {
      //           ProductID: '',
      //           PartID: '',
      //           CraftID: '',
      //           GroupID: '',
      //           PropertyID: '', // 以上5个为回传项
      //           PropertyType: '', // 条件前半部分
      //           Operator: '', // 关系
      //           Value: '', // 条件后半部分： 输入的值 | 选项的ID
      //         },
      //       ],
      //     },
      //     PriceUnit: '', // 所选择的分类项： 单价 | 总价 | 百分比
      //     Price: '', // 输入的价格值
      //   },
      // ],
      // },
    ]

    static check(obj) {
      if (!obj.Title || obj.Title.length >= 20) return '活动标题不能为空且不能超过20个字符!';
      if (!obj.ValidStartTime.split('T')[0] || !obj.ValidStartTime.split('T')[1] || !obj.ValidStartTime.split('T')[1].split('.')[0]) return '请输入活动开始时间';
      if (new Date(obj.ValidStartTime) - Date.now() <= 0 && !obj.StartNow) return '活动开始时间不能早于当前时间';
      if (new Date(obj.ValidEndTime) <= new Date(obj.ValidStartTime)) return '活动结束时间不能早于活动开始时间';
      if (!obj.ValidEndTime.split('T')[0] || !obj.ValidEndTime.split('T')[1] || !obj.ValidEndTime.split('T')[1].split('.')[0]) return '请输入活动结束时间';
      if (new Date(obj.ValidEndTime) - Date.now() <= 0) return '活动结束时间不能早于当前时间';
      if (!obj.ApplyUser.StaffID) return '请输入申请人';
      if (obj.OrderTypeList.length === 0) return '请选择下单渠道';
      if (obj.CustomerTypeList.length === 0) return '请选择客户类型';
      if (obj.CustomerGradeList.length === 0) return '请选择客户等级';
      if (obj.SellAreaArray.length === 0) return '请选择销售区域';
      if (obj.ProductList.length === 0) return '请添加活动商品';
      for (let i = 0; i < obj.ProductList.length; i += 1) {
        if (obj.ProductList[i].List.length === 0) return `第[ ${i + 1} ]个价格表缺少活动价格设置`;
      }
      return true;
    }

    static filter(obj) {
      const _obj = { ...obj };
      if (!_obj.PromoteID) delete _obj.PromoteID;
      if (!_obj.Status) delete _obj.Status;
      // if (_obj.StartNow) delete _obj.ValidStartTime;
      return _obj;
    }

    static clear() {
      const _obj = {
        PromoteID: '',
        Title: '',
        ApplyUser: {
          StaffID: '',
        },
        Status: '',
        StartNow: false,
        ValidStartTime: 'T00:00:00.000Z',
        ValidEndTime: 'T23:59:59.997Z',
        CustomerTypeList: [],
        CustomerGradeList: [],
        OrderTypeList: [],
        SellAreaArray: [],
        ProductList: [],
      };
      return _obj;
    }

    static back(obj) {
    //  console.log(obj);
      const _SellAreaArray = obj.SellAreaArray.map(item => ({ CountyID: item.CountyID }));
      const _ProductList = [];
      obj.ProductList.forEach((level1, i1) => {
        _ProductList[i1] = {};
        _ProductList[i1].LimitList = [...level1.LimitList];
        _ProductList[i1].List = [];
        level1.List.forEach((level2, i2) => {
          const { PriceUnit, Price, Constraint } = level2;
          //  console.log(level2, 'level2');
          _ProductList[i1].List[i2] = {};
          _ProductList[i1].List[i2].Price = Price;
          _ProductList[i1].List[i2].PriceUnit = PriceUnit;
          _ProductList[i1].List[i2].Constraint = {};
          _ProductList[i1].List[i2].Constraint.FilterType = Constraint.FilterType;
          _ProductList[i1].List[i2].Constraint.ItemList = [];
          Constraint.ItemList.forEach(item => {
            const { Operator, Value, PropertyType, PropertyID, GroupID, PartID, CraftID, ProductID } = item;
            const _obj = {
              ProductID,
              PartID,
              CraftID,
              GroupID,
              PropertyID,
              PropertyType,
              Operator,
              Value,
            };
            _ProductList[i1].List[i2].Constraint.ItemList.push(_obj);
          });
        });
      });
      const _obj = {
        PromoteID: obj.PromoteID,
        Title: obj.Title,
        ApplyUser: {
          StaffID: obj.ApplyUser.StaffID,
        },
        Status: obj.Status,
        StartNow: false,
        ValidStartTime: `${obj.ValidStartTime.split('.')[0]}.000Z`,
        ValidEndTime: `${obj.ValidEndTime.split('.')[0]}.997Z`,
        CustomerTypeList: obj.CustomerTypeList.map(it => ({ ID: it.ID })),
        CustomerGradeList: obj.CustomerGradeList.map(it => ({ ID: it.ID })),
        OrderTypeList: obj.OrderTypeList.map(it => ({ ID: it.ID })),
        SellAreaArray: _SellAreaArray,
        ProductList: _ProductList,
      };
      return _obj;
    }
}
