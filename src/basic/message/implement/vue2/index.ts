/* eslint-disable global-require */
import { MessageBox } from 'element-ui';
import { normalizeOptions } from '../../core/utils';
import './index.scss';

type Option = ReturnType<typeof normalizeOptions>

type Config = {
  showConfirmButton: boolean
  icon: string
  dialogClass: string
}

const _impTip = (option: Option, config: Config) => {
  const message = `
    <div class='my-message-content  ${option.msg ? '' : 'none-content'}'>
      <aside>
        <img src=${config.icon}>
      </aside>
      <main>
        <h2 class='header'>${option.title}</h2>
        <div class='content'>${option.msg}</div>
      </main>
    </div>
  `;

  MessageBox({
    title: '',
    message,
    customClass: `my-vue2-element-ui-message-box ${config.dialogClass}`,
    cancelButtonText: option.cancelButtonText,
    confirmButtonText: option.confirmButtonText,
    showConfirmButton: config.showConfirmButton,
    showCancelButton: true,
    cancelButtonClass: 'cancel',
    confirmButtonClass: 'confirm',
    closeOnPressEscape: false,
    closeOnClickModal: false,
    showClose: true,
    center: true,
    dangerouslyUseHTMLString: true, // option.dangerouslyUseHTMLString设置在该版本中不生效
  }).then(() => option.onOk()).catch(() => option.onCancel()).finally(() => option.onClose());
};

export const warn = (option: Option) => { // 实现warn方法
  const config: Config = {
    showConfirmButton: true,
    icon: require('./icons/warn.png'),
    dialogClass: 'warn',
  };

  _impTip(option, config);
};

export const error = (option: Option) => { // 实现error方法
  const _option = {
    ...option,
    cancelButtonText: option.confirmButtonText,
  };

  const config: Config = {
    showConfirmButton: false,
    icon: require('./icons/error.png'),
    dialogClass: 'error',
  };
  _impTip(_option, config);
};

export const success = (option: Option) => { // 实现success方法
  const _option = {
    ...option,
    cancelButtonText: option.confirmButtonText,
  };

  const config: Config = {
    showConfirmButton: false,
    icon: require('./icons/success.png'),
    dialogClass: 'success',
  };
  _impTip(_option, config);
};

export const confirm = (option: Option) => { // 实现confirm方法
  const config: Config = {
    showConfirmButton: true,
    icon: require('./icons/confirm.png'),
    dialogClass: 'confirm',
  };
  _impTip(option, config);
};
