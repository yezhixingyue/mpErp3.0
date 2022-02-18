<template>
  <section class="mp-erp-print-bean-list-page-wrap">
    <PrintBeanListPageHeader
     @add="onJumpToSetupClick('null')"
     :condition="PrintBeanListClassData.Condition"
     :searchWatchKey='PrintBeanListClassData.DataList'
    />
    <main>
      <PrintBeanListPageTable
        :list='PrintBeanListClassData.DataList'
        :loading='PrintBeanListClassData.loading'
        @edit='onJumpToSetupClick'
        @remove='handleItemRemove'
      />
    </main>
    <footer>
      <CountComp
        :count='PrintBeanListClassData.DataNumber'
        :watchPage='PrintBeanListClassData.Condition.Page'
        :handlePageChange='handlePageChange'
        :pageSize='PrintBeanListClassData.Condition.PageSize'
      />
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import PrintBeanListPageHeader from '../../components/PrintBeanComps/ListPageComps/PrintBeanListPageHeader.vue';
import PrintBeanListPageTable from '../../components/PrintBeanComps/ListPageComps/PrintBeanListPageTable.vue';
import CountComp from '../../components/common/Count.vue';

export default {
  name: 'PrintBeanListPage',
  components: {
    PrintBeanListPageHeader,
    PrintBeanListPageTable,
    CountComp,
  },
  computed: {
    ...mapState('printBean', ['PrintBeanListClassData']),
  },
  methods: {
    onJumpToSetupClick(ID) { // 跳转配置页面
      this.$router.push({ name: 'printBeanSetup', params: { ID } });
    },
    async handleItemRemove([item, index]) {
      if (!item || !item.ID) return;
      const resp = await this.api.getPrintBeanRemove(item.ID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const temp = {
            item,
            isEdit: false,
            isRemove: true,
            index,
          };
          this.$store.commit('printBean/setItemChange', temp);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    handlePageChange(page) {
      this.$store.dispatch('printBean/getPrintBeanList', page);
    },
  },
  created() {
    this.$store.dispatch('common/getUserClassify');
    // this.$store.dispatch('common/getAreaList');
  },
  mounted() {
    this.$store.commit('printBean/clearCondition');
    this.$store.dispatch('printBean/getPrintBeanList');
  },
};
</script>
<style lang='scss'>
.mp-erp-print-bean-list-page-wrap {
  display: flex;
  flex-direction: column;
  background: rgb(245, 245, 245);
  width: 100%;
  height: 100%;
  padding-left: 8px;
  box-sizing: border-box;
  overflow: hidden;
  > header {
    flex: none;
    // height: 60px;
    background-color: #fff;
    padding: 15px 20px;
    padding-top: 0;
    > div {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      > button {
        flex: none;
        width: 120px;
        height: 30px;
        padding: 0;
        border-radius: 2px;
        margin-right: 30px;
        margin-top: 15px;
      }
      > ul {
        flex: none;
        margin-right: 30px;
        margin-top: 15px;
      }
      > section {
        flex: none;
        margin-right: 30px;
        margin-top: 15px;
        &:last-of-type {
          margin-right: 0;
        }
      }
      .mp-common-select-comp-wrap .el-input > input {
        font-size: 12px !important;
        color: #585858 !important;
        position: relative;
        top: 1px;
      }
      &:last-of-type {
        justify-content: space-between;
        padding-right: 25px;
      }
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    margin-top: 10px;
    padding-right: 2px;
  }
  > footer {
    flex: none;
    background-color: #fff;
    height: 70px;
  }
}
</style>
