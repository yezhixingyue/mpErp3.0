<template>
  <div class="mp-erp-period-holiday-item-setup-dialog-calendar-comp-wrap">
    <section class="l">
      <header v-if="currentDate">
        <!-- <template v-if="mode==='day'">
          <i class="el-icon-arrow-left" :class="{disabled: leftArrowDisabled}" @click="onArrowChangeClick(-1)"></i>
          <div @click="onModeClick">
            <span>{{dateTitle}}</span>
          </div>
          <i class="el-icon-arrow-right" :class="{disabled: rightArrowDisabled}" @click="onArrowChangeClick(1)"></i>
        </template> -->
        <ul>
          <li @click="onModeClick" class="t" :class="{disabled: disabledSwitch, a: !disabledSwitch}"><span>{{dateTitle}}</span></li>
          <li>
            <div @click="onArrowChangeClick(-1)" :class="{disabled: leftArrowDisabled}">
              <i class="el-icon-arrow-up" :class="{disabled: leftArrowDisabled}"></i>
            </div>
            <div @click="onArrowChangeClick(1)" :class="{disabled: rightArrowDisabled}">
              <i class="el-icon-arrow-down" :class="{disabled: rightArrowDisabled}"></i>
            </div>
          </li>
        </ul>
      </header>
      <main v-if="currentDate">
        <transition mode="out-in">
          <ul class="calendar" @contextmenu="e => e.preventDefault()" v-if="mode==='day'">
            <li v-for="week in weekList" :key="week" class="week">
              <span>{{week}}</span>
            </li>
            <DateItemComp v-for="(it, i) in dateList" :key="`${it.m}${it.d}${i}`" :item="it" @change="handleItemStateChange" />
          </ul>
        </transition>
        <transition mode="out-in">
          <ul v-if="mode==='month'" class="month-list">
            <li
             v-for="it in monthList"
             :key="it.ID"
             :class="{
               active: selectedYear===currentDate.y&&it.ID===currentDate.m,
               disabled: selectedYear===thisYear&&it.ID<thisMonth
              }"
             @click="onMonthSelectClick(it)"
             >{{it.Name}}</li>
          </ul>
        </transition>
        <transition mode="out-in">
          <ul v-if="mode==='year'" class="month-list year-list">
            <li
             v-for="it in yearList[yearIndex].List"
             :key="it"
             :class="{active:it===currentDate.y,disabled:it<thisYear}"
             @click="onYearSelectClick(it)"
             >{{it}}</li>
          </ul>
        </transition>
      </main>
    </section>
    <ul class="r">
      <li>
        <div class="color blue"></div>
        <span>工作</span>
      </li>
      <li>
        <div class="color green"></div>
        <span>休息</span>
      </li>
      <li>
        <div class="color pink"></div>
        <span>未设置</span>
      </li>
      <li>
        <div class="color gray"></div>
        <span>不可选</span>
      </li>
    </ul>
  </div>
</template>

<script>
import DateItemComp from './DateItemComp.vue';

export default {
  props: {
    weekList: {
      type: Array,
      default: () => [],
    },
    dateList: {
      type: Array,
      default: () => [],
    },
    currentDate: {
      type: Object,
      default: null,
    },
    yearList: {
      type: Array,
      default: () => [],
    },
    monthList: {
      type: Array,
      default: () => [],
    },
    disabledSwitch: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    DateItemComp,
  },
  data() {
    return {
      mode: 'day', // year | month | day
      selectedYear: '',
      yearIndex: 0,
      minYearIndex: 0,
      thisYear: new Date().getFullYear(),
      thisMonth: new Date().getMonth(),
    };
  },
  computed: {
    dateTitle() {
      if (this.mode === 'day') return `${this.currentDate.y}年${`0${this.currentDate.m + 1}`.slice(-2)}月`;
      if (this.mode === 'month') return `${this.selectedYear || this.currentDate.y}年`;
      if (this.mode === 'year' && this.yearList[this.yearIndex]) return `${this.yearList[this.yearIndex].Name}年`;
      return '';
    },
    leftArrowDisabled() {
      if (this.disabledSwitch) return true;
      if (this.mode === 'day' && this.currentDate) {
        const time = new Date(this.currentDate.y, this.currentDate.m, 1).getTime();
        const nowTime = Date.now();
        return time <= nowTime;
      }
      if (this.mode === 'month' && this.selectedYear) {
        return this.selectedYear <= this.thisYear;
      }
      if (this.mode === 'year') {
        return this.yearIndex <= this.minYearIndex;
      }
      return false;
    },
    rightArrowDisabled() {
      if (this.disabledSwitch) return true;
      if (this.mode === 'day' && this.currentDate) {
        return this.currentDate.y >= 2099 && this.currentDate.m >= 11;
      }
      if (this.mode === 'month' && this.selectedYear) {
        return this.selectedYear >= 2099;
      }
      if (this.mode === 'year') {
        return this.yearIndex >= this.yearList.length - 1;
      }
      return false;
    },
  },
  methods: {
    onArrowChangeClick(num) { // 左右箭头点击事件
      if ((num < 0 && this.leftArrowDisabled) || (num > 0 && this.rightArrowDisabled)) return;
      if (this.mode === 'day') this.$emit('dateChange', { ...this.currentDate, m: this.currentDate.m + num });
      if (this.mode === 'month') this.selectedYear += num;
      if (this.mode === 'year') this.yearIndex += num;
    },
    handleItemStateChange(data) { // 日历状态修改事件
      this.$emit('itemStateChange', data);
    },
    onModeClick() { // 日期选择默认修改事件
      if (this.disabledSwitch) return;
      if (this.mode === 'day') {
        if (!this.selectedYear) this.selectedYear = this.currentDate.y;
        this.mode = 'month';
      } else if (this.mode === 'month') {
        this.yearIndex = this.minYearIndex;
        this.mode = 'year';
      } else if (this.mode === 'year') {
        this.selectedYear = '';
        this.yearIndex = this.minYearIndex;
        this.mode = 'day';
      }
    },
    onYearSelectClick(y) { // 日历选择年份
      this.selectedYear = y;
      this.mode = 'month';
    },
    onMonthSelectClick(m) { // 日历选择月份
      if (this.selectedYear !== this.currentDate.y || m.ID !== this.currentDate.m) {
        this.$emit('dateChange', { y: this.selectedYear, m: m.ID });
      }
      this.mode = 'day';
    },
  },
  watch: {
    currentDate: {
      handler(val) {
        if (!val) return;
        const i = this.yearList.findIndex(it => it.List.includes(val.y));
        this.yearIndex = i > -1 ? i : 0;
        this.minYearIndex = this.yearIndex;
        this.selectedYear = this.currentDate.y;
      },
      immediate: true,
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-period-holiday-item-setup-dialog-calendar-comp-wrap {
  color: #444;
  width: 100%;
  text-align: center;
  > section.l {
    display: inline-block;
    vertical-align: top;
    text-align: left;
    width: 443px;
    > header {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      padding-bottom: 12PX;
      height: 30px;
      box-sizing: border-box;
      > div {
        margin: 0 10px;
        cursor: pointer;
        user-select: none;
        min-width: 100px;
        text-align: center;
      }
      > ul {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        // padding-left: 20px;
        padding-right: 30px;
        > li {
          display: flex;
          > div {
            display: flex;
            margin-left: 25px;
            height: 24px;
            width: 24px;
            background-color: rgba($color: #eee, $alpha: 0.6);
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            user-select: none;
            > i {
              font-size: 14px;
            }
            &:hover {
              background-color: rgba($color: #eee, $alpha: 0.9);
            }
            &:active {
              background-color: #e5e5e5;
            }
            &.disabled {
              background-color: rgba($color: #eee, $alpha: 0.6);
            }
          }
          &.t {
            padding: 5px 10px;
            border-radius: 3px;
            min-width: 108px;
            user-select: none;
            &.a {
              cursor: pointer;
              &:hover {
                background-color: #f5f5f5;
              }
            }
            &.disabled {
              color: #585858;
              cursor: not-allowed;
            }
          }
        }
      }
      i {
        cursor: pointer;
        color: #909399;
        &:hover {
          color: #444;
        }
        &.disabled {
          color: #cbcbcb;
          cursor: not-allowed;
        }
        user-select: none;
      }
    }
    > main {
      height: 433px;
      position: relative;
      > ul.calendar {
        display: flex;
        flex-wrap: wrap;
        > li {
          margin-right: 13px;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          font-size: 16px;
          &.week {
            height: 50px;
            margin-bottom: 5px;
          }
          &.date {
            border-radius: 50%;
            color: #fff;
            margin-bottom: 13px;
            .lunar {
              font-size: 12px;
              opacity: 0.5;
              margin-top: 3px;
            }
            &.working {
              background-color: #66A4FF;
            }
            &.resting {
              background-color: #04E47E;
            }
            &.disabled {
              background-color: #E5E5E5;
              color: #cbcbcb;
              cursor: not-allowed;
              &.isBefore {
                cursor: auto;
              }
            }
            &.empty {
              background-color: #FF3769;
            }
            &.hidden {
              color: #aaa;
              background-color: #fff;
            }
            &:not(.working):not(.resting):not(.disabled):not(.empty):not(.hidden) {
              color: #444;
            }
            transition: background-color 0.1s;
            // &.resting, &.working, &.empty {
            //   &:hover {
            //     transform: scale(1.01);
            //   }
            // }
          }
        }
      }
      > ul.month-list {
        display: flex;
        padding: 20px 0;
        width: 475px;
        margin: 0 -16px;
        height: 300px;
        flex-wrap: wrap;
        align-content: space-around;
        > li {
          height: 60px;
          width: 60px;
          margin: 15px;
          margin-right: 43px;
          display: flex;
          flex: none;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          color: #585858;
          &:hover {
            // border-color: #cbcbcb;
            color: #66A4FF;
          }
          &.active {
            color: #fff;
            background-color: #66A4FF;
          }
          &.disabled {
            color: #cbcbcb;
            pointer-events: none;
          }
        }
        &.year-list {
          > li {
            margin-right: 35px;
            margin-left: 20px;
          }
        }
      }
      .v-enter, .v-leave-to {
        opacity: 0;
        transform: scale(10%);
      }
      .v-enter-active, .v-leave-active {
        transition: all 0.3s;
        position: absolute;
        left: 0;
        top: 0;
      }
      .v-enter-to, .leave {
        opacity: 1;
        transform: scare(100%);
      }
    }
  }
  > ul.r {
    display: inline-block;
    width: 90px;
    margin-left: 47px;
    padding-top: 100px;
    text-align: left;
    > li {
      color: #585858;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      > span {
        width: 3em;
      }
      > div.color {
        width: 40px;
        height: 10px;
        border-radius: 5px;
        &.blue {
          background-color: #66A4FF;
        }
        &.green {
          background-color: #04E47E;
        }
        &.pink {
          background-color: #FF3769;
        }
        &.gray {
          background-color: #E5E5E5;
        }
      }
    }
  }
}
</style>
