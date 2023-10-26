<template>
  <header class="header-box">
    <div class="first">
      <div class="menu">
        <h4>状态筛选：</h4>
        <span v-for="it in localStatusEnumList" :key="it.ID" :class="{active:it.ID===condition.HaveDeal}" @click="onMenuClick(it,'HaveDeal')">{{it.Name}}</span>
      </div>
      <!-- <div class="menu">
        <h4>异常类型：</h4>
        <span v-for="it in localTypeEnumList" :key="it.ID" :class="{active:it.ID===condition.Type}" @click="onMenuClick(it, 'Type')">{{it.Name}}</span>
      </div> -->
      <OrderChannelSelector
        :options='localServerList'
        :requestFunc='getList'
        :changePropsFunc='setCondition'
        :typeList="[['ServerID', '']]"
        style="margin-right: 20px"
        :value='condition.ServerID'
        :defaultProps="{ label: 'Name', value: 'ID', }"
        label='转换器'
        />
    </div>
    <div class="second">
      <div class="left">
        <LineDateSelectorComp
          :changePropsFunc='setCondition'
          :requestFunc='getList'
          :isFull="true"
          :typeList="[['DateType', ''], ['CreateTime', 'First'], ['CreateTime', 'Second']]"
          :dateList="dateList"
          :dateValue='condition.DateType'
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
          label="时间筛选"
        />
      </div>
      <SearchInputComp
        :word='condition.KeyWords'
        :typeList="[['KeyWords', '']]"
        title="关键词搜索"
        placeholder="请输入搜索关键词"
        resetWords="清空所有筛选条件"
        :changePropsFunc="(e) => setCondition(e)"
        :requestFunc='getList'
        :searchWatchKey="list"
        @reset='clearCondition'
      />
    </div>
  </header>
</template>

<script setup lang='ts'>
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import LineDateSelectorComp from '../../../../components/common/SelectorComps/LineDateSelectorComp.vue';
import { SearchInputComp } from '../../../../components/common/mpzj-sell-lib/lib';
import { computed } from 'vue';
import { Condition } from '../js/Condition';
import { IConvertExceptionListItem } from '../js/type';
import { ILocalEnumValue, ISetConditionParams } from '../../../../assets/types';

const props = defineProps<{
  condition: Condition
  setCondition:(e: ISetConditionParams) => void
  clearCondition:() => void
  getList:(Page?: number) => void
  list: IConvertExceptionListItem[]
  ConvertServerList: { ID: string, Name: string }[]
}>();

const dateList = [
  { name: '近7天异常', ID: 'last7Date' },
  { name: '今天', ID: 'today' },
  { name: '昨天', ID: 'yesterday' },
  { name: '前天', ID: 'beforeyesterday' },
  { name: '本月', ID: 'curMonth' },
  { name: '上月', ID: 'lastMonth' },
];

const UserDefinedTimeIsActive = computed(() => props.condition.DateType === '' && !!props.condition.CreateTime.First && !!props.condition.CreateTime.Second);

const onMenuClick = (it: ILocalEnumValue, key: keyof Condition) => {
  props.setCondition([[key, ''], it.ID]);
  props.getList();
};

const localStatusEnumList = [{ ID: '', Name: '不限' }, { ID: false, Name: '未处理' }, { ID: true, Name: '已处理' }] as ILocalEnumValue[];
const localServerList = computed(() => [{ ID: '', Name: '不限' }, ...props.ConvertServerList]);

</script>

<style scoped lang='scss'>
.header-box {
  padding: 20px 15px 20px;
  .menu {
    flex: none;
    white-space: wrap;
    max-width: 100%;
    min-height: 28px;
    margin-right: 62px;
    font-size: 14px;
    > span {
      display: inline-block;
      line-height: 26px;
      padding: 0 24px;
      box-shadow: 0 0 0 1px #e8e8e8;
      cursor: pointer;
      background-color: #f5f5f5;
      color: #444;
      transition: 0.2s ease-in-out;
      position: relative;
      user-select: none;
      &:hover {
        color: #26bcf9;
      }
      &.active {
        color: #26bcf9;
        background-color: #fff;
        box-shadow: 0 0 0 1px #26bcf9;
        z-index: 2;
      }
    }
    .is-pink {
      line-height: 28px;
      i {
        vertical-align: -2px;
      }
    }
    h4 {
      display: inline-block;
      margin-right: 16px;
      min-width: 6em;
      text-align: right;
      font-weight: 700;
      color: #444;
    }
  }
  .first {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .second {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  :deep(.mp-line-date-selector-wrap) {
    margin-right: 20px;
    margin-top: 15px;
    // line-height: 30px;
    min-width: 800px;
    .title {
      min-width: 6em;
    }
  }
  :deep(.mp-common-comps-search-box) {
    margin-left: 0;
    margin-top: 15px;
    padding-top: 0;
  }
}

</style>
