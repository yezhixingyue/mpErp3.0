<template>
  <section
   class="mp-fund-bill-page-balance-type-page-comp-wrap mp-fund-bill-page-common-style-wrap">
    <header>
      <order-type-page-comp-header />
    </header>
    <div class="content">
      <OrderTypePageCompTable />
    </div>
    <footer>
      <Count
       :watchPage='condition4OrderType.Page'
       :handlePageChange='handlePageChange'
       :count='orderTypeDataCount'
       >
        <DownLoadExcelComp :getConfigObj="getConfigObj" v-if="localPermission.ExportOrderBillExcel" />
      </Count>
    </footer>
  </section>
</template>

<script>
import Count from '@/components/common/Count.vue';
import { mapState } from 'vuex';
import DownLoadExcelComp from '@/components/common/UploadComp/DownLoadExcelComp.vue';
import CommonClassType from '@/store/CommonClassType';
import OrderTypePageCompHeader from './Header/OrderTypePageCompHeader.vue';
import OrderTypePageCompTable from './Main/OrderTypePageCompTable.vue';

export default {
  components: {
    OrderTypePageCompHeader,
    OrderTypePageCompTable,
    DownLoadExcelComp,
    Count,
  },
  computed: {
    ...mapState('fundBill', ['orderTypeDataCount', 'condition4OrderType']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionCustomerBill?.Obj) {
        return this.Permission.PermissionList.PermissionCustomerBill.Obj;
      }
      return {};
    },
  },
  methods: {
    handlePageChange(page) {
      this.$store.dispatch('fundBill/getCustomerOrderBill', page);
    },
    getConfigObj() {
      return {
        condition: CommonClassType.filter(this.condition4OrderType, true),
        count: this.orderTypeDataCount,
        fileDefaultName: '客户订单流水',
        fileDate: this.condition4OrderType.Date,
        downFunc: data => this.api.getOrderBillExcel(data),
      };
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
  > footer {
    .is-blue {
      margin-left: 30px;
      margin-right: -30px;
    }
  }
}
</style>
