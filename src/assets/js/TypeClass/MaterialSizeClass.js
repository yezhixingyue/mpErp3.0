export const getFirstOptionName = (UnionShowList, ElementList) => {
  let lv1Title = '';
  let itemContent = '';
  if (!UnionShowList || UnionShowList.length === 0) { // 未设置元素组合 此时取元素列表种第一项
    if (ElementList && ElementList.length > 0) {
      lv1Title = ElementList[0].DisplayContent;
      ElementList.forEach((ele, i) => {
        if (i > 0) {
          itemContent += `${ele.DisplayContent}${ele.Unit ? ele.Unit : ''}`;
        }
      });
    }
  } else if (ElementList && ElementList.length > 0) { // 如果设置有元素组合 则按照元素组合取一项  （组合第一项可能为多个）
    UnionShowList[0].forEach(union => {
      const t = ElementList.find(Ele => Ele.ID === union);
      if (t) lv1Title += `${t.DisplayContent}${t.Unit ? t.Unit : ''}`;
    });
    UnionShowList.forEach((it, i) => {
      if (i > 0) {
        it.forEach((union, index) => {
          const t = ElementList.find(Ele => Ele.ID === union);
          if (t) {
            if (index === 0 && itemContent) itemContent += ' ';
            itemContent += `${t.DisplayContent}${t.Unit ? t.Unit : ''}`;
          }
        });
      }
    });
  }
  return { lv1Title, itemContent };
};

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
    // eslint-disable-next-line max-len
    const { ID, Name, IsLengthSplit, IsWidthSplit, MinLength, MinWidth, MaxLength, MaxWidth, LengthIncrement, WidthIncrement } = JSON.parse(JSON.stringify(initData));
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
      this.SingleWidthRadio = false;
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
