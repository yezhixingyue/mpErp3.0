const getPartName = (Name, Data, ApplyRange) => {
  const { CraftID, GroupID } = ApplyRange;
  if (CraftID && GroupID) { // 此处如果有值 则肯定是工艺上可以多次使用的元素组
    // 工艺元素组
    const { CraftList } = Data;
    const targetCraft = CraftList.find(it => it.ID === CraftID);
    if (targetCraft) {
      const targetGroup = targetCraft.GroupList?.find(_it => _it.ID === GroupID);
      if (targetGroup) {
        const _Name = `${targetCraft.ShowName}-${targetGroup.Name}`;
        if (Name === '产品') return _Name;
        return `${Name}-${_Name}`;
      }
    }
  }
  return Name;
};

export const insertShowName4SolutionList = (PriceTableList, ProductData) => { // 为tab名附加部件名称信息 及 数据列表条数信息(还未完成 缺少数值更新)
  if (!ProductData || !Array.isArray(ProductData.PartList) || !PriceTableList) return PriceTableList;
  return PriceTableList.map(it => {
    const { ApplyRange, Name, TableNumber } = it;
    let _PartName = '';
    if (ApplyRange.PartID) {
      const t = ProductData.PartList.find(_it => _it.ID === ApplyRange.PartID);
      if (t) {
        _PartName = getPartName(t.Name, t, ApplyRange);
      }
    } else {
      _PartName = getPartName('产品', ProductData, ApplyRange);
    }
    const Count = TableNumber; // ------------- 后面补充赋值 已好
    const ShowName = _PartName ? `${Name} [${_PartName}]` : Name;
    return { ...it, ShowName, Count };
  });
};

export default {
  insertShowName4SolutionList,
};
