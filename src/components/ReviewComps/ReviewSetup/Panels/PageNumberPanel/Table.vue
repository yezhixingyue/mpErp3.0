<template>
  <el-table
    class="mp-erp-review-setting-panels-page-number-panel-table-comp-wrap"
    :max-height="h"
    fit
    :data="localList"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column min-width="180px" prop="_FileNames" show-overflow-tooltip label="输出文件"></el-table-column>
    <el-table-column min-width="180px" prop="_NumberContent" show-overflow-tooltip label="页数限制"></el-table-column>
    <el-table-column width="180px" label="操作">
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
import { PagesNumberTypeEnumList } from '../../../../../store/review/reviewEnums';

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
        _NumberContent: this.getNumberContent(it),
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
    getNumberContent({ Type, Formula, Value }) {
      const t = PagesNumberTypeEnumList.find(it => it.ID === Type);
      if (t) {
        const TypeName = t.Name;
        let NumberContent = '';
        if (Formula) {
          const { Name, Unit } = Formula;
          NumberContent = `${Name}${Unit ? ` （单位：${Unit}）` : ''}`;
        } else if (Value) {
          NumberContent = `${Value}页`;
        }
        if (NumberContent) {
          return `${TypeName}：${NumberContent}`;
        }
      }
      return '';
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
.mp-erp-review-setting-panels-page-number-panel-table-comp-wrap {
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
