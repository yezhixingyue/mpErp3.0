<template>
  <header class="mp-feedback-page-main-wrap-header-wrap">
    <ul>
      <li>
        <AreaSelector
          style="margin-right: 40px"
          :changePropsFunc="setCondition4DataList"
          :requestFunc="getDataList"
          :RegionalID="condition.SellArea.RegionalID"
          :CityID="condition.SellArea.CityID"
          :CountyID="condition.SellArea.CountyID"
          :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
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
        <LineDateSelectorComp
        :changePropsFunc='setCondition4DataList'
        :requestFunc='getDataList'
        :isFull="true"
        :typeList="[['DateType', ''], ['Date', 'First'], ['Date', 'Second']]"
        :dateValue='condition.DateType'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        label="时间"
        :dateList="dateList"
        dateType="date"
        />
        <search-input-comp
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
  },
  computed: {
    ...mapState('common', ['FeedbackProgress', 'FeedbackQuestionList', 'userTypeList', 'userRankList']),
    UserDefinedTimeIsActive() {
      // eslint-disable-next-line max-len
      return this.condition.DateType === '' && !!this.condition.Date.First && !!this.condition.Date.Second;
    },
    progressList() {
      if (!this.FeedbackProgress || this.FeedbackProgress.length === 0) return [];
      return [{ name: '不限', ID: '' }, ...this.FeedbackProgress];
    },
    questionList() {
      if (!this.FeedbackQuestionList || this.FeedbackQuestionList.length === 0) return [];
      const arr = this.FeedbackQuestionList.map(({ ID, Title }) => ({ name: Title, ID }));
      return [{ name: '不限', ID: '' }, ...arr];
    },
  },
  data() {
    return {
      // eslint-disable-next-line max-len
      dateList: [{ name: '不限', ID: 'all' }, { name: '今天', ID: 'today' }, { name: '昨天', ID: 'yesterday' }, { name: '前天', ID: 'beforeyesterday' }, { name: '本月', ID: 'curMonth' }, { name: '上月', ID: 'lastMonth' }],
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
      // console.log('getDataList', this.condition);
      this.$emit('getDataList');
    },
  },
  mounted() {
    this.$store.dispatch('common/getFeedbackQuestionList');
    this.$store.dispatch('common/getUserClassify');
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
    }
  }
}
</style>
