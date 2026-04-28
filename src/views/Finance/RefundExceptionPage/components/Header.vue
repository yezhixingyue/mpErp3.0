<template>
  <header class="mp-developer-list-manage-page-header">
    <ul>
      <li>
        <div class="user-selector">
          <OrderChannelSelector
            :options="userTypeList"
            :requestFunc="getList"
            :changePropsFunc="setCondition"
            :typeList="[['CustomerType', 'First']]"
            :value="condition.CustomerType.First"
            :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
            label="用户"
          />
          <OrderChannelSelector
            :showLabel="false"
            :options="userRankList"
            :requestFunc="getList"
            :changePropsFunc="setCondition"
            :typeList="[['CustomerType', 'Second']]"
            :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
            :value="condition.CustomerType.Second"
            label=""
          />
        </div>

        <OrderChannelSelector
          :options="BillAccountEnumList.filter(it => it.onlyRefundException)"
          :requestFunc="getList"
          class="mr-30 account"
          :changePropsFunc="setCondition"
          :typeList="[['Account', '']]"
          :defaultProps="{ label: 'Name', value: 'ID' }"
          :value="condition.Account"
          withEmpty
          label="原支付账户"
        />

        <StaffSelector
          title="处理人"
          class="mr-40"
          needlimit
          isLineStyle
          showArrow
          :remote="false"
          :changePropsFunc='setCondition'
          :requestFunc='getList'
          :typeList="[['Operator', '']]"
          :value="condition.Operator"
          />

        <OrderChannelSelector
          :options="RefundApplyChannelEnumList"
          :requestFunc="getList"
          :changePropsFunc="setCondition"
          :typeList="[['Channel', '']]"
          :defaultProps="{ label: 'Name', value: 'ID' }"
          :value="condition.Channel"
          withEmpty
          label="退款渠道"
        />
      </li>

      <li>
        <LineDateSelectorComp
          :changePropsFunc='setCondition'
          :requestFunc='getList'
          :isFull="true"
          :typeList="[['DateType', ''], ['CreateTime', 'First'], ['CreateTime', 'Second']]"
          :dateList="dateList"
          :dateValue='condition.DateType'
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
          label="申请退款时间"
        />
      </li>

      <li class="third">
        <RadioButtonGroupComp
          :radioList="[{ ID: '', Name: '不限' }, ...RefundExceptionStatusEnumList.filter(it => !it.hideToFilter)]"
          :requestFunc="getList"
          v-model="localStatus"
          :isFull="true"
          :defaultProps="{ label: 'Name', value: 'ID' }"
          title="状态筛选"
          class="mt-20"
        />

        <SearchInputComp
          :typeList="[['KeyWords', '']]"
          :requestFunc='getList'
          :changePropsFunc='setCondition'
          :word='condition.KeyWords'
          @reset='clearCondition'
          title="关键词"
          placeholder="请输入异常编号、订单号、客户编号"
          :searchWatchKey="list" />
      </li>
    </ul>
  </header>
</template>

<script setup lang='ts'>
import { computed, getCurrentInstance, onMounted } from 'vue';
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import StaffSelector from '@/components/common/SelectorComps/StaffSelector.vue';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
import RadioButtonGroupComp from '@/components/common/RadioButtonGroupComp.vue';
import { RefundExceptionCondition } from '../model/Condition';
import { BillAccountEnumList } from '@/packages/enums/billEnumList.js';
import { RefundExceptionStatusEnumList, RefundApplyChannelEnumList } from '../types/enum';

const props = defineProps<{
  condition: RefundExceptionCondition
  list: object[]
}>();

const emit = defineEmits(['setCondition', 'getList', 'clear']);

const setCondition = (e) => {
  emit('setCondition', e);
};

const clearCondition = () => {
  emit('clear');
};

const getList = () => {
  emit('getList');
};

const { proxy } = getCurrentInstance();
const userTypeList = computed(() => proxy.$store.state.common.userTypeList);
const userRankList = computed(() => proxy.$store.state.common.userRankList);

const dateList = [
  { name: '近7天', ID: 'last7Date' },
  { name: '今天', ID: 'today' },
  { name: '昨天', ID: 'yesterday' },
  // { name: '前天', ID: 'beforeyesterday' },
  { name: '本月', ID: 'curMonth' },
  { name: '上月', ID: 'lastMonth' },
];
const UserDefinedTimeIsActive = computed(() => props.condition.DateType === '' && !!props.condition.CreateTime.First && !!props.condition.CreateTime.Second);

const localStatus = computed({
  get() {
    return props.condition.Status;
  },
  set(val) {
    setCondition([['Status'], val]);
    getList();
  },
});

onMounted(() => {
  proxy.$store.dispatch('common/getUserClassify');
});
</script>

<style lang='scss'>
.mp-developer-list-manage-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 20px;
  padding-bottom: 20px;

  > ul {
    padding-top: 16px;
    width: 100%;

    > li {
      margin-top: 0px;
      width: 100%;
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .user-selector {
        display: flex;
        align-items: center;
        margin-right: 45px;

        .mp-common-comps-order-channel-selector-wrap > header {
          width: 3em;
          margin-right: 5px;
        }
      }

      .account > header {
        width: 6em;
      }

      .mp-line-date-selector-wrap {
        margin-top: 20px;
        > .title {
          width: 7em;
        }
      }

      &.third {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .mp-common-comps-radio-group-wrap > header {
          font-size: 14px;
          color: #444;
          font-weight: 700;
          width: 5em;
          display: inline-block;
          text-align: right;
          margin-right: 12px;
        }
      }
    }
  }

  .mp-common-comps-search-box {
    margin-top: 20px;

    .el-input {
      width: 215px;
    }
  }
}
</style>
