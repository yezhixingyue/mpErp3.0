export const insertShowName4SolutionList = (PriceTableList, ProductData) => { // 为tab名附加部件名称信息 及 数据列表条数信息(还未完成 缺少数值更新)
  if (!ProductData || !Array.isArray(ProductData.PartList) || !PriceTableList) return PriceTableList;
  return PriceTableList.map(it => {
    const { ApplyRange, Name, TableNumber } = it;
    let _PartName = '';
    if (ApplyRange.PartID) {
      const t = ProductData.PartList.find(_it => _it.ID === ApplyRange.PartID);
      if (t) {
        _PartName = t.Name;
      }
    } else {
      _PartName = '产品';
    }
    const Count = TableNumber; // ------------- 后面补充赋值 已好
    const ShowName = _PartName ? `${Name} [${_PartName}]` : Name;
    return { ...it, ShowName, Count };
  });
};

export default {
  insertShowName4SolutionList,
};
