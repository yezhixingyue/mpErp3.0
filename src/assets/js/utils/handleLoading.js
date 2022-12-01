import store from '@/store';
import messageBox from './message';

/**
 *
 *
 * @export 高阶函数，用于处理需要单独展示loading的网络请求处理，多用于弹窗loading展示
 * @param {*} requestFunc 网络请求函数
 * @param {*} beginFunc 开始网络请求前需要做的函数
 * @param {*} catchFunc 当网络请求失败后的回调函数
 */
export default async function handleLoading(requestFunc, beginFunc, catchFunc) {
  let key = true;
  beginFunc();
  store.commit('common/setIsLoading', true);
  await requestFunc().catch((error) => {
    key = false;
    messageBox.handleLoadingError(
      error,
      () => { catchFunc(); store.commit('common/setIsLoading', false); },
      () => { catchFunc(); store.commit('common/setIsLoading', false); },
    );
  });
  if (key) store.commit('common/setIsLoading', false);
}

// 调用示例：
// this.$utils.handleLoadingHOF(
//   () => this.getOrderDetail(), () => this.setIsShowDia(true), () => this.setIsShowDia(false),
// );
