import { create } from './request-lib/bus';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { Message } from 'element-ui';
import type { ICoreOptions } from './request-lib/core/types';
import { LoadingHandler } from './utils/LoadingHandler';
import { handleErrorToast } from './utils/handleErrorToast';
import TokenClass from '../../assets/js/utils/tokenManage';
import { logout } from '../logout';

const getToken = () => { // 获取到token
  const _token = TokenClass.getToken() || '';

  if (!_token) {
    logout();
  }

  return _token;
};

const useResponse: ICoreOptions['useResponse'] = (resp, { clear, closeTip, msgCallback, tipTitle }) => { // 还需要 tipTitle 与 msgCallback 字段
  if (resp.status === 200 && [1000, 9062, 8044, 1100].includes(resp.data.Status)) return;

  if (resp.status !== 200) { // 请求错误
    handleErrorToast(resp, () => {
      clear();
      logout();
    });

    return;
  }

  if (!closeTip) { // 请求失败 -- closeTip 是否进行错误提示
    if ([8037, 7025].includes(resp.data.Status)) {
      clear();
      logout();
      Message({ showClose: true, message: '请重新登录', type: 'error' });
    } else {
      MpMessage.error({
        title: tipTitle || '操作失败',
        msg: `[ ${resp.data.Message} ]`,
        onCancel: () => msgCallback && msgCallback(),
        onOk: () => msgCallback && msgCallback(),
      });
    }
  }
};

const useCatchError = (msg: string) => Message({ showClose: true, message: msg || '请求失败', type: 'error' }); // 错误处理

// const baseURL = import.meta.env.VITE_BASE_URL;

export const instance = create({
  loadingHandler: new LoadingHandler(),
  // cache: {
  //   duration: 500,
  //   isCacheable: resp => resp.status === 200 && resp.data.Status === 1000,
  // },
  getToken,
  useResponse,
  useCatchError,
  isSuccess: resp => resp?.status === 200 && resp.data.Status === 1000,
  validStatuses: [200],
  // baseURL,
});
