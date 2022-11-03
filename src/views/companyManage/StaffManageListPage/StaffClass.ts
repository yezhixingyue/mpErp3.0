import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { IStaff, StaffStatusEnum } from './types';

/**
 * Staff类
 *
 * @export
 * @class StaffClass
 * @implements {IStaff}
 */
export class StaffClass implements IStaff {
  ID = ''

  Name = ''

  Mobile = ''

  /**
   * 密码 编辑时可不填写（不修改原密码）
   *
   * @memberof StaffClass
   */
  Password = ''

  Status = StaffStatusEnum.Normal;

  RegTime = '';

  constructor(data: null | IStaff) {
    if (data) restoreInitDataByOrigin(this, data);
    this.Password = '';
  }
}
