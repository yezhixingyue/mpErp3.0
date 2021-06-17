/* eslint-disable max-len */
import { getRandomRangeId } from '@/assets/js/utils/util';

export const TypeEnum = [{ Name: 'Numberic', ID: 1, label: '数字值' }, { Name: 'Option', ID: 2, label: '选择项' }, { Name: 'Switch', ID: 3, label: '开关' }];
export const SelectModeEnum = [{ Name: '单选按钮', ID: 0 }, { Name: '下拉框', ID: 1 }];

const getEnumValue = (list, Name) => { // 从枚举数值中根据Name值获取枚举值
  const t = list.find(it => it.Name === Name);
  if (t) return t.ID;
  return '';
};

const getEnumKeyName = (list, ID) => { // 从枚举数值中根据ID值获取枚举值
  const t = list.find(it => it.ID === ID);
  if (t) return t.Name;
  return '';
};

const handleDefineListFormat = (data, key) => { // 处理自定义值至上传数据的转换
  const _temp = data;

  // 处理自定义值至上传数据的转换
  if (_temp[key].DefineList.length > 0) {
    if (_temp[key].DefineList.includes('staff')) _temp[key].Allow = true;
    if (_temp[key].DefineList.includes('customer')) _temp[key].AllowCustomer = true;
  }

  delete _temp[key].DefineList;
};

const handleOptionIsRadioFormat = (data) => { // 转换选项值单选多选数据格式
  const _temp = data;
  if (_temp.OptionAttribute.ChooseType === 'single') {
    _temp.OptionAttribute.IsRadio = true;
    _temp.OptionAttribute.OptionList.forEach(it => {
      const _it = it;
      _it.IsChecked = false;
    });
    if (_temp.OptionAttribute.defaultSingleOption) {
      const t = _temp.OptionAttribute.OptionList.find(it => it.key === _temp.OptionAttribute.defaultSingleOption);
      if (t) t.IsChecked = true;
    }
    delete _temp.OptionAttribute.UseTimes;
  } else if (_temp.OptionAttribute.ChooseType === 'multiple') {
    _temp.OptionAttribute.IsRadio = false;
    delete _temp.OptionAttribute.SelectMode;
    delete _temp.OptionAttribute.IsRequired;
  }

  delete _temp.OptionAttribute.ChooseType;
  delete _temp.OptionAttribute.defaultSingleOption;
};

export default class ElementClassType {
  ID = '';

  Name = '';

  IsNameHidden = false;

  PositionID = '';

  Type = 'Numberic';

  HiddenToCustomer = false;

  DefaultValue = '';

  NumbericAttribute = {
    AllowDecimal: false,
    InputContent: '',
    CheckedValue: '',
    Unit: '',
    IsRequired: false,
    IsWidthAdaption: true,
    DisplayWidth: '',
    DefineList: [], // need Allow AllowCustomer
    SectionList: [],
  }

  OptionAttribute = {
    OptionList: [],
    defaultSingleOption: '', // need
    IsWidthAdaption: true,
    DisplayWidth: '',
    DefineList: [], // Allow AllowCustomer
    CustomizeValue: '',
    ChooseType: 'single', // IsRadio
    IsRequired: false,
    SelectMode: 0,
    UseTimes: {
      MinValue: '',
      MaxValue: '',
    },
  }

  SwitchAttribute = {
    Words: '',
    OpenValue: '',
    CloseValue: '',
    DefaultOpen: false,
  }

  constructor(initData, positionID) {
    if (positionID) this.PositionID = positionID;
    if (!initData || Object.prototype.toString.call(initData) !== '[object Object]') return;
    const { Name, Type, DefaultValue, HiddenToCustomer, ID, IsNameHidden, NumbericAttribute, OptionAttribute, SwitchAttribute, PositionID } = JSON.parse(JSON.stringify(initData));
    if (Name) this.Name = Name; // 还原名称
    if (Type || Type === 0) { // 还原类型
      const TypeKey = getEnumKeyName(TypeEnum, Type);
      if (TypeKey) this.Type = TypeKey;
    }
    if (DefaultValue || DefaultValue === 0) this.DefaultValue = `${DefaultValue}`;
    if (HiddenToCustomer) this.HiddenToCustomer = HiddenToCustomer;
    if (ID) this.ID = ID;
    if (IsNameHidden) this.IsNameHidden = IsNameHidden;
    if (PositionID && !positionID) this.PositionID = PositionID;
    if (Type === 1 && NumbericAttribute) { // 还原数字值
      const { Allow, AllowCustomer, AllowDecimal, CheckedValue, DisplayWidth, InputContent, IsRequired, IsWidthAdaption, Unit, SectionList } = NumbericAttribute;
      if (AllowDecimal) this.NumbericAttribute.AllowDecimal = AllowDecimal;
      if (InputContent) this.NumbericAttribute.InputContent = InputContent;
      if (CheckedValue || CheckedValue === 0) this.NumbericAttribute.CheckedValue = `${CheckedValue}`;
      if (DisplayWidth) this.NumbericAttribute.DisplayWidth = DisplayWidth;
      if (IsRequired) this.NumbericAttribute.IsRequired = IsRequired;
      if (!IsWidthAdaption) this.NumbericAttribute.IsWidthAdaption = IsWidthAdaption;
      if (Unit) this.NumbericAttribute.Unit = Unit;
      if (Allow) this.NumbericAttribute.DefineList = ['staff'];
      if (Allow && AllowCustomer) this.NumbericAttribute.DefineList = ['staff', 'customer'];
      if (SectionList && SectionList.length > 0) {
        this.NumbericAttribute.SectionList = SectionList.map(it => ({
          ...it,
          key: getRandomRangeId(8),
          Increment: it.Increment ? `${it.Increment}` : '',
          MinValue: `${it.MinValue}`,
          MaxValue: `${it.MaxValue}`,
        }));
      }
    }
    if (Type === 2 && OptionAttribute) { // 还原选项值
      const { Allow, AllowCustomer, CustomizeValue, DisplayWidth, IsRadio, IsRequired, IsWidthAdaption, SelectMode, UseTimes, OptionList } = OptionAttribute;
      if (Allow) this.OptionAttribute.DefineList = ['staff'];
      if (Allow && AllowCustomer) this.OptionAttribute.DefineList = ['staff', 'customer'];
      if (CustomizeValue || CustomizeValue === 0) this.OptionAttribute.CustomizeValue = `${CustomizeValue}`;
      if (DisplayWidth) this.OptionAttribute.DisplayWidth = DisplayWidth;
      if (!IsRadio) this.OptionAttribute.ChooseType = 'multiple';
      if (IsRequired) this.OptionAttribute.IsRequired = IsRequired;
      if (!IsWidthAdaption) this.OptionAttribute.IsWidthAdaption = IsWidthAdaption;
      if (SelectMode || SelectMode === 0) this.OptionAttribute.SelectMode = SelectMode;
      if (OptionList && OptionList.length > 0) {
        this.OptionAttribute.OptionList = OptionList.map(it => ({
          ...it,
          key: getRandomRangeId(8),
          Value: `${it.Value}`,
        }));
        if (IsRadio) {
          const t = this.OptionAttribute.OptionList.find(it => it.IsChecked);
          if (t) this.OptionAttribute.defaultSingleOption = t.key;
        }
      }
      if (UseTimes && OptionAttribute.UseTimes.MaxValue) {
        this.OptionAttribute.UseTimes.MinValue = UseTimes.MinValue;
        this.OptionAttribute.UseTimes.MaxValue = UseTimes.MaxValue;
      }
    }
    if (Type === 3 && SwitchAttribute) { // 还原开关值
      const { OpenValue, CloseValue, DefaultOpen, Words } = SwitchAttribute;
      if (Words) this.SwitchAttribute.Words = Words;
      if (DefaultOpen) this.SwitchAttribute.DefaultOpen = DefaultOpen;
      if (OpenValue || OpenValue === 0) this.SwitchAttribute.OpenValue = `${OpenValue}`;
      if (CloseValue || CloseValue === 0) this.SwitchAttribute.CloseValue = `${CloseValue}`;
    }
  }

  static formatSubmitData(data) { // 转换为数据提交格式
    if (!data) return null;
    const _temp = JSON.parse(JSON.stringify(data));
    const TypeValue = getEnumValue(TypeEnum, _temp.Type);
    _temp.DefaultValue = +_temp.DefaultValue;
    if (TypeValue.toString()) {
      _temp.Type = TypeValue;
      switch (_temp.Type) {
        case 1: // number
          handleDefineListFormat(_temp, 'NumbericAttribute'); // 处理显示宽度和自定义
          delete _temp.OptionAttribute;
          delete _temp.SwitchAttribute;
          break;
        case 2: // option
          handleDefineListFormat(_temp, 'OptionAttribute'); // 处理显示宽度和自定义
          handleOptionIsRadioFormat(_temp);
          delete _temp.NumbericAttribute;
          delete _temp.SwitchAttribute;
          break;
        case 3: // switch
          delete _temp.OptionAttribute;
          delete _temp.NumbericAttribute;
          break;
        default:
          break;
      }
    }
    return _temp;
  }
}
