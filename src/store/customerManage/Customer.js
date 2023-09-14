import { RegTypeEnum, AuthStatusEnum, CustomerStatusEnum } from './Enums';
import AddressClass from './Address';
import restoreInitDataByOrigin from '../../assets/js/utils/reduction';

export default class Customer {
  CustomerID = ''

  CustomerSN = '/'

  CustomerName = ''

  Mobile = ''

  QQ = ''

  Type = {
    First: '',
    Second: '',
  }

  Grade = {
    First: '',
    Second: '',
  }

  Feature = {
    First: '',
    Second: '',
  }

  Config = {
    IsAcceptNotify: true, // 是否接收未付款订单提醒
  }

  RegTime = ''

  AuthenInfo = {
    AuthID: '', // 认证ID
    CompanyName: '', // 公司名称
    TaxID: '', // 纳税人识别号
    LegalMan: '', // 法人
    Mobile: '', // 法人手机号
    CheckTime: '',
    CheckUser: {
      StaffID: '',
      StaffName: '',
    },
    SellArea: { // 经营地址 ---- 此处为行政区域
      RegionalID: '',
      RegionalName: '',
      CityID: '',
      CityName: '',
      CountyID: '',
      CountyName: '',
    },
    DetailAddress: '', // 经营地址详情
    Type: '', // 企业类型
    Scale: '', // 企业规模
    Place: '', // 经营场所
    ScopeArray: [], // 主营产品
    LicensePath: '', // 营业执照照片地址
  }

  CompanyAuthenticationInfo = {

    ChangeWay: 2,
    CheckTime: null,
    CheckUser: { ID: '', Name: null },
    ID: '',
    Name: null,
    CompanyName: '',
    CreateTime: '',
    CreditCode: '',
    CreditPath: [],
    CustomerID: '',
    Remark: '',
    Status: 0,
  }

  RegType = RegTypeEnum.Manual.ID // 注册方式

  AuthStatus = AuthStatusEnum.Checked.ID // 认证状态

  Status = CustomerStatusEnum.Nomal.ID // 客户状态

  FundInfo = {
    Amount: '0', // 可用余额
    UsedCredit: '/', // 已用信用额度 -- 可用额度需要与总额度计算
    TotalCredit: '/', // 总信用额度
    CashBackType: '',
    BeanNumber: '',
    MinAmount: null,
    BackPercent: null,
  }

  Address = []

  PolicyList = [] // 设置价格中的产品和等级

  SellArea = { // 销售区域
    RegionalID: '',
    RegionalName: '',
    CityID: '',
    CityName: '',
    CountyID: '',
    CountyName: '',
  }

  LastLoginTime = ''

  LastLoginIP = ''

  ShopName = ''

  ShopID = ''

  ShopIDString = ''

  CustomerFreezeInfo = {
    FreezeName: '',
    FreezeDescribe: '',
    FreezeTime: '',
  }

  constructor(data) {
    restoreInitDataByOrigin(this, data);
    if (data && Object.prototype.toString.call(data) === '[object Object]') {
      const { Address } = data;
      if (Address && Array.isArray(Address)) {
        this.Address = Address.map(it => new AddressClass(it));
      }
    }
  }
}
