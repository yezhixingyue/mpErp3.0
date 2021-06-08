<template>
  <el-table
    class="mp-erp-material-size-page-material-size-table-comp-wrap"
    :max-height="h"
    :height="h"
    stripe
    border
    :data="localTableData"
    key="mp-erp-material-size-page-material-size-table-comp-wrap"
    fit
    style="width: 100%"
   >
    <el-table-column prop="Name" label="尺寸名称" width="260"></el-table-column>
    <el-table-column prop="LenText" label="长度"  min-width="240" show-overflow-tooltip></el-table-column>
    <el-table-column prop="WidthText" label="宽度"  min-width="240" show-overflow-tooltip></el-table-column>
    <el-table-column label="操作" min-width="380" class-name='menu-column'>
      <div class="menu-list" slot-scope="scope">
        <span @click="onEditClick(scope.row)"><i></i>编辑</span>
        <span @click="onRemoveClick(scope.row)"><i></i>删除</span>
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
        LenText: this.getSizeText(it, 'len'),
        WidthText: this.getSizeText(it, 'width'),
      }));
    },
  },
  mixins: [tableMixin],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-material-size-manage-page-wrap > header', 45 + 8);
      this.h = tempHeight;
    },
    onEditClick(itemData) {
      this.$emit('edit', itemData);
    },
    onRemoveClick(itemData) {
      this.$emit('remove', itemData);
    },
    getSizeText(data, type) {
      const min = type === 'len' ? data.MinLength : data.MinWidth;
      let max = type === 'len' ? data.MaxLength : data.MaxWidth;
      const increment = type === 'len' ? data.LengthIncrement : data.WidthIncrement;
      const split = type === 'len' ? data.IsLengthSplit : data.IsWidthSplit;

      max = max === -1 ? '无限' : `${max}mm`;

      const splitStr = split ? '可加工' : '不可加工';
      const sizeStr = (!min && min !== 0) ? `${max}` : `${min}<=值<=${max} 增量：${increment}`;

      return `${sizeStr}（${splitStr}）`;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-material-size-page-material-size-table-comp-wrap {
  border-top-color: rgb(230, 230, 230);
  border-left: 1px solid rgb(230, 230, 230);
  .el-table__header-wrapper thead tr th {
    .cell {
      line-height: 36px;
      font-size: 14px;
    }
    &.menu-column {
      text-align: left;
      padding-left: 120px;
    }
  }
  .el-table__body-wrapper {
    .el-table__row {
      width: 100%;
      > td {
        > .cell {
          font-size: 14px;
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
                height: 16px;
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
