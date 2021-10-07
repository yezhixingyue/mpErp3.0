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
    <el-table-column prop="conditionText" label="条件" min-width="260">
      <template slot-scope="scope">
        <el-tooltip effect="light" popper-class='common-property-condition-text-tips-box' v-if="typeof scope.row.conditionText === 'object'">
          <div slot="content">
            <p v-for="(it, i) in scope.row.conditionText" :key="it.name + 'tips' + i">
              <span v-if="i > 0" class="type">{{scope.row.Constraint.FilterType === 1 ? '且' : '或'}}</span>
              <span class="name">{{it.name}}</span>
              <span class="is-origin">{{it.operator}}</span>
              <span class="val">{{it.val}}</span>
              <span v-if="i === scope.row.conditionText.length - 1" style="margin-left:2px"> 。</span>
              <span v-else style="margin-left:2px">；</span>
            </p>
          </div>
          <div class="common-property-condition-text-content-box">
            <p v-for="(it, i) in scope.row.conditionText" :key="it.name + 'content' + i">
              <span v-if="i > 0" class="type">{{scope.row.Constraint.FilterType === 1 ? '且' : '或'}}</span>
              <span>{{it.name}}</span>
              <span class="is-origin">{{it.operator}}</span>
              <span>{{it.val}}</span>
            </p>
          </div>
        </el-tooltip>
        <span v-if="typeof scope.row.conditionText === 'string'">{{scope.row.conditionText}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="FilterTypeText" label="条件类型"  width="180" show-overflow-tooltip></el-table-column>
    <el-table-column prop="PriorityText" label="优先级"  width="140" show-overflow-tooltip></el-table-column>
    <el-table-column prop="defaultFactoryName" label="默认生产工厂"  width="180" show-overflow-tooltip></el-table-column>
    <el-table-column prop="unDelaultFactoryListName" label="可选生产工厂"  width="320" show-overflow-tooltip>
    </el-table-column>
    <el-table-column label="操作" width="240">
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
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';

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
    PropertyList: {
      default: () => [],
      type: Array,
    },
  },
  computed: {
    localTableData() {
      if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return [];
      return this.dataList.map(it => ({
        ...it,
        PriorityText: `${it.Priority}级`,
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
      const tempHeight = this.getHeight('.mp-erp-product-list-page-product-factory-set-comp-wrap > header', 110);
      this.h = tempHeight;
    },
    onEditClick(itemData) {
      this.$emit('edit', itemData);
    },
    onRemoveClick(itemData, i) {
      this.$emit('remove', itemData, i);
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
      const str = PropertyClass.getPropertyConditionText(list, this.PropertyList);
      return str || '无';
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
            justify-content: center;
            padding-right: 12px;
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
