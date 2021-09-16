export default class Product {
  ID = '';

  Name = ''; // 内部名称

  ShowName = ''; // 显示名称

  ClassifyList = []; // 所属分类 可多类别

  AllowValetOrder = false; // 代客下单

  AllowCustomOrder = false; // 自助上传

  IsSpacial = false; // 是否非标准化产品 false为标准化 true为非标准

  AllowAnalysisName = false; // 是否允许解析名称

  AllowBatchUpload = false; // 是否允许批量上传

  IsAppendWeight = false; // 是否附加重量

  IsAppendPrice = false; // 是否附加价格

  FileNameSplitChars = null; // 文件名称拆分符

  PartSplitChars = null; // 部件名称拆分字符

  ElementSplitChars = null; // 元素拆分字符

  MaterialList = []; // 物料列表

  PartList = []; // 部件列表

  SizeList = [];

  TypeList = [];

  MinNumber = null; // 库存最小数量

  Mobile = null; // 库存预警手机号码

  MaterialDisplayName = '物料';

  constructor(initData) {
    if (!initData || Object.prototype.toString.call(initData) !== '[object Object]') return;
    const { ID, Name, ShowName, ClassifyList, IsSpacial, TypeList, MaterialDisplayName } = JSON.parse(JSON.stringify(initData));
    if (ID) this.ID = ID;
    if (Name) this.Name = Name;
    if (ShowName) this.ShowName = ShowName;
    if (ClassifyList && Array.isArray(ClassifyList)) this.ClassifyList = ClassifyList;
    if (TypeList && Array.isArray(TypeList)) this.TypeList = TypeList;
    if (IsSpacial) this.IsSpacial = IsSpacial;
    if (MaterialDisplayName) this.MaterialDisplayName = MaterialDisplayName;
  }
}
