/*
 * @Author: your name
 * @Date: 2020-05-11 12:16:03
 * @LastEditTime: 2020-05-26 10:36:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \orderList\src\assets\js\setInfo.js
 */

/**
 * 用于获得登录令牌，已弃用
 *
 * @param {*} token
 * @returns
 */
const setInfo = (token) => {
  if (!token) return;
  if (sessionStorage.getItem('ErpToken')) sessionStorage.removeItem('ErpToken');
  sessionStorage.setItem('ErpToken', JSON.stringify(token));
  delete window.setInfo;
};

export default setInfo;
