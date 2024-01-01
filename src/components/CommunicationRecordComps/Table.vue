<template>
  <el-table
    stripe
    border
    fit
    :data="CommunicationRecordList"
    style="width: 100%"
    :max-height="h"
    :height="h"
    class="mp-erp-communication-record-page-main-table-comp-wrap ft-14-table"
  >
    <el-table-column
      prop="Customer.CreateTime"
      label="沟通时间"
      minWidth="196"
      show-overflow-tooltip
    >
      <span slot-scope="scope">
        {{scope.row.CreateTime | format2MiddleLangTypeDate}}
      </span>
    </el-table-column>
    <el-table-column
      label="沟通人"
      minWidth="122"
      show-overflow-tooltip
    >
      <span slot-scope="scope">
        {{scope.row.Operator.OperatorName}}
      </span>
    </el-table-column>
    <el-table-column
      label="沟通方式"
      minWidth="96"
      show-overflow-tooltip
    >
      <span slot-scope="scope">{{
        scope.row.CommunicateType ? 'QQ' : '电话'
      }}</span>
    </el-table-column>
    <el-table-column
      prop="CommunicateRemark"
      label="沟通备注"
      minWidth="296"
      show-overflow-tooltip
    ></el-table-column>
    <el-table-column
      label="客户（编号）"
      width="282"
      show-overflow-tooltip
    >
      <span slot-scope="scope">
        {{scope.row.Customer.CustomerName}}（{{scope.row.Customer.CustomerSN}}）
      </span>
    </el-table-column>
    <el-table-column label="销售区域" show-overflow-tooltip width="296">
      <span slot-scope="scope">
        {{scope.row.Customer.SellArea?.RegionalName}}{{scope.row.Customer.SellArea?.CityName}}{{scope.row.Customer.SellArea?.CountyName}}
      </span>
    </el-table-column>
    <el-table-column label="客户等级分类" show-overflow-tooltip width="272">
      <span slot-scope="scope">
        {{ userTypeList.find(it => it.CategoryID === scope.row.Customer.Type.First)?.CategoryName }}-{{
          userRankList.find(it => it.CategoryID === scope.row.Customer.Grade.First)?.CategoryName
        }}
      </span>
    </el-table-column>
    <el-table-column label="操作" minWidth="127" show-overflow-tooltip>
      <div class="is-font-12 btn-wrap" slot-scope="scope">
        <span @click="onDetaClick(scope.row)" v-if="localPermission.TrackDetail">
          <img src="@/assets/images/detail.png" alt />详情
        </span>
      </div>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  computed: {
    ...mapState('CommunicationRecord', ['CommunicationRecordList', 'loading']),
    ...mapState('common', ['Permission', 'userTypeList', 'userRankList']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionCalculateRecord?.Obj) {
        return this.Permission.PermissionList.PermissionCalculateRecord.Obj;
      }
      return {};
    },
  },
  mixins: [tableMixin, recordScrollPositionMixin('.ft-14-table .el-table__body-wrapper')],
  filters: {
    getProductName(Attributes) {
      if (!Attributes) return '';
      const { DisplayName, ClassList } = Attributes;
      if (!ClassList) return DisplayName;
      const t = ClassList.find(it => it.Type === 1);
      if (t) {
        const { FirstLevel, SecondLevel } = t;
        return `${FirstLevel.Name}-${SecondLevel.Name}-${DisplayName}`;
      }
      return DisplayName;
    },
    getCraftTextList(craftList) {
      if (craftList.length === 0) return '';
      const _list = craftList.map(it => it.Attributes.DisplayName);
      return _list.join(' ');
    },
  },
  methods: {
    setHeight() {
      // const tempHeight = this.getHeight('.mp-erp-communication-record-page-main-comp-wrap', 0);
      const oDom = document.querySelector('.mp-erp-communication-record-page-main-comp-wrap'); // 未使用通用方式获取高度
      if (oDom) this.h = oDom.offsetHeight;
    },
    onDetaClick(data) {
      this.$emit('detail', data);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-communication-record-page-main-table-comp-wrap {
  width: 100%;
  .el-table__header-wrapper thead tr th .cell {
    line-height: 36px;
    font-size: 14px;
  }
  .btn-wrap {
    display: flex;
    justify-content: space-around;
    padding: 0 10px;
    > span {
      > img {
        margin-right: 5px;
        vertical-align: -3px;
      }
      &:not(.disbaled) {
        color: #a2a2a2;
        transition: color 0.2s ease-in-out;
        cursor: pointer;
        &:hover {
          color: #444;
        }
      }
      &.disbaled {
        color: #cbcbcb;
      }
    }
  }
}
</style>
