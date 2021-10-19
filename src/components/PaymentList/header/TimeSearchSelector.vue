<template>
  <div class="mp-time-serach-wrap mp-header-search-wrap">
    <div class="mp-time-select-box">
      <span class="text">时间筛选：</span>
      <ul class="time-menu">
        <li
          :class="{'is-selected':selectedTimeArr[0]}"
          @click="onTimeSubmit('AlltimeDate', 0)"
        >全部</li>
        <li
          :class="{'is-selected':selectedTimeArr[1]}"
          @click="onTimeSubmit('TodayDate', 1)"
          class="li-today"
        >今日下单</li>
        <li
          :class="{'is-selected':selectedTimeArr[2]}"
          @click="onTimeSubmit('YesterdayDate', 2)"
        >昨日下单</li>
        <li
          :class="{'is-selected':selectedTimeArr[3]}"
          @click="onTimeSubmit('curMonthDate', 3)"
        >本月下单</li>
        <li
          :class="{'is-selected':selectedTimeArr[4]}"
          @click="onTimeSubmit('lastMonthDate', 4)"
        >上月下单</li>
        <li class="by-time" :class="{'is-selected'
          :selectedTimeArr[5]}">
          <el-popover
           placement="bottom" v-model="visible" popper-class="order-time-select" trigger="click">
            <div class="select-block-wrap">
              <div class="block">
                <span>开始日期:</span>
                <el-date-picker :picker-options="{disabledDate: handleDisabledDate4Begin}"
                  v-model="beginTime" value-format="yyyy-MM-dd" type="date" placeholder="选择开始日期">
                  </el-date-picker>
              </div>
              <div class="totext-box">至</div>
              <div class="block">
                <span>结束日期:</span>
                <el-date-picker :picker-options="{disabledDate: handleDisabledDate4End}"
                  v-model="endTime" value-format="yyyy-MM-dd" type="date" placeholder="选择结束日期"
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
      <input @keydown.enter="onKeyWordSubmit"
        v-model.trim="inpVal"
        spellcheck='false'
        placeholder="请输入搜索关键词" type="text" />
      <button class="mp-search-box-btn" @click="onKeyWordSubmit">
        <!-- <i class="el-icon-search">  @input="onInput" :value="set2PaymentList.KeyWords" </i> -->
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

export default {
  computed: {
    ...mapState('paymentModule', ['selectedTimeArr', 'set2PaymentList', 'searchWatchKey']),
    storeBeginTime() {
      const time = this.set2PaymentList.CreateDate.First;
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
    ...mapMutations('paymentModule', [
      'setSelectTime',
      'setPlaceWord',
      'clearConfigObj',
    ]),
    ...mapMutations('timeSelectModule', ['updateNewDate']),
    ...mapActions('paymentModule', ['getPaymentListTableData']),
    // getTableData() {
    //   this.getPaymentListTableData();
    // },
    onKeyWordSubmit() {
      this.setPlaceWord(this.inpVal);
      // if (!this.set2PaymentList.KeyWords) {
      //   // this.clearConfigObj('onKeyWordSubmit');
      //   // this.setSelectTime(['AlltimeDate', 0]);
      //   this.onResetBtn();
      // } else {
      this.getTableData();
      // }
    },
    onTimeSubmit(type, num) {
      this.updateNewDate();
      if (this.selectedTimeArr[num]) return;
      this.setSelectTime([type, num]);
      this.getTableData();
    },
    onSelectTimeSubmit() {
      if (!this.endTime || !this.beginTime) {
        this.visible = false;
        this.key = false;
        return;
      }
      if (this.endTime < this.beginTime) {
        this.$message({
          showClose: true,
          message: '结束日期必须大于开始日期!',
          type: 'error',
        });
        return;
      }
      const obj = { First: '', Second: '' };
      const beginTime = `${this.beginTime}T00:00:00.000Z`;
      const endTime = `${this.endTime}T23:59:59.997Z`;
      obj.First = beginTime;
      obj.Second = endTime;
      const bool = JSON.stringify(this.set2PaymentList.CreateDate) === JSON.stringify(obj);
      if (!(bool && this.selectedTimeArr[5])) {
        this.setSelectTime(['timeSelect', 5, obj]);
        this.getTableData();
      }
      this.begin = this.beginTime;
      this.end = this.endTime;
      this.key = true;
      this.visible = false;
    },
    onResetBtn() {
      this.updateNewDate();
      this.clearConfigObj();
      this.setSelectTime(['TodayDate', 1]);
      this.getPaymentListTableData();
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
      if (new Date(e) < new Date(new Date(this.beginTime).getTime() - 24 * 60 * 60 * 1000)) {
        return true;
      }
      return false;
    },
  },
  watch: {
    searchWatchKey() {
      this.inpVal = this.set2PaymentList.KeyWords;
    },
  },
  mounted() {
    // this.setSelectTime(['TodayDate', 1]); // 如果初始获取时间为今天，则使此项生效。
    this.getTableData = throttle(this.getPaymentListTableData, 350);
    this.onResetBtn();
  },
};
</script>

<style lang='scss'>
@import '@/assets/css/mixins/header/time-search-selector.scss';
</style>
