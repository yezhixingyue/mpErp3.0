<template>
  <div
   class="mp-common-comps-disconnect-type-date-picker-wrap"
   :class="isLineStyle ? 'isLineStyle' : ''">
    <span>{{title}}：</span>
    <el-date-picker
      v-model="firstTime"
      :clearable='false'
      class="comp-date"
      format='yyyy-MM-dd'
      :disabled='isDisabled || localTimeDisabled'
      value-format='yyyy-MM-dd'
      type="date"
      placeholder="年 / 月 / 日">
    </el-date-picker>
    <el-time-picker
      v-model="secondTime"
      class="comp-time"
      :disabled='isDisabled || localTimeDisabled'
      default-time='00:00'
      value-format='HH:mm'
      :picker-options="{
        format: 'HH:mm'
      }"
      format='HH:mm'
      :clearable='false'
    ></el-time-picker>
    <span v-if="showCheck" class="check-box">
      <el-checkbox v-model="isStartNow" :disabled='isDisabled'>
        <em>立即生效</em>
      </el-checkbox>
    </span>
  </div>
</template>

<script>
import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';

export default {
  props: {
    title: {
      type: String,
      default: '开始时间',
    },
    isDisabled: {
      default: false,
      type: Boolean,
    },
    DateValue: {
      type: String,
    },
    handleFunc: {
      type: Function,
    },
    isLineStyle: {
      default: false,
      type: Boolean,
    },
    /**
     * 是否展示立即生效复选框 及 对应的内容值
     */
    showCheck: {
      default: false,
      type: Boolean,
    },
    StartNow: {
      default: false,
      type: Boolean,
    },
    setStartNowFunc: {
      type: Function,
    },
  },
  data() {
    return {
      localTimeDisabled: false,
    };
  },
  computed: {
    firstTime: {
      get() {
        if (!this.DateValue) return '';
        return this.DateValue.split('T')[0];
      },
      set(newVal) {
        if (!this.handleFunc) return;
        let _timeStr = '';
        if (!this.DateValue) _timeStr = `${newVal}T00:00:00.000Z`;
        else _timeStr = `${newVal}T${this.DateValue.split('T')[1]}`;
        this.handleFunc(_timeStr);
      },
    },
    secondTime: {
      get() {
        if (!this.DateValue) return '';
        const timeString = this.DateValue.split('T')[1].split('.')[0].substring(0, 5);
        // const h = timeString.split(':')[0];
        // const m = timeString.split(':')[1];
        // const s = timeString.split(':')[2];
        // const t = new Date(
        //   new Date(new Date(new Date().setHours(h)).setMinutes(m)).setSeconds(s),
        // );
        return timeString;
      },
      set(newVal) {
      //  console.log(newVal);
        if (!this.handleFunc) return;
        const _ft = this.DateValue.split('T')[0];
        // const h = new Date(newVal).getHours();
        // const m = new Date(newVal).getMinutes();
        // const s = new Date(newVal).getSeconds();
        let _t = '00.000Z';
        if (this.title === '结束时间') _t = '59.997Z';
        const _timeStr = `${_ft}T${newVal}:${_t}`;
        this.handleFunc(_timeStr);
      },
    },
    isStartNow: {
      get() {
        return this.StartNow;
      },
      set(newVal) {
        this.localTimeDisabled = newVal;
        this.setStartNowFunc(newVal);
        // this.setPromoteAddRequestObj([['StartNow', ''], newVal]);
        if (newVal) {
          const stringDate = ConvertTimeFormat(new Date());
          const h = `0${new Date().getHours()}`.slice(-2);
          const m = `0${new Date().getMinutes()}`.slice(-2);
          const s = `0${new Date().getSeconds()}`.slice(-2);
          const _Time = `${stringDate}T${h}:${m}:${s}.000Z`;
          this.handleFunc(_Time);
        }
      },
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-common-comps-disconnect-type-date-picker-wrap {
  display: flex;
  > .el-date-editor {
    height: 30px;
    > input {
      height: 100%;
      border-color: $--color-text-secondary;
      color: $--color-text-primary;
      font-size: 13px;
      &::placeholder {
        font-size: 12px;
        color:  $--color-text-secondary;
      }
    }
    > span {
      line-height: 30px;
      > i {
        line-height: 30px;
      }
    }
    &.comp-time{
      width: 98px;
      margin-left: 25px;
      > input {
        padding-right: 0;
        font-size: 13px;
      }
    }
    &.comp-date{
      width: 150px;
    }
  }
  > span {
    font-size: 14px;
    min-width: 5em;
    text-align: right;
    line-height: 30px;
    margin-right: 15px;
    color: $--color-text-primary;
  }
  &.isLineStyle {
    > div.el-date-editor {
      width: 113px;
      > input {
        width: 113px;
        padding: 0;
        border: none;
        border-bottom: 1px solid $--color-text-secondary;
        border-radius: 0;
        padding-left: 5px;
        height: 32px;
      }
      > span {
        display: none;
      }
      position: relative;
      &::after {
        content: "";
        position: absolute;
        width: 13px;
        height: 14px;
        background: url(../../assets/images/Calendar.png) no-repeat center/100%;
        top: 9px;
        right: 8px;
      }
      &:last-of-type {
        &::after {
        background: url(../../assets/images/Clock.png) no-repeat center/100%;
        width: 14px;
        height: 15px;
        }
        > input {
          color: $--color-text-table-time !important;
        }
      }
    }
  }
  > .check-box {
    position: relative;
    top: 1px;
    > .el-checkbox {
      > .el-checkbox__label {
        font-size: 12px;
        color: $--color-text-primary-light;
      }
    }
  }
}
</style>
