<template>
  <el-table
    class="mp-erp-invoice-makeup-list-page-main-table-comp-wrap"
    :max-height="h"
    :height="h"
    fit
    :data="localDataList"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column width="80px" prop="InvoiceID" show-overflow-tooltip label="申请单号"></el-table-column>
    <el-table-column width="90px" prop="CustomerNo" show-overflow-tooltip label="客户编号"></el-table-column>
    <el-table-column width="120px" prop="CustomerName" show-overflow-tooltip label="客户"></el-table-column>
    <el-table-column width="120px" prop="_TitleName" show-overflow-tooltip label="抬头名称"></el-table-column>
    <el-table-column width="150px" prop="CreditCode" show-overflow-tooltip label="统一社会信用代码"></el-table-column>
    <el-table-column width="125px" prop="RegisteredAddress" show-overflow-tooltip label="注册地址"></el-table-column>
    <el-table-column width="120px" prop="RegisteredTelephone" show-overflow-tooltip label="注册电话"></el-table-column>
    <el-table-column width="100px" prop="OpeningBank" show-overflow-tooltip label="开户银行"></el-table-column>
    <el-table-column width="150px" prop="BankAccount" show-overflow-tooltip label="银行账号"></el-table-column>
    <el-table-column width="85px" prop="ReceiverName" show-overflow-tooltip label="收票人"></el-table-column>
    <el-table-column width="135px" prop="_ReceiverAddress" show-overflow-tooltip label="收票人地址"></el-table-column>
    <el-table-column width="110px" prop="ReceiverContactWay" show-overflow-tooltip label="收票人电话"></el-table-column>
    <el-table-column width="75px"  label="开票信息">
      <span slot-scope="scope" class="blue-span" @click="onInvoiceDetailClick(scope.row)">查看</span>
    </el-table-column>
    <el-table-column width="85px"  label="开票总金额">
      <span slot-scope="scope"> {{ scope.row.InvoiceAmount }} </span>
    </el-table-column>
    <el-table-column width="130px" prop="_InvoiceTypeText" show-overflow-tooltip label="发票类型"></el-table-column>
    <el-table-column width="75px"  label="是否过公户">
      <span slot-scope="scope">{{scope.row.IsPassBusinessAccount === true ? '过公户' : (scope.row.IsPassBusinessAccount === false ? '不过公户' : '')}}</span>
    </el-table-column>
    <el-table-column width="120px" show-overflow-tooltip label="申请开票时间">
      <template slot-scope="scope" >{{scope.row.CreateTime | format2MiddleLangTypeDate}}</template>
    </el-table-column>
    <el-table-column width="120px" show-overflow-tooltip label="处理时间">
      <span slot-scope="scope" class="is-gray">{{scope.row.OperateTime | format2MiddleLangTypeDate}}</span>
    </el-table-column>
    <el-table-column width="85px" prop="OperaterUserName" show-overflow-tooltip label="处理人"></el-table-column>
    <el-table-column width="85px" prop="_InvoiceStatusText" show-overflow-tooltip fixed="right" label="发票状态">
      <span slot-scope="scope" :class="{
        'is-gray': scope.row.InvoiceStatus === InvoiceStatusEnums.haveToMail.ID,
        'is-pink': scope.row.InvoiceStatus === InvoiceStatusEnums.rejected.ID,
        'is-success': scope.row.InvoiceStatus === InvoiceStatusEnums.haveMaked.ID,
        'is-origin': scope.row.InvoiceStatus === InvoiceStatusEnums.pendingCheck.ID,
        'is-cyan': scope.row.InvoiceStatus === InvoiceStatusEnums.makingUp.ID,
      }" >{{scope.row._InvoiceStatusText}}</span>
    </el-table-column>

    <el-table-column width="130px" label="操作" fixed="right" v-if="localPermission.Operate">
      <template slot-scope="scope">
        <CtrlMenus
          :showList="['detail']"
          :detailText="scope.row._DetailText"
          @detail="onCrtlClick(scope.row)"
        />
      </template>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import { InvoiceStatusEnumList, InvoiceTypeEnumList, InvoiceStatusEnums, InvoiceTypeEnums, InvoiceTitleEnums } from '../../../packages/InvoiceComps/enums';
import CtrlMenus from '../../common/NewComps/CtrlMenus/index.vue';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [tableMixin],
  components: {
    CtrlMenus,
  },
  computed: {
    ...mapState('common', ['Permission']),
    localPermission() { // 后面需要更改为发票的权限
      if (this.Permission?.PermissionList?.PermissionInvoicing?.Obj) {
        return this.Permission.PermissionList.PermissionInvoicing.Obj;
      }
      return {};
    },
    localDataList() {
      if (!Array.isArray(this.list)) return [];
      return this.list.map(it => ({
        ...it,
        _ReceiverAddress: this.getReceiverAddress(it),
        _InvoiceTypeText: this.getInvoiceTypeText(it),
        _InvoiceStatusText: this.getInvoiceStatusText(it),
        _DetailText: this.getDetailText(it),
        _TitleName: this.getTitleName(it),
      }));
    },
  },
  data() {
    return {
      InvoiceStatusEnums,
    };
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-invoice-makeup-list-page-wrap > header', 55);
      this.h = tempHeight;
    },
    getReceiverAddress({ ReceiverProvinceName, ReceiverCityName, ReceiverCountyName, ReceiverAddress }) {
      return `${ReceiverProvinceName || ''}${ReceiverCityName || ''}${ReceiverCountyName || ''}${ReceiverAddress || ''}`;
    },
    getInvoiceTypeText({ InvoiceType }) {
      const t = InvoiceTypeEnumList.find(it => it.ID === InvoiceType);
      return t ? t.Name : '';
    },
    getInvoiceStatusText({ InvoiceStatus }) {
      const t = InvoiceStatusEnumList.find(it => it.ID === InvoiceStatus);
      return t ? t.Name : '';
    },
    getTitleName({ InvoiceType, EnterpriseName, PersonalName, InvoiceMainBody }) {
      if (InvoiceType === InvoiceTypeEnums.normal.ID && InvoiceMainBody === InvoiceTitleEnums.personal.ID) {
        return PersonalName;
      }
      return EnterpriseName;
    },
    getDetailText({ InvoiceStatus, InvoiceType }) {
      let label = '详情';
      switch (InvoiceStatus) {
        case InvoiceStatusEnums.pendingCheck.ID:
          label = '详情/审核';
          break;
        case InvoiceStatusEnums.makingUp.ID:
          label = '详情/处理';
          break;
        case InvoiceStatusEnums.haveMaked.ID:
          if (InvoiceType === InvoiceTypeEnums.special.ID) {
            label = '详情';
          }
          break;
        default:
          break;
      }
      return label;
    },
    onInvoiceDetailClick(item) {
      this.$emit('view', item);
    },
    onCrtlClick(item) {
      this.$emit('detail', item);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/var.scss";
.mp-erp-invoice-makeup-list-page-main-table-comp-wrap {
  margin-right: 2px;
  border: 1px solid $--border-color-base;
  &.el-table::before {
    display: none;
  }
  .el-table__header-wrapper .el-table__header thead {
    tr {
      th {
        font-size: 14px;
        .cell {
          height: 34px;
          line-height: 34px;
          color: $--color-text-primary;
        }
      }
    }
  }
  .el-table__body-wrapper .el-table__body tbody tr td {
    color: $--color-text-primary;
    &.is-gray > .cell {
      font-size: 12px;
    }
    > .cell {
      color: #585858;
      height: 24px;
      line-height: 24px;
      padding: 0 8px;
    }
  }
  .el-table__fixed-header-wrapper thead tr th .cell {
    line-height: 34px;
    font-size: 14px;
  }
  .el-table__fixed-right .el-table__body tbody tr td > .cell {
    line-height: 24px;
    height: 24px;
    padding-left: 15px;
    .ctrl-menus-container {
      margin-left: -10px;
      > span > i {
        display: inline-block;
        min-width: 54px;
        text-align: left;
        margin-left: 2px;
      }
    }
  }
}

  .el-tooltip__popper {
    max-width: 400px;
    line-height: 180%;
    // white-space: pre;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 16px;
  }
</style>
