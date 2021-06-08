export const MakeupMode = [
  { ID: 0, Name: '正翻版', key: 'zhengFan' },
  { ID: 1, Name: '自翻版', key: 'ziFan' },
  { ID: 2, Name: '天地翻', key: 'tianDiFan' },
];

/**
 * @description: // 根据枚举值设置拼版方式列表数据
 * @param {*}
 * @return {*}
 */
const getMakeupModeData = () => {
  const MakeupModeList = MakeupMode.map(it => {
    const _temp = {
      checked: false,
      Mode: it.ID,
      WhiteEdge: {
        Length: '',
        Width: '',
      },
      key: it.key,
      Name: it.Name,
    };
    return _temp;
  });
  return MakeupModeList;
};

/**
 * @description: 类 - 印刷幅面
 * @param {*}
 * @return {*}
 */
export default class PrintBreadth {
  ID = '';

  Name = '';

  MinMaterialSize = { // 最小物料尺寸
    Length: '',
    Width: '',
  }

  MaxMaterialSize = {
    Length: '',
    Width: '',
    // Thickness: '',
  }

  Class = '' // 分类

  ModeList = getMakeupModeData() // 允许拼版方式

  constructor(initData) {
    if (!initData || Object.prototype.toString.call(initData) !== '[object Object]') return;
    const { ID, Name, MinMaterialSize, MaxMaterialSize, Class, ModeList } = initData;
    if (ID) this.ID = ID;
    if (Name) this.Name = Name;
    if (MinMaterialSize) this.MinMaterialSize = MinMaterialSize;
    if (MaxMaterialSize) this.MaxMaterialSize = MaxMaterialSize;
    if (Class) this.Class = Class;
    if (ModeList && ModeList.length > 0) {
      ModeList.forEach(it => {
        const t = this.ModeList.find(_it => it.Mode === _it.Mode);
        if (t) {
          t.checked = true;
          t.WhiteEdge = it.WhiteEdge;
        }
      });
    }
  }

  static formatSubmit(data) { // 暂只需转换ModeList即可
    const temp = JSON.parse(JSON.stringify(data));
    temp.ModeList = temp.ModeList.filter(it => it.checked).map(it => ({ Mode: it.Mode, WhiteEdge: it.WhiteEdge }));
    return temp;
  }
}

// Class = { // 分类
//   ID: '',
//   Name: '',
// }

//   "ModeList": [
//     {
//       "Mode": 0,
//       "WhiteEdge": {
//         "Length": 0,
//         "Width": 0,
//         "Thickness": 0
//       }
//     }
//   ],
