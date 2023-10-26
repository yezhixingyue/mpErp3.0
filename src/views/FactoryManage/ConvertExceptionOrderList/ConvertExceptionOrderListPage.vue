<template>
  <section class="mp-erp-factory-convert-exception-order-list-manage-page-wrap">
    <Header
      :condition="ManageListData.condition"
      :setCondition="ManageListData.condition.setConditon.bind(ManageListData.condition)"
      :clearCondition="ManageListData.clearCondition.bind(ManageListData)"
      :getList="ManageListData.getList.bind(ManageListData)"
      :list="ManageListData.list"
      :ConvertServerList="ManageListData.ConvertServerList"
    />
    <Main
      :list="ManageListData.list"
      :loading="ManageListData.loading"
      @setTableRef="(multipleTableRef) => ManageListData.setMultipleTableRef(multipleTableRef)"
      @select="(rows) => ManageListData.setSelectList(rows)"
      @setHaveDeal="(row) => ManageListData.setRowsHaveDeal([row])"
     />
    <Footer :ManageListData="ManageListData" />
  </section>
</template>

<script lang='ts' setup>
import { Ref, onMounted, ref } from 'vue';
import Header from './Comps/Header.vue';
import Main from './Comps/Main.vue';
import Footer from './Comps/Footer.vue';
import { ManageListClass } from './js/ManageListClass';

const ManageListData = ref(new ManageListClass()) as unknown as Ref<ManageListClass>;

onMounted(() => {
  ManageListData.value.getList();
  ManageListData.value.getConvertServerList();
});
</script>

<script lang='ts'>
// eslint-disable-next-line import/first
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  name: 'ConvertExceptionOrderListPage',
  mixins: [recordScrollPositionMixin('.mp-erp-factory-convert-exception-order-list-manage-page-wrap .el-table__body-wrapper')],
};
</script>

<style lang='scss'>
.mp-erp-factory-convert-exception-order-list-manage-page-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding-left: 8px;
  box-sizing: border-box;
  > main {
    flex: 1;
    margin-top: 8px;
    overflow: hidden;
    > :deep(.el-table) {
      height: 100%;
    }
  }
  > footer {
    height: 40px;
    padding: 7px 0 3px 0;
  }
  > header, > footer {
    flex: none;
  }
  > header, > main, > footer {
    background-color: #fff;
  }
}
</style>
