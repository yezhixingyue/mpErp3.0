import { Message } from 'element-ui';
import message from './message';

interface Ioptions {
  title?: string
  msg?: string
  onOk?: () => void
  onCancel?: () => void
  dangerouslyUseHTMLString?: boolean
  danger?: false // 仅 warn 时有效
  success?: boolean // 仅 warn 时有效
  warn?: boolean // 仅 warn 时有效
}

export const MpMessage = {
  /**
   * 错误提示
   *
   * @param {Ioptions} options
   */
  error(options: Ioptions) {
    const {
      title, msg, onOk, onCancel, dangerouslyUseHTMLString,
    } = options;

    if (msg) message.failSingleError(title, msg, onOk, onCancel, dangerouslyUseHTMLString);
    else message.failSingle(title, onOk, onCancel, dangerouslyUseHTMLString);
  },

  /**
   * 警告提示 通常用于删除等操作时的确认
   *
   * @param {Ioptions} options
   */
  warn(options: Ioptions) {
    const {
      title, msg, onOk, onCancel, dangerouslyUseHTMLString, danger, success, warn,
    } = options;

    let className = '';
    if (success) className = 'success';
    if (warn) className = 'warn';

    if (msg) {
      if (danger) {
        message.dangerCancelBox(title, msg, onOk, onCancel, dangerouslyUseHTMLString);
      } else {
        message.warnCancelBox(title, msg, onOk, onCancel, dangerouslyUseHTMLString, className);
      }
    } else message.warnCancelNullMsg(title, onOk, onCancel, dangerouslyUseHTMLString);
  },

  /**
   * 成功提示
   *
   * @param {Ioptions} options
   */
  success(options: Ioptions) {
    const {
      title, msg, onOk, onCancel, dangerouslyUseHTMLString,
    } = options;

    const canCloseOnPressEscape = true;

    message.successSingle(title, onOk, onCancel, canCloseOnPressEscape, msg, dangerouslyUseHTMLString);
  },

  dialogSuccess(options: Ioptions) {
    const {
      title, msg, onOk, onCancel, dangerouslyUseHTMLString,
    } = options;

    const needToast = false;

    if (needToast) {
      const canCloseOnPressEscape = true;
      message.successSingle(title, onOk, onCancel, canCloseOnPressEscape, msg, dangerouslyUseHTMLString);
    } else {
      Message({
        showClose: true,
        message: title,
        type: 'success',
      });
      if (onOk) onOk();
    }
  },
};
