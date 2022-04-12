<template>
  <div class="mp-line-date-selector-wrap" :class="isFull?'mp-line-date-selector-wrap-is-full':''">
    <span class="title">{{label}}：</span>
    <radio-button-group-comp :radioList="dateList" v-model="date" :isFull="isFull" />
    <span @click="onDefineBtnClick" class="define-btn">
      <span v-if="!showText" class="manual-select-date-box">
        自定义时间
      </span>
      <span v-else :class="{'active':UserDefinedTimeIsActive, 'manual-select-date-box': 1}">
        <template>{{ beginTime | formatDateContent(dateType)  }}</template>
        <span style="font-size:12px;margin:0 2px;vertical-align:0%;">至</span>
        <template>{{ endTime | formatDateContent(dateType) }}</template>
      </span>
    </span>
    <el-date-picker
      v-model="localValue"
      :type="dateType"
      align="center"
      :visible-arrow='false'
      unlink-panels
      value-format="yyyy-MM-ddTHH:mm:ss"
      :format="format"
      :default-time='defaultTime'
      :clearable='false'
      @focus='onPickerFocus'
      @blur="onPickerBlur"
      size="mini"
      ref="oPicker"
      popper-class="date-selector-popper-box"
    >
    </el-date-picker>
  </div>
</template>

<script>
import RadioButtonGroupComp from '@/components/common/RadioButtonGroupComp.vue';

export default {
  components: {
    RadioButtonGroupComp,
  },
  props: {
    dateList: {
      type: Array,
      default: () => [
        { name: '不限', ID: 'all' },
        { name: '今天', ID: 'today' },
        { name: '昨天', ID: 'yesterday' },
        { name: '前天', ID: 'beforeyesterday' },
        { name: '本月', ID: 'curMonth' },
        { name: '上月', ID: 'lastMonth' },
      ],
    },
    dateValue: {
      type: String,
      default: 'today',
    },
    typeList: {
      type: Array,
      required: true,
    },
    changePropsFunc: {
      type: Function,
      default: () => {},
    },
    UserDefinedTimeIsActive: {
      type: Boolean,
      default: false,
    },
    requestFunc: {
      type: Function,
      default: () => {},
      required: true,
    },
    isFull: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: '可用时间',
    },
    dateType: {
      type: String,
      default: 'daterange',
    },
  },
  filters: {
    formatDateContent(str, dateType) {
      if (str) {
        const d = str.split('T')[0];
        if (dateType === 'daterange') return d;
        const h = str.split('T')[1].slice(0, 5);
        return `${d} ${h}`;
      }
      return '';
    },
  },
  computed: {
    date: {
      get() {
        return this.dateValue;
      },
      set(newVal) {
        this.changePropsFunc([this.typeList[0], newVal]);
        if (newVal) this.requestFunc();
      },
    },
    showText: {
      get() {
        return !!(this.key && this.beginTime && this.endTime);
      },
    },
    Format2DateEnd() {
      return this.$utils.getDateFormat2Date(this.endTime);
    },
    Format2DateBegin() {
      return this.$utils.getDateFormat2Date(this.beginTime);
    },
    localValue: {
      get() {
        if (this.beginTime && this.endTime) {
          return [this.beginTime, this.endTime];
        }
        return [];
      },
      set(val) {
        if (Array.isArray(val)) {
          [this.beginTime, this.endTime] = val;
        } else {
          this.beginTime = '';
          this.endTime = '';
        }
      },
    },
    defaultTime() { // 后续的特殊处理？
      return ['00:00:00', '23:59:59'];
    },
    format() {
      if (this.dateType === 'daterange') return 'yyyy-MM-dd';
      return 'yyyy-MM-dd HH:mm';
    },
  },
  data() {
    return {
      beginTime: '',
      endTime: '',
      key: false,
      start: '',
      end: '',
      isNotFoulCloseType: false, // 是否使用犯规方式关闭
    };
  },
  methods: {
    onDefineBtnClick() {
      this.$refs.oPicker.focus();
    },
    onPickerFocus() {
      setTimeout(() => {
        this.clickTarget = null;
      }, 0);
    },
    onPickerBlur() {
      setTimeout(() => {
        if (!this.clickTarget) {
          this.changePropsFunc([this.typeList[0], '']);
          this.changePropsFunc([this.typeList[1], this.beginTime]);
          this.changePropsFunc([this.typeList[2], this.endTime]);
          this.requestFunc();
          this.key = true;
        }
      }, 0);
    },
    onDocumentClick(e) {
      this.clickTarget = e;
    },
  },
  mounted() {
    document.body.addEventListener('click', this.onDocumentClick);
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.onDocumentClick);
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
@import '@/assets/css/mixins/header/time-search-selector.scss';
.mp-line-date-selector-wrap {
  min-width: 712px;
  display: flex;
  align-items: center;
  &.mp-line-date-selector-wrap-is-full {
    .manual-select-date-box {
      top: 0;
      margin: 0;
      background-color: $--bg-color-base;
      border-left: none;
      border-top-left-radius: 0%;
      border-bottom-left-radius: 0%;
      &.active {
        box-shadow: -1px 0 0 0 #26bcf9;
      }
      &:hover {
        background-color: $--color-text-table-hover;
      }
    }
    .mp-common-comps-radio-group-wrap {
      > .el-radio-group {
        > label {
          &:last-of-type {
            > .el-radio-button__inner {
              border-radius: 0%;
            }
          }
        }
      }
    }
  }
  > .title {
    font-size: 14px;
    position: relative;
    top: -2px;
    width: 5em;
    margin-right: 15px;
    line-height: 23px;
    font-weight: 600;
    color: $--color-text-primary;
    text-align: right;
  }
  > .normal-btn {
    margin: 0;
    &.un-select {
    color: $--color-text-primary;
    border: 1px solid $--border-color-base;
    }
    margin-left: 20px;
    position: relative;
    top: -5px;
  }
  > .define-btn {
    cursor: pointer;
  }
  .manual-select-date-box {
    font-size: 13px;
    min-width: 110px;
    height: 28px;
    border: 1px solid $--border-color-base;
    display: inline-block;
    text-align: center;
    line-height: 26px;
    position: relative;
    top: -5px;
    margin-left: 20px;
    border-radius: 2px;
    box-sizing: border-box;
    padding: 0 15px;
    // box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.15);
    > i > img {
      vertical-align: -5%;
      margin-left: 10px;
    }
    &.active {
      color: $--color-primary;
      border-color: #26bcf9;
      background-color: $--color-white;
    }
  }
  > span {
    flex: none;
  }
  .el-date-editor {
    width: 1px;
    height: 1px;
    opacity: 0;
    vertical-align: top;
    padding: 0;
    border: none;
    position: relative;
    top: 18px;
    right: 95px;
    .el-popper[x-placement^="bottom"] .popper__arrow::after {
      display: none;
    }
  }
}
.date-selector-popper-box {
  .el-picker-panel__link-btn.el-button--text {
    display: none;
  }
  .today.start-date, .today.end-date {
    > div > span {
      color: #fff !important;
    }
  }
}
</style>
