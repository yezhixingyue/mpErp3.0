import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IDeveloper } from '../../DeveloperListManage/js/types';
import { DeveloperNoticeTargetEnum, DeveloperNoticeTargetEnumList } from './enum';

export class SendMsgRuleForm {
  TargetType = DeveloperNoticeTargetEnum.All

  IncludeNew = false

  DeveloperID = ''

  DeveloperName = ''

  OperatorID = ''

  OperatorName = ''

  Title = ''

  Content = ''

  CreateTime = ''

  /** 指定手机号 */
  _Mobile = ''

  /** 上一次成功检索出数据的手机号码 */
  _lastMobile = ''

  get _TargetTypeList() {
    return DeveloperNoticeTargetEnumList;
  }

  async inputBlur() { // 在blur事件中获取指定账号信息
    if (/^1[356789]\d{9}$/.test(this._Mobile) && this._Mobile === this._lastMobile) return;

    this.DeveloperID = '';
    this.DeveloperName = '';

    if (!this._Mobile) return;

    if (!/^1[356789]\d{9}$/.test(this._Mobile)) {
      MpMessage.error({
        title: '格式不正确',
        msg: '手机号码格式不正确',
      });

      return;
    }

    const resp = await api.getDeveloperFind(this._Mobile).catch(() => null);

    if (resp?.data.Status === 1000) {
      if (resp.data.Data) {
        const developer = resp.data.Data as IDeveloper;

        this.DeveloperID = developer.ID;
        this.DeveloperName = developer.Name;
      } else {
        MpMessage.error({
          title: '找不到该账号',
          msg: '该手机号未注册为开发者',
        });
      }
      this._lastMobile = this._Mobile;
    }
  }

  private _validate() { // 提交前的校验
    if (this.TargetType === DeveloperNoticeTargetEnum.Developer) { // 指定单个账号
      if (!this.DeveloperID || !this.DeveloperName) { // 未设置指定账户
        MpMessage.error({
          title: '发送失败',
          msg: '未设置指定账号',
        });
        return false;
      }
    }

    if (!this.Title) {
      MpMessage.error({
        title: '发送失败',
        msg: '请设置消息标题',
      });
      return false;
    }

    if (!this.Content) {
      MpMessage.error({
        title: '发送失败',
        msg: '请输入消息内容',
      });
      return false;
    }

    return true;
  }

  async submit() {
    if (!this._validate()) return null;

    const temp = {
      TargetType: this.TargetType,
      IncludeNew: this.TargetType !== DeveloperNoticeTargetEnum.Developer ? this.IncludeNew : false,
      DeveloperID: this.TargetType === DeveloperNoticeTargetEnum.Developer ? this.DeveloperID : '',
      DeveloperName: this.TargetType === DeveloperNoticeTargetEnum.Developer ? this.DeveloperName : '',
      Title: this.Title,
      Content: this.Content,
    };

    const resp = await api.getDeveloperNoticeSend(temp).catch(() => null);

    if (resp?.data.Status === 1000) {
      return resp.data.Data;
    }

    return null;
  }
}
