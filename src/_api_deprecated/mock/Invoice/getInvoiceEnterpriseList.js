import Mock from 'mockjs';

export default (e) => {
  const DataNumber = 112;
  const condition = JSON.parse(e.body);
  let count = 10;
  if (condition) {
    const { Page, PageSize } = condition;
    if (Page && PageSize) {
      count = PageSize;
      if (Math.ceil(DataNumber / PageSize) <= Page) {
        count = (DataNumber % PageSize > 0) || DataNumber === 0 ? DataNumber % PageSize : PageSize;
      }
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
        CustomerNo: '豫A4249430',
        CustomerName: '影印设计',
        'EnterpriseName|1': ['郑州印刷公司', '郑州名片之家电子商务有限公司', '影印设计', '印把子'],
        CreditCode: '91410100MA3X8PHD96',
        RegisteredAddress: '郑州市金水区花园路国基路花园SOHO1号楼',
        RegisteredTelephone: '0371-68413443',
        'OpeningBank|1': ['中国银行', '中国工商银行', '中国农业银行', '中国建设银行'],
        BankAccount: '1234123412341234',
        AuditTime: '2022-06-07T07:43:16.968Z',
        ModifyTime: '2022-06-07T15:43:16.968Z',
        Mobile: '13500001111',
      },
    ],
  });

  return temp;
};
