// import store from '@/store';
// import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';

export default class FundBillClassType {
    SellArea = {
      RegionalID: '',
      CityID: '',
      CountyID: '',
    }

    Type= ''

    BillType = 1

    Currency= ''

    Date = {
      First: '',
      Second: '',
    }

    CustomerType = {
      First: '',
      Second: '',
    }

    KeyWords= ''

    Page= 1

    PageSize= 30

    DateType = ''

    // initDateText= ''

    constructor(DateType = 'last30Date') {
      this.DateType = DateType;
    }
}
