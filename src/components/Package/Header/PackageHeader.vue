<template>
  <header class="mp-erp-package-page-header-comp-wrap">
    <div class="first">
      <area-selector
        :changePropsFunc='setCondition4DataList'
        :requestFunc='getPackageDataList'
        :RegionalID='condition4DataList.SellArea.RegionalID'
        :CityID='condition4DataList.SellArea.CityID'
        :CountyID='condition4DataList.SellArea.CountyID'
        :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
        />
      <div class="user-selector">
        <order-channel-selector
          :options="userTypeList"
          :requestFunc="getPackageDataList"
          :changePropsFunc="setCondition4DataList"
          :typeList="[['CustomerType', 'First']]"
          :value="condition4DataList.CustomerType.First"
          :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
          label="用户"
        />
        <order-channel-selector
          :showLabel="false"
          :options="userRankList"
          :requestFunc="getPackageDataList"
          :changePropsFunc="setCondition4DataList"
          :typeList="[['CustomerType', 'Second']]"
          :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
          :value="condition4DataList.CustomerType.Second"
          label=""
        />
      </div>
      <order-channel-selector
        :options="expressList"
        :requestFunc="getPackageDataList"
        :changePropsFunc="setCondition4DataList"
        :typeList="[['ExpressType', '']]"
        :defaultProps="{ label: 'name', value: 'ID' }"
        :value="condition4DataList.ExpressType"
        label="配送方式"
      />
      <order-channel-selector
        :options="deliverStatus"
        :requestFunc="getPackageDataList"
        :changePropsFunc="setCondition4DataList"
        :typeList="[['Status', '']]"
        :defaultProps="{ label: 'name', value: 'ID' }"
        :value="condition4DataList.Status"
        label="物流状态"
      />
    </div>
    <div class="second">
      <LineDateSelectorComp
        :changePropsFunc='setCondition4DataList'
        :requestFunc='getPackageDataList'
        :isFull="true"
        :typeList="[['DateType', ''], ['CreateTime', 'First'], ['CreateTime', 'Second']]"
        :dateValue='condition4DataList.DateType'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        label="时间筛选"
        :dateList="dateList"
        dateType="date"
        />
        <search-input-comp
        class="search-section"
        :typeList="[['KeyWords', '']]"
        title="关键词"
        placeholder='请输入搜索关键词'
        :requestFunc='getPackageDataList'
        :changePropsFunc='setCondition4DataList'
        :word='condition4DataList.KeyWords'
        :searchWatchKey="packageDataList"
        @reset='clearCondition4DataList'
        />
    </div>
  </header>
</template>

<script>
import AreaSelector from '@/components/common/SelectorComps/AreaSelectorIndex.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    AreaSelector,
    OrderChannelSelector,
    LineDateSelectorComp,
    SearchInputComp,
  },
  computed: {
    ...mapState('packageModule', ['condition4DataList', 'packageDataList']),
    ...mapState('common', ['userTypeList', 'userRankList', 'deliverStatus']),
    ...mapGetters('common', ['expressList']),
    UserDefinedTimeIsActive() {
      return this.condition4DataList.DateType === '' && !!this.condition4DataList.CreateTime.First && !!this.condition4DataList.CreateTime.Second;
    },
  },
  data() {
    return {
      // eslint-disable-next-line max-len
      dateList: [{ name: '全部', ID: 'all' }, { name: '今日揽收', ID: 'today' }, { name: '昨日揽收', ID: 'yesterday' }, { name: '本月揽收', ID: 'curMonth' }, { name: '上月揽收', ID: 'lastMonth' }],
    };
  },
  methods: {
    ...mapMutations('packageModule', ['setCondition4DataList', 'clearCondition4DataList']),
    ...mapActions('packageModule', ['getPackageDataList']),
  },
  mounted() {
    this.$store.dispatch('common/getUserClassify');
    this.$store.dispatch('common/getExpressList');
  },
};
</script>
<style lang='scss'>
.mp-erp-package-page-header-comp-wrap {
  padding-left: 20px;
  padding-bottom: 20px;
  > div {
    display: flex;
    flex-wrap: wrap;
    &.first {
      > .user-selector {
        display: flex;
        margin-right: 30px;
        & + section {
          margin-right: 30px;
        }
      }
    }
    &.second {
      justify-content: space-between;
    }
    > * {
      margin-top: 18px;
      &.mp-common-comps-search-box {
        margin-right: 6vw;
      }
    }
  }
}
</style>
