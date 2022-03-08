import restoreClassByOriginData from '../../assets/js/utils/reduction';

export default class Address {
  CustomerID = ''

  AddressID = ''

  ExpressArea = {
    RegionalID: '',
    RegionalName: '',
    CityID: '',
    CityName: '',
    CountyID: '',
    CountyName: '',
  }

  AddressDetail = ''

  Consignee = ''

  Mobile = ''

  Longitude = ''

  Latitude = ''

  HavePosition = false

  IsDefault = false

  key = Math.random().toString(32).slice(-8)

  constructor(data) {
    restoreClassByOriginData(this, data);
    // if (data && Object.prototype.toString.call(data) === '[object Object]') {
    //   const { CustomerID, AddressID, ExpressArea, AddressDetail, Consignee, Mobile, Longitude, Latitude, HavePosition } = data;
    //   if (CustomerID) this.CustomerID = CustomerID;
    //   if (AddressID) this.AddressID = AddressID;
    //   if (AddressDetail) this.AddressDetail = AddressDetail;
    //   if (Consignee) this.Consignee = Consignee;
    //   if (Mobile) this.Mobile = Mobile;
    //   if (Longitude) this.Longitude = Longitude;
    //   if (Latitude) this.Latitude = Latitude;
    //   if (HavePosition) this.HavePosition = HavePosition;
    //   if (ExpressArea && Object.prototype.toString.call(ExpressArea) === '[object Object]') {
    //     const { RegionalID, RegionalName, CityID, CityName, CountyID, CountyName } = ExpressArea;
    //     if (RegionalID || RegionalID === 0) this.ExpressArea.RegionalID = RegionalID;
    //     if (RegionalName) this.ExpressArea.RegionalName = RegionalName;
    //     if (CityID || CityID === 0) this.ExpressArea.CityID = CityID;
    //     if (CityName) this.ExpressArea.CityName = CityName;
    //     if (CountyID || CountyID === 0) this.ExpressArea.CountyID = CountyID;
    //     if (CountyName) this.ExpressArea.CountyName = CountyName;
    //   }
    // }
  }
}
