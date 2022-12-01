import Vue from 'vue';

/**
 * 转换中长类型时间格式：   从 2020-07-24T23:59:59.997  转换为  2020-07-24  23:59
 */
export const formatDateForDisplay = (date: string) => {
  if (!date) return '';
  const _arr = date.split('T');
  const [t1, t2s] = _arr;
  const t2 = t2s.split('.')[0].slice(0, -3);
  return `${t1}  ${t2}`;
};
Vue.filter('formatDateForDisplay', formatDateForDisplay);
