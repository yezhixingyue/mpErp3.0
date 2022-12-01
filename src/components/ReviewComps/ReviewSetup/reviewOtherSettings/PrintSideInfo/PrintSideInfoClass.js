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
    Option: {
      ID: '',
      Name: '',
    },
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
    Option: {
      ID: '',
      Name: '',
    },
  }

  constructor(data) {
    restoreInitDataByOrigin(this, data);
  }

  checker() {
    if (!this.SideType && this.SideType !== 0) {
      messageBox.failSingleError('保存失败', '单双面未设置');
      return false;
    }
    if (this.SideType === PrintSideTypeEnums.propMap.ID) {
      if (!this.SingleSide.Element.ID || !this.SingleSide.Option.ID) {
        messageBox.failSingleError('保存失败', '单双面设置中 [ 单面 ] 信息不完整');
        return false;
      }
      if (!this.DoubleSide.Element.ID || !this.DoubleSide.Option.ID) {
        messageBox.failSingleError('保存失败', '单双面设置中 [ 双面 ] 信息不完整');
        return false;
      }
    }
    return true;
  }

  getInfo() {
    if (!this.checker()) {
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
