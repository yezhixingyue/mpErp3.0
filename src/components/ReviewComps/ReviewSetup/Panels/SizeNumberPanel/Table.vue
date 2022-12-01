<template>
  <el-table
    class="mp-erp-review-setting-panels-size-number-panel-table-comp-wrap"
    :max-height="h"
    fit
    :data="localList"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column min-width="160px" prop="_FileNames" show-overflow-tooltip label="输出文件"></el-table-column>
    <el-table-column width="75px" prop="_LenWidthExchange" show-overflow-tooltip label="宽高互换"></el-table-column>
    <el-table-column min-width="150px" prop="_LenContent" show-overflow-tooltip label="宽（允许误差）"></el-table-column>
    <el-table-column min-width="150px" prop="_WidthContent" show-overflow-tooltip label="高（允许误差）"></el-table-column>
    <el-table-column min-width="110px" prop="NumberFormula.Name" show-overflow-tooltip label="修改数量公式"></el-table-column>
    <el-table-column min-width="120px" prop="_BleedContent" show-overflow-tooltip label="出血（上下左右）"></el-table-column>
    <el-table-column width="120px" label="操作">
      <template slot-scope="scope">
        <CtrlMenus
          @edit='onEditClick(scope.row, scope.$index)'
          @remove='onRemoveClick(scope.row, scope.$index)'
        />
      </template>
    </el-table-column>
    <div slot="empty">
      <span >暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import CtrlMenus from '../../../../common/NewComps/CtrlMenus/index.vue';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  mixins: [tableMixin],
  components: {
    CtrlMenus,
  },
  computed: {
    localList() {
      return this.list.map(it => ({
        ...it,
        _FileNames: it.FileList.map(_it => _it.Name).join('、'),
        _LenContent: this.getSizeContent(it.LengthFormula, it.LengthErrorRange),
        _WidthContent: this.getSizeContent(it.WidthFormula, it.WidthErrorRange),
        _BleedContent: this.getBleedContent(it),
        _LenWidthExchange: it.AllowSizeExchange ? '允许' : '不允许',
      }));
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight(
        null,
        300,
        '.mp-erp-review-common-with-condition-setting-manage-setup-page-wrap .right.mp-scroll-wrap',
      );
      this.h = tempHeight;
    },
    getSizeContent(formula, range) {
      if (formula && range) {
        const formulaName = formula.Name;
        if (formulaName) {
          const { MinValue, MaxValue } = range;
          if (typeof +MinValue === 'number' && !Number.isNaN(+MinValue) && typeof +MaxValue === 'number' && !Number.isNaN(+MaxValue)) {
            return `${formulaName}(+${MaxValue}mm,-${MinValue}mm)`;
          }
        }
      }
      return '';
    },
    getBleedContent({ BleedTop, BleedBottom, BleedLeft, BleedRight }) {
      const str = [BleedTop, BleedBottom, BleedLeft, BleedRight].map(it => (this.$utils.getValueIsOrNotNumber(BleedTop) ? +it : '设置错误')).join(',');
      return str;
    },
    onEditClick(data, index) {
      this.$emit('edit', data, index);
    },
    onRemoveClick(data, index) {
      this.messageBox.warnCancelBox('确定删除该输出文件吗 ?', `输出文件：${data._FileNames}`, () => {
        this.$emit('remove', index);
      }, null);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/var.scss";
.mp-erp-review-setting-panels-size-number-panel-table-comp-wrap {
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
      color: #989898;
    }
    > .cell {
      color: #585858;
      height: 24px;
      line-height: 24px;
      .ctrl-menus-container > span + span {
          margin-left: 12px;
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
