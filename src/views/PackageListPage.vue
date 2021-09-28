<template>
  <section class="mp-erp-package-list-page-wrap">
    <PackageHeader />
    <main>
      <Table />
      <OrderListDialog />
      <ServiceDialog key="package-list-page" />
    </main>
    <footer>
      <Count
       :watchPage='condition4DataList.Page'
       :handlePageChange='handlePageChange'
       :count='packageDataNumber'
       :pageSize='condition4DataList.PageSize'
       />
    </footer>
  </section>
</template>

<script>
import PackageHeader from '@/components/Package/Header/PackageHeader.vue';
import Table from '@/components/Package/TableTransport.vue';
import OrderListDialog from '@/components/order/Main/OrderListDialog.vue';
import ServiceDialog from '@/components/order/DialogContent/ServiceDialog.vue';
import Count from '@/components/common/Count.vue';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import { mapState } from 'vuex';

export default {
  name: 'PackageListPage',
  mixins: [recordScrollPositionMixin('.mp-erp-package-list-page-wrap .el-table__body-wrapper')],
  components: {
    PackageHeader,
    Table,
    OrderListDialog,
    ServiceDialog,
    Count,
  },
  computed: {
    ...mapState('packageModule', ['condition4DataList', 'packageDataNumber']),
  },
  methods: {
    handlePageChange(page) {
      this.$store.dispatch('packageModule/getPackageDataList', page);
    },
  },
  mounted() {
    this.$store.dispatch('packageModule/getPackageDataList');
  },
};
</script>
<style lang='scss'>
.mp-erp-package-list-page-wrap {
  > footer {
    margin-top: 2px;
    padding-top: 5px;
    box-shadow: 0px 3px 7px #c4c4c4;
    padding-bottom: 8px;
  }
}
</style>
