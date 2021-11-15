/*
 * @Describe: 在打开页面时 获取权限信息， 初始放置在这个位置，等以后有登录模块后在登录后进行获取
 * @FilePath: /src/assets/js/Permission/index.js
 */

import api from '@/api/index';

export default async function getPermission(token) {
  const _detailData = sessionStorage.getItem('staffDetailData');
  if (!_detailData) {
    let key = true;
    const res = await api.getStaffDetail().catch(() => { key = false; });
    if (key && res && res.status === 200 && res.data.Status === 1000) {
      sessionStorage.setItem('staffDetailData', JSON.stringify(res.data.Data));
      return res.data.Data;
    }
    return res && res.data ? res.data.Message : '获取账号信息失败，请刷新重试';
  }
  const data = JSON.parse(_detailData);
  if (data.Token === token) return data;
  sessionStorage.removeItem('staffDetailData');
  return getPermission(token);
}

// getPermission();
