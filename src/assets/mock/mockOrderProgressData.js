const obj = {
  Status: 1000,
  Message: '返回成功',
  DataNumber: 10,
  VersionCode: 2.0,
  Data: [
    {
      PayCode: 0,
      TotalAmount: 0,
      UnpaidAmount: 0,
      PaidAmount: 0,
      Customer: {
        ID: '00000000-0000-0000-0000-000000000000',
        Name: 'string',
        SN: 'string',
      },
      Status: 1,
      OrderType: 0,
      OrderTaker: {
        key: '00000000-0000-0000-0000-000000000000',
        value: 'string',
      },
      HaveBackOrderPrepare: true,
      Payment: 0,
      CreateTime: '2020-04-01T01:00:29.707Z',
      FinishTime: '2020-04-01T01:00:29.707Z',
      PackageList: [
        {
          PayCode: 0,
          ID: '00000000-0000-0000-0000-000000000000',
          Weight: 0,
          Freight: 0,
          Address: {
            Express: {
              First: 1,
              Second: 0,
            },
            AddressID: '00000000-0000-0000-0000-000000000000',
            Address: {
              CustomerID: '00000000-0000-0000-0000-000000000000',
              AddressID: '00000000-0000-0000-0000-000000000000',
              ExpressArea: {
                RegionalID: 0,
                RegionalName: 'string',
                CityID: 0,
                CityName: 'string',
                CountyID: 0,
                CountyName: 'string',
              },
              AddressDetail: 'string',
              Consignee: 'string',
              Mobile: 'string',
              IsDefault: true,
              Longitude: 'string',
              Latitude: 'string',
              HavePosition: true,
            },
          },
          OrderList: [
            {
              OrderID: 0,
              PackageID: '00000000-0000-0000-0000-000000000000',
              FinalPrice: 0,
              Amount: 0,
              OnlyCash: true,
              IsCancled: true,
            },
          ],
        },
      ],
    },
  ],
};
