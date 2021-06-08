export default class MaterialSizeClass {
  ID = '';

  Name = '';

  // 长相关 ↓

  SingleLenRadio = true;

  SingleLength = ''; // 单个长尺寸

  MinLength = '';

  MaxLength = '';

  LengthIncrement = '';

  IsLengthSplit = false; // 长度可加工

  // 宽相关 ↓

  SingleWidthRadio = true;

  SingleWidth = ''; // 单个宽尺寸

  MinWidth = '';

  MaxWidth = '';

  WidthIncrement = '';

  IsWidthSplit = false; // 宽度可加工

  constructor(initData) {
    if (!initData || Object.prototype.toString.call(initData) !== '[object Object]') return;
    const { ID, Name, IsLengthSplit, IsWidthSplit, MinLength, MinWidth, MaxLength, MaxWidth, LengthIncrement, WidthIncrement } = initData;
    if (ID) this.ID = ID;
    if (Name) this.Name = Name;
    if (IsLengthSplit) this.IsLengthSplit = IsLengthSplit;
    if (IsWidthSplit) this.IsWidthSplit = IsWidthSplit;
    if (!MinLength && MinLength !== 0) { // 为长度单尺寸
      this.SingleLength = MaxLength;
    } else {
      this.SingleLenRadio = false;
      this.MinLength = MinLength;
      this.MaxLength = MaxLength;
      this.LengthIncrement = LengthIncrement;
    }
    if (!MinWidth && MinWidth !== 0) { // 为宽度单尺寸
      this.SingleWidth = MaxWidth;
    } else {
      this.SingleLenRadio = false;
      this.MinWidth = MinWidth;
      this.MaxWidth = MaxWidth;
      this.WidthIncrement = WidthIncrement;
    }
  }

  static formatSubmit(data) {
    const temp = { ...data }; // 不变动：ID Name IsLengthSplit IsWidthSplit 变动： SingleLenRadio SingleLength MinLength MaxLength LengthIncrement 及 宽的对应值
    if (temp.SingleLenRadio) {
      temp.MaxLength = temp.SingleLength;
      delete temp.MinLength;
      delete temp.LengthIncrement;
    }

    if (temp.SingleWidthRadio) {
      temp.MaxWidth = temp.SingleWidth;
      delete temp.MinWidth;
      delete temp.WidthIncrement;
    }
    delete temp.SingleLenRadio;
    delete temp.SingleLength;
    delete temp.SingleWidthRadio;
    delete temp.SingleWidth;

    return temp;
  }
}
