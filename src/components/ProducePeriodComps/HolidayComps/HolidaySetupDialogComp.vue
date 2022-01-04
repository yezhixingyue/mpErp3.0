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
    };
  },
  methods: {
    onOpen() {
      this.getInitDateData({ ItemID: this.ItemID });
    },
    onClosed() {
      this.ItemData = null;
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
            width: 500px;
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
</style>
