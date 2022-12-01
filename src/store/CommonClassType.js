import store from '@/store';

export default class CommonClassType {
  static setDate(obj, key = 'Date', defalutProps = { First: 'First', Second: 'Second' }) {
    const _obj = obj;
    switch (obj.DateType) {
      case 'all':
        _obj[key][defalutProps.First] = store.getters['timeSelectModule/AlltimeDate'].First;
        _obj[key][defalutProps.Second] = store.getters['timeSelectModule/AlltimeDate'].Second;
        break;
      case 'today':
        _obj[key][defalutProps.First] = store.getters['timeSelectModule/TodayDate'].First;
        _obj[key][defalutProps.Second] = store.getters['timeSelectModule/TodayDate'].Second;
        break;
      case 'yesterday':
        _obj[key][defalutProps.First] = store.getters['timeSelectModule/YesterdayDate'].First;
        _obj[key][defalutProps.Second] = store.getters['timeSelectModule/YesterdayDate'].Second;
        break;
      case 'beforeyesterday':
        _obj[key][defalutProps.First] = store.getters['timeSelectModule/BeforeYesterdayTimeDate'].First;
        _obj[key][defalutProps.Second] = store.getters['timeSelectModule/BeforeYesterdayTimeDate'].Second;
        break;
      case 'curWeek':
        _obj[key][defalutProps.First] = store.getters['timeSelectModule/curWeekDate'].First;
        _obj[key][defalutProps.Second] = store.getters['timeSelectModule/curWeekDate'].Second;
        break;
      case 'lastWeek':
        _obj[key][defalutProps.First] = store.getters['timeSelectModule/lastWeekDate'].First;
        _obj[key][defalutProps.Second] = store.getters['timeSelectModule/lastWeekDate'].Second;
        break;
      case 'curMonth':
        _obj[key][defalutProps.First] = store.getters['timeSelectModule/curMonthDate'].First;
        _obj[key][defalutProps.Second] = store.getters['timeSelectModule/curMonthDate'].Second;
        break;
      case 'lastMonth':
        _obj[key][defalutProps.First] = store.getters['timeSelectModule/lastMonthDate'].First;
        _obj[key][defalutProps.Second] = store.getters['timeSelectModule/lastMonthDate'].Second;
        break;
      case 'last2Month':
        _obj[key][defalutProps.First] = store.getters['timeSelectModule/last2MonthDate'].First;
        _obj[key][defalutProps.Second] = store.getters['timeSelectModule/last2MonthDate'].Second;
        break;
      default:
        if (store.getters[`timeSelectModule/${obj.DateType}`]) {
          _obj[key][defalutProps.First] = store.getters[`timeSelectModule/${obj.DateType}`].First;
          _obj[key][defalutProps.Second] = store.getters[`timeSelectModule/${obj.DateType}`].Second;
        }
        break;
    }
  }

  static filter(obj, bool = false) { // 布尔值用于判断是否保留value为0的键值对，为true时保留，为false不保留
    const _tempObj = {};
    // console.log(obj);
    if (!obj) return {};
    Object.keys(obj).forEach(key => {
      if (Object.prototype.toString.call(obj[key]) !== '[object Object]') {
        if ((obj[key] && key !== 'DateType') || (bool && obj[key] === 0) || obj[key] === false) _tempObj[key] = obj[key];
      } else {
        const _t = obj[key];
        Object.keys(_t).forEach(subKey => {
          if (_t[subKey]) {
            if (!_tempObj[key]) _tempObj[key] = {};
            _tempObj[key][subKey] = _t[subKey];
          }
        });
      }
    });
    return _tempObj;
  }

  /**
   * 根据平铺开的两级列表数据生成树形结构列表数据
   *
   * @static
   * @param {*} list 两级组合列表数据
   * @param {*} bool 是否去除下级列表为空的项
   * @returns
   * @memberof ClassType
   */
  static getTwoLevelsClassifyDataFromList(list, bool) {
    if (!list || !Array.isArray(list) || list.length === 0) return [];

    let level1List = list // 挑选第一级分类
      .filter(item => item.Level === 1)
      .map(item => ({ ...item, children: [] }))
      .sort((a, b) => a.Index - b.Index);
    // 设置第二级分类
    level1List.forEach(level1 => {
      const _list = list.filter(item => item.Level === 2 && item.ParentID === level1.ID).sort((a, b) => a.Index - b.Index);
      const _level1 = level1;
      _level1.children = _list;
    });
    // 筛选去除无下属产品的分类 bool --- 确定是否保留无下属产品分类 （当设置排序时不应删除） 为true时不删除
    if (!bool) level1List = level1List.filter(leve1 => leve1.children.length > 0);

    return level1List;
  }
}
