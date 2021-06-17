
/**
 *
 *  获取订单列表中的订单状态信息，已基本不用，大部分场景由过滤器formatStatus代理
 * @export
 * @param {*} id 订单状态码
 * @param {*} OrderStatusList 状态码值和名称对应列表
 * @returns
 */
import handleLoadingHOF from './handleLoading';

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
  let _bool = !Number.isNaN(+val);
  if (_bool && isInteger) _bool = Number.isInteger(+val);
  return _bool;
};

/**
 * @description:  判断是否为正整数 返回bool值
 * @param {*} value
 * @param {*} canInfinite 是否允许无限大
 * @param {*} canZero 是否允许等于0
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
  getTreeDataFromListAndClassifyData,
};
