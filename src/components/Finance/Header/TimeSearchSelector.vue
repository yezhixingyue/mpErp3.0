<template>
  <div class="mp-time-serach-wrap mp-header-search-wrap">
    <div class="mp-time-select-box">
      <span class="text">入库时间：</span>
      <ul class="time-menu">
        <li
          :class="{'is-selected':selectedTimeArr[0]}"
          @click="onTimeSubmit('financeAlltimeDate', 0)"
        >全部</li>
        <li
          :class="{'is-selected':selectedTimeArr[1]}"
          @click="onTimeSubmit('financeTodayDate', 1)"
          class="li-today"
        >今日入库</li>
        <li
          :class="{'is-selected':selectedTimeArr[2]}"
          @click="onTimeSubmit('financeYesterdayDate', 2)"
        >昨日入库</li>
        <!-- <li
          :class="{'is-selected':selectedTimeArr[0]}"
          @click="onTimeSubmit('financeDayBeforeYesterdayTimeDate', 0)"
        >前日入库</li> -->
        <li
          :class="{'is-selected':selectedTimeArr[3]}"
          @click="onTimeSubmit('financeCurMonthDate', 3)"
        >本月入库</li>
        <li
          :class="{'is-selected':selectedTimeArr[4]}"
          @click="onTimeSubmit('financeLastMonthDate', 4)"
        >上月入库</li>
        <li class="by-time" :class="{'is-selected'
          :selectedTimeArr[5]}">
          <el-popover
           placement="bottom" v-model="visible" popper-class="order-time-select" trigger="click">
            <div class="select-block-wrap">
              <div class="block">
                <span>开始日期:</span>
                <el-date-picker :picker-options="{disabledDate: handleDisabledDate4Begin}"
                  v-model="beginTime" value-format="timestamp" type="date" placeholder="选择开始日期">
                  </el-date-picker>
              </div>
              <div class="totext-box">至</div>
              <div class="block">
                <span>结束日期:</span>
                <el-date-picker :picker-options="{disabledDate: handleDisabledDate4End}"
                  v-model="endTime" value-format="timestamp" type="date" placeholder="选择结束日期"
                ></el-date-picker>
              </div>
            </div>
            <div class="select-btn-wrap">
              <normalBtn title="确定"  @click.native="onSelectTimeSubmit" />
            </div>
            <span slot="reference">
              <span v-if="!key" style="line-height:14px;vertical-align:10%;">
                自定义时间
                <i>
                  <img  style="vertical-align:text-middle;"
                   src="@/assets/images/timeselect.png" alt />
                </i>
              </span>
              <span v-else style="font-size:13px;line-height:13px;vertical-align:10%;">
                {{begin}}
                <span style="font-size:12px;margin:0 2px;vertical-align:0%;">至</span>
                {{end}}
                <i><img class="date-img" src="@/assets/images/timeselect.png" alt /></i>
              </span>
            </span>
          </el-popover>
        </li>
      </ul>
    </div>
    <div class="mp-order-search-box">
      <span class="text">关键词：</span>
      <input
        placeholder="请输入搜索关键词"
        v-model.trim="inpVal"
        spellcheck='false'
        @keydown.enter="onKeyWordSubmit"
        type="text"
      />
      <!-- @input="onInput" :value="searchCondition4Finance.KeyWords" -->
      <button class="mp-search-box-btn" @click="onKeyWordSubmit">
        <i></i>
      </button>
      <button class="order-header-reset-btn" @click="onResetBtn">清空所有筛选项条件</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import mixin from '@/assets/js/mixins/header/TimeSearchSelectorMixins';
import { throttle } from '@/assets/js/utils/throttle';
import { ConvertTimeFormat, getSecondTime } from '@/assets/js/utils/ConvertTimeFormat';

export default {
  computed: {
    ...mapState('finance', ['selectedTimeArr', 'searchCondition4Finance', 'searchWatchKey']),
    storeBeginTime() {
      const time = this.searchCondition4Finance.OutstoreDate.First;
      if (time) return time;
      return '';
    },
  },
  mixins: [mixin],
  data() {
    return {
      inpVal: '',
    };
  },
  methods: {
    ...mapMutations('finance', [
      'setSelectTime',
      'setPlaceWord',
      'clearConfigObj',
    ]),
    ...mapMutations('timeSelectModule', ['updateNewDate']),
    ...mapActions('finance', ['getFinanceTableData']),
    // getTableData() {
    //   return throttle(this.getFinanceTableData, 350);
    // },
    onKeyWordSubmit() {
      this.setPlaceWord(this.inpVal);
      // if (!this.searchCondition4Finance.KeyWords) {
      // this.clearConfigObj('onKeyWordSubmit');
      // this.setSelectTime(['AlltimeDate', 0]);
      // this.onResetBtn();
      // } else {
      this.getTableData();
      // }
    },
    onTimeSubmit(type, num) {
      if (this.selectedTimeArr[num]) return;
      this.updateNewDate();
      this.setSelectTime([type, num]);
      this.getTableData();
    },
    onSelectTimeSubmit() {
      if (!this.endTime || !this.beginTime) {
        this.visible = false;
        this.key = false;
        return;
      }
      // console.log(this.endTime, this.beginTime);
      if (this.endTime < this.beginTime) {
        this.$message({
          showClose: true,
          message: '结束日期必须大于开始日期!',
          type: 'error',
        });
        return;
      }
      const obj = { First: '', Second: '' };
      const firstDate = ConvertTimeFormat(new Date(this.beginTime));
      const secondDate = getSecondTime(new Date(this.endTime));
      const beginTime = `${firstDate}T08:00:00.000Z`;
      const endTime = `${secondDate}T07:59:59.997Z`;
      obj.First = beginTime;
      obj.Second = endTime;
      const key = JSON.stringify(this.searchCondition4Finance.OutstoreDate) === JSON.stringify(obj);
      if (!(key && this.selectedTimeArr[5])) {
        this.setSelectTime(['timeSelect', 5, obj]);
        this.getTableData();
      }
      this.begin = firstDate;
      this.end = ConvertTimeFormat(new Date(this.endTime));
      this.key = true;
      this.visible = false;
    },
    onResetBtn() {
      this.updateNewDate();
      this.clearConfigObj();
      this.setSelectTime(['financeTodayDate', 1]);
      this.getFinanceTableData();
      this.inpVal = '';
    },
    // onInput($event) {
    //   this.setPlaceWord($event.target.value);
    // },
    handleDisabledDate4Begin(e) {
      if (!this.endTime) {
        return false;
      }
      if (new Date(e) > new Date(this.endTime)) {
        return true;
      }
      return false;
    },
    handleDisabledDate4End(e) {
      if (!this.beginTime) {
        return false;
      }
      if (new Date(e) < new Date(new Date(this.beginTime).getTime())) {
        return true;
      }
      return false;
    },
  },
  watch: {
    searchWatchKey() {
      this.inpVal = this.searchCondition4Finance.KeyWords;
    },
  },
  mounted() {
    this.getTableData = throttle(this.getFinanceTableData, 350);
    this.onResetBtn();
  },
};
</script>

<style lang='scss'>
@import '@/assets/css/mixins/header/time-search-selector.scss';
.mp-time-serach-wrap{
  .mp-time-select-box {
    padding-bottom: 12px;
    .time-menu{
      width: 725px;
    }
    .text {
      padding-left: 20px;
    }
  }
  .mp-order-search-box {
    padding-bottom: 12px;
    > .text {
      width: 5em;
      padding-left: 20px;
    }
  }
}
</style>
