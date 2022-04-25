<template>
  <section class="mp-erp-cash-back-list-page-wrap">
    <Header @setup='onSetupClick' />
    <main>
      <Table :list='DataList' :loading='loading' @edit='onSetupClick' @remove='handleItemRemove' />
    </main>
    <footer>
      <CountComp
        :count='DataNumber'
        :watchPage='conditionForDataList.Page'
        :handlePageChange='handlePageChange'
        :pageSize='conditionForDataList.PageSize'
      />
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import Header from '../../components/BackCashComps/ListComps/Header.vue';
import Table from '../../components/BackCashComps/ListComps/Table.vue';
import CountComp from '../../components/common/Count.vue';

export default {
  name: 'CashBackListPage',
  mixins: [recordScrollPositionMixin('.mp-erp-cash-back-list-page-wrap .el-table__body-wrapper')],
  components: {
    Header,
    Table,
    CountComp,
  },
  computed: {
    ...mapState('cashback', ['conditionForDataList', 'DataList', 'DataNumber', 'loading']),
  },
  methods: {
    onSetupClick(id) {
      this.$router.push({
        name: 'cashBackSetup',
        params: {
          ID: id || 'null',
        },
      });
    },
    handlePageChange(page) {
      this.$store.dispatch('cashback/getConsumeReturnCashList', page);
    },
    async handleItemRemove([itemData, i]) {
      const resp = await this.api.getConsumeReturnCashRemove(itemData.ID).catch(() => null);
      if (resp?.data.Status === 1000) {
        const cb = () => {
          this.$store.commit('cashback/setListItemRemove', i);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
  },
  mounted() {
    this.$store.dispatch('common/getUserClassify');
    // this.$store.dispatch('common/getAreaList'); // 使用筛选组件后 注释该方法的使用
    this.$store.commit('cashback/clearConditonForDataList');
    this.$store.dispatch('cashback/getConsumeReturnCashList');
  },
};
</script>
<style lang='scss'>
.mp-erp-cash-back-list-page-wrap {
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
    // display: flex;
    // align-items: center;
    padding: 20px;
    > div.f {
      > button {
        width: 120px;
        height: 30px;
        padding: 0;
        border-radius: 2px;
        margin-bottom: 10px;
      }
    }
    > div.list {
      display: flex;
      flex-wrap: wrap;
      .mp-common-comps-area-select-wrap {
        margin-top: 10px;
        // .text {
        //   width: 3em;
        // }
      }
      .mp-common-comps-order-channel-selector-wrap, .mp-order-product-select-wrap {
        margin-right: 20px;
        margin-top: 10px;
      }
    }
    > div.s {
      padding-top: 12px;
      padding-right: 20px;
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    margin-top: 10px;
  }
  > footer {
    flex: none;
    background-color: #fff;
    height: 45px;
    // padding-top: 5px;
  }
}
</style>
