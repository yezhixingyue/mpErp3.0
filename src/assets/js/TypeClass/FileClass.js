export default class FileClassType {
  ShowIndex = '';

  TypeList = [];

  Remark = '';

  FailTips = '';

  ID = '';

  Name = '';

  InternalName = '';

  AllowMultiple = false;

  IsPrintFile = false;

  constructor(initData) {
    if (!initData || Object.prototype.toString.call(initData) !== '[object Object]') return;
    const { ID, Name, InternalName, Remark, FailTips, TypeList, ShowIndex, AllowMultiple, IsPrintFile } = JSON.parse(JSON.stringify(initData));
    if (ID) this.ID = ID;
    if (Name) this.Name = Name;
    if (InternalName) this.InternalName = InternalName;
    if (Remark) this.Remark = Remark;
    if (AllowMultiple) this.AllowMultiple = AllowMultiple;
    if (FailTips) this.FailTips = FailTips;
    if (IsPrintFile) this.IsPrintFile = IsPrintFile;
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
