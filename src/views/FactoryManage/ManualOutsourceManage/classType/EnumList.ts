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
    Name: '待外购',
    filter: true, // 手动外购列表是否需要此项进行筛选
  },
  OutsourceComfirm: {
    ID: 21,
    Name: '已外购',
    filter: true,
  },
  HaveSendFactory: {
    ID: 25,
    Name: '已接单',
    filter: true,
  },
  Finished: {
    ID: 60,
    Name: '生产完成',
    filter: true,
  },
  Abort: {
    ID: 253,
    Name: '生产终止',
    filter: true,
    className: 'is-gray',
  },
  Cancled: {
    ID: 255,
    Name: '订单取消',
    filter: true,
    className: 'is-gray',
  },
};

/** 外购订单状态枚举列表 */
export const CheckFileOrderStatusEnumList = getEnumList(CheckFileOrderStatusEnumObj, true);
