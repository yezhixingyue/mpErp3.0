<template>
  <el-table
    stripe
    border
    fit
    :data="TraceClientList"
    style="width: 100%"
    :max-height="h"
    :height="h"
    class="mp-erp-get-price-record-page-main-table-comp-wrap ft-14-table"
  >
    <el-table-column
      prop="Customer.CustomerName"
      label="客户（编号）"
      minWidth="224"
      show-overflow-tooltip
    >
      <span slot-scope="scope">
        {{scope.row.Customer.CustomerName}}（{{scope.row.Customer.CustomerSN}}）
      </span>
    </el-table-column>
    <el-table-column
      label="销售区域"
      minWidth="136"
      show-overflow-tooltip
    >
      <span class="is-gray" slot-scope="scope">
        {{scope.row.Customer.Location?.RegionalName}}{{scope.row.Customer.Location?.CityName}}{{scope.row.Customer.Location?.CountyName}}
      </span>
    </el-table-column>
    <el-table-column
      label="客户等级分类"
      minWidth="184"
      show-overflow-tooltip
    >
      <span class="is-gray" slot-scope="scope">
        {{`${(scope.row.Type && scope.row.Type.Second) || ''}${(scope.row.Grade && scope.row.Grade.Second) || ''}`}}
      </span>
    </el-table-column>
    <el-table-column
      prop="Customer.Mobile"
      label="联系电话"
      minWidth="136"
      show-overflow-tooltip
    ></el-table-column>
    <el-table-column
      prop="Customer.QQ"
      label="QQ"
      width="103"
      show-overflow-tooltip
    ></el-table-column>
    <el-table-column
      prop="TodayCommunicateCount"
      label="今日联系次数"
      width="124"
      show-overflow-tooltip
    ></el-table-column>
    <el-table-column label="下次沟通时间" show-overflow-tooltip width="164">
      <span class="is-gray" slot-scope="scope">{{
        scope.row.NextCommunicateTime
      }}</span>
    </el-table-column>
    <el-table-column label="未完成跟踪订单" show-overflow-tooltip width="118">
      <span slot-scope="scope">{{
        scope.row.UnFinishTrackCount
      }} 个</span>
    </el-table-column>
    <el-table-column
      prop="Customer.Mobile"
      label="最近一次沟通（方式/时间）"
      width="215"
    >
      <span slot-scope="scope">
        {{ scope.row.Operator.OperatorName }}
        （{{ scope.row.LastCommunicateType ? '电话' : 'QQ' }}
        {{ scope.row.LastCommunicateTime | format2MiddleLangTypeDate }}）
      </span>
    </el-table-column>
    <el-table-column
      label="最近一次沟通备注"
      prop="LastCommunicateRemark"
      width="152"
    >
    </el-table-column>
    <el-table-column label="操作" minWidth="127" show-overflow-tooltip>
      <div class="is-font-12 btn-wrap" slot-scope="scope">
        <span @click="onDetaClick(scope.row)">
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
    ...mapState('TraceClientList', ['TraceClientList', 'loading']),
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
