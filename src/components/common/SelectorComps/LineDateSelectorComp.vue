<template>
  <div class="mp-line-date-selector-wrap" :class="isFull?'mp-line-date-selector-wrap-is-full':''">
    <span class="title">{{label}}：</span>
    <radio-button-group-comp :radioList="dateList" v-model="date" :isFull="isFull" />
    <el-popover
           placement="bottom" v-model="visible" popper-class="order-time-select" trigger="click">
            <div class="select-block-wrap">
              <div class="block">
                <span>开始日期:</span>
                <el-date-picker value-format='yyyy-MM-ddTHH:mm:ss.000Z' :clearable='false'
                  :picker-options="{disabledDate: handleDisabledDate4Begin}"
                  v-model="beginTime" :type="dateType" placeholder="选择开始日期">
                  </el-date-picker>
              </div>
              <div class="totext-box">至</div>
              <div class="block">
                <span>结束日期:</span>
                <el-date-picker value-format='yyyy-MM-ddTHH:mm:ss.997Z' :clearable='false'
                  :picker-options="{disabledDate: handleDisabledDate4End}"
                  default-time='23:59:59'
                  v-model="endTime" :type="dateType" placeholder="选择结束日期"
                ></el-date-picker>
              </div>
            </div>
            <div class="select-btn-wrap">
              <normalBtn title="确定"  @click.native="onSelectTimeSubmit" />
            </div>
            <span slot="reference">
              <span v-if="!showText" class="manual-select-date-box">
                自定义时间
                <i>
                  <img src="@/assets/images/timeselect.png" alt />
                </i>
              </span>
              <span v-else :class="{'active':UserDefinedTimeIsActive, 'manual-select-date-box': 1}">
                <template v-if="dateType === 'date'">{{ Format2DateBegin }}</template>
                <template v-else>{{ beginTime | formatDate }}</template>
                <span style="font-size:12px;margin:0 2px;vertical-align:0%;">至</span>
                <!-- {{endTime | formatDate}} -->
                <!-- {{ dateType === 'date' ? Format2DateEnd : (endTime | formatDate)}} -->
                <template v-if="dateType === 'date'">{{ Format2DateEnd }}</template>
                <template v-else>{{ endTime | formatDate }}</template>
                <i><img class="date-img" src="@/assets/images/timeselect.png" alt /></i>
              </span>
            </span>
          </el-popover>
  </div>
</template>

<script>
import normalBtn from '@/components/common/normalBtn.vue';
import RadioButtonGroupComp from '@/components/common/RadioButtonGroupComp.vue';

export default {
  components: {
    normalBtn,
    RadioButtonGroupComp,
  },
  props: {
    dateList: {
      type: Array,
      default: () => [{ name: '不限', ID: 'all' }, { name: '今天', ID: 'today' }, { name: '昨天', ID: 'yesterday' }, { name: '前天', ID: 'beforeyesterday' }],
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
      default: 'datetime',
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
        if (this.key && this.beginTime && this.endTime) return true;
        return false;
      },
    },
    Format2DateEnd() {
      return this.$utils.getDateFormat2Date(this.endTime);
    },
    Format2DateBegin() {
      return this.$utils.getDateFormat2Date(this.beginTime);
    },
  },
  data() {
    return {
      beginTime: '',
      endTime: '',
      visible: false,
      key: false,
      start: '',
      end: '',
      isNotFoulCloseType: false, // 是否使用犯规方式关闭
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.start = this.beginTime;
        this.end = this.endTime;
        this.isNotFoulCloseType = false;
      }
      if (!newVal && this.UserDefinedTimeIsActive) {
        if (!this.beginTime) this.beginTime = this.start;
        if (!this.endTime) this.endTime = this.end;
        if (!this.isNotFoulCloseType) {
          if (this.start !== this.beginTime) this.beginTime = this.start;
          if (this.end !== this.endTime) this.endTime = this.end;
        }
      }
    },
  },
  methods: {
    onSelectTimeSubmit() {
      if (!this.endTime || !this.beginTime) return;
      if (this.dateType === 'date') {
        this.endTime = `${this.Format2DateEnd}T23:59:59.997Z`;
      }
      const bool = new Date(this.endTime) - new Date(this.beginTime) > 0;
      if (!bool) {
        this.$message({
          showClose: true,
          message: '结束日期必须大于开始日期!',
          type: 'error',
        });
      } else {
        this.key = true;
        this.isNotFoulCloseType = true;
        this.visible = false;
        // eslint-disable-next-line max-len
        if (this.beginTime !== this.start || this.endTime !== this.end || !this.UserDefinedTimeIsActive) {
          this.changePropsFunc([this.typeList[0], '']);
          this.changePropsFunc([this.typeList[1], this.beginTime]);
          this.changePropsFunc([this.typeList[2], this.endTime]);
          this.requestFunc();
        }
      }
    },
    handleDisabledDate4Begin(e) {
      if (!this.endTime) {
        return false;
      }
      if (new Date(e) > new Date(this.Format2DateEnd)) {
        return true;
      }
      return false;
    },
    handleDisabledDate4End(e) {
      if (!this.beginTime) {
        return false;
      }
      if (new Date(e) < new Date(new Date(this.Format2DateBegin).getTime() - 24 * 60 * 60 * 1000)) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
@import '@/assets/css/mixins/header/time-search-selector.scss';
.mp-line-date-selector-wrap {
  margin-top: 24px;
  min-width: 712px;
  display: flex;
  align-items: center;
  &.mp-line-date-selector-wrap-is-full {
    margin-top: 18px;
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
}
</style>
