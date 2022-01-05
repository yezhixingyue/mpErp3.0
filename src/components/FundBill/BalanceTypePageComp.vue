<template>
  <section
   class="mp-fund-bill-page-balance-type-page-comp-wrap mp-fund-bill-page-common-style-wrap">
    <header>
      <balance-type-page-comp-header />
    </header>
    <div class="content">
      <BalanceTypePageCompTable />
    </div>
    <footer>
      <Count
       :watchPage='condition4BalanceType.Page'
       :handlePageChange='handlePageChange'
       :count='balanceTypeDataCount'
       >
        <DownLoadExcelComp :configObj="configObj" v-if="localPermission.ExportBalanceBillExcel" />
      </Count>
    </footer>
  </section>
</template>

<script>
import Count from '@/components/common/Count.vue';
import { mapState } from 'vuex';
import DownLoadExcelComp from '@/components/common/UploadComp/DownLoadExcelComp.vue';
import FundBillClassType from '@/store/fundBill/fundBillClassType';
import BalanceTypePageCompHeader from './Header/BalanceTypePageCompHeader.vue';
import BalanceTypePageCompTable from './Main/BalanceTypePageCompTable.vue';

export default {
  components: {
    BalanceTypePageCompHeader,
    BalanceTypePageCompTable,
    DownLoadExcelComp,
    Count,
  },
  computed: {
    ...mapState('fundBill', ['balanceTypeDataCount', 'condition4BalanceType']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionCustomerBill?.Obj) {
        return this.Permission.PermissionList.PermissionCustomerBill.Obj;
      }
      return {};
    },
    condition() {
      return FundBillClassType.filter(this.condition4BalanceType);
    },
    configObj() {
      return {
        condition: this.condition,
        count: this.balanceTypeDataCount,
        fileDefaultName: '客户余额流水',
        fileDate: this.condition4BalanceType.Date,
        downFunc: data => this.api.getCustomerBillExcel(data),
      };
    },
  },
  methods: {
    handlePageChange(page) {
      this.$store.dispatch('fundBill/getCustomerBill', page);
    },
  },
};
</script>

<style lang='scss'>
.mp-fund-bill-page-common-style-wrap {
  width: 100%;
  > header {
    padding:10px 20px 5px;
    > ul {
      > li {
        display: flex;
        align-items: flex-end;
        flex-wrap: wrap;
        > div, > section, > ul {
          margin-bottom: 22px;
          margin-top: 0 !important;
        }
        > .user-selector {
          display: flex;
        }
        &:last-of-type {
          justify-content: space-between;
          > div, > section {
            height: 32px;
            box-sizing: border-box;
          }
          > .search-section {
            margin-right: 3vw;
          }
        }
        .mp-line-date-selector-wrap-is-full {
          > span:last-of-type{
            height: 30px;
            .manual-select-date-box {
              height: 30px;
              line-height: 28px;
            }
          }
          .mp-radio-group-full-box.el-radio-group {
            height: 30px;
            .el-radio-button {
              width: 70px;
              .el-radio-button__inner {
                line-height: 14px;
              }
            }
          }
        }
      }
    }
  }
  > .content {
    background-color: rgb(245, 245, 245);
    padding-top: 10px;
  }
  .mp-line-date-selector-wrap {
    min-width: 720px;
  }
}
</style>
