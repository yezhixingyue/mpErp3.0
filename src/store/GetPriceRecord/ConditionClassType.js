import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';

export default class RecordListConditonClass {
  Page = 1; // 页码

  KeyWords = ''; // 关键词 (活动名称)

  PageSize = 30; // 页容量

  DateType = 'today';

  CalculateDate = {
    First: `${ConvertTimeFormat(new Date())}T00:00:00.000Z`,
    Second: `${ConvertTimeFormat(new Date())}T23:59:59.997Z`,
  }

  Terminal = '';
}
