<template>
  <div class="mp-time-serach-wrap mp-header-search-wrap">
    <div class="mp-time-select-box">
      <span class="text">时间筛选：</span>
      <ul class="time-menu">
        <li
          v-show="$route.name !== 'orderManage'"
          :class="{'is-selected':selectedTimeArr[0]}"
          @click="onTimeSubmit('AlltimeDate', 0)"
        >全部</li>
        <li
          :class="{'is-selected':selectedTimeArr[1]}"
          @click="onTimeSubmit('TodayDate', 1)"
          class="li-today"
        >今日{{$route.name === 'transport' ? '揽收': '下单'}}</li>
        <li
          :class="{'is-selected':selectedTimeArr[2]}"
          @click="onTimeSubmit('YesterdayDate', 2)"
        >昨日{{$route.name === 'transport' ? '揽收': '下单'}}</li>
        <li
          :class="{'is-selected':selectedTimeArr[3]}"
          @click="onTimeSubmit('curMonthDate', 3)"
        >本月{{$route.name === 'transport' ? '揽收': '下单'}}</li>
        <li
          :class="{'is-selected':selectedTimeArr[4]}"
          @click="onTimeSubmit('lastMonthDate', 4)"
        >上月{{$route.name === 'transport' ? '揽收': '下单'}}</li>
        <li class="by-time" :class="{'is-selected'
          :selectedTimeArr[5]}">
          <el-popover
           placement="bottom" v-model="visible" popper-class="order-time-select" trigger="click">
            <div class="select-block-wrap">
              <div class="block">
                <span>开始日期:</span>
                <el-date-picker
                  v-model="beginTime" :picker-options="{disabledDate: handleDisabledDate4Begin}"
                    value-format="yyyy-MM-dd" type="date" placeholder="选择开始日期">
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
              <!-- <el-button
                      type="primary" @click="onSelectTimeSubmit" size="small">确认</el-button> -->
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
        spellcheck='false'
        v-model.trim="inpVal"
        placeholder="请输入搜索关键词" type="text" />
        <!-- 从input框取消代码：@input="onInput" :value="objForOrderList.KeyWords" -->
      <button class="mp-search-box-btn" @click="onKeyWordSubmit">
        <!-- <i class="el-icon-search"></i> -->
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
    ...mapState('orderModule', ['selectedTimeArr', 'objForOrderList', 'searchWatchKey']),
    storeBeginTime() {
      const time = this.objForOrderList.PlaceDate.First;
      if (time) return time;
      return '';
    },
    curPath() {
      return this.$route.name;
    },
  },
  mixins: [mixin],
  data() {
    return {
      inpVal: '',
    };
  },
  methods: {
    ...mapMutations('orderModule', [
      'setSelectTime',
      'setPlaceWord',
      'clearConfigObj',
    ]),
    ...mapMutations('timeSelectModule', ['updateNewDate']),
    ...mapActions('orderModule', ['getOrderTableData', 'getExpressTableData']),
    onKeyWordSubmit() {
      this.setPlaceWord(this.inpVal);
      // if (!this.objForOrderList.KeyWords) {
      //   // this.clearConfigObj('onKeyWordSubmit');
      //   // this.setSelectTime(['AlltimeDate', 0]);
      //   this.onResetBtn();
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
      const bool = JSON.stringify(this.objForOrderList.PlaceDate) === JSON.stringify(obj);
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
      this.getTableData();
      this.inpVal = '';
    },
    // onInput($event) {
    //   this.setPlaceWord($event.target.value);
    // },
    handleDisabledDate4Begin(e) {
      if (!this.endTime) {
        return false;
      }
      if (new Date(e) > new Date(this.endTime) || new Date(this.endTime) - new Date(e) > 366 * 24 * 60 * 60 * 1000) {
        return true;
      }
      return false;
    },
    handleDisabledDate4End(e) {
      if (!this.beginTime) {
        return false;
      }
      // eslint-disable-next-line max-len
      if (new Date(e) < new Date(new Date(this.beginTime).getTime() - 24 * 60 * 60 * 1000) || new Date(e) - (new Date(new Date(this.beginTime).getTime() - 24 * 60 * 60 * 1000)) > 366 * 24 * 60 * 60 * 1000) {
        return true;
      }
      return false;
    },
  },
  watch: {
    searchWatchKey() {
      this.inpVal = this.objForOrderList.KeyWords;
    },
    curPath() {
      if (this.$route.name === 'transport') {
        this.getTableData = throttle(this.getExpressTableData, 350);
      } if (this.$route.name === 'orderManage') {
        this.getTableData = throttle(this.getOrderTableData, 350);
      }
    },
  },
  mounted() {
    // console.log(1);
    // this.setSelectTime();
    // this.$store.commit('orderModule/setSelectTime', ['TodayDate', 1]);
    if (this.$route.name === 'transport') {
      this.getTableData = throttle(this.getExpressTableData, 350);
    } if (this.$route.name === 'orderManage') {
      this.getTableData = throttle(this.getOrderTableData, 350);
    }
  },
};
</script>

<style lang='scss'>
@import '@/assets/css/mixins/header/time-search-selector.scss';
</style>
