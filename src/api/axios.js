/* eslint-disable max-len */
import axios from 'axios';
import { Loading, Message } from 'element-ui';
import router from '@/router';
// import setToken2SessionStorage from '../assets/js/utils/cookie'; // 获取cookie中的token信息存入到会话缓存中
import store from '../store';
import messageBox from '../assets/js/utils/message';
import TokenClass from '../assets/js/utils/tokenManage';

const apiListByNotNeedToken = ['/Api/Staff/Login']; // 不需要token访问的接口列表

const { CancelToken } = axios;
let source = CancelToken.source();

const clearToken = () => {
  TokenClass.removeToken();
  source.cancel(); // 跳转登录页时 清除页面其它后续请求
  source = CancelToken.source(); // 清除后赋予axios新的取消信息
};

const getShowLoading = (config) => {
  let showLoading = true;
  const arr = ['/Api/PaymentOrder/PayResult', '/Api/Upload/File', '/Api/PaymentOrder/Create', '/Api/Staff/List',
    '/Api/FileNode', '/Api/FileServer']; // 不需要展示loading的api地址
  if (config && config.url) {
    for (let i = 0; i < arr.length; i += 1) {
      if (config.url.split('?')[0].includes(arr[i]) || store.state.common.isLoading || config.closeLoading) {
        showLoading = false;
      }
    }
  }
  return showLoading;
};

let loadingInstance;
let closeTip = false;
axios.interceptors.request.use(
  (config) => {
    const curConfig = config;
    curConfig.cancelToken = source.token;
    const token = TokenClass.getToken();
    if (!token && !apiListByNotNeedToken.includes(curConfig.url)) {
      clearToken();
      router.replace('/login');
      throw new Error('请重新登录');
    }
    closeTip = curConfig.closeTip;
    curConfig.headers.common.Authorization = `Bearer ${token}`;
    if (getShowLoading(curConfig)) {
      loadingInstance = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.3)',
        customClass: 'mp-general-loading-box',
      });
    }

    return curConfig;
  },
  (error) => {
    if (getShowLoading(error.config) && loadingInstance) loadingInstance.close();
    messageBox.failSingleError(error);
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    if (getShowLoading(response.config) && loadingInstance) loadingInstance.close();
    const _list2NotNeed2Toast = ['/Api/AccountReceivable/Excel', '/Api/PaymentOrder/Excel', '/Api/OrderList/Excel', '/Api/Coupon/DownLoad', '/Api/AfterSales/Excel', '/Api/PackageList/Excel', '/Api/CustomerBill/Excel', '/Api/OrderBill/Excel', '/Api/PriceTable/Export'];
    const _statusList2NotNeed2Toast = [1000, 9062, 8044];
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
    return response;
  },
  async (error) => {
    if (!store.state.common.isLoading) {
      if (getShowLoading(error.config) && loadingInstance) loadingInstance.close();
      if (error.response) {
        let key = false;
        let b;
        let r;
        let buffterRes;
        let buffterErr = '文件导出数据过大，请缩小导出时间区间或精确筛选条件';
        let _func = null;
        switch (error.response.status) {
          case 401:
            // if (process.env.NODE_ENV === 'development') {
            clearToken();
            _func = () => {
              router.replace('/login');
            };
            // }
            if (!closeTip) {
              messageBox.failSingleError(undefined, '[ 错误 401：请重新登录! ]', _func);
            } else {
              router.replace('/login');
            }
            key = true;
            break;
          case 404:
            messageBox.failSingleError('操作失败', '404 not found');
            key = true;
            break;
          case 413: // 处理文件导出错误
            b = new Blob([error.response.data]);
            r = new FileReader();
            r.readAsText(b, 'utf-8');
            buffterRes = await new Promise(resolve => { r.onload = res => resolve(res); });
            if (buffterRes && buffterRes.currentTarget && buffterRes.currentTarget.result) {
              buffterErr = buffterRes.currentTarget.result;
            }
            messageBox.failSingleError(undefined, `[ 错误 413：${buffterErr} ]`);
            key = true;
            break;
          default:
            messageBox.failSingleError('操作失败', `${error.response.data && error.response.data.Message ? error.response.data.Message : error.response.statusText}`);
            key = true;
            break;
        }
        if (key) return Promise.reject(error.response);
      }
      if (error.message === 'Network Error') {
        Message({
          showClose: true,
          message: '网络错误',
          type: 'error',
        });
      } else if (error.message.includes('timeout')) {
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
        let msg = '未知错误';
        if (error.response && error.response.data && error.response.data.Message) {
          msg = error.response.data.Message;
        } else if (error && error.message) {
          msg = error.message;
        }
        Message({
          showClose: true,
          message: msg,
          type: 'error',
        });
      }
    }
    return Promise.reject(error);
  },
);


export default axios;
