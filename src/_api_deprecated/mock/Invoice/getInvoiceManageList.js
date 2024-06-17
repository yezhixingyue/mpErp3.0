import Mock from 'mockjs';

export default (e) => {
  const DataNumber = 112;
  const condition = JSON.parse(e.body);
  let count = 10;
  let InvoiceID = 100385916;
  if (condition) {
    const { Page, PageSize, IsAllowInvoice } = condition;
    if (Page && PageSize) {
      count = PageSize;
      if (Math.ceil(DataNumber / PageSize) <= Page) {
        count = (DataNumber % PageSize > 0) || DataNumber === 0 ? DataNumber % PageSize : PageSize;
      }
      if (!IsAllowInvoice) {
        InvoiceID = 100285916;
      }
      InvoiceID += Page * 10;
    }
  }
  console.log(condition);
  const label = `Data|${count}`;
  const temp = Mock.mock({
    Status: 1000,
    Message: '',
    DataNumber,
    VersionCode: 0,
    [label]: [
      {
        'InvoiceID|+1': InvoiceID,
        CustomerNo: '豫A4249430',
        CustomerName: '影印设计',
        'EnterpriseName|1': ['郑州印刷公司', '郑州名片之家电子商务有限公司', '影印设计', '印把子'],
        CreditCode: '91410100MA3X8PHD96',
        RegisteredAddress: '郑州市金水区花园路国基路花园SOHO1号楼',
        RegisteredTelephone: '0371-68413443',
        'OpeningBank|1': ['中国银行', '中国工商银行', '中国农业银行', '中国建设银行'],
        BankAccount: '1234123412341234',
        'ReceiverName|1': ['王老五', '张三', '李四'],
        ReceiverProvinceName: '河南省',
        ReceiverCityName: '郑州市',
        ReceiverCountyName: '金水区',
        ReceiverAddress: '花园SOHO',
        ReceiverContactWay: '13803822583',
        'InvoiceType|1': [1, 2],
        'InvoiceStatus|1': [0, 10, 20, 30, 40],
        CreateTime: '2022-06-07T07:43:16.968Z',
        OperateTime: '2022-06-07T15:43:16.968Z',
        OperaterUserName: '刘亦菲',
      },
    ],
  });

  return temp;
};
