import getEnumList from '@/assets/js/utils/getEnumList';

export const logisticTypeEnumObj = {
  self: {
    ID: 1,
    Name: '自建',
  },
  logistic: {
    ID: 2,
    Name: '物流',
  },
  express: {
    ID: 3,
    Name: '快递',
  },
};

export const OutPlatTypeEnumList = [
  { ID: 1, Name: '淘宝' },
  { ID: 2, Name: '京东' },
  { ID: 3, Name: '拼多多' },
];

export const logisticTypeEnumList = getEnumList(logisticTypeEnumObj);
