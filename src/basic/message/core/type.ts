export interface IMessageCoreOptions {
  title: string
  msg?: string
  onOk?: () => void
  onCancel?: () => void
  onClose?: () => void
  dangerouslyUseHTMLString?: boolean
  confirmButtonText?: string
  cancelButtonText?: string
}

export interface IMessageCore {
  /** 警告 */
  warn(options: IMessageCoreOptions): void
  warn(title: string, msg: string, onOk: IMessageCoreOptions['onOk'], onCancel: IMessageCoreOptions['onCancel']): void

  /** 错误 */
  error(options: IMessageCoreOptions): void
  error(title: string, msg: string, onOk: IMessageCoreOptions['onOk'], onCancel: IMessageCoreOptions['onCancel']): void

  /** 成功 */
  success(options: IMessageCoreOptions): void
  success(title: string, msg: string, onOk: IMessageCoreOptions['onOk'], onCancel: IMessageCoreOptions['onCancel']): void

  /** 询问 */
  confirm(options: IMessageCoreOptions): void
  confirm(title: string, msg: string, onOk: IMessageCoreOptions['onOk'], onCancel: IMessageCoreOptions['onCancel']): void
}
