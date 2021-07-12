export const getAllSubItemList = (list, key = 'children') => {
  const _list = [];
  const pushItem2List = (arr) => {
    arr.forEach(it => {
      if (!it[key]) _list.push(it);
      else pushItem2List(it[key]);
    });
  };
  pushItem2List(list);
  return _list;
};

export const createOneNewIncreasedItem = (TargetID, title) => { // 得到一个新加子项目
  const ClassName = `新加${title}`;
  const ID = `${TargetID}Increased`;
  const isIncreased = true;
  return { ID, ClassName, isIncreased, TargetID };
};

export const getSelectedItemsList = (obj, title) => {
  if (!obj) return [];
  const _list = [];
  const getNum = (item) => {
    if (!item.List) {
      _list.push(item);
      return;
    }
    if (item.IsIncludeIncreased) {
      const newItem = createOneNewIncreasedItem(item.AreaList ? 'root' : item.ID, title);
      _list.push(newItem);
    }
    item.List.forEach(sub => {
      if (sub.List) getNum(sub);
      else {
        _list.push(sub);
      }
    });
  };
  if (obj.IsIncludeIncreased) {
    const newItem = createOneNewIncreasedItem(obj.AreaList ? 'root' : obj.ID, title);
    _list.push(newItem);
  }
  const list = obj.AreaList || obj.List;
  if (list) list.forEach(lv1 => getNum(lv1));
  if (!list && obj.isIncreased) _list.push(obj);
  return _list;
};

export default {
  getAllSubItemList,
  getSelectedItemsList,
  createOneNewIncreasedItem,
};
