<template>
  <el-table
    stripe
    border
    fit
    :data="RecordDataList"
    style="width: 100%"
    :max-height="h"
    :height="h"
    class="mp-erp-get-price-record-page-main-table-comp-wrap ft-14-table"
  >
    <el-table-column
      prop="Customer.CustomerSN"
      label="客户编号"
      width="110"
    ></el-table-column>
    <el-table-column
      prop="Customer.CustomerName"
      label="客户"
      minWidth="160"
      show-overflow-tooltip
    ></el-table-column>
    <el-table-column
      prop="Customer.Mobile"
      label="联系电话"
      width="120"
    ></el-table-column>
    <el-table-column
      label="QQ"
      prop="Customer.QQ"
      width="110"
    >
    </el-table-column>
    <el-table-column
      label="产品"
      minWidth="260"
      show-overflow-tooltip
    >
      <span class="is-gray" slot-scope="scope">{{
        scope.row.ProductParams.Attributes | getProductName
      }}</span>
    </el-table-column>
    <el-table-column label="数量" width="120" show-overflow-tooltip>
      <template slot-scope="scope">{{
        scope.row.ProductParams.Attributes | formarProductAmount
      }}</template>
    </el-table-column>
    <el-table-column label="尺寸" prop="ProductParams.Size.DisplayContent" width="110" show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="Remark"
      label="工艺"
      width="110"
      show-overflow-tooltip
    >
      <template slot-scope="scope">{{ scope.row.ProductParams.CraftList | getCraftTextList }}</template>
    </el-table-column>
    <el-table-column
      label="原价"
      width="100"
      show-overflow-tooltip
    >
      <template slot-scope="scope">{{ scope.row.Funds.OriginalPrice }}元</template>
    </el-table-column>
    <el-table-column
      label="成交价"
      width="100"
      show-overflow-tooltip
    >
      <template slot-scope="scope">{{ scope.row.Funds.FinalPrice }}元</template>
    </el-table-column>
    <el-table-column
      label="报价方式"
      width="85"
      show-overflow-tooltip
    >
      <template slot-scope="scope">{{ scope.row.Terminal | formatTerminalType }}</template>
    </el-table-column>
    <el-table-column label="报价时间" show-overflow-tooltip width="135">
      <span class="is-gray" slot-scope="scope">{{
        scope.row.CreateTime | format2MiddleLangTypeDate
      }}</span>
    </el-table-column>
    <el-table-column label="操作" minWidth="160" show-overflow-tooltip>
      <div class="is-font-12 btn-wrap" slot-scope="scope">
        <span @click="onDetaClick(scope.row)">
          <img src="@/assets/images/detail.png" alt />查看详情
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
    ...mapState('PriceRecord', ['RecordDataList', 'RecordDataNumber', 'loading']),
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
      // const tempHeight = this.getHeight('.mp-erp-get-price-record-page-main-comp-wrap', 0);
      const oDom = document.querySelector('.mp-erp-get-price-record-page-main-comp-wrap'); // 未使用通用方式获取高度
      if (oDom) this.h = oDom.offsetHeight;
    },
    onDetaClick(data) {
      this.$emit('detail', data);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-get-price-record-page-main-table-comp-wrap {
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
