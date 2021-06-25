<template>
  <el-table
    class="mp-erp-product-module-factory-list-page-factory-table-comp-wrap"
    :max-height="h"
    :height="h"
    stripe
    border
    :data="localTableData"
    key="mp-erp-product-module-factory-list-page-factory-table-comp-wrap"
    fit
    style="width: 100%"
   >
    <el-table-column prop="conditionText" label="条件" width="260"></el-table-column>
    <el-table-column prop="FilterTypeText" label="条件类型"  min-width="240" show-overflow-tooltip></el-table-column>
    <el-table-column prop="Priority" label="优先级"  min-width="240" show-overflow-tooltip></el-table-column>
    <el-table-column prop="defaultFactoryName" label="默认生产工厂"  min-width="240" show-overflow-tooltip></el-table-column>
    <el-table-column prop="unDelaultFactoryListName" label="可选生产工厂"  min-width="240" show-overflow-tooltip>
    </el-table-column>
    <el-table-column label="操作" min-width="380">
      <div class="menu-list" slot-scope="scope">
        <span @click="onEditClick(scope.row)"><i></i>编辑</span>
        <span @click="onRemoveClick(scope.row, scope.$index)"><i></i>删除</span>
      </div>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';

export default {
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
  computed: {
    localTableData() {
      if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return [];
      return this.dataList.map(it => ({
        ...it,
        Priority: `${it.Priority}级`,
        FilterTypeText: it.Constraint.FilterType === 1 ? '满足所有条件' : '满足任一条件',
        defaultFactoryName: this.getDefaultFactory(it.FactoryList),
        unDelaultFactoryListName: this.getUnDefaultFactory(it.FactoryList),
        conditionText: this.getConditionText(it.Constraint.ItemList),
      }));
    },
  },
  mixins: [tableMixin],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-product-list-page-product-factory-set-comp-wrap > header', 100);
      this.h = tempHeight;
    },
    onEditClick(itemData) {
      this.$emit('edit', itemData);
    },
    onRemoveClick(itemData) {
      this.$emit('remove', itemData);
    },
    getDefaultFactory(list) {
      const t = list.find(it => it.IsDefault);
      return t ? t.Factory.FactoryName : '';
    },
    getUnDefaultFactory(list) {
      const _list = list.filter(it => !it.IsDefault).map(it => it.Factory.FactoryName);
      return _list.join('、');
    },
    getConditionText(list) {
      console.log(list);
      return 123;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-product-module-factory-list-page-factory-table-comp-wrap {
  border-top-color: rgb(230, 230, 230);
  border-left: 1px solid rgb(230, 230, 230);
  .el-table__header-wrapper thead tr th {
    .cell {
      line-height: 36px;
      font-size: 14px;
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
          .menu-list {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-right: 12px;
            padding-left: 60px;
            font-size: 12px;
            > span {
              color: #a2a2a2;
              transition: color 0.05s ease-in-out;
              cursor: pointer;
              margin: 0 10px;
              display: flex;
              align-items: center;
              user-select: none;
              &:hover {
                color: #444;
              }
              > i {
                width: 16px;
                height: 18px;
                background: url(../../../assets/images/Compile.png) no-repeat center center/14px 14px;
                margin-right: 4px;
              }
              &:last-of-type > i {
                background: url(../../../assets/images/del.png) no-repeat center center/12px 16px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
