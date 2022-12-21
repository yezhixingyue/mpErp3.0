export const ElementSelectTypeEnum = [
  { label: '元素', ID: 0, nickName: '类型元素' },
  { label: '物料尺寸', ID: 1, nickName: '尺寸' },
  { label: '产品元素组', ID: 2, nickName: '元素组' },
  { label: '产品元素', ID: 3, nickName: '元素' },
  { label: ' 产品工艺', ID: 4, nickName: '工艺' },
  { label: ' 产品物料', ID: 5, nickName: '物料' },
  { label: ' 产品尺寸组', ID: 6, nickName: '尺寸组' },
  { label: ' 产品', ID: 7, nickName: '产品' },
  { label: ' 表数据', ID: 8, nickName: '表数据' },
  { label: ' 费用', ID: 9, nickName: '费用' },
  { label: ' 部件', ID: 10, nickName: '部件' },
  { label: ' 公共属性', ID: 11, nickName: '公共属性' },
  { label: ' 工期数据', ID: 12, nickName: '工期数据' },
  { label: ' 其他', ID: 254, nickName: '其他' },
  { label: ' 常量', ID: 255, nickName: '常量' },
];

export const PropertyFixedType = [
  { ID: 0, Name: '已选项数' },
  { ID: 1, Name: '和' },
  { ID: 2, Name: '最小值' },
  { ID: 3, Name: '最大值' },
  { ID: 4, Name: '使用次数' },
  { ID: 5, Name: '最短边' },
  { ID: 6, Name: '最长边' },
  { ID: 7, Name: '常规尺寸' },
  { ID: 8, Name: '物料尺寸长' },
  { ID: 9, Name: '物料尺寸宽' },
  { ID: 10, Name: '选项' },
  { ID: 11, Name: '展开长' },
  { ID: 12, Name: '展开宽' },
  { ID: 13, Name: '最长展开边' },
  { ID: 14, Name: '最短展开边' },
  { ID: 15, Name: '大版印刷次数' },
  { ID: 16, Name: '大版幅面' },
  { ID: 17, Name: '原始物料数量' },
  { ID: 18, Name: '原始物料尺寸' },
  { ID: 19, Name: '满足条数' },
  { ID: 20, Name: '不满足条数' },
  { ID: 21, Name: '工艺费' },
  { ID: 22, Name: '横轴上限' },
  { ID: 23, Name: '横轴下限' },
  { ID: 24, Name: '竖轴上限' },
  { ID: 25, Name: '竖轴下限' },
  { ID: 26, Name: '报价方案' },
  { ID: 27, Name: '拼版长(含白边)' },
  { ID: 28, Name: '拼版宽(含白边)' },
  { ID: 29, Name: '印刷幅面物料损耗数量' },
  { ID: 30, Name: '大版拼数' },
  { ID: 31, Name: '物料费' },
  { ID: 32, Name: '数量' },
  { ID: 33, Name: '款数' },
  { ID: 34, Name: '总价' },
  { ID: 35, Name: '自定义' },
  { ID: 36, Name: '印刷幅面物料数量(不含损耗)' },
  { ID: 37, Name: '拼版长' },
  { ID: 38, Name: '拼版宽' },
  // { ID: 39, Name: '工期数据' },
  { ID: 40, Name: '拼版方式' },
  { ID: 41, Name: '付款时间' },
  { ID: 42, Name: '付款时间星期' },
  { ID: 43, Name: '付款日' },
  { ID: 44, Name: '生产工时' },
  { ID: 45, Name: '配送方式' },
  { ID: 46, Name: '收货地址' },
  { ID: 47, Name: '产品' },
  { ID: 48, Name: '重量' },
  { ID: 49, Name: '客户类型' },
  { ID: 50, Name: '生产工厂' },
  { ID: 51, Name: '客户等级' },
  { ID: 52, Name: '销售区域' },
  { ID: 53, Name: '印后工艺' },
  { ID: 54, Name: '物料' },
  { ID: 55, Name: '尺寸' },
];

export const AllOperatorList = [ // 运算符号列表
  { ID: 1, Name: '等于' },
  { ID: 2, Name: '不等于' },
  { ID: 3, Name: '大于', label: '＞' },
  { ID: 4, Name: '大于等于', label: '≥' },
  { ID: 5, Name: '小于', label: '＜' },
  { ID: 6, Name: '小于等于', label: '≤' },
  { ID: 7, Name: '包含' },
  { ID: 8, Name: '不包含' },
  { ID: 9, Name: '选中' },
  { ID: 10, Name: '不选中' },
  { ID: 11, Name: '≥值≤' },
  { ID: 12, Name: '＞值≤' },
  { ID: 13, Name: '≥值＜' },
  { ID: 14, Name: '＞值＜' },
  { ID: 15, Name: '相同' },
  { ID: 16, Name: '不相同' },
  { ID: 21, Name: '禁用' },
  { ID: 22, Name: '隐藏' },
  { ID: 23, Name: '必选' },
];

// 下面3个方法主要用于已选择的物料类型在页面上的展示，会对其进行分类提交处理 使用地方：1条件关系选择为物料时 2 工厂列表物料显示文字处理 等
export const getTempMaterialListObj = (OptionList) => {
  if (!OptionList || !Array.isArray(OptionList) || OptionList.length === 0) return null;
  const _list = OptionList
    .map((it) => ({ ...it, list: it.Second.split(' ') }))
    .map((it) => ({
      ...it, first: it.list[0], second: it.list.length > 1 ? it.list[1] : '', third: it.list.length > 2 ? it.list.slice(2).join(' ') : '',
    }));
  const _obj = {};
  _list.forEach((it) => {
    const {
      first, second, third, First, Second,
    } = it;
    if (!_obj[first]) _obj[first] = {};
    if (!_obj[first][second]) _obj[first][second] = [];
    _obj[first][second].push({ third, Data: { First, Second } });
  });
  return _obj;
};

export const getTempMaterialOptionList = (localMaterialListObj) => {
  if (!localMaterialListObj) return [];
  const list = [];
  Object.keys(localMaterialListObj).forEach((fKey) => {
    const second = localMaterialListObj[fKey];
    const _temp1 = {};
    _temp1.Name = fKey;
    _temp1.List = [];
    Object.keys(second).forEach((sKey) => {
      const thirdList = second[sKey];
      const _temp2 = {};
      _temp2.Name = sKey;
      _temp2.List = [];
      if (thirdList.length === 1 && !thirdList[0].third) {
        const { Data } = thirdList[0];
        _temp2.Data = Data;
      } else {
        thirdList.forEach((it) => {
          const { third, Data } = it;
          const _temp3 = {};
          _temp3.Name = third;
          _temp3.Data = Data;
          _temp2.List.push(_temp3);
        });
      }
      _temp1.List.push(_temp2);
    });
    list.push(_temp1);
  });
  return list;
};

export const getTempMaterialSelectedListShowText = (checkList, localMaterialOptionList) => {
  if (!Array.isArray(checkList) || checkList.length === 0 || localMaterialOptionList.length === 0) return '';
  const _list = localMaterialOptionList.map((lv1) => { // 找出并附加已选的物料信息
    const List = lv1.List.map((lv2) => {
      const lv3List = lv2.Data ? [{ Name: lv2.Name, Data: lv2.Data }] : lv2.List;
      const SelectedList = lv3List.filter((it) => checkList.includes(it.Data.First));
      const isCheckedAll = lv3List.length === SelectedList.length;
      return { ...lv2, SelectedList, isCheckedAll };
    }).filter((it) => it.SelectedList.length > 0);
    let isCheckedAll = false;
    if (lv1.List.length === List.length) {
      const t = List.find((it) => !it.isCheckedAll);
      isCheckedAll = !t;
    }
    return { ...lv1, List, isCheckedAll };
  }).filter((it) => it.List.length > 0);

  const _text = _list.map((lv1) => { // 从提取出的选择信息中转换出要显示的文字
    const { Name, List } = lv1;
    const text = lv1.isCheckedAll ? '全部' : List.map((lv2) => {
      const { SelectedList, isCheckedAll, Data } = lv2;
      let lv2Str = lv2.Name;
      if (isCheckedAll && !Data) lv2Str = `${lv2Str}（全部）`;
      else if (!Data) {
        const names = SelectedList.map((_it) => _it.Name).join('、');
        lv2Str = `${lv2Str}（${names}）`;
      }
      return lv2Str;
    }).join('、');
    return `${Name}（${text}）`;
  }).join('、');
  return _text;
};

export default {
  getTempMaterialListObj, getTempMaterialSelectedListShowText, getTempMaterialOptionList, ElementSelectTypeEnum, PropertyFixedType, AllOperatorList,
};
