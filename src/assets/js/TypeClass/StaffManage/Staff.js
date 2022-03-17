import { EducationEnumObj, SexEnumObj, StaffStatusEnumObj } from './enums';
import { getFormatDateString } from '../../utils/util';
import restoreClassByOriginData from '../../utils/reduction';
/**
 * 员工类
 *
 * @export
 * @class Staff
 */
export default class Staff {
  StaffID = ''

  StaffName = ''

  Mobile = ''

  Password = ''

  Education = EducationEnumObj.AssociateDegree.ID

  IDCard = ''

  Sex = SexEnumObj.male.ID // 根据IDCard生成

  LinkArea = {
    RegionalID: 1497,
    CityID: 1498,
  }

  DetailAddress = ''

  HeadPic = ''

  Status = StaffStatusEnumObj.pending.ID

  CheckUser = {
    StaffName: '',
  }

  PositionList = []

  TimeRecord = {
    CheckTime: '',
    RegTime: '',
    Birthday: '', // 根据IDCard生成
    JoinDate: getFormatDateString(),
  }

  LastLoginRecord = {
    First: '', // 时间
    Second: '', // IP
  }

  constructor(data) {
    restoreClassByOriginData(this, data);
  }
}
