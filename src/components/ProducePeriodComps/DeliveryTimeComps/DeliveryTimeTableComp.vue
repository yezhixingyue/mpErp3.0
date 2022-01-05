<template>
  <el-table
    class="mp-erp-period-delivery-page-main-table-comp-wrap"
    :max-height="h"
    :height="h"
    stripe
    border
    :data="localDataList"
    key="mp-erp-period-delivery-page-main-table-comp-wrap"
    fit
    style="width: 100%"
   >
    <el-table-column label="名称" prop="ItemName" width="260"></el-table-column>
    <el-table-column label="区域" min-width="220">
      <span class="left" slot-scope="scope" :title="scope.row.AreaDescribe">{{scope.row.AreaDescribe.replaceAll('\r\n', '、')}}</span>
    </el-table-column>
    <el-table-column label="配送方式" width="220">
      <span class="left" slot-scope="scope" :title="scope.row.ExpressList | formatExpressList(subExpressList)">
        {{scope.row.ExpressList | formatExpressList(subExpressList)}}
      </span>
    </el-table-column>
    <el-table-column prop="ProduceDelayTime" label="发货班次" min-width="260">
      <span class="left" slot-scope="scope" :title="scope.row.deliveryContent">{{scope.row.deliveryContent.replaceAll('\r\n', ' | ')}}</span>
    </el-table-column>
    <el-table-column label="操作" width="240">
      <template slot-scope="scope" v-if="localPermission.ShiftSetup">
        <CtrlMenus @edit='onSetupClick(scope.row)' @remove='onRemoveClick(scope.row)' />
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
import { formatTimeObjToStringFunc } from '@/assets/js/filters/filters';
import { mapGetters, mapState } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  mixins: [tableMixin, recordScrollPositionMixin('.mp-erp-period-delivery-page-main-table-comp-wrap .el-table__body-wrapper')],
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
  computed: {
    ...mapGetters('common', ['subExpressList']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionProducePeriod?.Obj) {
        return this.Permission.PermissionList.PermissionProducePeriod.Obj;
      }
      return {};
    },
    localDataList() {
      if (Array.isArray(this.dataList)) {
        return this.dataList.map(it => ({ ...it, deliveryContent: this.getDeliveryContent(it) }));
      }
      return [];
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('header', 130, '.mp-erp-period-manage-delivery-time-manage-list-page');
      this.h = tempHeight;
    },
    onSetupClick(item) {
      this.$emit('edit', item);
    },
    onRemoveClick(item) {
      this.messageBox.warnCancelBox('确定删除该发货班次吗', `名称：${item.ItemName}`, () => {
        this.$emit('remove', item);
      });
    },
    getDeliveryContent({ Shift }) {
      if (!Shift) return '';
      const list = typeof Shift === 'string' ? JSON.parse(Shift) : Shift;
      if (!Array.isArray(list)) return '';
      const content = list.map(it => {
        const { S, D, H } = it;
        const time = formatTimeObjToStringFunc(S);
        const d = D && this.$utils.getValueIsOrNotNumber(D, true) ? `${D}天` : '';
        const h = H && this.$utils.getValueIsOrNotNumber(H, true) ? `${H}小时` : '';
        return `${time} 运输时长：${d}${h}`;
      }).join('\r\n');
      return content;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-period-delivery-page-main-table-comp-wrap {
  border-top-color: rgb(230, 230, 230);
  border-left: 1px solid rgb(230, 230, 230);
  .el-table__header-wrapper thead tr th {
    .cell {
      line-height: 36px;
      font-size: 14px;
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
        > .cell {
          font-size: 12px;
          height: 30px;
          color: #585858;
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
}
</style>
