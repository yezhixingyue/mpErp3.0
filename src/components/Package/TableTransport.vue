<template>
  <el-table
    class="mp-table-trans-wrap"
    :max-height="h"  :height="h"
    fit
    :data="packageDataList"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column prop="ExpressNo" sortable minWidth="150" label="运单号"></el-table-column>
    <el-table-column prop="ExpressText" minWidth="85" label="配送方式"></el-table-column>
    <el-table-column prop="CustomerSN" sortable minWidth="100" label="客户编号"></el-table-column>
    <el-table-column prop="CustomerName" minWidth="125" label="客户名称"></el-table-column>
    <el-table-column prop="Receiver.LinkMan" sortable minWidth="85" label="收货人"></el-table-column>
    <el-table-column show-overflow-tooltip minWidth="240" label="收货地址">
      <template slot-scope="scope">
        {{getAdd(scope.row.Receiver)}}
      </template>
    </el-table-column>
    <el-table-column prop="Receiver.Mobile" minWidth="105" label="联系方式"></el-table-column>
    <el-table-column sortable minWidth="78" label="包裹数">
      <template slot-scope="scope">
        {{scope.row.PackageCount}}
      </template>
    </el-table-column>
    <el-table-column prop="worth" minWidth="100" label="商品价值">
      <template slot-scope="scope">
        {{scope.row.TotalAmount}}元
      </template>
    </el-table-column>
    <el-table-column prop="cost" minWidth="100" label="代收款">
      <template slot-scope="scope">
        {{scope.row.UnPaidAmount}}元
      </template>
    </el-table-column>
    <el-table-column sortable minWidth="90" label="状态">
      <template slot-scope="scope">
        {{scope.row.Status | formatTransportStatus}}
      </template>
    </el-table-column>
    <el-table-column minWidth="165" label="发货时间">
      <template slot-scope="scope">
        <!-- {{$utils.getDateFormat(scope.row.CreateTime)}} -->
        {{ scope.row.CreateTime | formatDate }}
      </template>
    </el-table-column>
    <el-table-column prop="handle" width="280" label="操作">
      <ul class="handle-menus" slot-scope="scope">
        <li>
          <span @click="onMenuClick(scope.row, 1)">
            <img src="@/assets/images/list-true.png" alt />包裹列表
          </span>
        </li>
        <li>
          <span @click="onMenuClick(scope.row, 0)">
            <img src="@/assets/images/progress.png" alt />配送进度</span>
        </li>
      </ul>
    </el-table-column>
    <div slot="empty">
      <span v-show="!isTableDataLoading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';

export default {
  mixins: [tableMixin],
  computed: {
    ...mapState('packageModule', ['packageDataList', 'isTableDataLoading']),
  },
  methods: {
    ...mapMutations('orderModule', ['setOrderListDialogShow', 'setOrderListDialogHide', 'setCurExpressID', 'setCurExpressNumber']),
    ...mapMutations('common', ['setIsLoading']),
    ...mapActions('orderModule', ['getPackageListByExressID', 'getExpressProgress']),
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-package-page-header-comp-wrap', 60);
      this.h = tempHeight;
    },
    handleCatchError(error) { // 处理tab弹窗点击与切换catch错误信息
      this.messageBox.handleLoadingError(
        error,
        () => { this.setOrderListDialogHide(); this.setIsLoading(false); },
        () => { this.setOrderListDialogHide(); this.setIsLoading(false); },
      );
    },
    async onMenuClick(data, id) {
      let str = '';
      let key = true;
      this.setCurExpressID(data.ID);
      this.setIsLoading(true);
      switch (id) {
        case 0:
          str = 'express';
          this.setCurExpressNumber(data.ExpressNo);
          this.setOrderListDialogShow(str);
          await this.getExpressProgress().catch((error) => {
            key = false;
            this.handleCatchError(error);
          });
          break;
        case 1:
          str = 'second';
          this.setOrderListDialogShow(str);
          await this.getPackageListByExressID().catch((error) => {
            key = false;
            this.handleCatchError(error);
          });
          break;
        default:
          break;
      }
      if (key) this.setIsLoading(false);
    },
    getAdd(data) {
      return data.Province.Name + data.City.Name + data.County.Name + data.AddressDetail;
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/var.scss";
.mp-table-trans-wrap {
  // overflow-y: auto;
  max-width: 2500px;
  height: 100%;
  font-size: 12px;
  .handle-menus {
    display: flex;
    list-style: none;
    justify-content: space-between;
    // padding-right: 20px;
    padding: 0 10px;
    &:before,
      &:after {
          content: '';
          display: block;
    }
    > li {
      padding: 0 6px;
      flex: none;
      &:hover {
        color: $--color-text-table;
      }
      cursor: pointer;
      img {
        margin-right: 6px;
        width: 15px;
        vertical-align: -14%;
      }
      &:nth-of-type(1) {
        // margin-right: 30px;
        img {
          width: 16px;
          vertical-align: -4%;
        }
        // margin-left: 40px;
      }
    }
  }
  &.el-table {
    border: none;
    thead tr {
      background-color: rgb(245, 245, 245);
      th {
        padding: 1px 0;
        // padding-top: 1px;
        .cell {
          text-align: center;
          font-size: 14px;
          line-height: 34px;
          > span{
            width: 8px;
            margin-left: -5px;
            margin-right: 5px;
          }
        }
        border-right: none;
        border-top: none;
        background-color: $--bg-color-base;
        font-weight: 600;
      }
    }
    .el-table__body > tbody {
      > tr {
          td {
            // &:nth-of-type(7),
            // &:nth-of-type(8),
            // &:nth-of-type(9),
            // &:nth-of-type(10),
            // &:nth-of-type(11) {
            //   .cell{
            //     font-size: 14px;
            //   }
            // }
            &:nth-of-type(12) {
              .cell{
                margin-right: -10px;
                color:$--color-text-light;
              }
            }
            &:nth-of-type(13) {
              .cell{
                // margin-right: -20px;
                color:$--color-text-light;
                user-select: none;
              }
            }
            &:nth-of-type(6){
              padding: 0 10px;
            }
            border: none;
          }
          &:hover {
            td {
              background-color: $--color-text-table-hover
            }
          }
          line-height: 27px;
      }
    }
    td,th {
      padding: 6px 0;
      .cell {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: keep-all !important;
        line-height: 28px;
        padding:0 5px;
        // text-align: left;
        text-align: center;
        color: $--color-text-regular;
        font-size: 12px;
        &.red {
          color: red;
        }
        &.green {
          color: rgb(125, 186, 90);
        }
      }
    }
    &::before{
      display: none;
    }
  }
}
</style>
