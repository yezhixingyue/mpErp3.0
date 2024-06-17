import restoreInitDataByOrigin from '../../assets/js/utils/reduction';

export default class FactoryClass {
  FactoryID = ''

  FactoryName = ''

  ProvinceID = ''

  CityID = ''

  Address = ''

  LinkMan = ''

  Mobile = ''

  ProductNumber = 0

  Convert = {
    ID: '',
    Name: '',
    // Server: {
    //   ID: '',
    //   Name: '',
    // },
  }

  /** 外购自动接单 */
  AutoReceiveOrder = false

  _AutoLink = false

  constructor(data) {
    restoreInitDataByOrigin(this, data);
    if (this.Convert?.ID) {
      this._AutoLink = true;
    }
  }

  getSubmitInfo(ConvertServerList = []) {
    const temp = { ...this };
    if (!this._AutoLink) {
      temp.Convert = null;
    } else {
      const c = ConvertServerList.find(it => it.ID === temp.Convert.ID);
      if (c) {
        temp.Convert.Name = c.Name;
      }
      // const cs = ConvertServerList.find(it => it.ID === temp.Convert.Server.ID);
      // if (cs) {
      //   temp.Convert.Server.Name = cs.Name;
      // }
    }
    delete temp._AutoLink;
    return temp;
  }
}
