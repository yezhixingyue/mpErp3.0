// const Mock = require('mockjs'); // 引入mockjs模拟数据

// function getData() {
//   const mockData = Mock.mock({ // 模拟数据模板
//     Status: 1000,
//     Message: '获取成功',
//     DataNumber: 160,
//     VersionCode: 2.0,
//     'Data|20': [
//       {
//         OrderID: /1\d{10}/,
//         Customer: {
//           CustomerID: /豫[A-Z]\d{7}/,
//           CustomerSN: /1\d{12}/,
//           'CustomerName|2': '@cname',
//           Type: {
//             'First|1-3': 0,
//             Second: 'string',
//           },
//           SellArea: {
//             RegionalID: /(1002|1003|1004|1005|1006|1000|1008)/,
//             RegionalName: /(郑州大区|豫西大区|豫东大区|豫南大区|豫北大区|省外大区|豫中大区)/,
//             CityID: 1498,
//             CityName: 'string',
//             'CountyID|1499-1510': 0,
//             CountyName: 'string',
//           },
//         },
//         Funds: {
//           OrderID: /1\d{10}/,
//           'HavePaid|0-500': 0,
//           'Refund|0-50': 0,
//           'Unpaid|500-3000': 0,
//           'Receivable|2000-3000': 0,
//           'OriginalPrice|3000-3500': 0,
//           'FinalPrice|2500-3000': 0,
//           'Freight|0-50': 0,
//           'Deposit|0-300': 0,
//         },
//         Address: {
//           Express: {
//             'First|1-3': 1,
//             Second: 0,
//           },
//           AddressID: '00000000-0000-0000-0000-000000000000',
//           Address: {
//             CustomerID: '00000000-0000-0000-0000-000000000000',
//             AddressID: '00000000-0000-0000-0000-000000000000',
//             ExpressArea: {
//               RegionalID: 0,
//               RegionalName: 'string',
//               CityID: 0,
//               CityName: '@city(true)',
//               CountyID: 0,
//               CountyName: 'string',
//             },
//             AddressDetail: '@city(true)',
//             Consignee: '@cname',
//             Mobile: /1\d{10}/,
//             IsDefault: true,
//             Longitude: 'string',
//             Latitude: 'string',
//             HavePosition: true,
//           },
//         },
//         Remark: 'string',
//         ProductName: /(铜板不覆膜|胶装画册|骑马钉画册|精品名片|特殊材质不干胶)/,
//         Number: /[1-9]盒[1-9]款/,
//         Content: /(奥德赛看电视春风吹|面积中量的计数|欧洲一些国家相当于英国|按顺序数数;计|在上一次家族婚礼|计票工作正在顺利进行|中国给我们送来了一批物资)/,
//         Status: /(10|20|30|200|254)/,
//         Taker: {
//           key: /\d{8}-\d{4}-\d{4}-\d{4}-\d{12}/,
//           value: '@cname',
//         },
//         CreateTime: '@date(yyyy-MM-dd)T00:36:59.549Z',
//       },
//     ],
//   });
//   return mockData;
// }


// export default getData;
