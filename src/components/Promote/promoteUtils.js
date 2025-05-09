/* eslint-disable max-len */

export const reg = /^全部/;

export function getAreaList(SellAreaArray, allAreaTreeList, type = 'ClassName') {
  if (!SellAreaArray || SellAreaArray.length === 0) return [];
  const _allAreaTreeList = JSON.parse(JSON.stringify(allAreaTreeList));
  const _firstList = [...new Set(SellAreaArray.map(it => it.RegionalID))];
  const _secondList = [...new Set(SellAreaArray.map(it => it.CityID))];
  const _thirdList = [...new Set(SellAreaArray.map(it => it.CountyID))];
  let _allAreaTreeList1 = _allAreaTreeList.filter(level1 => _firstList.includes(level1.ID));
  _allAreaTreeList1 = _allAreaTreeList1.map(
    le1 => ({ ...le1, children: le1.children.filter(le2 => _secondList.includes(le2.ID)) }),
  );
  _allAreaTreeList1 = _allAreaTreeList1.map(
    le1 => {
      const _children = le1.children.map(
        le2 => {
          let _child;
          let key = true;
          le2.children.forEach(it => {
            if (!_thirdList.includes(it.ID)) key = false;
          });
          if (!key) {
            _child = le2.children.filter(le3 => _thirdList.includes(le3.ID));
          } else if (key) {
            _child = [`全部${le2[type]}区域`];
          }
          return ({ ...le2, children: _child });
        },
      );
      let _key = true;
      _children.forEach(_child => {
        if (!reg.test(_child.children[0])) _key = false;
      });
      if (_key) {
        const _arr = _allAreaTreeList.find(level1 => level1.ID === le1.ID);
        _arr.children.forEach(it => { // 遍历所有一级children中数据，如果有出现已提取出的2级列表中未包含遍历的子项目ID，说明并非全部子项目都为全部产品，即有２级分类项目中无产品选择出
          if (!_secondList.includes(it.ID) && it.children.length > 0) _key = false;
        });
      }
      const _last2ndChildren = _key ? [`全部${le1[type]}`] : _children;
      return ({
        ...le1,
        children: _last2ndChildren,
      });
    },
  );
  if (_allAreaTreeList1.length === allAreaTreeList.length) {
    let key = true;
    _allAreaTreeList1.forEach(it => {
      if (!reg.test(it.children[0])) key = false;
    });
    if (key) _allAreaTreeList1 = '全部区域';
  }
  return _allAreaTreeList1;
}

export default {
  getAreaList,
};
