<template>
  <div class="order-list-dialog-packagelist-wrap">
    <template v-if="dialogPackageData.BackPackageInfos">
      <template v-if="dialogPackageData.ExpressBillType === 0"> <!-- 普通面单 -->
        <div class="package-list-content">
          <p style="font-size: 16px;font-weight: 700;margin-bottom: 6px;">
            包裹信息：<span v-if="dialogPackageData.Order" class="is-origin" style="font-size: 12px;font-weight: 300;">
              注：当前订单为普通电子面单发货</span>
          </p>
          <el-table
            :data="dialogPackageData.BackPackageInfos"
            stripe
            border
            style="width: 100%"
            :cell-class-name="initStyle"
            max-height="620px"
          >
            <el-table-column width="102px" prop="ID" label="包裹号"></el-table-column>
            <el-table-column width="125px" prop="Logistics.BillNo" label="运单号" show-overflow-tooltip>
              <template  slot-scope="scope">
                {{scope.row.Logistics.BillNo}}
                <template v-if="scope.row.Logistics?.BillNo &&
                 dialogPackageData.PackageBills.filter(it => it.ExpressBillType === 1).map(it => it.BillNo).length">
                  、
                </template>
                <template v-if="dialogPackageData.PackageBills.filter(it => it.ExpressBillType === 1).map(it => it.BillNo).length">
                  {{dialogPackageData.PackageBills.filter(it => it.ExpressBillType === 1).map(it => it.BillNo).join('、')}}
                </template>
              </template>
            </el-table-column>
            <el-table-column width="92px" prop="Logistics.BillNo" label="运单包裹数量" v-if="!dialogPackageData.Order">
              <template  slot-scope="scope">
                <el-popover
                  placement="top"
                  trigger="hover"
                  :content="scope.row.Logistics?.ChildBillNos?.length?scope.row.Logistics?.ChildBillNos.join('、'):scope.row.Logistics?.BillNo">
                  <span slot="reference">{{scope.row.Logistics?.ChildBillNos?.length || 1}}个</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column width="90px" label="产品" show-overflow-tooltip>
              <template  slot-scope="scope">
                {{scope.row.Order.ProductName || dialogPackageData.Order.ProductName|| curOrderProductName}}
              </template>
            </el-table-column>
            <el-table-column width="67" label="产品数量" show-overflow-tooltip>
              <template  slot-scope="scope">
                {{scope.row.ProductAmount}}{{scope.row.Order.Unit || dialogPackageData.Order.Unit}}
              </template>
            </el-table-column>
            <el-table-column width="67" label="商品价值">
              <template  slot-scope="scope">
                {{scope.row.TotalAmount}}元
              </template>
            </el-table-column>
            <el-table-column width="57" label="代收款">
              <template  slot-scope="scope">
                {{scope.row.UnPaidAmount}}元
              </template>
            </el-table-column>
            <el-table-column min-width="77" label="实际运输单位" show-overflow-tooltip>
              <template  slot-scope="scope">
                {{scope.row.Logistics?.ExpressName}}
              </template>
            </el-table-column>
            <el-table-column width="64" label="状态">
              <template slot-scope="scope">
                {{scope.row.Status === 0
                 ? '' : scope.row.Status | formatTransportStatus}}
              </template>
            </el-table-column>
            <el-table-column width="66" prop="handle" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="onExpressClick(scope.row)">配送进度</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <footer>
          <ul>
            <li>
              <span>合计：</span>
              <span>包裹数：</span>
              <span>{{dialogPackageData.BackPackageInfos.length}}包</span>
            </li>
            <li>
              <span>商品价值：</span>
              <span>{{getWorth(dialogPackageData.BackPackageInfos, 'TotalAmount')}}</span>
            </li>
            <li>
              <span>代收款：</span>
              <span class="is-origin is-bold">{{getWorth(dialogPackageData.BackPackageInfos, 'UnPaidAmount')}}</span>
            </li>
          </ul>
        </footer>
      </template>
      <template v-else> <!-- 子母单面单 -->
        <div class="package-list-content">
          <p style="font-size: 16px;font-weight: 700;margin-bottom: 6px;">
            包裹信息：<span class="is-origin" style="font-size: 12px;font-weight: 300;">
              注：当前订单包含子母单发货
            </span>
          </p>
          <el-table
            :data="dialogPackageData.BackPackageInfos"
            stripe
            border
            style="width: 100%"
            max-height="620px"
          >
            <el-table-column width="112px" prop="ID" label="包裹号"></el-table-column>
            <el-table-column width="102px" label="产品" show-overflow-tooltip>
              <template  slot-scope>
                {{dialogPackageData.Order.ProductName || curOrderProductName}}
              </template>
            </el-table-column>
            <el-table-column width="67" label="产品数量" show-overflow-tooltip>
              <template  slot-scope="scope">
                {{scope.row.ProductAmount}}{{dialogPackageData.Order.Unit}}
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
            <el-table-column min-width="67" label="实际运输单位">
              <template  slot-scope="scope">
                {{scope.row.Logistics?.ExpressName}}
              </template>
            </el-table-column>
            <el-table-column width="74" label="状态">
              <template slot-scope="scope">
                {{scope.row.Status === 0
                 ? '' : scope.row.Status | formatTransportStatus}}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <footer>
          <ul>
            <li>
              <span>合计：</span>
              <span>包裹数：</span>
              <span>{{dialogPackageData.BackPackageInfos.length}}包</span>
            </li>
            <li>
              <span>商品价值：</span>
              <span>{{getWorth(dialogPackageData.BackPackageInfos, 'TotalAmount')}}</span>
            </li>
            <li>
              <span>代收款：</span>
              <span class="is-origin is-bold">{{getWorth(dialogPackageData.BackPackageInfos, 'UnPaidAmount')}}</span>
            </li>
          </ul>
        </footer>
        <div class="package-list-content">
          <p style="font-size: 16px;font-weight: 700;margin-bottom: 6px;">运单信息：</p>
          <el-table
            :data="dialogPackageData.PackageBills"
            stripe
            border
            style="width: 100%"
            max-height="620px"
          >
            <el-table-column width="155px" prop="BillNo" label="运单号">
              <template slot-scope="scope">
                {{ scope.row.BillNo }}
              </template>
            </el-table-column>
            <el-table-column width="102px" label="运单包裹数量">
              <template  slot-scope="scope">
                <el-popover
                  placement="top"
                  trigger="hover"
                  :content="scope.row.ChildBillNo.length?scope.row.ChildBillNo.join('、'):scope.row.BillNo">
                  <span slot="reference">{{scope.row.PackageCount}}个</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column width="102px" label="产品" show-overflow-tooltip>
              <template slot-scope>
                {{dialogPackageData.Order.ProductName || curOrderProductName}}
              </template>
            </el-table-column>
            <el-table-column min-width="67" label="实际运输单位">
              <template  slot-scope="scope">
                {{scope.row.ExpressName}}
              </template>
            </el-table-column>
            <el-table-column width="74" label="状态">
              <template slot-scope="scope">
                {{scope.row.Status === 0
                 ? '' : scope.row.Status | formatTransportStatus}}
              </template>
            </el-table-column>
            <el-table-column width="66" prop="handle" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="onExpressClick(
                  {ID:dialogPackageData.BackPackageInfos[0].ID,
                    Logistics:{ID:scope.row.ID}}
                  )">配送进度</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <footer>
          <ul>
            <li>
              <span>合计：</span>
              <span>快件数：</span>
              <span>{{dialogPackageData.PackageBills.length}}个</span>
            </li>
            <!-- <li>
              <span>商品价值：</span>
              <span>{{getWorth(dialogPackageData.PackageBills, 'TotalAmount')}}</span>
            </li>
            <li>
              <span>代收款：</span>
              <span class="is-origin is-bold">{{getWorth(dialogPackageData.PackageBills, 'UnPaidAmount')}}</span>
            </li> -->
          </ul>
        </footer>
      </template>
    </template>
    <CommonDialogComp
      :visible="visible"
      v-if="visible"
      top='18vh'
      title="配送进度"
      width="760px"
      @cancle="handleBeforeDiaClose"
      @closed='handleBeforeDiaClose'
      append-to-body
      :showSubmit="false"
      cancelText="关闭"
    >
      <ul class="order-list-express-progress-dialog-wrap" v-loading='loading' element-loading-text="正在加载中...">
        <template v-if="list.length > 0">
          <template v-if="list.length > 0">
            <li class="express-num" v-if="BillNo">
              运单号：{{BillNo}}
            </li>
          </template>
          <MiniProgressItem v-for="(item,i) in list" :key='item.Status + "-" + i' :data='item' />
        </template>
        <li v-else-if='!loading' class="no-info-box">
          暂无信息
        </li>
      </ul>
    </CommonDialogComp>
  </div>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import { mapState, mapMutations, mapActions } from 'vuex';
// import ImgBtn from '@/components/common/ImgBtn.vue';
import MiniProgressItem from '@/components/common/MiniProgressItem.vue';
import { format2LangTypeDateFunc } from '@/assets/js/filters/filters.js';

const img1 = require('@/assets/images/service.png');
const img2 = require('@/assets/images/servicestop.png');

export default {
  components: {
    MiniProgressItem,
    CommonDialogComp,
  },
  data() {
    return {
      img1,
      img2,
      visible: false,
      BillNo: '',
      dataList: [],
      curPackageID: '',
      loading: false,
    };
  },
  computed: {
    ...mapState('orderModule', ['dialogPackageData', 'OrderStatusList', 'curOrderProductName']),
    ...mapState('common', ['Permission']),
    showCrtl() {
      return this.$route.name !== 'feedback';
    },
    listData() {
      const returnlist = [];
      this.dialogPackageData.forEach(item => {
        item.Bills.forEach(it => {
          returnlist.push({ ...item, BillsNo: it.Name });
        });
      });
      return returnlist;
    },
    list() {
      if (!this.dataList) return [];
      const arr = [];
      this.dataList.forEach((it, i) => {
        const obj = {};
        if (it.Operator) obj.operator = it.Operator;
        obj.showLine = true;
        if (i === 0) obj.showLine = false;
        if (i === this.dataList.length - 1) obj.isNewest = true;
        if (it.Description) obj.expressDetail = it.Description;
        if (it.OperateTime) {
          const [year, afterTime] = format2LangTypeDateFunc(it.OperateTime).split(' ');
          obj.afterTime = afterTime;
          obj.year = year;
        }
        arr.push(obj);
      });
      const newArr = arr.map((item, index) => {
        const temp = item;
        if (index < arr.length - 1 && temp.year === arr[index + 1].year) temp.year = '';
        return temp;
      }).reverse();
      return newArr;
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
    async getExpressDetail(id, ExressID) {
      if (!id || id === this.curPackageID) return;
      this.dataList = [];
      let key = true;
      this.loading = true;
      const res = await this.api.getPackageProgress(id, ExressID).catch(() => { key = false; });
      this.loading = false;
      if (key && res && res.data.Status === 1000) {
        this.dataList = res.data.Data;
        this.curPackageID = id;
      }
    },
    onExpressClick({ ID, Logistics, BillNo: haveSunBillNo }) {
      this.BillNo = Logistics?.BillNo || haveSunBillNo;
      // if (!Logistics?.BillNo) {
      //   this.BillNo = haveSunBillNo;
      // }
      this.visible = true;
      this.getExpressDetail(ID, Logistics?.ID);
    },
    handleBeforeDiaClose() {
      this.visible = false;
      this.BillNo = '';
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
  overflow-y: auto;
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
      .el-button{
        font-size: 12px;
      }
    }
  }

  > footer {
    padding-top: 20px;
    padding-bottom: 20px;
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
  .order-list-express-progress-dialog-wrap {
    min-height: 260px;
    max-height: 420px;
    overflow: auto;
    .el-loading-spinner {
      top: 30%;
    }
    .no-info-box {
      text-align: center;
      padding-top: 75px;
      color: #888;
      font-size: 13px;
    }
    >.express-num{
      font-size: 16px;
      font-weight: 700;
      padding-left: 124px;
      line-height: 1em;
      margin-bottom: 20px;
    }
    .left-title-wrap {
      width: 200px;
    }
  }
}
.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: $--bg-color-base;
}
</style>
