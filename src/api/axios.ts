/* eslint-disable max-len */
import axios from 'axios';
import { Loading, Message } from 'element-ui';
import router from '@/router';
// import setToken2SessionStorage from '../assets/js/utils/cookie'; // 获取cookie中的token信息存入到会话缓存中
import store from '../store';
import messageBox from '../assets/js/utils/message';
import TokenClass from '../assets/js/utils/tokenManage';
import LocalCancelToken from './CancelToken';
import { IMPAxiosInstance } from './types/type';

const instance: IMPAxiosInstance = axios.create({});

const apiListByNotNeedToken = ['/Api/Staff/Login']; // 不需要token访问的接口列表

const localCancelToken = new LocalCancelToken();

const clearToken = () => {
  TokenClass.removeToken();
  localCancelToken.cancelAllRequest();
};

let closeTip = false;
let requestNum = 0;
let loadingInstance;
const getShowLoading = (config) => { // 查看当前请求是否需要展示弹窗
  let showLoading = true;
  const arr = ['/Api/PaymentOrder/PayResult', '/Api/ProductionStop/PayResult', '/Api/Upload/File', '/Api/PaymentOrder/Create',
    '/Api/FileNode', '/Api/FileServer']; // 不需要展示loading的api地址
  if (config && config.url) {
    for (let i = 0; i < arr.length; i += 1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (config.url.split('?')[0].includes(arr[i]) || (store.state as any).common.isLoading || config.closeLoading) {
        showLoading = false;
      }
    }
  }
  return showLoading;
};
const handleLoadingOpen = () => { // 打开弹窗
  requestNum += 1;
  loadingInstance = Loading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.3)',
    customClass: 'mp-general-loading-box',
  });
};
const handleLoadingClose = () => { // 关闭弹窗
  requestNum -= 1;
  if (requestNum < 0) requestNum = 0;
  if (requestNum === 0 && loadingInstance) loadingInstance.close();
};

instance.interceptors.request.use(
  (config) => {
    const curConfig = config;
    const token = TokenClass.getToken();
    if (!token && !apiListByNotNeedToken.includes(curConfig.url)) {
      clearToken();
      router.replace('/login');
      throw new Error('请重新登录');
    }
    closeTip = curConfig.closeTip;
    curConfig.headers.Authorization = `Bearer ${token}`;
    if (getShowLoading(curConfig)) handleLoadingOpen();

    localCancelToken.setCancelToken(config);

    return curConfig;
  },
  (error) => {
    if (getShowLoading(error.config) && loadingInstance) handleLoadingClose();
    messageBox.failSingleError(error);
    return Promise.reject(error);
  },
);

const handleResponse = (response) => {
  if (getShowLoading(response.config) && loadingInstance) handleLoadingClose();
  const _list2NotNeed2Toast = [
    '/Api/AccountReceivable/Excel',
    '/Api/PaymentOrder/Excel',
    '/Api/CustomerList/Excel',
    '/Api/OrderList/Excel',
    '/Api/Coupon/DownLoad',
    '/Api/AfterSales/Excel',
    '/Api/AfterSale/Excel',
    '/Api/PackageList/Excel',
    '/Api/CustomerBill/Excel',
    '/Api/OrderBill/Excel',
    '/Api/PriceTable/Export',
    '/Api/CalculatePrice/Excel',
    '/Api/InvoiceManage/ExportExcel',
    '/Api/CheckFile/Statistics/Excel',
    '/Api/Order/ProductionStop/Save',
    '/Api/ProductionStop/PayResult',
    '/Api/Order/ProductionStop/CancelPay',
  ];
  const _statusList2NotNeed2Toast = [1000, 9062, 8044, 1100];
  // 包含以上的状态码 或 以上的请求路径  不会弹窗报错  其余以外都会报错出来

  if (!_statusList2NotNeed2Toast.includes(response.data.Status) && !_list2NotNeed2Toast.includes(response.config.url.split('?')[0])) {
    if ([7025, 8037].includes(response.data.Status)) {
      clearToken();
      if (!closeTip) {
        const cb = () => {
          router.replace('/login');
        };
        messageBox.failSingleError('操作失败', `[ ${response.data.Message} ]`, cb, cb);
      } else router.replace('/login');
    } else if (!closeTip) {
      messageBox.failSingleError('操作失败', `[ ${response.data.Message} ]`);
    }
  }
  localCancelToken.removeCancelToken(response.config);
  return response;
};

instance.interceptors.response.use(
  handleResponse,
  async (error) => {
    // if (error.response && error.response.status === 200) {
    //   return handleResponse(error.response);
    // }

    localCancelToken.removeCancelToken(error.config || '');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(store.state as any).common.isLoading) {
      if (getShowLoading(error.config) && loadingInstance) handleLoadingClose();
      if (error.response) {
        let b;
        let r;
        let buffterRes;
        let buffterErr = '文件导出数据过大，请缩小导出时间区间或精确筛选条件';
        let _func = null;
        let _msg = '';
        switch (error.response.status) {
          case 401:
            clearToken();
            _func = () => {
              router.replace('/login');
            };
            if (!closeTip) {
              messageBox.failSingleError(undefined, '[ 错误 401：请重新登录! ]', _func);
            } else {
              router.replace('/login');
            }
            break;
          case 403:
            clearToken();
            _func = () => {
              router.replace('/login');
            };
            if (!closeTip) {
              messageBox.failSingleError(undefined, '[ 错误 403：请重新登录! ]', _func);
            } else {
              router.replace('/login');
            }
            break;
          case 404:
            _msg = '404 not found';
            break;
          case 413: // 处理文件导出错误
            b = new Blob([error.response.data]);
            r = new FileReader();
            r.readAsText(b, 'utf-8');
            buffterRes = await new Promise(resolve => { r.onload = res => resolve(res); });
            if (buffterRes && buffterRes.currentTarget && buffterRes.currentTarget.result) {
              buffterErr = buffterRes.currentTarget.result;
            }
            _msg = `[ 错误 413：${buffterErr} ]`;
            break;
          case 500:
            _msg = '服务器内部错误';
            break;
          case 501:
            _msg = '服务器无法识别请求';
            break;
          case 502:
            _msg = '网关错误';
            break;
          case 503:
            _msg = '服务不可用';
            break;
          case 504:
            _msg = '网关超时';
            break;
          case 505:
            _msg = 'HTTP 版本不受支持';
            break;
          default:
            _msg = '系统暂无响应，请重试';
            if (error.response.data) {
              if (error.response.data.Message) {
                _msg = error.response.data.Message;
              } else {
                _msg = `系统出错，错误码：${error.response.data.Status}`;
              }
            }
            break;
        }
        if (_msg) {
          messageBox.failSingleError('操作失败', _msg);
        }
        return Promise.reject(error.response);
      }
      if (error.message === 'Network Error') {
        Message({
          showClose: true,
          message: '网络错误',
          type: 'error',
        });
      } else if (error.message && error.message.includes('timeout')) {
        Message({
          showClose: true,
          message: '网络超时',
          type: 'error',
        });
      } else if (error.response && error.response.status === 404) {
        Message({
          showClose: true,
          message: '404错误',
          type: 'error',
        });
      } else {
        let msg = '';
        if (error.response && error.response.data && error.response.data.Message) {
          msg = error.response.data.Message;
        } else if (error && error.message) {
          msg = error.message;
        }
        if (msg) {
          Message({
            showClose: true,
            message: msg,
            type: 'error',
          });
        }
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
