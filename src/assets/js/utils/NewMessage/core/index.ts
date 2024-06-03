/* eslint-disable lines-between-class-members */
import * as implementer from '../implement';
import { INewMessage, INewMessageOptions } from './type';
import { normalizeOptions } from './utils';

export class NewMessage implements INewMessage {
  warn(options: INewMessageOptions): void;
  warn(title: string, msg: string, onOk: () => void, onCancel?: () => void): void;
  warn(title: INewMessageOptions | string, msg?: string, onOk?: INewMessageOptions['onOk'], onCancel?: INewMessageOptions['onCancel']): void {
    const options = normalizeOptions(title, msg, onOk, onCancel);

    implementer.warn(options); // 实现方法
  }

  error(options: INewMessageOptions): void;
  error(title: string, msg: string, onOk?: () => void, onCancel?: () => void): void;
  error(title: INewMessageOptions | string, msg?: string, onOk?: INewMessageOptions['onOk'], onCancel?: INewMessageOptions['onCancel']): void {
    const options = normalizeOptions(title, msg, onOk, onCancel);

    implementer.error(options); // 实现方法
  }

  success(options: INewMessageOptions): void;
  success(title: string, msg?: string, onOk?: () => void, onCancel?: () => void): void;
  success(title: INewMessageOptions | string, msg?: string, onOk?: INewMessageOptions['onOk'], onCancel?: INewMessageOptions['onCancel']): void {
    const options = normalizeOptions(title, msg, onOk, onCancel);

    implementer.success(options); // 实现方法
  }

  confirm(options: INewMessageOptions): void;
  confirm(title: string, msg: string, onOk: () => void, onCancel?: () => void): void;
  confirm(title: INewMessageOptions | string, msg?: string, onOk?: INewMessageOptions['onOk'], onCancel?: INewMessageOptions['onCancel']): void {
    const options = normalizeOptions(title, msg, onOk, onCancel);

    implementer.confirm(options); // 实现方法
  }
}
