<template>
  <header class="mp-feedback-page-main-wrap-header-wrap">
    <ul>
      <li>
        <AreaSelector
          style="margin-right: 40px"
          :changePropsFunc="setCondition4DataList"
          :requestFunc="getDataList"
          :RegionalID="condition.SellRegionalID"
          :CityID="condition.SellCityID"
          :CountyID="condition.SellCountyID"
          :typeList="[['SellRegionalID', ''],['SellCityID', ''],['SellCountyID', '']]"
        />
        <OrderChannelSelector
        style="margin-right: 50px"
        :options='questionList'
        :requestFunc='getDataList'
        :changePropsFunc='setCondition4DataList'
        :typeList="[['QuestionID', '']]"
        :value='condition.QuestionID'
        label="售后原因"
       />
        <OrderChannelSelector
        style="margin-right: 30px"
        :options='progressList'
        :requestFunc='getDataList'
        :changePropsFunc='setCondition4DataList'
        :typeList="[['Status', '']]"
        :value='condition.Status'
        label="售后进度"
       />
       <div class="user-selector">
          <OrderChannelSelector
            :options="userTypeList"
            :requestFunc="getDataList"
            :changePropsFunc="setCondition4DataList"
            :typeList="[['CustomerType', 'First']]"
            :value="condition.CustomerType.First"
            :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
            label="用户"
          />
          <OrderChannelSelector
            :showLabel="false"
            :options="userRankList"
            :requestFunc="getDataList"
            :changePropsFunc="setCondition4DataList"
            :typeList="[['CustomerType', 'Second']]"
            :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
            :value="condition.CustomerType.Second"
            label=""
          />
        </div>
      </li>
      <li>
        <OrderChannelSelector
        style="margin-right: 30px"
        :options='ServerApplyTypeList'
        :requestFunc='getDataList'
        :changePropsFunc='setCondition4DataList'
        :typeList="[['Source', '']]"
        :value='condition.Source'
        label="服务单来源"
       />
        <OrderChannelSelector
        style="margin-right: 30px"
        :options='AppealType'
        :requestFunc='getDataList'
        :changePropsFunc='setCondition4DataList'
        :typeList="[['AppealType', '']]"
        :value='condition.AppealType'
        label="诉求意向"
       />
          <!-- :disabled='condition.SolutionType !== 2' -->
        <!-- <OrderChannelSelector
          class="refund-pay-type"
          :showLabel="false"
          :options="RefundPayTypeList"
          :requestFunc="getDataList"
          :changePropsFunc="setCondition4DataList"
          :typeList="[['RefundPayType', '']]"
          :value="condition.RefundPayType"
          label=""
        /> -->
        <OrderChannelSelector
        style="margin-right: 30px"
        :filterable='true'
        :options='staffList'
        :requestFunc='getDataList'
        :changePropsFunc='setCondition4DataList'
        :typeList="[['OperaterID', '']]"
        :defaultProps="{ label: 'StaffName', value: 'StaffID' }"
        :value='condition.OperaterID'
        label="处理人"
       />
      </li>
      <li>
        <LineDateSelectorComp
          :changePropsFunc='setCondition4DataList'
          :requestFunc='getDataList'
          :isFull="true"
          :typeList="[['DateType', ''], ['Date', 'First'], ['Date', 'Second']]"
          :dateValue='condition.DateType'
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
          label="申请时间"
          :dateList="dateList"
        />
        <!-- <ElDateRangeSelector v-model="conditionDate"  title="时间" :watchVal="condition" /> -->
        <SearchInputComp
        class="search-section"
        :typeList="[['KeyWords', '']]"
        title="关键词"
        placeholder='请输入搜索关键词'
        :requestFunc='getDataList'
        :changePropsFunc='setCondition4DataList'
        :word='condition.KeyWords'
        :searchWatchKey="dataList"
        @reset='() => this.clearCondition()'
        />
      </li>
    </ul>
  </header>
</template>

<script>
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import AreaSelector from '@/components/common/SelectorComps/AreaSelectorIndex.vue';
// import ElDateRangeSelector from '@/components/common/SelectorComps/ElDateRangeSelector';
import { mapState } from 'vuex';

export default {
  props: {
    condition: {
      type: Object,
      default: () => ({}),
    },
    dataList: {
      type: Array,
      default: () => ([]),
    },
  },

  components: {
    OrderChannelSelector,
    LineDateSelectorComp,
    SearchInputComp,
    AreaSelector,
    // ElDateRangeSelector,
  },
  computed: {
    ...mapState('common', ['FeedbackProgress', 'FeedbackQuestionList', 'userTypeList', 'userRankList', 'ServerApplyTypeList']),
    UserDefinedTimeIsActive() {
      return this.condition.DateType === '' && !!this.condition.Date.First && !!this.condition.Date.Second;
    },
    progressList() {
      // if (!this.FeedbackProgress || this.FeedbackProgress.length === 0) return [];
      const arr = [
        { name: '不限', ID: '' },
        { name: '待处理', ID: 0 },
        { name: '处理中', ID: 10 },
        { name: '已挂起', ID: 25 },
        { name: '退款中', ID: 20 },
        { name: '处理完成', ID: 30 },
        { name: '已驳回', ID: 40 },
        { name: '已取消', ID: 255 },
      ];
      return arr;
    },
    questionList() {
      if (!this.FeedbackQuestionList || this.FeedbackQuestionList.length === 0) return [];
      const arr = this.FeedbackQuestionList.map(({ ID, Title }) => ({ name: Title, ID }));
      return [{ name: '不限', ID: '' }, ...arr];
    },
    AppealType() {
      return [
        { name: '不限', ID: '' },
        { name: '退款', ID: 2 },
        { name: '补印', ID: 7 },
        { name: '其他', ID: 255 },
      ];
    },
    RefundPayTypeList() {
      return [
        { name: '不限', ID: '' },
        { name: '原支付方式返还', ID: '0' },
        { name: '退回余额', ID: 1 },
      ];
    },
    conditionDate: {
      get() {
        return [this.condition.Date.First, this.condition.Date.Second];
      },
      set(newVal) {
        const [key, value] = newVal?.length === 2 ? newVal : ['', ''];
        this.setCondition4DataList([['Date', 'First'], key]);
        this.setCondition4DataList([['Date', 'Second'], value]);
        this.getDataList();
      },
    },
  },
  data() {
    return {
      // eslint-disable-next-line max-len
      dateList: [{ name: '不限', ID: 'all' }, { name: '今天', ID: 'today' }, { name: '昨天', ID: 'yesterday' }, { name: '前天', ID: 'beforeyesterday' }, { name: '本月', ID: 'curMonth' }, { name: '上月', ID: 'lastMonth' }],
      dateMenus: [
        { text: '不限', key: 'all' },
        { text: '今天', key: 'TodayDate' },
        { text: '昨天', key: 'YesterdayDate' },
        { text: '前天', key: 'BeforeYesterdayTimeDate' },
        { text: '本月', key: 'curMonthDate' },
        { text: '上月', key: 'lastMonthDate' },
      ],
      staffList: null,
    };
  },
  methods: {
    clearCondition() {
      this.$emit('clearCondition');
    },
    setCondition4DataList(data) {
      this.$emit('setCondition', data);
    },
    getDataList() {
      this.$emit('getDataList');
    },
    async getCustomerData() { // 获取客户数据
      this.api.getOperateStaff().then(res => {
        this.staffList = [{ StaffName: '不限', StaffID: '' }, ...res.data.Data];
      });
    },
  },
  mounted() {
    this.$store.dispatch('common/getFeedbackQuestionList');
    this.$store.dispatch('common/getUserClassify');
    this.getCustomerData();
  },
  watch: {
    'condition.SolutionType': {
      handler(newVal) {
        if (newVal !== 2) {
          this.setCondition4DataList([['RefundPayType', ''], '']);
        }
      },
    },
  },
};
</script>

<style lang='scss'>
.mp-feedback-page-main-wrap-header-wrap {
  > ul {
    padding: 12px 20px;
    padding-top: 8px;
    > li {
      display: flex;
      // height: 48px;
      align-items: center;
      flex-wrap: wrap;
      > div {
        margin-top: 9px !important;
        margin: 9px 0;
      }
      > section {
        margin: 11.5px 0;
      }
      &:last-of-type {
        justify-content: space-between;
        flex-wrap: wrap;
        > section {
          margin-right: 80px;
          margin: 9px 0;
        }
      }
      > .user-selector {
        display: flex;
        // margin-left: 60px;
      }
      .refund-pay-type{
        .el-input>input{
          width: 120px;
        }
      }
    }
  }
}
</style>
