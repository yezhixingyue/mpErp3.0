import { getNameFromListByIDs, getDateFormat } from '@/assets/js/utils/util';
import { DeveloperTypeEnumList, DeveloperStatusEnumList, DeveloperStatusEnum } from './enum';
import { IDeveloper } from './types';

/** 获取开发者表格列表数据 - 会附加部分信息 */
export const getDeveloperTableList = (it: IDeveloper) => ({
  ...it,
  _TypeText: getNameFromListByIDs(it.Type, DeveloperTypeEnumList),
  _ContactsText: `${it.Contacts}（ ${it.ContactMobile} ）`,
  _CreateTime: getDateFormat(it.CreateTime),
  _StatusText: getNameFromListByIDs(it.Status, DeveloperStatusEnumList),
  _CheckTime: getDateFormat(it.CheckTime),
  _AppNumber: `${it.AppNumber}个`,
  _Remark: it.Status === DeveloperStatusEnum.Forbit ? it.Remark : '',
  _StatusClass: it.Status === DeveloperStatusEnum.Apply ? 'is-pink' : '',
});
