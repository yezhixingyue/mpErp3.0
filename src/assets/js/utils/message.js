/* eslint-disable max-len */
import { MessageBox } from 'element-ui';
import Vue from 'vue';
import { MyMessage } from '@/basic/message';

/**
 * 警告提示框 --- 不含内容，只有标题 单按钮
 *
 * @param {*} msg
 * @param {*} successFunc
 * @param {*} failFunc
 */
function failSingle(msg, successFunc, failFunc, dangerouslyUseHTMLString, confirmButtonText) {
  // MessageBox({
  //   showClose: true,
  //   confirmButtonText: confirmButtonText || '确定',
  //   title: msg,
  //   dangerouslyUseHTMLString,
  //   customClass: 'mp-order-del-pop-reverse-warn-null fail',
  // }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
  MyMessage.error({
    title: msg,
    dangerouslyUseHTMLString,
    confirmButtonText: confirmButtonText || '确定',
    onOk: successFunc,
    onCancel: failFunc,
  });
}

/**
 * 失败提示框 --- 有标题和内容 单按钮
 *
 * @param {string} [title='出错啦 ！']
 * @param {*} msg
 * @param {*} successFunc
 * @param {*} failFunc
 */
// eslint-disable-next-line default-param-last
function failSingleError(title = '出错啦 ！', msg, successFunc, failFunc, dangerouslyUseHTMLString, confirmButtonText) {
  // MessageBox({
  //   showClose: true,
  //   message: msg,
  //   type: 'fail ',
  //   confirmButtonText: confirmButtonText || '关闭',
  //   title,
  //   customClass: 'mp-order-del-pop-reverse-fail',
  //   dangerouslyUseHTMLString,
  // }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
  MyMessage.error({
    title,
    msg,
    dangerouslyUseHTMLString,
    confirmButtonText: confirmButtonText || '确定',
    onOk: successFunc,
    onCancel: failFunc,
  });
}

/**
 * 警告提示框 --- 有标题和内容 单按钮
 *
 * @param {*} msg
 * @param {*} successFunc
 * @param {*} failFunc
 * @param {string} [title='注意']
 * @param {string} [text='关闭']
 */
function warnSingleError(msg, successFunc, failFunc, title = '注意', text = '关闭') {
  // MessageBox({
  //   showClose: true,
  //   message: msg,
  //   type: 'warning',
  //   confirmButtonText: text,
  //   title,
  //   customClass: 'mp-order-del-pop-reverse-warn',
  // }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
  MyMessage.error({
    title,
    msg,
    confirmButtonText: text || '确定',
    onOk: successFunc,
    onCancel: failFunc,
  });
}

/**
 * 警告提示框 --- 有标题和内容 双按钮   用于取消或删除  如订单列表取消
 *
 * @param {string} [title='确定取消此订单吗 ?']
 * @param {*} msg
 * @param {*} successFunc
 * @param {*} failFunc
 */
// eslint-disable-next-line default-param-last
function warnCancelBox(title = '确定取消此订单吗 ?', msg, successFunc, failFunc, dangerouslyUseHTMLString = false, className, confirmButtonText, cancelButtonText) {
  // MessageBox({
  //   showClose: true,
  //   message: msg,
  //   type: 'success ',
  //   confirmButtonText: confirmButtonText || '确定',
  //   title,
  //   customClass: `mp-order-del-pop-reverse-warn ${className}`,
  //   showCancelButton: true,
  //   cancelButtonText: cancelButtonText || '取消',
  //   dangerouslyUseHTMLString,
  // }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
  MyMessage.warn({
    title,
    msg,
    confirmButtonText: confirmButtonText || '确定',
    cancelButtonText: cancelButtonText || '取消',
    dangerouslyUseHTMLString,
    onOk: successFunc,
    onCancel: failFunc,
  });
}

/**
 * 警告提示框 --- 有标题, 无内容 双按钮   用于图片删除等
 *
 * @param {*} title
 * @param {*} successFunc
 * @param {*} failFunc
 */
function warnCancelNullMsg(title, successFunc, failFunc, dangerouslyUseHTMLString, confirmButtonText, cancelButtonText) {
  // MessageBox({
  //   showClose: true,
  //   confirmButtonText: confirmButtonText || '确定',
  //   showCancelButton: true,
  //   cancelButtonText: cancelButtonText || '取消',
  //   dangerouslyUseHTMLString,
  //   title,
  //   customClass: 'mp-order-del-pop-reverse-warn-null',
  // }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
  MyMessage.warn({
    title,
    confirmButtonText: confirmButtonText || '确定',
    cancelButtonText: cancelButtonText || '取消',
    dangerouslyUseHTMLString,
    onOk: successFunc,
    onCancel: failFunc,
  });
}

/**
 * 成功提示框 --- 不含内容，只有标题 单按钮 -- 后加msg 添加有内容
 *
 * @param {*} title
 * @param {*} successFunc
 * @param {*} failFunc
 * @param {boolean} [canCloseOnPressEscape=true]
 */
function successSingle(title, successFunc, failFunc, dangerouslyUseHTMLString, confirmButtonText, canCloseOnPressEscape = true, msg = '') {
  // let customClass = 'mp-order-del-pop-success';
  // if (!msg) customClass = `${customClass} none-msg`;
  // MessageBox({
  //   showClose: true,
  //   confirmButtonText: confirmButtonText || '确定',
  //   title,
  //   message: msg,
  //   closeOnPressEscape: canCloseOnPressEscape,
  //   dangerouslyUseHTMLString,
  //   customClass,
  // }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
  MyMessage.success({
    title,
    msg,
    confirmButtonText: confirmButtonText || '确定',
    dangerouslyUseHTMLString,
    onOk: successFunc,
    onCancel: failFunc,
    canCloseOnPressEscape,
  });
}

/**
 * 警告提示框 --- 有标题, 无内容 双按钮   用于图片删除等 小文字 可换行
 *
 * @param {*} title
 * @param {*} successFunc
 * @param {*} failFunc
 */
function warnCancelMsgSM(title, successFunc, failFunc) {
  MessageBox({
    showClose: true,
    confirmButtonText: '确定',
    showCancelButton: true,
    cancelButtonText: '取消',
    // dangerouslyUseHTMLString: true,
    title,
    customClass: 'mp-del-pop-reverse-warn-wrap-sm',
  }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
}

/**
 * 处理使用isLoading状态时的错误处理回调函数
 *
 * @param {*} error
 * @param {*} trueFunc
 * @param {*} failFunc
 */
function handleLoadingError(error, trueFunc, failFunc) {
  let msg = error;
  if (error.response && error.response.data && error.response.data.Message) {
    msg = error.response.data.Message;
  }
  failSingleError(undefined, msg, trueFunc, failFunc);
}

const messageBox = {
  failSingle,
  failSingleError,
  warnSingleError,
  warnCancelBox, // 删除常用
  warnCancelNullMsg,
  successSingle, // 成功
  warnCancelMsgSM,
  handleLoadingError,
};

Vue.prototype.messageBox = messageBox;

export default messageBox;
