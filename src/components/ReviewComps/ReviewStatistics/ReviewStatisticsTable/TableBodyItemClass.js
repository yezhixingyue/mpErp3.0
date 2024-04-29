export default class TableBodyItemClass {
  List = [] // { ID Name DataList }

  // constructor(curGroup, datas) {
  constructor(datas) {
    this.List = [];
    // console.log(datas);
    if (!datas) return;
    const { DataList, MemberList, ProductList } = datas;
    if (!Array.isArray(DataList) || !Array.isArray(MemberList) || !Array.isArray(ProductList)) return;

    // 生成组成员列表数据
    // const list = curGroup.List
    //   .map(staffId => MemberList.find(it => it.ID === staffId)) // 1. 获取到员工信息
    //   .filter(it => it) // 2. 筛选掉为空的
    const list = MemberList.map(staff => ({ // 3. 寻找并附加上具体统计数据 -- 通过对应员工ID和产品类别ID
      ...staff,
      DataList: ProductList
        .map(p => DataList.find(it => it.StaffID === staff.ID && it.TypeID === p.ID)
           || { KindCount: 0, OrderCount: 0, TotalAmount: 0, StaffID: staff.ID, TypeID: p.ID }),
    }))
      .map(it => { // 4. 为每一行添加上合计信息
        const KindCount = it.DataList.map(_it => _it.KindCount).reduce((a, b) => a + b, 0);
        const OrderCount = it.DataList.map(_it => _it.OrderCount).reduce((a, b) => a + b, 0);
        const TotalAmount = it.DataList.map(_it => _it.TotalAmount).reduce((a, b) => a + b, 0);
        return {
          ...it,
          key: Math.random().toString(16).slice(-10),
          DataList: [...it.DataList, { KindCount, OrderCount, TotalAmount: +(TotalAmount.toFixed(1)), StaffID: '', TypeID: -1 }],
        };
      });
    // 添加组及组合计信息
    const HeaderDataList = [];

    for (let i = 0; i <= ProductList.length; i += 1) {
      const _list = list.map(it => it.DataList[i]);
      const KindCount = _list.map(_it => _it.KindCount).reduce((a, b) => a + b, 0);
      const OrderCount = _list.map(_it => _it.OrderCount).reduce((a, b) => a + b, 0);
      const TotalAmount = _list.map(_it => _it.TotalAmount).reduce((a, b) => a + b, 0);
      HeaderDataList.push({ KindCount, OrderCount, TotalAmount, StaffID: '', TypeID: -1 });
    }

    // list.unshift({ ID: '', Name: '合计', DataList: HeaderDataList, isGroup: true });
    // list.unshift({ ID: curGroup.ID, Name: curGroup.Name, DataList: HeaderDataList, isGroup: true });

    this.List = list;
  }
}
