<template>
  <CommonDialogComp
    width="850px"
    top="2vh"
    :title="dialogTitle"
    :visible.sync="localVisible"
    @cancle="localVisible = false"
    @open="onOpen"
    @closed="onClosed"
    @submit="onSubmitClick"
    :disabled='loading'
    class="mp-erp-period-holiday-item-setup-dialog-comp-wrap"
  >
    <!-- 内容区 -->
    <ul class="comp-content" v-loading='!ItemData && loading'>
      <template v-if="ItemData">
        <li>
          <label>名称：</label>
          <el-input v-model="ItemData.ItemName" maxlength="15" show-word-limit placeholder="" size="small" style="width:500px"></el-input>
        </li>
        <li class="calendar-box">
          <!-- 日历 -->
          <CalendarComp
            v-loading='loading'
            :weekList='weekList'
            :dateList='dateList'
            :currentDate='currentDate'
            :monthList='monthList'
            :yearList='yearList'
            :disabledSwitch='!!ItemID'
            @dateChange='handleDateChange'
            @itemStateChange='handleItemStateChange'
            />
        </li>
        <li>
          <label for="">最晚付款时间：</label>
          <div>
            <el-radio-group v-model="ItemData.DelayType" size="small">
              <el-radio v-for="it in dateSetList" :key="it.ID" :label="it.ID">{{
                it.Name
              }}</el-radio>
            </el-radio-group>
            <p class="time">
              <template v-if="ItemData.DelayType === 1">
                <label>每天最晚付款时间：</label>
                <el-time-picker
                  v-model="LatestTime"
                  :clearable='false'
                  value-format="HH:mm"
                  format="HH:mm"
                  :picker-options="{ format: 'HH:mm' }"
                  :default-value='defaultBeginTime'
                  placeholder="20:00"
                  size="small"
                  style="width:100px"
                >
                </el-time-picker>
              </template>
              <template v-else-if="ItemData.DelayType === 2">
                <label>推移</label>
                <el-input v-model.number="ItemData.ChangeTime" placeholder="" style="width:100px" maxlength="4"></el-input>
                <span>小时</span>
                <span class="is-font-size-12 tips-box">（ 注：负数往前，正数往后推移 ）</span>
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  offset='20'
                  popper-class='mp-erp-holiday-setup-dialog-comp-tips-popover-box-wrap'
                  >
                  <ul>
                    <li>1. 在无人为干预的情况下默认均为工作日；</li>
                    <li>2. 每次调整仅在单个自然月内设置并生效；</li>
                    <li>3.“最晚付款时间”仅对工作日有效；</li>
                    <li>4.“可生产日期”起始点为第一个休息日的零点；</li>
                    <li>5.“给客户提示”与“可生产日期”仅对休息日有效。</li>
                  </ul>
                  <span slot="reference" @mouseenter="showBImg = true">
                    <img src="@/assets/images/wen-w.png" class="w" alt="">
                    <img src="@/assets/images/wen-b.png" class="b" alt="" v-if="showBImg">
                  </span>
                </el-popover>
              </template>
            </p>
          </div>
        </li>
        <li>
          <label>给客户提示：</label>
          <el-input v-model="ItemData.Tips" maxlength="40" show-word-limit placeholder="" size="small" style="width:600px"></el-input>
        </li>
        <li>
          <label>可生产工期：</label>
          <div>
            <el-input v-model.number="ItemData.ProductionTime" placeholder="" maxlength="3" size="small" style="width:140px"></el-input>
            <span class="is-gray">小时</span>
          </div>
        </li>
      </template>
    </ul>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp';
import HolidayClass, { createYearMonthByYM } from '@/store/Period/HolidayClass';
import CalendarComp from './CalendarComp/index.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    ItemID: {
      type: String,
      default: '',
    },
    dateSetList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
    CalendarComp,
  },
  computed: {
    dialogTitle() {
      if (this.ItemID) return '编辑节假日';
      return '添加节假日';
    },
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
    defaultBeginTime() {
      return new Date(new Date(new Date(new Date().setHours(20)).setMinutes(0)).setSeconds(0));
    },
    LatestTime: {
      get() {
        if (!this.ItemData) return '';
        const { First, Second } = this.ItemData.LatestTime;
        if ((!First && First !== 0) || (!Second && Second !== 0)) return '';
        const _f = `0${First}`.slice(-2);
        const _s = `0${Second}`.slice(-2);
        return `${_f}:${_s}`;
      },
      set(val) {
        if (!val) return;
        const [First, Second] = val.split(':');
        this.ItemData.LatestTime.First = First;
        this.ItemData.LatestTime.Second = Second;
      },
    },
  },
  data() {
    return {
      weekList: [],
      dateList: [],
      currentDate: null,
      monthList: [],
      yearList: [],
      ItemData: null,
      loading: false,
      showBImg: false,
    };
  },
  methods: {
    onOpen() {
      this.getInitDateData({ ItemID: this.ItemID });
    },
    onClosed() {
      this.ItemData = null;
      this.showBImg = false;
    },
    async getInitDateData(params, item) { // 此方法应在弹窗打开时进行调用 或 弹窗月份手动改变时调用
      this.loading = true;
      const data = await HolidayClass.getInitData(params, item);
      this.loading = false;
      if (!data) {
        return;
      }
      const { weekList, dateList, currentDate, monthList, yearList, ItemData } = data;
      this.weekList = weekList;
      this.dateList = dateList;
      this.currentDate = currentDate;
      this.monthList = monthList;
      this.yearList = yearList;
      this.ItemData = ItemData;
    },
    onSubmitClick() {
      HolidayClass.checkerAndSubmit(this.ItemData, this.dateList, this.handleSubmitSuccess);
    },
    handleSubmitSuccess(itemData, ItemID) {
      this.$emit('submitSuccess', [itemData, ItemID]);
      this.localVisible = false;
    },
    handleDateChange({ y, m }) { // 点击左右箭头切换月份
      const YearMonth = createYearMonthByYM({ y, m });
      this.getInitDateData({ YearMonth }, this.ItemData);
    },
    handleItemStateChange({ item, type }) { // 修改日期状态
      const t = this.dateList.find(it => it.y === item.y && it.m === item.m && it.d === item.d);
      if (t) {
        t.empty = false;
        t.disabled = false;
        t.resting = false;
        t.working = false;
        t[type] = true;
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-period-holiday-item-setup-dialog-comp-wrap {
  .el-dialog {
    margin-bottom: 0;
    margin-top: 0px;
    .el-dialog__body {
      padding-bottom: 1px;
      height: 723px;
      ul.comp-content {
        padding: 0 16px;
        min-height: 500px;
        > li {
          display: flex;
          margin-bottom: 23px;
          > label {
            width: 7em;
            text-align: right;
            flex: none;
            height: 30px;
            line-height: 30px;
            padding-right: 10px;
            color: #888E99;
          }
          .time {
            color: #888E99;
            display: flex;
            align-items: center;
            white-space: nowrap;
            width: 600px;
            label {
              margin-right: 8px;
              min-width: 9em;
              text-align: right;
            }
            .tips-box {
              margin-left: 12px;
              width: 210px;
              padding-left: 8px;
            }
            .el-popover__reference {
              display: inline-block;
              margin-left: 76px;
              width: 30px;
              height: 30px;
              position: relative;
              > img {
                position: absolute;
                // transition: opacity 0.12s ease-in-out;
                cursor: pointer;
              }
              .w {
                opacity: 1;
              }
              .b {
                opacity: 0;
              }
              @keyframes toWhite {
                0% {
                  opacity: 100%;
                }
                50% {
                  opacity: 100%;
                }
                100% {
                  opacity: 0%;
                }
              }
              .b {
                opacity: 0;
                animation: toWhite 0.5s;
              }
              &:hover {
                @keyframes toBlack {
                  0% {
                    opacity: 0;
                  }
                  50% {
                    opacity: 30%;
                  }
                  75% {
                    opacity: 85%;
                  }
                  100% {
                    opacity: 1;
                  }
                }
                .b {
                  opacity: 1;
                  animation: toBlack 0.15s;
                }
              }
            }
          }
          .el-radio-group {
            padding: 7px 0;
            margin-bottom: 8px;
            .el-radio {
              .el-radio__label {
                color: #585858;
              }
            }
          }
          .el-input {
            margin-right: 10px;
            input {
              border-radius: 5px;
              border-color: #e5e5e5;
              height: 30px;
              line-height: 30px;
            }
          }
          &.calendar-box {
            margin-bottom: 10px;
          }
        }
      }
    }
  }
}
.mp-erp-holiday-setup-dialog-comp-tips-popover-box-wrap {
  width: 205px !important;
  background: #444;
  .popper__arrow::after {
    border-top-color: #444 !important;
    border-width: 8px !important;
    border-bottom: none !important;
    bottom: -1px !important;
    right: -8px !important;
  }
  padding: 12px 25px;
  box-sizing: border-box;
  > ul {
    > li {
      color: #b5b7bb;
      font-size: 12px;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #5b5b5b;
      padding: 5px 0;
      &:last-of-type {
        border: none;
      }
    }
  }
}
</style>
