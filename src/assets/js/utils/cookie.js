// import messageBox from '@/assets/js/utils/message';

const Cookie = {
  /**
   * 设置cookie的方法
   *
   * @param {*} key
   * @param {*} value
   * @param {*} t 设置cookie的有效期时间： 单位为秒，如小时应为: 60 * 60 * 1，该时间为GMT标准时间，显示上会比北京时间早8个小时，但不影响使用
   */
  setCookie(key, value, t) {
    document.cookie = `${key}=${value};max-age=${t}`;
  },
  removeCookie(name) {
    this.setCookie(name, '', -1);
  },
  getCookie(key) {
    const arr1 = document.cookie.split('; ');
    for (let i = 0; i < arr1.length; i += 1) {
      const arr2 = arr1[i].split('=');
      if (arr2[0] === key) {
        return decodeURI(arr2[1]);
      }
    }
    return '';
  },
};


// function setToken2SessionStorage() {
//   const { getCookie } = Cookie;
//   const cookie = getCookie('ErpToken');

//   if (cookie) {
//     if (localStorage.getItem('ErpToken')) localStorage.removeItem('ErpToken');
//     localStorage.setItem('ErpToken', JSON.stringify(cookie));
//     return true;
//   }
//   messageBox.failSingleError(undefined, '[ 未获取到登录信息,请重新登录尝试 ]');
//   return false;
// }


// export default setToken2SessionStorage;

export default Cookie;
