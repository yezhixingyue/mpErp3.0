const pointStartNumberReg = /^\.\d+$/;
const pointEndReg = /\w+\.$/;

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
 * @description: 把数字组成的数组字符串拆分开为数组
 * @param {*} valueList
 * @return {*}
 */
export const getNumberValueList = (valueList) => {
  const reg = /\s|,|，/;
  return valueList.split(reg).filter(it => it);
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

export const getTreeTextDisplayContent = (value, allAdAreaTreeList, type = 'area', defaultLabels = null) => {
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
  if (defaultLabels) {
    defaultPropKeys = defaultLabels;
  }
  let title = '全部';
  if (type === 'area') title = '全部区域';
  if (type === 'sellArea') title = '全部销售区域';
  if (type === 'product') title = '全部产品';
  const labelName = type === 'area' ? 'Name' : 'ClassName';
  const list = [];
  if (Array.isArray(value) && value.length > 0) {
    value.forEach(it => { // 可能为省全部、市全部 也可能为单个城区
      if (it[defaultPropKeys.lv1Key] === 0) { // 全部区域
        list.push(title);
      } else if (it[defaultPropKeys.lv2Key] === 0) { // 全省
        const lv1 = allAdAreaTreeList.find(_it => _it.ID === it[defaultPropKeys.lv1Key]);
        if (lv1) {
          list.push(lv1[labelName]);
        }
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
  getValueIsOrNotNumber,
  getNumberValueList,
  getNameFromListByIDs,
  getTreeTextDisplayContent,
};
