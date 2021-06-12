export default class FileClassType {
  ShowIndex = '';

  TypeList = [];

  Remark = '';

  FailTips = '';

  ID = '';

  Name = '';

  constructor(initData) {
    if (!initData || Object.prototype.toString.call(initData) !== '[object Object]') return;
    const { ID, Name, Remark, FailTips, TypeList, ShowIndex } = JSON.parse(JSON.stringify(initData));
    if (ID) this.ID = ID;
    if (Name) this.Name = Name;
    if (Remark) this.Remark = Remark;
    if (FailTips) this.FailTips = FailTips;
    if (ShowIndex || ShowIndex === 0) this.ShowIndex = ShowIndex;
    if (TypeList) this.TypeList = TypeList.map(it => it.ID);
  }

  static formatSubmitData(ruleForm, FileTypeList) {
    const _list = ruleForm.TypeList.map(ID => { // 转换TypeList  初始化数据时也需要
      const t = FileTypeList.find(it => it.ID === ID);
      return { ...t };
    });
    const _temp = { ...ruleForm, TypeList: _list };
    return _temp;
  }
}
