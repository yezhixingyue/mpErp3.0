import getEnumList from '@/assets/js/utils/getEnumList';

export const CheckFileOrderStatusEnumObj = {
  Initial: {
    ID: 0,
    Name: '订单已接入',
  },
  FileChecked: {
    ID: 11,
    Name: '文件已审核',
  },
  ContentGenerated: {
    ID: 12,
    Name: '缩略图已生成',
  },
  FileRejected: {
    ID: 14,
    Name: '审稿已驳回',
  },
  ContentRejected: {
    ID: 15,
    Name: '内容有问题',
  },
  WaitSendFactory: {
    ID: 20,
    Name: '待确认外协',
    filter: true, // 手动外协列表是否需要此项进行筛选
  },
  OutsourceComfirm: {
    ID: 21,
    Name: '待接单',
    filter: true,
  },
  HaveSendFactory: {
    ID: 25,
    Name: '生产中',
    filter: true,
  },
  Finished: {
    ID: 60,
    Name: '生产完成',
    filter: true,
  },
  Cancled: {
    ID: 255,
    Name: '订单已取消',
    filter: true,
  },
};

/** 外协订单状态枚举列表 */
export const CheckFileOrderStatusEnumList = getEnumList(CheckFileOrderStatusEnumObj, true);
