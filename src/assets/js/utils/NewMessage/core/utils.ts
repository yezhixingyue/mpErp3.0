import { INewMessageOptions } from './type';

/** 参数归一化 */
export const normalizeOptions = (
  title: INewMessageOptions | string,
  msg?: string,
  onOk?: INewMessageOptions['onOk'],
  onCancel?: INewMessageOptions['onCancel'],
) => {
  const _options = typeof title === 'object' ? title : null;

  const _title = _options ? _options.title : title as string; // 标题必填 其它项选项
  const _msg = _options ? _options.msg : msg;
  const _onOk = _options ? _options.onOk : onOk;
  const _onCancel = _options ? _options.onCancel : onCancel;
  const _onClose = _options?.onClose;

  const temp = {
    title: _title,
    msg: _msg || '',
    onOk: () => _onOk && _onOk(),
    onCancel: () => _onCancel && _onCancel(),
    onClose: () => _onClose && _onClose(),
    dangerouslyUseHTMLString: _options?.dangerouslyUseHTMLString || false,
    confirmButtonText: _options?.confirmButtonText || '确定',
    cancelButtonText: _options?.cancelButtonText || '取消',
  };

  return temp;
};
