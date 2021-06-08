<template>
  <el-table
    class="mp-erp-craft-list-page-craft-table-comp-wrap"
    :max-height="h"
    :height="h"
    stripe
    border
    :data="localTableData"
    key="mp-erp-craft-list-page-craft-table-comp-wrap"
    fit
    style="width: 100%"
   >
    <el-table-column prop="Name" label="内部名称" width="260"></el-table-column>
    <el-table-column prop="ShowName" label="显示名称"  min-width="240" show-overflow-tooltip></el-table-column>
    <el-table-column prop="ClassiftText" label="所属分类"  min-width="240" show-overflow-tooltip></el-table-column>
    <el-table-column prop="ElementText" label="元素"  min-width="240" show-overflow-tooltip></el-table-column>
    <el-table-column prop="GroupText" label="元素组"  min-width="240" show-overflow-tooltip></el-table-column>
    <el-table-column label="操作" min-width="380">
      <div class="menu-list" slot-scope="scope">
        <span @click="onElementClick(scope.row)"><i></i>界面元素</span>
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
        ClassiftText: this.getClassiftText(it),
        ElementText: this.getElementText(it.ElementList),
        GroupText: this.getGroupText(it),
      }));
    },
  },
  mixins: [tableMixin],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-craft-manage-craft-list-page-wrap > header', 45 + 8);
      this.h = tempHeight;
    },
    onEditClick(itemData) {
      this.$emit('edit', itemData);
    },
    onRemoveClick(itemData) {
      this.$emit('remove', itemData);
    },
    onElementClick(itemData) {
      this.$emit('setElement', itemData);
    },
    getClassiftText(data) {
      if (!data) return '';
      const { Classify } = data;
      if (Classify) {
        const { FirstLevel, SecondLevel } = Classify;
        return `${FirstLevel.Name} ${SecondLevel.Name}`;
      }
      return '';
    },
    getElementText(list) {
      if (!list || !Array.isArray(list) || list.length === 0) return '';
      return list.map(it => it.Name).join('、');
    },
    getGroupText(item) {
      if (!item || !item.GroupList || item.GroupList.length === 0) return '';
      return item.GroupList.map(it => `${it.Name}（${it.UseTimes.MinValue}-${it.UseTimes.MaxValue}次）`).join(' ');
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-craft-list-page-craft-table-comp-wrap {
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
                background: url(../../assets/images/Compile.png) no-repeat center center/14px 14px;
                margin-right: 4px;
              }
              &:last-of-type > i {
                background: url(../../assets/images/del.png) no-repeat center center/12px 16px;
              }
              &:first-of-type > i {
                background: url(../../assets/images/element.png) no-repeat center center/16px 18px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
