<template>
  <header class="header">
    <el-button type="primary" @click="emit('add')">+ 添加设备</el-button>

    <div class="filter">
      <div class="list">
        <OrderChannelSelector
          :options="localTypeList"
          :requestFunc="getList"
          :changePropsFunc="setCondition"
          :typeList="[['Type']]"
          :value="localListManageData.condition.Type"
          :defaultProps="{ label: 'Name', value: 'ID' }"
          label="设备类型"
        />
        <OrderChannelSelector
          :options="localStateList"
          :requestFunc="getList"
          :changePropsFunc="setCondition"
          :typeList="[['Status']]"
          :value="localListManageData.condition.Status"
          :defaultProps="{ label: 'Name', value: 'ID' }"
          label="状态"
        />
        <OrderChannelSelector
          :options="localDepartmentList"
          :requestFunc="getList"
          :changePropsFunc="setCondition"
          :typeList="[['DepartmentID']]"
          :value="localListManageData.condition.DepartmentID"
          :defaultProps="{ label: 'ClassName', value: 'ID' }"
          label="部门"
        />
        <OrderChannelSelector
          :options="localJobPostList"
          :requestFunc="getList"
          :changePropsFunc="setCondition"
          :typeList="[['PostID']]"
          :value="localListManageData.condition.PostID"
          :defaultProps="{ label: 'PositionName', value: 'PositionID' }"
          label="岗位"
        />
      </div>
      <SearchInputComp
        :typeList="[['Keywords', '']]"
        :requestFunc="getList"
        :changePropsFunc='setCondition'
        :word='localListManageData.condition.Keywords'
        title="关键词"
        placeholder="请输入搜索关键字"
        :searchWatchKey="localListManageData.list"
        @reset='() => localListManageData.clearCondition()'
        />
    </div>
  </header>
</template>

<script setup lang='ts'>
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import { computed } from 'vue';
import { useStaffList } from '../hooks/useStaffList';
import { ManageEquipmentListClass } from '../model/ManageEquipmentListClass';
import { EquipmentStatusEnumList, EquipmentTypeEnumList } from '../types/enum';

const props = defineProps<{
  localListManageData: ManageEquipmentListClass
}>();
const emit = defineEmits(['add', 'getList']);

const setCondition = (e) => props.localListManageData.condition.setConditon(e);
const getList = () => emit('getList');

const localStateList = [{ ID: '', Name: '不限' }, ...EquipmentStatusEnumList];
const localTypeList = [{ ID: '', Name: '不限' }, ...EquipmentTypeEnumList];

const { departmentList, jobPostList } = useStaffList();
const localDepartmentList = computed(() => [{ ID: '', ClassName: '不限' }, ...departmentList.value.filter(it => it.Level === 1)]);
const localJobPostList = computed(() => [{ PositionID: '', PositionName: '不限' }, ...jobPostList.value]);
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
