/* eslint-disable lines-between-class-members */
import * as implementer from '../implement';
import type { IMessageCore, IMessageCoreOptions } from './type';
import { normalizeOptions } from './utils';

export class MessageCore implements IMessageCore {
  warn(options: IMessageCoreOptions): void;
  warn(title: string, msg: string, onOk: () => void, onCancel?: () => void): void;
  warn(title: IMessageCoreOptions | string, msg?: string, onOk?: IMessageCoreOptions['onOk'], onCancel?: IMessageCoreOptions['onCancel']): void {
    const options = normalizeOptions(title, msg, onOk, onCancel);

    implementer.warn(options); // 实现方法
  }

  error(options: IMessageCoreOptions): void;
  error(title: string, msg: string, onOk?: () => void, onCancel?: () => void): void;
  error(title: IMessageCoreOptions | string, msg?: string, onOk?: IMessageCoreOptions['onOk'], onCancel?: IMessageCoreOptions['onCancel']): void {
    const options = normalizeOptions(title, msg, onOk, onCancel);

    implementer.error(options); // 实现方法
  }

  success(options: IMessageCoreOptions): void;
  success(title: string, msg?: string, onOk?: () => void, onCancel?: () => void): void;
  success(title: IMessageCoreOptions | string, msg?: string, onOk?: IMessageCoreOptions['onOk'], onCancel?: IMessageCoreOptions['onCancel']): void {
    const options = normalizeOptions(title, msg, onOk, onCancel);

    implementer.success(options); // 实现方法
  }

  confirm(options: IMessageCoreOptions): void;
  confirm(title: string, msg: string, onOk: () => void, onCancel?: () => void): void;
  confirm(title: IMessageCoreOptions | string, msg?: string, onOk?: IMessageCoreOptions['onOk'], onCancel?: IMessageCoreOptions['onCancel']): void {
    const options = normalizeOptions(title, msg, onOk, onCancel);

    implementer.confirm(options); // 实现方法
  }
}
