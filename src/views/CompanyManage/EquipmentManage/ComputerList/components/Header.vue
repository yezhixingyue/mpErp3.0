<template>
  <header class="header">
    <el-button type="primary" @click="emit('add')">+ 添加计算机</el-button>
    <div class="filter">
      <div class="list">
        <OrderChannelSelector
          :options="localStateList"
          :requestFunc="getList"
          :changePropsFunc="setCondition"
          :typeList="[['State']]"
          :value="localManageListData.condition.State"
          :defaultProps="{ label: 'Name', value: 'ID' }"
          label="状态"
        />
        <OrderChannelSelector
          :options="localDepartmentList"
          :requestFunc="getList"
          :changePropsFunc="setCondition"
          :typeList="[['DepartmentID']]"
          :value="localManageListData.condition.DepartmentID"
          :defaultProps="{ label: 'ClassName', value: 'ID' }"
          label="部门"
        />
      </div>
      <SearchInputComp
        :typeList="[['Keywords', '']]"
        :requestFunc="getList"
        :changePropsFunc='setCondition'
        :word='localManageListData.condition.Keywords'
        title="关键词"
        placeholder="请输入搜索关键字"
        :searchWatchKey="localManageListData.list"
        @reset='() => localManageListData.clearCondition()'
        />
    </div>
  </header>
</template>

<script setup lang='ts'>
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import { ComputerListManageClass } from '../model/ComputerListManageClass';
import { ComputerUseStateEnumList } from '../types/enum';
import { useStaffList } from '../hooks/useStaffList';
import { computed } from 'vue';

const props = defineProps<{
  localManageListData: ComputerListManageClass
}>();
const emit = defineEmits(['add', 'getList']);

const setCondition = (e) => props.localManageListData.condition.setConditon(e);
const getList = () => emit('getList');

const localStateList = [{ ID: '', Name: '不限' }, ...ComputerUseStateEnumList];

const { departmentList } = useStaffList();
const localDepartmentList = computed(() => [{ ID: '', ClassName: '不限' }, ...departmentList.value.filter(it => it.Level === 1)]);

</script>

<style scoped lang='scss'>
.header {
  padding: 20px;
  padding-right: 60px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  > button {
    height: 32px;
    width: 120px;
    padding: 0;
    border-radius: 2px;
    flex: none;
  }

  > .filter {
    padding-left: 20px;
    flex-wrap: wrap;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    > .list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
  }
}
</style>
