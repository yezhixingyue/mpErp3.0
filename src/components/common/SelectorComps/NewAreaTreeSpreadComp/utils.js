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
      const newItem = createOneNewIncreasedItem((item.ID || item.ID === 0) ? item.ID : 'root', title);
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
    const newItem = createOneNewIncreasedItem((obj.ID || obj.ID === 0) ? obj.ID : 'root', title);
    _list.push(newItem);
  }
  const list = obj.List;
  if (list) list.forEach(lv1 => getNum(lv1));
  if (!list && obj.isIncreased) _list.push(obj);
  return _list;
};

export const getCheckAllListByCurDataList = (list, isRoot = false) => {
  const getInfo = (_list) => {
    const transformItem = (it) => {
      const { ID, ClassName, children, isIncreased } = it;
      if (isIncreased) return null;
      const Name = ClassName;
      const _temp = { ID, Name };
      if (Array.isArray(children)) {
        _temp.IsIncludeIncreased = false;
        const t = children.find(_it => _it.isIncreased);
        if (t) _temp.IsIncludeIncreased = true;
        _temp.List = getInfo(children);
      }
      return _temp;
    };
    const _tempList = _list.map(it => transformItem(it)).filter(it => it);
    return _tempList;
  };
  const List = getInfo(list);
  if (isRoot) return { IsIncludeIncreased: true, List };
  return List;
};

export const getFormalData4SubmitAfterChange = (item, value, data) => {
  const valueify = value
    ? JSON.parse(JSON.stringify(value))
    : { IsIncludeIncreased: false, List: [], ID: data ? data.ID : '', Name: data ? data.ClassName : '' };

  if (item.isIncreased) {
    return { ...valueify, IsIncludeIncreased: !valueify.IsIncludeIncreased };
  }
  const isDelete = !item || (!item.IsIncludeIncreased && (!item.List || item.List.length === 0));
  const i = valueify.List.findIndex(it => it.ID === item.ID);
  if (i > -1) { // 找到了
    if (isDelete) valueify.List.splice(i, 1);
    else valueify.List.splice(i, 1, item);
  } else if (!isDelete) { // 没找到 但设置的有 -- 要添加
    valueify.List.push(item);
  }
  return valueify;
  // 最后没找到且应删除 -- 不做处理
};

export const getSelectedContentBySelectedDataAndAllData = (item, treeData, title = '区域') => {
  if (!item || !treeData || treeData.length === 0) return '';
  const { IsIncludeIncreased, List } = item;
  if (!List || List.length === 0) {
    if (IsIncludeIncreased) return '只包含新加大区';
    return '无效区域';
  }

  const selectedLv1Ids = item.List.map(it => it.ID);
  let treeList = JSON.parse(JSON.stringify(treeData));
  const originLen = treeList.length;
  treeList = treeList.filter(it => selectedLv1Ids.includes(it.ID));
  treeList.forEach(lv1 => {
    const t = item.List.find(it => it.ID === lv1.ID);
    if (t) {
      const selectedLv2Ids = t.List.map(it => it.ID);
      const temp = lv1;
      const len1 = lv1.children.length;
      temp.children = lv1.children.filter(it => selectedLv2Ids.includes(it.ID));
      temp.IsIncludeIncreased = t.IsIncludeIncreased;
      temp.children.forEach(lv2 => {
        const t2 = t.List.find(it => it.ID === lv2.ID);
        if (t2) {
          const selectedLv3Ids = t2.List.map(it => it.ID);
          const temp2 = lv2;
          const len2 = lv2.children.length;
          temp2.children = lv2.children.filter(it => selectedLv3Ids.includes(it.ID));
          temp2.isCheckAll = false;
          temp2.IsIncludeIncreased = t2.IsIncludeIncreased;
          const aside = `(${temp2.IsIncludeIncreased ? `包含新加${title}` : `不含新加${title}`})`;
          temp2.content = `${temp2.ClassName}${aside}`;
          if (len2 === temp2.children.length) { // 包含全部
            temp2.isCheckAll = true;
            temp2.content = `${temp2.content}：全部${title}`;
          } else {
            const _content = temp2.children.map(it => it.ClassName).join('、');
            temp2.content = `${temp2.content}：[${_content}]`;
          }
        }
      });
      const aside = `(${temp.IsIncludeIncreased ? `包含新加${title}` : `不含新加${title}`})`;
      temp.content = `${temp.ClassName}${aside}`;
      const partial = temp.children.find(it => !it.isCheckAll || !it.IsIncludeIncreased);
      if (!partial && temp.children.length === len1) {
        temp.isCheckAll = true;
      } else {
        temp.isCheckAll = false;
        temp.content = {
          name: temp.content,
          list: temp.children.map(it => it.content),
        };
      }
    }
  });

  const _temp = {
    isCheckAll: false,
    content: '',
  };
  const aside = `${IsIncludeIncreased ? `包含新加${title}` : `不含新加${title}`}`;
  _temp.content = treeList.map(it => it.content);
  const partial = treeList.find(it => !it.isCheckAll || !it.IsIncludeIncreased);
  if (!partial && treeList.length === originLen) {
    _temp.isCheckAll = true;
    _temp.content = `全部${title}（${aside}）`;
  } else {
    _temp.content = treeList.map(it => it.content);
    _temp.content.unshift(aside);
  }
  return _temp.content;
};

export default {
  getAllSubItemList,
  getSelectedItemsList,
  createOneNewIncreasedItem,
  getCheckAllListByCurDataList,
  getFormalData4SubmitAfterChange,
  getSelectedContentBySelectedDataAndAllData,
};
