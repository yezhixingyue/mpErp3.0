export default (value, list) => {
  const validList = list.filter(it => it.children.length > 0);
  const selectedLv1Ids = value.map(it => it.ClassID);
  const selectedLv2Ids = value.map(it => it.TypeID);
  const _selectlist = validList.filter(it => selectedLv1Ids.includes(it.ID));
  const arr = _selectlist.map(lv1 => {
    const _list = lv1.children.filter(it => selectedLv2Ids.includes(it.ID));
    if (_list.length === lv1.children.length) {
      return `${lv1.ClassName}全部`;
    }
    return `${lv1.ClassName}：[${_list.map(it => it.ClassName).join('、')}]`;
  });
  if (arr.length === validList.length && arr.every(it => it.includes('全部'))) {
    return '全部产品';
  }
  return arr.join('\r\n');
};
