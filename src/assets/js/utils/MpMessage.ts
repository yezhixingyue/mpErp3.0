import { Message } from 'element-ui';

export { MyMessage as MpMessage } from '@/basic/message';
// import message from './message';

// interface Ioptions {
//   title?: string
//   msg?: string
//   onOk?: () => void
//   onCancel?: () => void
//   dangerouslyUseHTMLString?: boolean
//   // danger?: false // 仅 warn 时有效
//   success?: boolean // 仅 warn 时有效
//   warn?: boolean // 仅 warn 时有效
//   confirmButtonText?: string
//   cancelButtonText?: string // 仅 warn 时有效
// }

// export const MpMessage = {
//   /**
//    * 错误提示
//    *
//    * @param {Ioptions} options
//    */
//   error(options: Ioptions) {
//     const {
//       title, msg, onOk, onCancel, dangerouslyUseHTMLString, confirmButtonText,
//     } = options;

//     if (msg) message.failSingleError(title, msg, onOk, onCancel, dangerouslyUseHTMLString, confirmButtonText);
//     else message.failSingle(title, onOk, onCancel, dangerouslyUseHTMLString, confirmButtonText);
//   },

//   /**
//    * 警告提示 通常用于删除等操作时的确认
//    *
//    * @param {Ioptions} options
//    */
//   warn(options: Ioptions) {
//     const {
//       title, msg, onOk, onCancel, dangerouslyUseHTMLString, success, warn, confirmButtonText, cancelButtonText,
//     } = options;

//     let className = '';
//     if (success) className = 'success';
//     if (warn) className = 'warn';

//     if (msg) {
//       // if (danger) {
//       //   message.dangerCancelBox(title, msg, onOk, onCancel, dangerouslyUseHTMLString);
//       // } else {
//       //   message.warnCancelBox(title, msg, onOk, onCancel, dangerouslyUseHTMLString, className);
//       // }
//       message.warnCancelBox(title, msg, onOk, onCancel, dangerouslyUseHTMLString, className, confirmButtonText, cancelButtonText);
//     } else message.warnCancelNullMsg(title, onOk, onCancel, dangerouslyUseHTMLString, confirmButtonText, cancelButtonText);
//   },

//   /**
//    * 成功提示
//    *
//    * @param {Ioptions} options
//    */
//   success(options: Ioptions) {
//     const {
//       title, msg, onOk, onCancel, dangerouslyUseHTMLString, confirmButtonText,
//     } = options;

//     const canCloseOnPressEscape = true;

//     message.successSingle(title, onOk, onCancel, dangerouslyUseHTMLString, confirmButtonText, canCloseOnPressEscape, msg);
//   },

//   dialogSuccess(options: Ioptions) {
//     const {
//       title, msg, onOk, onCancel, dangerouslyUseHTMLString,
//     } = options;

//     const needToast = false;

//     if (needToast) {
//       const canCloseOnPressEscape = true;
//       message.successSingle(title, onOk, onCancel, canCloseOnPressEscape, msg, dangerouslyUseHTMLString);
//     } else {
//       Message({
//         showClose: true,
//         message: title,
//         type: 'success',
//       });
//       if (onOk) onOk();
//     }
//   },
// };

export const dialogSuccess = ({ title, onOk }: { title: string, onOk?: () => void }) => {
  Message({
    showClose: true,
    message: title,
    type: 'success',
  });

  if (onOk) onOk();
};
