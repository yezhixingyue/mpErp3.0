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
  return valueList.split(reg).filter((it) => it);
};

export const getNameFromListByIDs = (ids, list, defaultKeys = { label: 'Name', value: 'ID' }) => {
  if (typeof ids === 'string' || typeof ids === 'number') { // 单个Name模式， 返回单个ID
    const t = list.find((it) => it[defaultKeys.value] === ids);
    return t ? t[defaultKeys.label] : '';
  }
  if (Array.isArray(ids)) { // 传递进来的是Name列表模式，同样返回ID组成的列表
    const arr = ids.map((ID) => list.find((it) => it[defaultKeys.value] === ID)).filter((it) => it).map((it) => it[defaultKeys.label]);
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
    value.forEach((it) => { // 可能为省全部、市全部 也可能为单个城区
      if (it[defaultPropKeys.lv1Key] === 0) { // 全部区域
        list.push(title);
      } else if (it[defaultPropKeys.lv2Key] === 0) { // 全省
        const lv1 = allAdAreaTreeList.find((_it) => _it.ID === it[defaultPropKeys.lv1Key]);
        if (lv1) {
          list.push(lv1[labelName]);
        }
      } else if (it[defaultPropKeys.lv3Key] === 0 || it[defaultPropKeys.lv3Key] === '00000000-0000-0000-0000-000000000000') { // 全市
        const lv1 = allAdAreaTreeList.find((_it) => _it.ID === it[defaultPropKeys.lv1Key]);
        if (lv1) {
          const lv2 = lv1.children.find((_it) => _it.ID === it[defaultPropKeys.lv2Key]);
          if (lv2) {
            const item = { [labelName]: lv2[labelName], CountyList: [] };
            const t = list.find((_item) => _item.Province === lv1[labelName]);
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
        const lv1 = allAdAreaTreeList.find((_it) => _it.ID === it[defaultPropKeys.lv1Key]);
        if (lv1) {
          const lv2 = lv1.children.find((_it) => _it.ID === it[defaultPropKeys.lv2Key]);
          if (lv2) {
            const lv3 = lv2.children.find((_it) => _it.ID === it[defaultPropKeys.lv3Key]);
            if (lv3) {
              const _ProvinceItem = list.find((_item) => _item.Province === lv1[labelName]);
              if (_ProvinceItem) {
                const _CityItem = _ProvinceItem.CityList.find((city) => city[labelName] === lv2[labelName]);
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
  return list.map((it) => {
    if (typeof it === 'string') return it;
    const { Province, CityList } = it;
    return `${Province}：[${CityList.map((city) => {
      const { CountyList } = city;
      if (CountyList.length === 0) return `${city[labelName]}${title}`;
      const _Name = city[labelName] === Province ? '' : `${city[labelName]}：`;
      const CountyListContent = CountyList.join('、');
      return `${_Name}${CountyListContent}`;
    }).join('、')}]`;
  }).join('\r\n');
};

export const matchAllReg = /^全部/;

export const getProductArrayList = (ProductList, allProductClassify, defalutProps = {}) => {
  if (!ProductList || ProductList.length === 0) return [];
  const _allProductClassify = JSON.parse(JSON.stringify(allProductClassify));
  const _firstList = [...new Set(ProductList.map((it) => it[defalutProps.FirstLevelID || 'FirstLevelID']))];
  const _secondList = [...new Set(ProductList.map((it) => it[defalutProps.SecondLevelID || 'SecondLevelID']))];
  const _thirdList = [...new Set(ProductList.map((it) => it[defalutProps.ProductID || 'ProductID']))];
  let _allProductClassify1 = _allProductClassify.filter((level1) => _firstList.includes(level1.ID));
  // const _initLen1 = _allProductClassify1.children.length;
  _allProductClassify1 = _allProductClassify1.map(
    (le1) => ({ ...le1, children: le1.children.filter((le2) => _secondList.includes(le2.ID)) }),
  );
  // const _initLen2 = _allProductClassify1.children.length;
  _allProductClassify1 = _allProductClassify1.map(
    (le1) => {
      const _children = le1.children.map(
        (le2) => {
          let _child;
          let key = true;
          le2.children.forEach((it) => {
            if (!_thirdList.includes(it.ID)) key = false;
          });
          if (!key) {
            _child = le2.children.filter((le3) => _thirdList.includes(le3.ID));
          } else if (key) {
            _child = [`全部${le2.ClassName}产品`];
          }
          return ({ ...le2, children: _child });
        },
      ); // 判断及找出2级产品情况
      let _key = true;
      _children.forEach((_child) => {
        if (!matchAllReg.test(_child.children[0])) _key = false;
      });
      if (_key) { // 说明2级的children中都为全部产品
        const _arr = _allProductClassify.find((level1) => level1.ID === le1.ID);
        _arr.children.forEach((it) => { // 遍历所有一级children中数据，如果有出现已提取出的2级列表中未包含遍历的子项目ID，说明并非全部子项目都为全部产品，即有２级分类项目中无产品选择出
          if (!_secondList.includes(it.ID)) _key = false;
        });
      }
      const _last2ndChildren = _key ? [`全部${le1.ClassName}产品`] : _children;
      return ({
        ...le1,
        children: _last2ndChildren,
      });
    },
  );
  // console.log(_allProductClassify1.length, allProductClassify.filter(it => it.children > 0).length);
  if (_allProductClassify1.length === allProductClassify.filter((it) => it.children.length > 0).length) {
    let key = true;
    _allProductClassify1.forEach((it) => {
      if (!matchAllReg.test(it.children[0])) key = false;
    });
    if (key) _allProductClassify1 = '全部产品';
  }
  return _allProductClassify1;
};

export const generateProductString = (ProductList, allProductClassify, defalutProps) => {
  if (!Array.isArray(ProductList) || !Array.isArray(allProductClassify) || ProductList.length === 0 || allProductClassify.length === 0) return '';
  try {
    const _defalutProps = defalutProps || { FirstLevelID: 'FirstLevelID', SecondLevelID: 'SecondLevelID', ProductID: 'ProductID' };
    const temp = getProductArrayList(ProductList, allProductClassify, _defalutProps);
    const _textArr = [];
    if (temp === '全部产品') return ['全部产品'];
    temp.forEach((l1) => {
      if (matchAllReg.test(l1.children[0])) {
        _textArr.push(`${l1.ClassName}全部产品`);
      } else {
        let _text = `${l1.ClassName}：[`;
        l1.children.forEach((l2, i2) => {
          if (i2 > 0) {
            _text += '、';
          }
          if (matchAllReg.test(l2.children[0])) {
            _text += `全部${l2.ClassName}产品 `;
          } else {
            _text += `${l2.ClassName}`;
            let str = '';
            l2.children.forEach((l3, i) => {
              if (i === 0) {
                str += `${l3.ClassName}`;
              } else {
                str += `、${l3.ClassName}`;
              }
            });
            if (str) {
              _text += ': ';
              _text += str;
            }
          }
        });
        _text += ']';
        _textArr.push(_text);
      }
    });
    return _textArr.join('\r\n');
  } catch (error) {
    return '';
  }
};

export const getTimeStrByMinutes = (Value) => {
  if (/^\d+$/.test(Value)) { // 字符串时间格式反转
    const paddingBit = (num) => `0${num}`.slice(-2); // 补充位数至2位
    return `${paddingBit(Math.floor(Value / 60))}:${paddingBit(Value % 60)}`;
  }

  return Value;
};

export default {
  getValueIsOrNotNumber,
  getNumberValueList,
  getNameFromListByIDs,
  getTreeTextDisplayContent,
  generateProductString,
};
