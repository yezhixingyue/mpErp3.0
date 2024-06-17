<template>
  <el-table class="mp-coupon-detail-table-comp-wrap mp-common-table-styles" :max-height="h" :height="h" fit
    :data="couponUseListData" stripe border style="width: 100%">
    <el-table-column min-width="260px" prop="CouponCode" label="券号"></el-table-column>
    <el-table-column min-width="130px" label="状态">
      <template slot-scope="scope">
        <span class="is-font-size-14" :class="{
          'is-pink': scope.row.Status === 0,
          'is-success': scope.row.Status === 1,
          'is-gray': scope.row.Status === 2,
          'is-cancel': scope.row.Status === 255,
        }">{{ scope.row.Status | formatCouponCordStatus }}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="160px" label="生成方式">
      <template slot-scope="scope">
        <span class="is-font-size-14">{{ scope.row.Channel | formatGenerateType }}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="160px" label="内部领取人">
      <template slot-scope="scope">
        <span class="is-font-size-14">{{ scope.row.Record && scope.row.Record.ReceiveUser.StaffName }}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="220px" label="生成时间">
      <template slot-scope="scope">
        <span class="is-gray">{{ scope.row.CreateTime | format2LangTypeDate }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip min-width="220px" label="激活时间">
      <template slot-scope="scope">
        <span class="is-gray">{{ scope.row.ReceiveTime | format2LangTypeDate }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip min-width="220px" label="使用时间">
      <template slot-scope="scope">
        <span class="is-gray">{{ scope.row.UseTime | format2LangTypeDate }}</span>
      </template>
    </el-table-column>

    <el-table-column width="340px" label="操作">
      <ul class="handle-menus" slot-scope="scope">
        <li>
          <span v-if="scope.row.CustomerID" @click="handleLookUpBindUsers(scope.row)" class="is-list-btn">
            <img src="@/assets/images/detail.png" alt />查看绑定用户</span>
          <span v-else class="is-disabled">
            <img src="@/assets/images/detail-gray.png" alt />查看绑定用户</span>
        </li>
        <li>
          <span v-if="scope.row.Status === 2" @click="handleRelatedOrder(scope.row, scope.$index)"
            class="is-list-btn"><img src="@/assets/images/submiticon.png" alt />相关订单
          </span>
          <span v-else class="is-disabled">
            <img src="@/assets/images/submiticon-gray.png" alt />相关订单</span>
        </li>
      </ul>
    </el-table-column>
    <div slot="empty">
      <span v-show="!tableDataLoading">暂无数据</span>
      <!-- <span v-show="tableDataLoading">正在加载数据...</span> -->
    </div>
  </el-table>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';

export default {
  mixins: [tableMixin],
  computed: {
    ...mapState('couponStore', ['couponUseListData', 'tableDataLoading', 'condition2CouponUseList']),
  },
  methods: {
    ...mapActions('couponStore', ['getCouponUseList', 'getCustomerData', 'getOrderDetail']),
    setHeight() {
      const tempHeight = this.getHeight('.mp-coupon-deatail-list-header-comp-wrap', 128);
      this.h = tempHeight;
    },
    handleLookUpBindUsers(rowData) {
      const _id = rowData.CustomerID;
      if (!_id) {
        this.messageBox.failSingleError('出错啦!', '[ 未获取到客户信息 ]', null, null);
        return;
      }
      this.$utils.handleLoadingHOF(
        () => this.getCustomerData(_id),
        () => this.$store.commit('couponStore/setDialogVisible2UsePage', true),
        () => this.$store.commit('couponStore/setDialogVisible2UsePage', false),
      );
    },
    handleRelatedOrder(rowData) {
      const { OrderID } = rowData;
      if (!OrderID) {
        this.messageBox.failSingleError('未找到订单', '优惠券已加入购物车中未下单', null, null);
        return;
      }
      this.$utils.handleLoadingHOF(
        () => this.getOrderDetail(OrderID),
        () => this.$store.commit('couponStore/setDialogVisible2UsePageOrderDetail', true),
        () => this.$store.commit('couponStore/setDialogVisible2UsePageOrderDetail', false),
      );
    },
    getLocalCouponUseData() {
      if (this.couponUseListData.length === 0 || this.couponUseListData[0].CouponID !== this.condition2CouponUseList.ID) this.getCouponUseList();
    },
  },
  mounted() {
    this.getLocalCouponUseData();
  },
  activated() {
    // this.getLocalCouponUseData();
  },
};
</script>

<style lang="scss">
.mp-coupon-detail-table-comp-wrap.mp-common-table-styles {
  >.el-table__body-wrapper {
    >.el-table__body {
      >tbody>tr {
        >td {
          >div.cell {
            padding: 0 3px;

            >.handle-menus {
              display: flex;
              justify-content: space-between;

              &:before,
              &:after {
                content: '';
                display: block;
              }

              >li {
                padding: 0 6px;

                >span {
                  font-size: 12px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  cursor: pointer;

                  >img {
                    height: 15px;
                    margin-right: 5px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
