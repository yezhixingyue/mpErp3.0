<template>
  <header class="mp-developer-list-manage-page-header">
    <ul>
      <li>
        <span class="label">账号类型：</span>
        <el-radio-group v-model="localType">
          <el-radio label="">不限</el-radio>
          <el-radio v-for="it in DeveloperTypeEnumList" :key="it.ID" :label="it.ID">{{ it.Name }}</el-radio>
        </el-radio-group>
      </li>

      <li>
        <span class="label">状态：</span>
        <el-radio-group v-model="localStatus">
          <el-radio label="">不限</el-radio>
          <el-radio v-for="it in DeveloperStatusEnumList" :key="it.ID" :label="it.ID">{{ it.Name }}</el-radio>
        </el-radio-group>
      </li>

      <li>
        <el-checkbox v-model="localIsLock">仅显示已锁定账号</el-checkbox>
      </li>
    </ul>

    <div>
      <SearchInputComp
        :typeList="[['KeyWords', '']]"
        :requestFunc='getList'
        :changePropsFunc='setCondition'
        :word='condition.KeyWords'
        @reset='clearCondition'
        title="关键词"
        placeholder="请输入名称/证件号/手机号/技术联系人关键字"
        :searchWatchKey="list" />
    </div>
  </header>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import { Condition } from '../js/Condition';
import { DeveloperTypeEnumList, DeveloperStatusEnumList } from '../js/enum';

const props = defineProps<{
  condition: Condition
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

const localType = computed({
  get() {
    return props.condition.Type;
  },
  set(val) {
    setCondition([['Type'], val]);
    getList();
  },
});

const localStatus = computed({
  get() {
    return props.condition.Status;
  },
  set(val) {
    setCondition([['Status'], val]);
    getList();
  },
});

const localIsLock = computed({
  get() {
    return props.condition.IsLock;
  },
  set(val) {
    setCondition([['IsLock'], val || '']);
    getList();
  },
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
    display: flex;
    align-items: center;
    // justify-content: space-between;
    flex-wrap: wrap;
    padding-top: 16px;

    > li {
      margin-top: 0px;
      height: 30px;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      margin-right: 70px;
      .label {
        font-size: 12px;
        color: #585858;
        margin-bottom: 4px;
        margin-right: 5px;
        white-space: nowrap;
      }

      &:first-of-type {
        margin-right:170px;
      }

      &:last-of-type {
        margin-right: 40px;
      }

      .el-radio-group {
        flex-wrap: nowrap;
      }

      .el-radio {
        margin-right: 20px;
      }

      .el-checkbox  {
        .el-checkbox__label {
          font-size: 12px;
        }
      }
    }
  }

  .mp-common-comps-search-box {
    margin-top: 16px;

    .el-input {
      width: 270px;
    }
  }
}
</style>
