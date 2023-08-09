export const AppealTypeList = [
  { name: '不限', ID: '' },
  { name: '退货/退款', ID: 2 },
  { name: '优惠减款', ID: 3 },
  { name: '补印', ID: 7 },
  { name: '其他', ID: 255 },
];

export const getLabelByAppealType = (id: number | string) => {
  const t = AppealTypeList.find(it => it.ID === id);
  return t ? t.name : '';
};
