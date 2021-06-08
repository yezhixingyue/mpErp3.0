// class SchemaClass {

// }
import SchemaItemClass from './SchemaItemClass';
import CraftPeriodClass from './CraftPeriodClass';

export default class TimeLimitClass {
  // eslint-disable-next-line max-len
  constructor({ FirstLevelID, FirstLevelName, SecondLevelID, SecondLevelName, ID = '', ProductList = [], SchemaList = [], CraftPeriodList = [] }) {
    this.ID = ID;
    this.ProductClass = {
      FirstLevelID,
      FirstLevelName,
      SecondLevelID,
      SecondLevelName,
    };
    this.ProductList = ProductList;
    this.SchemaList = SchemaList.map(it => new SchemaItemClass({ ...it }));
    this.CraftPeriodList = CraftPeriodList.map(it => new CraftPeriodClass({ ...it }));
  }

  // ProductList = [
  //   // {
  //   //   ID: '00000000-0000-0000-0000-000000000000',
  //   //   Name: '',
  //   // },
  // ]

  // SchemaList = [ // 工期列表
  //   // {
  //   //   PeriodID: '00000000-0000-0000-0000-000000000000',
  //   //   ID: '00000000-0000-0000-0000-000000000000',
  //   //   AreaList: [
  //   //     {
  //   //       RegionalID: 0,
  //   //       RegionalName: 'string',
  //   //       CityID: 0,
  //   //       CityName: 'string',
  //   //       CountyID: 0,
  //   //       CountyName: 'string',
  //   //     },
  //   //   ],
  //   //   ExpressList: [
  //   //     {
  //   //       ID: 0,
  //   //       Name: 'string',
  //   //     },
  //   //   ],
  //   //   LatestPayTime: {
  //   //     First: 0,
  //   //     Second: 0,
  //   //   },
  //   //   Constraint: {
  //   //     ConstraintID: '00000000-0000-0000-0000-000000000000',
  //   //     FilterType: 1,
  //   //     ItemList: [
  //   //       {
  //   //         ConstraintID: '00000000-0000-0000-0000-000000000000',
  //   //         ProductID: '00000000-0000-0000-0000-000000000000',
  //   //         PartID: '00000000-0000-0000-0000-000000000000',
  //   //         CraftID: '00000000-0000-0000-0000-000000000000',
  //   //         GroupID: '00000000-0000-0000-0000-000000000000',
  //   //         PropertyID: '00000000-0000-0000-0000-000000000000',
  //   //         PropertyType: 1,
  //   //         Operator: 1,
  //   //         Value: 'string',
  //   //         ValueType: 1,
  //   //         MinValue: 0,
  //   //         MaxValue: 0,
  //   //         Unit: 'string',
  //   //         Prefix: 'string',
  //   //         OperatorList: [
  //   //           1,
  //   //         ],
  //   //         OptionList: [
  //   //           {
  //   //             OptionID: '00000000-0000-0000-0000-000000000000',
  //   //             Value: 'string',
  //   //             Index: 0,
  //   //             IsSelected: true,
  //   //           },
  //   //         ],
  //   //       },
  //   //     ],
  //   //   },
  //   //   Duration: 0,
  //   //   ProductIncrement: 0,
  //   //   ProductIncrementDuration: 0,
  //   //   CraftPeriodType: 0,
  //   //   CraftIncrement: 0,
  //   //   CraftIncrementDuration: 0,
  //   //   IncludeExpress: true,
  //   //   Index: 0,
  //   // },
  // ]

  // CraftPeriodList = [ // 工艺工期
  //   // {
  //   //   PeriodID: '00000000-0000-0000-0000-000000000000',
  //   //   ID: '00000000-0000-0000-0000-000000000000',
  //   //   CraftList: [
  //   //     {
  //   //       ID: '00000000-0000-0000-0000-000000000000',
  //   //       Name: 'string',
  //   //     },
  //   //   ],
  //   //   Constraint: {
  //   //     ConstraintID: '00000000-0000-0000-0000-000000000000',
  //   //     FilterType: 1,
  //   //     ItemList: [
  //   //       {
  //   //         ConstraintID: '00000000-0000-0000-0000-000000000000',
  //   //         ProductID: '00000000-0000-0000-0000-000000000000',
  //   //         PartID: '00000000-0000-0000-0000-000000000000',
  //   //         CraftID: '00000000-0000-0000-0000-000000000000',
  //   //         GroupID: '00000000-0000-0000-0000-000000000000',
  //   //         PropertyID: '00000000-0000-0000-0000-000000000000',
  //   //         PropertyType: 1,
  //   //         Operator: 1,
  //   //         Value: 'string',
  //   //         ValueType: 1,
  //   //         MinValue: 0,
  //   //         MaxValue: 0,
  //   //         Unit: 'string',
  //   //         Prefix: 'string',
  //   //         OperatorList: [
  //   //           1,
  //   //         ],
  //   //         OptionList: [
  //   //           {
  //   //             OptionID: '00000000-0000-0000-0000-000000000000',
  //   //             Value: 'string',
  //   //             Index: 0,
  //   //             IsSelected: true,
  //   //           },
  //   //         ],
  //   //       },
  //   //     ],
  //   //   },
  //   //   Duration: 0,
  //   //   IsSignle: true,
  //   //   Index: 0,
  //   // },
  // ]
}
