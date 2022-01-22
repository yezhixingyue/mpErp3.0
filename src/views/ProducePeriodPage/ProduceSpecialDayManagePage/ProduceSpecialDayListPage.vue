<template>
  <section class="mp-erp-period-manage-produce-special-day-manage-list-page">
    <header>
      <el-button type="primary" sizi='small' @click="onItemSetupClick(null)" v-if="localPermission.SpecialDaySetup">添加生产特殊情况</el-button>
      <div>
        <ProductSelector
          :changePropsFunc="setCondition2ListData"
          :requestFunc="getTableDataList"
          :ClassID="Condition4ProduceSpecialDayList.ClassID"
          :TypeID="Condition4ProduceSpecialDayList.TypeID"
          :ProductID="Condition4ProduceSpecialDayList.ProductID"
          :typeList="[['ClassID', ''],['TypeID', ''],['ProductID', '']]" />
      </div>
    </header>
    <main>
      <ProduceSpecialDayTableComp :loading='loading' :dataList='ProduceSpecialDayDataList' @edit="onItemSetupClick" @remove="onRemoveClick" />
    </main>
    <footer>
      <CountComp
        :count='ProduceSpecialDayDataNumber'
        :watchPage='Condition4ProduceSpecialDayList.Page'
        :handlePageChange='getTableDataList'
        :pageSize='20'
        center
      />
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import CountComp from '@/components/common/Count.vue';
import ProductSelector from '@/components/common/SelectorComps/ProductSelectorIndex.vue';
import ProduceSpecialDayTableComp from '../../../components/ProducePeriodComps/SpecialDayComps/ProduceSpecialDayTableComp.vue';

export default {
  name: 'ProduceSpecialDayListPage',
  components: {
    ProductSelector,
    ProduceSpecialDayTableComp,
    CountComp,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('periodManage', ['loading', 'ProduceSpecialDayDataList', 'ProduceSpecialDayDataNumber', 'Condition4ProduceSpecialDayList']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionProducePeriod?.Obj) {
        return this.Permission.PermissionList.PermissionProducePeriod.Obj;
      }
      return {};
    },
  },
  methods: {
    onItemSetupClick(item) { // 为null为新增 否则为编辑
      this.$router.push({ name: 'ProduceSpecialDaySetup', params: { ItemID: item ? item.ItemID : 'null' } });
    },
    onRemoveClick(item) {
      if (!item || !item.ItemID) return;
      this.$store.dispatch('periodManage/getProduceSpecialDayItemRemove', item);
    },
    getTableDataList(Page = 1) {
      this.$store.dispatch('periodManage/getProduceSpecialDayDataList', Page);
    },
    setCondition2ListData(e) {
      this.$store.commit('periodManage/setCondition4ProduceSpecialDayList', e);
    },
  },
  mounted() {
    this.$store.commit('periodManage/clearCondition4ProduceSpecialDayList');
    this.getTableDataList();
  },
};
</script>
<style lang='scss'>
.mp-erp-period-manage-produce-special-day-manage-list-page {
  background-color: #f5f5f5;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  font-size: 14px;
  min-width: 900px;
  > header {
    flex: none;
    height: 60px;
    padding: 0 20px;
    background-color: #fff;
    display: flex;
    align-items: center;
    > button {
      width: 140px;
      flex: none;
      height: 30px;
      padding: 0;
      border-radius: 2px;
      margin-right:65px;
    }
    > div {
      color: #444;
      > label {
        font-weight: 700;
      }
      .el-radio__label {
        color: #444;
      }
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    margin: 0 -1px;
    margin-top: 10px;
  }
  > footer {
    flex: none;
    background-color: #fff;
    height: 45px;
    padding-bottom: 10px;
    padding-top: 2px;
    text-align: right;
    color: #585858;
    .blue {
      color: #26BCF9;
      margin: 0 3px;
    }
  }
}
</style>
