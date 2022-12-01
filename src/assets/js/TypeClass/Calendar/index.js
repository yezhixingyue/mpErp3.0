import { solar2lunar } from './lunarCalendar';
// console.log(solar2lunar(2021, 12, 21));

export default class Calendar {
  /**
   * 生成一个月的月份数据（42天， 包含上一个月的末尾 及 下个月的开头）  自然月份数据 如果需要填充数据则在此基础上添加
   *
   * @static
   * @param {*} date 指定一个日期 如果不传则默认为当前时间
   * @returns 返回的日期列表中的月份数据为英文月份，如果需要展示应进行 + 1 处理
   * @memberof Calendar
   */
  static getANaturalCalendarData(date) {
    const _date = date ? new Date(date) : new Date();
    const y = _date.getFullYear(); // 年
    const m = _date.getMonth(); // 月 ------------- 用于显示时 应 + 1 处理
    const d = _date.getDate(); // 当前日

    // 存放月份日期数据的列表
    const dateList = [];

    // 星期排序格式
    const weekList = ['一', '二', '三', '四', '五', '六', '日'];

    // 获取该月的总天数
    const days = new Date(y, m + 1, 0).getDate(); // m + 1为下个月 第三个参数传递为0 则又返回为上个月的最后一天 通过这种方式获取到当前月份的总天数

    // 获取该月第一天是星期几  [日, 一, 二, 三, 四, 五, 六]  英文星期索引排序  -- 修改为中文排序： ['一', '二', '三', '四', '五', '六', '日']
    let week = new Date(y, m, 1).getDay() - 1;
    if (week < 0) week = 6;

    // 获取上个月的日期天数
    const prevMonthDays = new Date(y, m, 0).getDate();

    // 获取下个月的年份 月份
    let nextYear = y;
    let nextMonth = m + 1;
    if (nextMonth > 11) {
      nextYear += 1;
      nextMonth -= 12;
    }

    // 生成月份日期列表
    for (let i = 0; i < 42; i += 1) {
      if (i < week) { // 填充至上月
        dateList.unshift({
          y,
          m: m - 1,
          d: prevMonthDays - i,
          disabled: true,
          active: false,
          lunarCalendar: solar2lunar(y, m, prevMonthDays - i),
        });
      } else if (i < week + days) { // 当月日期
        dateList.push({
          y,
          m,
          d: i - week + 1,
          disabled: false,
          active: i - week + 1 === d,
          lunarCalendar: solar2lunar(y, m + 1, i - week + 1),
        });
      } else { // 下月月初
        dateList.push({
          y: nextYear,
          m: nextMonth,
          d: i - (week + days) + 1,
          disabled: true,
          active: false,
          lunarCalendar: solar2lunar(nextYear, nextMonth + 1, i - (week + days) + 1),
        });
      }
    }
    // 关于农历lunarCalendar： IDayCn：'初四'  Term：24节气  festival：阳历节日  lfestival：农历节日

    const monthList = [
      { Name: '1月', ID: 0 },
      { Name: '2月', ID: 1 },
      { Name: '3月', ID: 2 },
      { Name: '4月', ID: 3 },
      { Name: '5月', ID: 4 },
      { Name: '6月', ID: 5 },
      { Name: '7月', ID: 6 },
      { Name: '8月', ID: 7 },
      { Name: '9月', ID: 8 },
      { Name: '10月', ID: 9 },
      { Name: '11月', ID: 10 },
      { Name: '12月', ID: 11 },
    ];

    const yearList = [
      {
        Name: '2020 - 2029',
        List: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
      },
      {
        Name: '2030 - 2039',
        List: [2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039],
      },
      {
        Name: '2040 - 2049',
        List: [2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048, 2049],
      },
      {
        Name: '2050 - 2059',
        List: [2050, 2051, 2052, 2053, 2054, 2055, 2056, 2057, 2058, 2059],
      },
      {
        Name: '2060 - 2069',
        List: [2060, 2061, 2062, 2063, 2064, 2065, 2066, 2067, 2068, 2069],
      },
      {
        Name: '2070 - 2079',
        List: [2070, 2071, 2072, 2073, 2074, 2075, 2076, 2077, 2078, 2079],
      },
      {
        Name: '2080 - 2089',
        List: [2080, 2081, 2082, 2083, 2084, 2085, 2086, 2087, 2088, 2089],
      },
      {
        Name: '2090 - 2099',
        List: [2090, 2091, 2092, 2093, 2094, 2095, 2096, 2097, 2098, 2099],
      },
    ];

    return {
      weekList,
      dateList,
      currentDate: { y, m, d },
      monthList,
      yearList,
    };
  }

  /**
   * 获取包含业务内容的日期数据 在上面方法的基础上进行封装
   *
   * @static
   * @param {*} date
   * @returns
   * @memberof Calendar
   */
  static getABAdIsCalendarData(date) {
    const { weekList, dateList, currentDate, monthList, yearList } = this.getANaturalCalendarData(date);
    const list = dateList.map(it => ({ // 对日期列表进行进一步处理 添加业务中需要用到的状态 --- 后期状态名称可能修改
      ...it,
      hidden: it.disabled, // 隐藏显示
      empty: false, // 未设置 4种状态
      resting: false, // 休息
      working: true, // 工作
      disabled: false, // 不可选
    }));
    // 后面在此根据请求到的数据来指定每项数据的状态值
    return { weekList, dateList: list, currentDate, monthList, yearList };
  }
}
