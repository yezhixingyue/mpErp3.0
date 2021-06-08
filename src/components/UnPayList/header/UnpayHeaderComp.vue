<template>
  <div class="mp-unpay-list-page-header-comp-wrap">
    <staff-selector
      title="接单员"
      needlimit
      isLineStyle
      showArrow
      :remote="false"
      :changePropsFunc='setSearchCondition4UnPayList'
      :requestFunc='getTableData'
      :typeList="[['OrderTaker', '']]"
      :value='searchCondition4UnPayList.OrderTaker'
      />
    <order-channel-selector
      :options='orderCreateTypeList'
      :requestFunc='getTableData'
      :changePropsFunc='setSearchCondition4UnPayList'
      :typeList="[['OrderType', '']]"
      :value='searchCondition4UnPayList.OrderType'
      label='下单方式'
      />
    <search-input-comp
     title="关键词"
     placeholder="请输入搜索关键词"
     resetWords='清除所有筛选项'
     :typeList="[['KeyWords', '']]"
     :requestFunc='getTableData'
     :changePropsFunc='setSearchCondition4UnPayList'
     :word='searchCondition4UnPayList.KeyWords'
     @reset='clearSearchCondition4UnPayList'
     :searchWatchKey="searchWatchKey"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import StaffSelector from '@/components/common/SelectorComps/StaffSelector.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';

export default {
  components: {
    SearchInputComp,
    OrderChannelSelector,
    StaffSelector,
  },
  computed: {
    ...mapState('common', ['orderCreateTypeList']),
    ...mapState('unpaylist', ['searchCondition4UnPayList', 'searchWatchKey']),
  },
  methods: {
    ...mapMutations('unpaylist', ['setSearchCondition4UnPayList', 'clearSearchCondition4UnPayList']),
    ...mapActions('unpaylist', ['getTableData']),
  },
};

</script>

<style lang='scss'>
.mp-unpay-list-page-header-comp-wrap {
    height: 50px;
    box-sizing: border-box;
    padding: 10px 60px;
    padding-bottom: 5px;
    display: flex;
    justify-content: flex-end;
    > .mp-common-comps-order-channel-selector-wrap {
      margin-top: 3px;
      margin-right: 68px;
      > main {
        margin-top: 2px;
      }
    }
    > .mp-common-comps-staff-selector-wrap {
      margin-top: 5px;
      margin-right: 50px;
      > main {
        > div {
          > div.mp-common-remote-select-comp-wrap > div.el-input > input {
            border-color: rgb(220, 220, 220);
            font-size: 13px;
          }
          > i {
            right: 2px;
          }
        }
      }
      > header {
        line-height: 22px;
      }
    }
}

</style>
