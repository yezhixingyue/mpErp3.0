import restoreInitDataByOrigin from '../../../../../assets/js/utils/reduction';
import { PrintSideTypeEnums } from '../../../../../store/review/reviewEnums';
import messageBox from '../../../../../assets/js/utils/message';

export default class PrintSideInfoClass {
  SideType = ''

  SingleSide = {
    Part: {
      ID: '',
      Name: '',
    },
    Group: {
      ID: '',
      Name: '',
    },
    Element: {
      ID: '',
      Name: '',
    },
    OptionList: [], // { ID: '', Name: '' }[]
  }

  DoubleSide = {
    Part: {
      ID: '',
      Name: '',
    },
    Group: {
      ID: '',
      Name: '',
    },
    Element: {
      ID: '',
      Name: '',
    },
    OptionList: [], // { ID: '', Name: '' }[]
  }

  constructor(data) {
    this.SideType = data.SideType;

    if (this.SideType === PrintSideTypeEnums.propMap.ID) {
      restoreInitDataByOrigin(this, data);
    }
  }

  checker(OptionList) {
    if (!this.SideType && this.SideType !== 0) {
      messageBox.failSingleError('保存失败', '单双面未设置');
      return false;
    }
    if (this.SideType === PrintSideTypeEnums.propMap.ID) {
      if (!this.SingleSide.Element.ID || this.SingleSide.OptionList.length === 0) {
        messageBox.failSingleError('保存失败', '[ 单面 ] 信息不完整');
        return false;
      }
      if (!this.DoubleSide.Element.ID || this.DoubleSide.OptionList.length === 0) {
        messageBox.failSingleError('保存失败', '[ 双面 ] 信息不完整');
        return false;
      }

      const SingleSideOptionIDs = this.SingleSide.OptionList.map(it => it.ID);
      const DoubleSideOptionIDs = this.DoubleSide.OptionList.map(it => it.ID);

      if ([...new Set([...SingleSideOptionIDs, ...DoubleSideOptionIDs])].length !== SingleSideOptionIDs.length + DoubleSideOptionIDs.length) {
        messageBox.failSingleError('保存失败', '[ 单面 ] 和 [ 双面 ] 存在重复选项');
        return false;
      }

      if (OptionList.length > 0 && SingleSideOptionIDs.length + DoubleSideOptionIDs.length !== OptionList.length) {
        messageBox.failSingleError('保存失败', '选中相同元素时，[ 单面 ] 和 [ 双面 ] 选项应覆盖所有选项');
        return false;
      }
    }
    return true;
  }

  getInfo(OptionList) {
    if (!this.checker(OptionList)) {
      return null;
    }
    if (this.SideType === PrintSideTypeEnums.propMap.ID) {
      const temp = {
        ...this,
        SingleSide: {
          ...this.SingleSide,
          Part: !this.SingleSide.Part.ID ? null : this.SingleSide.Part,
          Group: !this.SingleSide.Group.ID ? null : this.SingleSide.Group,
        },
        DoubleSide: {
          ...this.DoubleSide,
          Part: !this.DoubleSide.Part.ID ? null : this.DoubleSide.Part,
          Group: !this.DoubleSide.Group.ID ? null : this.DoubleSide.Group,
        },
      };
      return temp;
    }
    return new PrintSideInfoClass({ SideType: this.SideType });
  }
}
