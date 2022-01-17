<template>
  <el-table
    class="mp-erp-customer-manage-list-page-main-table-comp-wrap"
    :max-height="h"
    :height="h"
    stripe
    border
    :data="localDataList"
    fit
    style="width: 100%"
   >
    <el-table-column label="编号" prop="CustomerSN" width="86"></el-table-column>
    <el-table-column label="名称" prop="CustomerName" min-width="100" show-overflow-tooltip></el-table-column>
    <el-table-column label="手机号" prop="Mobile" width="96"></el-table-column>
    <el-table-column label="QQ号" prop="QQ" width="90"></el-table-column>
    <el-table-column label="分类等级" prop="TypeGradeContent" width="116" show-overflow-tooltip></el-table-column>
    <el-table-column label="可用余额" width="80" show-overflow-tooltip>
      <template slot-scope="scope" >{{scope.row.FundInfo.Amount | formatNumber}}</template>
    </el-table-column>
    <el-table-column label="信用额度" width="75" show-overflow-tooltip>
      <template slot-scope="scope" >{{scope.row.FundInfo.TotalCredit | formatNumber}}</template>
    </el-table-column>
    <el-table-column label="可用额度" width="75" show-overflow-tooltip>
      <template slot-scope="scope" >{{scope.row.canUseCredit | formatNumber}}</template>
    </el-table-column>
    <el-table-column label="所属销售区域" prop="locationContent" width="144" show-overflow-tooltip></el-table-column>
    <el-table-column label="经营地址" prop="SellAddressContent" width="100" show-overflow-tooltip></el-table-column>
    <el-table-column label="三方店铺" width="90" prop="ShopName" class-name='is-success' show-overflow-tooltip></el-table-column>
    <el-table-column label="认证状态" width="72" show-overflow-tooltip>
      <template slot-scope="scope" >{{scope.row.AuthStatus | formatAuthStatus}}</template>
    </el-table-column>
    <el-table-column label="状态" width="60" show-overflow-tooltip>
      <span :class="scope.row._ClassName" slot-scope="scope" >{{scope.row.Status | formatStatus}}</span>
    </el-table-column>
    <el-table-column label="注册/添加时间" prop="RegTimeContent" width="100" show-overflow-tooltip></el-table-column>
    <el-table-column label="注册方式" width="72" show-overflow-tooltip>
      <template slot-scope="scope" >{{scope.row.RegType | formatRegType}}</template>
    </el-table-column>
    <el-table-column label="审核人" prop="AuthenInfo.CheckUser.StaffName" width="70" show-overflow-tooltip></el-table-column>
    <el-table-column label="操作" min-width="350">
      <template slot-scope="scope">
        <CtrlMenus
         @detail='onDetailClick(scope.row)'
         @setup='onSetupPriceClick(scope.row)'
         @setup2='onSetupShopClick(scope.row)'
         @edit='onSetupClick(scope.row)'
         @remove='onRemoveClick(scope.row)'
         :showList="['detail','setup', 'setup2', 'edit', 'del']"
         :canSetupCost='scope.row._isSinglePriceType'
         setupCostText='设置价格'
         setupText2='关联店铺' />
      </template>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import { mapState } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import { AuthStatusEnumList, CustomerStatusEnumList, CustomerStatusEnum, RegTypeEnumList, CustomerPriceTypeEnum } from '../../../store/customerManage/Enums';

export default {
  mixins: [tableMixin, recordScrollPositionMixin('.mp-erp-customer-manage-list-page-main-table-comp-wrap .el-table__body-wrapper')],
  props: {
    dataList: {
      default: () => [],
      type: Array,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CtrlMenus,
  },
  filters: {
    formatAuthStatus(ID) {
      if (ID || ID === 0) {
        const t = AuthStatusEnumList.find(it => it.ID === ID);
        return t ? t.Name : '';
      }
      return '';
    },
    formatStatus(ID) {
      if (ID || ID === 0) {
        const t = CustomerStatusEnumList.find(it => it.ID === ID);
        return t ? t.Name : '';
      }
      return '';
    },
    formatRegType(ID) {
      if (ID || ID === 0) {
        const t = RegTypeEnumList.find(it => it.ID === ID);
        return t ? t.Name : '';
      }
      return '';
    },
  },
  computed: {
    ...mapState('common', ['Permission', 'userTypeList']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionProducePeriod?.Obj) {
        return this.Permission.PermissionList.PermissionProducePeriod.Obj;
      }
      return {};
    },
    localDataList() {
      if (Array.isArray(this.dataList)) {
        return this.dataList.map(it => ({
          ...it,
          TypeGradeContent: this.getTypeGradeContent(it), // 分类等级
          locationContent: this.getLocationContent(it), // 销售区域
          SellAddressContent: this.getSellAddressContent(it), // 经营地址
          RegTimeContent: this.getRegTimeContent(it), // 注册时间
          canUseCredit: this.getCanUseCredit(it), // 可用额度
          _ClassName: this.getStatusClassName(it),
          _isSinglePriceType: this.getIsSinglePriceType(it),
        }));
      }
      return [];
    },
  },
  methods: {
    setHeight() {
      const oHeader = document.querySelector('.mp-erp-customer-manage-list-page-wrap > header');
      const distance = oHeader ? oHeader.offsetHeight + 55 : 130;
      const tempHeight = this.getHeight('header', distance, '.mp-erp-customer-manage-list-page-wrap');
      this.h = tempHeight;
    },
    getTypeGradeContent({ Type, Grade }) {
      return `${(Type && Type.Second) || ''}${(Grade && Grade.Second) || ''}`;
    },
    getLocationContent({ Location, CustomerSN }) {
      if (Location) {
        const { RegionalName, CityName, CountyName } = Location;
        const str = `${RegionalName || ''}${CityName || ''}${CountyName || ''}`;
        return str || (CustomerSN === '/' ? '/' : '');
      }
      return '';
    },
    getSellAddressContent({ AuthenInfo }) {
      if (AuthenInfo) {
        const { SellArea, DetailAddress } = AuthenInfo;
        if (SellArea) {
          const { RegionalName, CityName, CountyName } = SellArea;
          return `${RegionalName || ''}${CityName || ''}${CountyName || ''}${DetailAddress || ''}`;
        }
      }
      return '';
    },
    getRegTimeContent({ RegTime }) {
      if (RegTime) {
        return RegTime.split('T')[0] || '';
      }
      return '';
    },
    getCanUseCredit({ FundInfo }) {
      if (FundInfo) {
        const { TotalCredit, UsedCredit } = FundInfo;
        if (this.$utils.getValueIsOrNotNumber(TotalCredit) && this.$utils.getValueIsOrNotNumber(UsedCredit)) {
          return TotalCredit - UsedCredit;
        }
        if (TotalCredit === '/' && UsedCredit === '/') return '/';
      }
      return '';
    },
    getStatusClassName({ Status }) {
      if (Status === CustomerStatusEnum.Freezed.ID) return 'is-pink';
      return '';
    },
    getIsSinglePriceType({ Type }) {
      const t = this.userTypeList.find(it => it.CategoryID === Type.First);
      return t && t.Value === CustomerPriceTypeEnum.Single.ID;
    },
    onDetailClick(item) {
      this.$emit('detail', item);
    },
    onSetupPriceClick(item) {
      this.$emit('setPrice', item);
    },
    onSetupShopClick(item) {
      this.$emit('setShop', item);
    },
    onSetupClick(item) { // 编辑
      this.$emit('setup', item.CustomerID);
    },
    onRemoveClick({ CustomerID, CustomerName }) { // 删除
      this.messageBox.warnCancelBox('确定删除该客户吗 ?', `客户名称：[ ${CustomerName} ]`, () => {
        this.$emit('remove', CustomerID);
      }, null);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-customer-manage-list-page-main-table-comp-wrap {
  border-top-color: rgb(230, 230, 230);
  border-left: 1px solid rgb(230, 230, 230);
  // height: 100%;
  .el-table__header-wrapper thead tr th {
    .cell {
      line-height: 36px;
      font-size: 14px;
      color: #444 !important;
    }
    &.menu-column {
      .cell {
        text-align: left;
        padding-left: 425px !important;
      }
    }
  }
  .el-table__body-wrapper {
    .el-table__row {
      width: 100%;
      > td {
          color: #585858;
        > .cell {
          font-size: 12px;
          height: 30px;
          padding: 0 5px;
          .left {
            display: inline-block;
            width: 85%;
            text-align: left;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  .ctrl-menus-container > span {
    img {
      margin-right: 4px;
    }
    & + span {
      margin-left: 12px;
    }
  }
}
</style>
