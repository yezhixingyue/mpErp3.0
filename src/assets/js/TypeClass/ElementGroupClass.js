export default class ElementGroup {
  ID = '';

  Name = '';

  PositionID = '';

  IsNameHidden = false;

  ElementList = [];

  // localElementList = [];

  UseTimes = {
    MinValue: '',
    MaxValue: '',
  }

  IsHorizontalDisplay = true;

  HiddenToCustomer = false;

  constructor(initData, ElementList) {
    // 1. 初始化本地元素列表数据
    // 1.2 需要根据this.curData的值对localElementList其中的Checked 和 ForbidRepeat 以及 Disabled （编辑时相同GroupID不为disabled） 进行处理
    const hasInitData = initData && Object.prototype.toString.call(initData) === '[object Object]'; // 是否有初始数据
    if (ElementList && ElementList.length > 0) {
      this.ElementList = ElementList.map(it => {
        let Checked = false;
        let ForbidRepeat = false;
        let Disabled = !!it.Group;
        if (hasInitData) {
          Disabled = !!(it.Group && (initData.ID !== it.Group.ID));
          const t = initData.ElementList.find(curItem => it.ID === curItem.ID);
          if (t) {
            Checked = true;
            ForbidRepeat = t.ForbidRepeat;
          }
        }
        return {
          ID: it.ID,
          Name: it.Name,
          Checked,
          ForbidRepeat,
          Disabled,
          HiddenToCustomer: it.HiddenToCustomer,
        };
      });
    }
    // 2. 解决编辑数据时 元素初始勾选结果及数据绑定  通过curData数据对初始数据进行处理 | 或null对初始数据进行重置 --- 后面写编辑时解决有值时的处理方式
    if (!hasInitData) return;
    const { Name, ID, PositionID, IsNameHidden, IsHorizontalDisplay, HiddenToCustomer, UseTimes } = JSON.parse(JSON.stringify(initData));
    if (Name) this.Name = Name; // 还原名称
    if (ID) this.ID = ID;
    if (PositionID) this.PositionID = PositionID;
    if (IsNameHidden) this.IsNameHidden = IsNameHidden;
    if (!IsHorizontalDisplay) this.IsHorizontalDisplay = IsHorizontalDisplay;
    if (HiddenToCustomer) this.HiddenToCustomer = HiddenToCustomer;
    if (UseTimes && Object.prototype.toString.call(UseTimes) === '[object Object]') {
      if (UseTimes.MinValue || UseTimes.MinValue === 0) this.UseTimes.MinValue = UseTimes.MinValue;
      if (UseTimes.MaxValue || UseTimes.MaxValue === 0) this.UseTimes.MaxValue = UseTimes.MaxValue;
    }
  }

  static formatSubmitData(data) { // 转换提交数据格式，
    // 数据转换  暂只需转换ElementList数据内容
    const temp = JSON.parse(JSON.stringify(data));
    temp.ElementList = temp.ElementList.filter(it => it.Checked && !it.Disabled); // 转换ElementList
    return temp;
  }
}
