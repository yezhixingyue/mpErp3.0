<template>
  <div class="order-list-dialog-packagelist-wrap">
    <div class="package-list-content">
      <el-table
        :data="dialogPackageData"
        stripe
        border
        style="width: 100%"
        :cell-class-name="initStyle"
        max-height="620px"
      >
        <el-table-column width="112px" prop="ID" label="包裹号"></el-table-column>
        <el-table-column width="155px" prop="Logistics.BillNo" label="运单号"></el-table-column>
        <el-table-column width="102px" label="产品" show-overflow-tooltip>
          <!-- {{curOrderProductName}} -->
          <template  slot-scope="scope">
            {{scope.row.Order.ProductName || curOrderProductName}}
          </template>
        </el-table-column>
        <el-table-column width="67" label="产品数量" show-overflow-tooltip>
          <template  slot-scope="scope">
            {{scope.row.ProductAmount}}{{scope.row.Order.Unit}}
          </template>
        </el-table-column>
        <el-table-column width="67" label="商品价值">
          <template  slot-scope="scope">
            {{scope.row.TotalAmount}}元
          </template>
        </el-table-column>
        <el-table-column width="67" label="代收款">
          <template  slot-scope="scope">
            {{scope.row.UnPaidAmount}}元
          </template>
        </el-table-column>
        <el-table-column width="74" label="状态">
          <template slot-scope="scope">
            {{scope.row.Status === 0
             ? '' : scope.row.Status | formatTransportStatus}}
          </template>
        </el-table-column>
        <el-table-column prop="handle" label="操作">
          <div class="handle-menus">
          <template v-if="Permission.PermissionList.PermissionManageOrder.Obj.ApplyAfterSales">
            <ImgBtn :url='img2' />
          </template>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <footer>
      <ul>
        <li>
          <span>合计：</span>
          <span>包裹数：</span>
          <span>{{dialogPackageData.length}}包</span>
        </li>
        <li>
          <span>商品价值：</span>
          <span>{{getWorth(dialogPackageData, 'TotalAmount')}}</span>
        </li>
        <li>
          <span>代收款：</span>
          <span class="is-origin is-bold">{{getWorth(dialogPackageData, 'UnPaidAmount')}}</span>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import ImgBtn from '@/components/common/ImgBtn.vue';

const img1 = require('@/assets/images/service.png');
const img2 = require('@/assets/images/servicestop.png');

export default {
  props: {
    dialogPackageData: {
      type: Array,
    },
  },
  components: {
    ImgBtn,
  },
  data() {
    return {
      img1,
      img2,
    };
  },
  computed: {
    ...mapState('orderModule', ['curOrderProductName']),
    ...mapState('common', ['Permission']),
    showCrtl() {
      return this.$route.name !== 'feedback';
    },
  },
  methods: {
    ...mapMutations('orderModule', ['setCurOrderID', 'setIsShowServiceDiaTrue', 'setIsShowServiceDiaFail']),
    ...mapMutations('common', ['setIsLoading']),
    ...mapMutations('service', ['clearServiceFormInfo']),
    ...mapActions('orderModule', ['getOrderDetail', 'getServiceOrderHistory']),
    ...mapActions('service', ['getQuestionTypeList', 'getPackageListByOrderID', 'getPayPackageByOrder']),
    initStyle({ columnIndex, row }) {
      const isBigFont = columnIndex === 4 || columnIndex === 5;
      const isOrigin = columnIndex === 5;
      if (isOrigin) return 'is-lg-font is-font-origin';
      if (isBigFont) return 'is-lg-font';
      if (columnIndex === 6 && row.status === '已取消') return 'is-cancel';
      if (columnIndex === 6 && row.status === '待付款') return 'is-pending';
      if (columnIndex === 6 && row.status === '已签收') return 'is-completed';
      return '';
    },
    getWorth(list, item) {
      let worth = 0;
      list.forEach((it) => {
        worth += it[item];
      });
      return `${worth.toFixed(1)}元`;
    },
    // async jump2Service(data) {
    //   let key = true;
    //   this.setIsLoading(true);
    //   this.clearServiceFormInfo();
    //   this.setCurOrderID(data.OrderID);
    //   this.setIsShowServiceDiaTrue();
    //   await Promise.all(
    //     [
    //       this.getQuestionTypeList(),
    //       this.getOrderDetail(),
    //       this.getPackageListByOrderID(data.OrderID),
    //       this.getServiceOrderHistory(),
    //       this.getPayPackageByOrder(data.OrderID),
    //       // this.$store.dispatch('service/getPayPackageByOrder', data.OrderID),
    //     ],
    //   ).catch((error) => {
    //     key = false;
    //     this.messageBox.handleLoadingError(
    //       error,
    //       () => { this.setIsShowServiceDiaFail(); this.setIsLoading(false); },
    //       () => { this.setIsShowServiceDiaFail(); this.setIsLoading(false); },
    //     );
    //   });
    //   if (key) this.setIsLoading(false);
    // },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.order-list-dialog-packagelist-wrap {
  width: 810px;
  margin: 0 auto;
  margin-top: 25px;
  height: 660px;

  .package-list-content {
    .el-table {
      .el-table__header-wrapper {
        thead {
          > tr {
            // border-right: 1px solid #EBEEF5;
            > th {
              text-align: center;
              color: $--color-text-regular;
              font-weight: 600;
              font-size: 12px;
              line-height: 35px;
              padding: 0;
              background-color: $--bg-color-base;
              &:not(:last-of-type) {
                border-right: none;
              }
            }
          }
        }
      }
      .el-table__body-wrapper {
        > table > tbody {
          > tr {
            > td {
              line-height: 40px;
              padding: 0;
              height: 40px;
              font-size: 12px;
              text-align: center;
              border-bottom: none;
              &:not(:last-of-type) {
                border-right: none;
              }
              &.is-lg-font {
                font-size: 14px;
              }
              &.is-cancel {
                color: $--color-text-table-cancel;
              }
              &.is-pending {
                color: $--color-text-table-pending;
              }
              &.is-completed {
                color: $--color-text-table-completed;
              }
              &.is-font-origin{
                color: $--color-text-orgin;
              }
              // &:hover {
              //   color: $--color-text-table-hover;
              // }
            }
          }
        }
      }
      .cell {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: keep-all !important;
        padding: 0 5px;
      }
    }
  }

  > footer {
    padding-top: 20px;
    color: $--color-text-table;
    > ul {
      display: flex;
      li {
        margin-right: 25px;

        span.is-origin {
          color: $--color-text-orgin;
          &.is-bold{
            font-weight: 600;
          }
        }
      }
    }
  }
}
.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: $--bg-color-base;
}
</style>
