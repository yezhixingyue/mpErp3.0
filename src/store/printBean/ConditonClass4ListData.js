import getEnumList from '../../assets/js/utils/getEnumList';

/*
 * 印豆购买状态
 */
export const PrintBeanBuyStatusEnums = {
  NotStarted: {
    ID: 0,
    Name: '未开始',
  },
  HasBegun: {
    ID: 1,
    Name: '可购买',
  },
  Expired: {
    ID: 2,
    Name: '已过期',
  },
};

export const PrintBeanBuyStatusEnumsList = getEnumList(PrintBeanBuyStatusEnums);

export default class ConditonClass4ListData {
  Page = 1

  PageSize = 20

  Category = ''

  CustomerType = ''

  CustomerGrade = ''

  SellArea = {
    RegionalID: '',
    CityID: '',
    CountyID: '',
  }

  KeyWords = ''

  Status = ''
}
