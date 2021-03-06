import store from '@/store';
import { getProductArrayList, reg } from '@/components/Promote/promoteUtils';

export default class CommonClassType {
  static setDate(obj, key = 'Date') {
    const _obj = obj;
    // console.log(obj[key], store);
    const dateTypeList = ['all', 'today', 'yesterday', 'beforeyesterday', 'curWeek', 'lastWeek', 'curMonth', 'lastMonth'];
    if (dateTypeList.includes(obj.DateType)) {
      switch (obj.DateType) {
        case 'all':
          _obj[key].First = store.getters['timeSelectModule/AlltimeDate'].First;
          _obj[key].Second = store.getters['timeSelectModule/AlltimeDate'].Second;
          break;
        case 'today':
          _obj[key].First = store.getters['timeSelectModule/TodayDate'].First;
          _obj[key].Second = store.getters['timeSelectModule/TodayDate'].Second;
          break;
        case 'yesterday':
          _obj[key].First = store.getters['timeSelectModule/YesterdayDate'].First;
          _obj[key].Second = store.getters['timeSelectModule/YesterdayDate'].Second;
          break;
        case 'beforeyesterday':
          _obj[key].First = store.getters['timeSelectModule/BeforeYesterdayTimeDate'].First;
          _obj[key].Second = store.getters['timeSelectModule/BeforeYesterdayTimeDate'].Second;
          break;
        case 'curWeek':
          _obj[key].First = store.getters['timeSelectModule/curWeekDate'].First;
          _obj[key].Second = store.getters['timeSelectModule/curWeekDate'].Second;
          break;
        case 'lastWeek':
          _obj[key].First = store.getters['timeSelectModule/lastWeekDate'].First;
          _obj[key].Second = store.getters['timeSelectModule/lastWeekDate'].Second;
          break;
        case 'curMonth':
          _obj[key].First = store.getters['timeSelectModule/curMonthDate'].First;
          _obj[key].Second = store.getters['timeSelectModule/curMonthDate'].Second;
          break;
        case 'lastMonth':
          _obj[key].First = store.getters['timeSelectModule/lastMonthDate'].First;
          _obj[key].Second = store.getters['timeSelectModule/lastMonthDate'].Second;
          break;
        default:
          break;
      }
    }
  }

  static filter(obj, bool = false) { // ?????????????????????????????????value???0??????????????????true???????????????false?????????
    const _tempObj = {};
    // console.log(obj);
    if (!obj) return {};
    Object.keys(obj).forEach(key => {
      if (Object.prototype.toString.call(obj[key]) !== '[object Object]') {
        if ((obj[key] && key !== 'DateType') || (bool && obj[key] === 0)) _tempObj[key] = obj[key];
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
   * ?????????????????????????????????
   *
   * @static
   * @param {*} ProductList  ????????????????????????
   * @param {*} allProductClassify ???????????????????????????
   * @param {*} defalutProps ?????????????????????????????????????????????????????????
   * @returns
   * @memberof ClassType
   */
  static generateProductString(ProductList, allProductClassify, defalutProps) {
    if (!Array.isArray(ProductList) || !Array.isArray(allProductClassify) || ProductList.length === 0 || allProductClassify.length === 0) return '';
    try {
      const _defalutProps = defalutProps || { FirstLevelID: 'FirstLevelID', SecondLevelID: 'SecondLevelID', ProductID: 'ProductID' };
      const temp = getProductArrayList(ProductList, allProductClassify, _defalutProps);
      const _textArr = [];
      if (temp === '????????????') return ['????????????'];
      temp.forEach(l1 => {
        if (reg.test(l1.children[0])) {
          _textArr.push(`${l1.ClassName}????????????`);
        } else {
          let _text = `${l1.ClassName}???[`;
          l1.children.forEach((l2, i2) => {
            if (i2 > 0) {
              _text += '???';
            }
            if (reg.test(l2.children[0])) {
              _text += `??????${l2.ClassName}?????? `;
            } else {
              _text += `${l2.ClassName}: `;
              l2.children.forEach((l3, i) => {
                if (i === 0) {
                  _text += `${l3.ClassName}`;
                } else {
                  _text += `???${l3.ClassName}`;
                }
              });
            }
          });
          _text += ']';
          _textArr.push(_text);
        }
      });
      return _textArr.join('\n');
    } catch (error) {
      return '';
    }
  }

  /**
   * ??????????????????????????????????????????????????????????????????
   *
   * @static
   * @param {*} list ????????????????????????
   * @param {*} bool ????????????????????????????????????
   * @returns
   * @memberof ClassType
   */
  static getTwoLevelsClassifyDataFromList(list, bool) {
    if (!list || !Array.isArray(list) || list.length === 0) return [];

    let level1List = list // ?????????????????????
      .filter(item => item.Level === 1)
      .map(item => ({ ...item, children: [] }))
      .sort((a, b) => a.Index - b.Index);
    // ?????????????????????
    level1List.forEach(level1 => {
      const _list = list.filter(item => item.Level === 2 && item.ParentID === level1.ID).sort((a, b) => a.Index - b.Index);
      const _level1 = level1;
      _level1.children = _list;
    });
    // ???????????????????????????????????? bool --- ??????????????????????????????????????? ???????????????????????????????????? ???true????????????
    if (!bool) level1List = level1List.filter(leve1 => leve1.children.length > 0);

    return level1List;
  }
}
