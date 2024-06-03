export interface INewMessageOptions {
  title: string
  msg?: string
  onOk?: () => void
  onCancel?: () => void
  onClose?: () => void
  dangerouslyUseHTMLString?: boolean
  confirmButtonText?: string
  cancelButtonText?: string
}

export interface INewMessage {
  /** 警告 */
  warn(options: INewMessageOptions): void
  warn(title: string, msg: string, onOk: INewMessageOptions['onOk'], onCancel: INewMessageOptions['onCancel']): void

  /** 错误 */
  error(options: INewMessageOptions): void
  error(title: string, msg: string, onOk: INewMessageOptions['onOk'], onCancel: INewMessageOptions['onCancel']): void

  /** 成功 */
  success(options: INewMessageOptions): void
  success(title: string, msg: string, onOk: INewMessageOptions['onOk'], onCancel: INewMessageOptions['onCancel']): void

  /** 询问 */
  confirm(options: INewMessageOptions): void
  confirm(title: string, msg: string, onOk: INewMessageOptions['onOk'], onCancel: INewMessageOptions['onCancel']): void
}
