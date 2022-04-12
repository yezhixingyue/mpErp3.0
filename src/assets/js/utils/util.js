
import { v4 as uuidv4 } from 'uuid';
/**
 *
 *  获取订单列表中的订单状态信息，已基本不用，大部分场景由过滤器formatStatus代理
 * @export
 * @param {*} id 订单状态码
 * @param {*} OrderStatusList 状态码值和名称对应列表
 * @returns
 */
import handleLoadingHOF from './handleLoading';

import { normalNameReg, pointStartNumberReg, pointEndReg } from './regexp';

// import { UseModuleList } from '../TypeClass/PropertyClass';

export function getStatusString(id, OrderStatusList) {
  const num = parseInt(id, 10);
  for (let i = 0; i < OrderStatusList.length; i += 1) {
    if (OrderStatusList[i].ID === num) {
      return OrderStatusList[i].name;
    }
  }
  return '';
}
/**
 *
 *  获取快递类型中文名称，订单列表中使用
 * @export
 * @param {*} type  传入快递编码，返回快递类型
 * @returns
 */
export function getExpress(type) {
  if (type === 1) return '自建物流';
  if (type === 2) return '物流';
  if (type === 3) return '快递';
  return '';
}

/**
 *
 * 获取付款单状态信息，返回中文状态名称
 * @export
 * @param {*} Status  付款单的状态值
 * @param {*} PayStatusList  付款单状态值和名字对应表
 * @returns
 */
export function getPaymentStatus(Status, PayStatusList) {
  const num = parseInt(Status, 10);
  for (let i = 0; i < PayStatusList.length; i += 1) {
    if (PayStatusList[i].ID === num) return PayStatusList[i].Name;
  }
  return '';
}

/**
 * 传入时间，返回对应时间的时间戳
 *
 * @export
 * @param {*} time  格式：2020-04-03T14:41:26.977
 * @returns 对应时间戳
 */
export function getTimeStamp(time) {
  if (!time) return '';
  const d = time.split('T')[0];
  const h = time.split('T')[1];
  const date = new Date();

  date.setFullYear(d.split('-')[0]);
  date.setMonth(d.split('-')[1] - 1);
  date.setDate(d.split('-')[2]);

  date.setHours(h.split(':')[0]);
  date.setMinutes(h.split(':')[1]);
  date.setSeconds(h.split(':')[2]);

  return date.getTime();
}

/**
* 在300毫秒之内，从指定的初始值，变化到结束值
* @param {*} start 起始位置
* @param {*} end 结束位置
*/
export function animateScroll(start, end, callback) {
  let num = start;
  const tick = 16; // 每隔16毫秒完成一次变化
  const total = 300;
  const times = Math.ceil(total / tick); // 变化的次数
  let curTimes = 0;
  const dis = (end - start) / times; // 总距离/次数，每次运动的距离
  const timer = setInterval(() => {
    curTimes += 1;
    num += dis;
    if (curTimes === times) {
      num = end;
      clearInterval(timer);
    }
    callback(num);
  }, tick);
  return timer;
}

/**
 * @param {*} value  传入一个value值，对其进行筛选，只返回数字部分, 用于设置只允许输入数字类型的input框
 */
export function filterNumber(value) {
  return String(value).replace(/[^\d.]/g, '');
}

/**
 * 转换后端传入时间格式为页面展示时间格式
 * @param {*} date 后端提供的时间格式
 */
export function getDateFormat(date) {
  return date ? date.split('.')[0].slice(0, -3).replace('T', ' ') : '';
}

/**
 * 转换时间格式
 * @param {*} date
 */
export function getDateFormat2Date(date) {
  return date ? date.split('T')[0] : '';
}

async function handleAsyncFunc(func, res, index, list) {
  if (index >= list.length) return;
  const _s = await func(list[index]);
  res.push(_s);
  const i = index + 1;
  await handleAsyncFunc(func, res, i, list);
}

/**
 * @description: 用于非并发方式处理数组组成的异步函数， 和上面函数为一体
 * @param {type}
 * @return {type}
 */
export async function asyncNonCurrentFunc(func, list) {
  if (!list || list.length === 0) return [];
  const res = [];
  await handleAsyncFunc(func, res, 0, list);
  return res;
}


/**
 * @description: 用于获取文件后缀名的方法
 * @param {type}
 * @return {type}
 */
export function extname(filename) {
  if (!filename || typeof filename !== 'string') {
    return '未知类型';
  }
  const a = filename.split('').reverse().join('');
  const b = a.substring(0, a.search(/\./)).split('').reverse().join('');
  return b;
}

/**
 * @description: 获取一个随机的ID值
 * @param {*} num 获取ID值的位数
 * @return {*}
 */
export const getRandomRangeId = (num) => {
  let returnStr = '';
  const charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < num; i += 1) {
    const index = Math.round(Math.random() * (charStr.length - 1));
    returnStr += charStr.substring(index, index + 1);
  }
  return returnStr;
};

/**
 * @description: 给一个值，判断该值是否为数字类型，返回布尔值结果 但isInteger值为true时则判断是否为整数类型 为true则为数字类型
 * @param {*} val
 * @return {*}
 */
export const getValueIsOrNotNumber = (val, isInteger) => {
  if (!val && val !== 0) return false;
  if (pointStartNumberReg.test(val) || pointEndReg.test(val)) return false;
  const _val = typeof val === 'number' ? val : +val;
  let _bool = !Number.isNaN(_val);
  if (_bool && isInteger) _bool = Number.isInteger(_val);
  return _bool;
};

/**
 * @description:  判断是否为正整数 返回bool值
 * @param {*} value
 * @param {*} canInfinite 是否允许无限大 即是否可为-1
 * @param {*} canZero 是否允许等于0 是否可为0
 * @return {*}
 */
export const isPositiveInteger = (value, canInfinite, canZero) => {
  if (!Number.isInteger(value)) return false; // 不是整数 直接返回false
  if (!canZero) {
    return canInfinite ? (value > 0 || value === -1) : value > 0;
  }
  return canInfinite ? (value >= 0 || value === -1) : value >= 0;
};

/**
 * @description: 把数字组成的数组字符串拆分开为数组
 * @param {*} valueList
 * @return {*}
 */
export const getNumberValueList = (valueList) => {
  const reg = /\s|,|，/;
  return valueList.split(reg).filter(it => it);
};

/**
 * @description: 计算笛卡尔积
 * @param {*} array 由数组组成的数组
 * @return {*}
 */
export const calcDescartes = (array) => {
  if (array.length < 2) return array[0] || [];
  return array.reduce((total, currentValue) => {
    const res = [];

    total.forEach(t => {
      currentValue.forEach(cv => {
        if (t instanceof Array) res.push([...t, cv]);
        else res.push([t, cv]);
      });
    });
    return res;
  });
};

/**
 * @description: 从一个列表中，根据传递进来的Name值或Name列表获取到其对应的ID值或ID列表，进行对应返回
 * @param {*} Names
 * @param {*} list
 * @param {*} defaultKeys
 * @return {*}
 */
export const getIDFromListByNames = (Names, list, defaultKeys = { label: 'Name', value: 'ID' }) => {
  if (typeof Names === 'string') { // 单个Name模式， 返回单个ID
    const t = list.find(it => it[defaultKeys.label] === Names);
    return t ? t[defaultKeys.value] : '';
  }
  if (Array.isArray(Names)) { // 传递进来的是Name列表模式，同样返回ID组成的列表
    const arr = Names.map(Name => list.find(it => it[defaultKeys.label] === Name)).filter(it => it).map(it => it[defaultKeys.value]);
    return arr.length > 0 ? arr : '';
  }
  return '';
};

export const getNameFromListByIDs = (ids, list, defaultKeys = { label: 'Name', value: 'ID' }) => {
  if (typeof ids === 'string' || typeof ids === 'number') { // 单个Name模式， 返回单个ID
    const t = list.find(it => it[defaultKeys.value] === ids);
    return t ? t[defaultKeys.label] : '';
  }
  if (Array.isArray(ids)) { // 传递进来的是Name列表模式，同样返回ID组成的列表
    const arr = ids.map(ID => list.find(it => it[defaultKeys.value] === ID)).filter(it => it).map(it => it[defaultKeys.label]);
    return arr.length > 0 ? arr : '';
  }
  return '';
};

// export const getModuleName = (module) => getNameFromListByIDs(module, UseModuleList);

/**
 * @description: 通过分类列表数据 及 列表数据 来形成分级树形数据结构
 * @param {*} list
 * @param {*} classData
 * @return {*}
 */
export const getTreeDataFromListAndClassifyData = (list, classData) => {
  if (list.length === 0 || classData.length === 0) return [];
  let _list = JSON.parse(JSON.stringify(classData));
  list.forEach(it => {
    const { FirstLevel, SecondLevel } = it.Classify;
    const _lv1 = _list.find(lv1 => lv1.ID === FirstLevel.ID);
    if (_lv1) {
      const _lv2 = _lv1.children.find(lv2 => lv2.ID === SecondLevel.ID);
      if (_lv2) {
        if (!_lv2.children) _lv2.children = [];
        _lv2.children.push(it);
      }
    }
  });
  _list.forEach(lv1 => {
    const t = lv1;
    t.children = t.children.filter(lv2 => lv2.children && lv2.children.length > 0);
  });
  _list = _list.filter(it => it.children && it.children.length > 0);
  return _list;
};

export const checkName = name => normalNameReg.test(name);

/**
 * @description: 获取一个UUID
 * @param {*}
 * @return {*}
 */
export const getAUUID = () => uuidv4();

/**
 * 判断数组中是否存在重复项
 *
 * @param {*} list
 */
export const getIsOrNotHasRepeatItemInArray = list => {
  if (!Array.isArray(list) || list.length < 2) return false;
  const len1 = list.length;
  const len2 = [...new Set(list)].length;
  return len1 > len2;
};

export const getFormatDateString = (date) => {
  const _date = date ? new Date(date) : new Date();
  const y = _date.getFullYear();
  const m = `0${_date.getMonth() + 1}`.slice(-2);
  const d = `0${_date.getDate()}`.slice(-2);
  const h = `0${_date.getHours()}`.slice(-2);
  const minute = `0${_date.getMinutes()}`.slice(-2);
  const s = `0${_date.getSeconds()}`.slice(-2);
  return `${y}-${m}-${d}T${h}:${minute}:${s}`;
};

/**
 * 数组乱序
 *
 * @param {*} arr
 */
export const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

/**
 * 复制到粘贴板
 *
 * @param {*} text
 */
export const copyToClipboard = (text) => navigator.clipboard?.writeText && navigator.clipboard.writeText(text);


/**
 * 检测黑暗模式
 *
 */
export const isDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

/**
 * 滚动到顶部
 *
 * @param {*} element
 */
export const scrollToTop = element => element.scrollIntoView({ behavior: 'smooth', block: 'start' });

/**
 * 滚动到顶部
 *
 * @param {*} element
 */
export const scrollToBottom = element => element.scrollIntoView({ behavior: 'smooth', block: 'end' });

/**
 * 生成随机颜色
 *
 */
export const generateRandomHexColor = () => `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;

export const getTreeTextDisplayContent = (value, allAdAreaTreeList, type = 'area') => {
  let defaultPropKeys = {
    rootKey: 'CountryID',
    lv1Key: 'ProvinceID',
    lv2Key: 'CityID',
    lv3Key: 'CountyID',
  };
  if (type === 'product') {
    defaultPropKeys = {
      rootKey: 'root',
      lv1Key: 'FirstLevelID',
      lv2Key: 'SecondLevelID',
      lv3Key: 'ProductID',
    };
  }
  let title = '全部';
  if (type === 'area') title = '全部区域';
  if (type === 'product') title = '全部产品';
  const labelName = type === 'product' ? 'ClassName' : 'Name';
  const list = [];
  if (Array.isArray(value) && value.length > 0) {
    value.forEach(it => { // 可能为省全部、市全部 也可能为单个城区
      if (it[defaultPropKeys.lv1Key] === 0) { // 全部区域
        list.push(title);
      } else if (it[defaultPropKeys.lv2Key] === 0) { // 全省
        const lv1 = allAdAreaTreeList.find(_it => _it.ID === it[defaultPropKeys.lv1Key]);
        if (lv1) list.push(lv1[labelName]);
      } else if (it[defaultPropKeys.lv3Key] === 0 || it[defaultPropKeys.lv3Key] === '00000000-0000-0000-0000-000000000000') { // 全市
        const lv1 = allAdAreaTreeList.find(_it => _it.ID === it[defaultPropKeys.lv1Key]);
        if (lv1) {
          const lv2 = lv1.children.find(_it => _it.ID === it[defaultPropKeys.lv2Key]);
          if (lv2) {
            const item = { [labelName]: lv2[labelName], CountyList: [] };
            const t = list.find(_item => _item.Province === lv1[labelName]);
            if (t) {
              t.CityList.push(item);
            } else {
              const temp = {
                Province: lv1[labelName],
                CityList: [item],
              };
              list.push(temp);
            }
          }
        }
      } else { // 单个城区
        const lv1 = allAdAreaTreeList.find(_it => _it.ID === it[defaultPropKeys.lv1Key]);
        if (lv1) {
          const lv2 = lv1.children.find(_it => _it.ID === it[defaultPropKeys.lv2Key]);
          if (lv2) {
            const lv3 = lv2.children.find(_it => _it.ID === it[defaultPropKeys.lv3Key]);
            if (lv3) {
              const _ProvinceItem = list.find(_item => _item.Province === lv1[labelName]);
              if (_ProvinceItem) {
                const _CityItem = _ProvinceItem.CityList.find(city => city[labelName] === lv2[labelName]);
                if (_CityItem) {
                  _CityItem.CountyList.push(lv3[labelName]);
                } else {
                  _ProvinceItem.CityList.push({ [labelName]: lv2[labelName], CountyList: [lv3[labelName]] });
                }
              } else {
                const temp = {
                  Province: lv1[labelName],
                  CityList: [{ [labelName]: lv2[labelName], CountyList: [lv3[labelName]] }],
                };
                list.push(temp);
              }
            }
          }
        }
      }
    });
  }
  return list.map(it => {
    if (typeof it === 'string') return it;
    const { Province, CityList } = it;
    return `${Province}：[${CityList.map(city => {
      const { CountyList } = city;
      if (CountyList.length === 0) return `${city[labelName]}${title}`;
      const _Name = city[labelName] === Province ? '' : `${city[labelName]}：`;
      const CountyListContent = CountyList.join('、');
      return `${_Name}${CountyListContent}`;
    }).join('、')}]`;
  }).join('\r\n');
};


export default {
  getStatusString,
  getExpress,
  getPaymentStatus,
  getTimeStamp,
  animateScroll,
  filterNumber,
  getDateFormat,
  handleLoadingHOF,
  getDateFormat2Date,
  asyncNonCurrentFunc,
  extname,
  getRandomRangeId,
  getValueIsOrNotNumber,
  isPositiveInteger,
  getNumberValueList,
  calcDescartes,
  getIDFromListByNames,
  getNameFromListByIDs,
  // getModuleName,
  getTreeDataFromListAndClassifyData,
  checkName,
  getAUUID,
  getIsOrNotHasRepeatItemInArray,
  getFormatDateString,
  shuffleArray,
  copyToClipboard,
  isDarkMode,
  scrollToTop,
  scrollToBottom,
  generateRandomHexColor,
  getTreeTextDisplayContent,
};
