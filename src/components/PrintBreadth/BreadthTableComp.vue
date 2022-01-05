<template>
  <el-table
    class="mp-erp-print-breadth-page-breadth-table-comp-wrap"
    :max-height="h"
    :height="h"
    stripe
    border
    :data="localTableData"
    key="mp-erp-print-breadth-page-breadth-table-comp-wrap"
    fit
    style="width: 100%"
   >
    <el-table-column prop="Name" label="名称" width="260"></el-table-column>
    <el-table-column prop="ModeText" label="允许拼版方式（括号内为白边）" show-overflow-tooltip></el-table-column>
    <el-table-column prop="MinSize" label="最小幅面" width="280"></el-table-column>
    <el-table-column prop="MaxSize" label="最大幅面" width="280"></el-table-column>
    <el-table-column label="操作" width="280">
      <div class="menu-list" slot-scope="scope" v-if="Permission && Permission.PermissionList.PermissionBreadth.Obj.SetupBreadth">
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
import { MakeupMode } from '@/assets/js/TypeClass/PrintBreadth';
import { mapState } from 'vuex';

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
    ...mapState('common', ['Permission']),
    localTableData() {
      if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return [];
      return this.dataList.map(it => ({
        ...it,
        ModeText: this.getModeListText(it.ModeList),
        MinSize: this.getBreadthSizeText(it.MinMaterialSize),
        MaxSize: this.getBreadthSizeText(it.MaxMaterialSize),
      }));
    },
  },
  mixins: [tableMixin],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-print-breadth-page-wrap > header', 45);
      this.h = tempHeight;
    },
    onEditClick(itemData) {
      this.$emit('edit', itemData);
    },
    onRemoveClick(itemData) {
      this.$emit('remove', itemData);
    },
    getModeListText(ModeList) {
      if (!ModeList || ModeList.length === 0) return '';
      const list = [];
      ModeList.forEach(it => {
        const t = MakeupMode.find(_it => _it.ID === it.Mode);
        if (t) {
          const str = `${t.Name}（${this.getBreadthSizeText(it.WhiteEdge)}）`;
          list.push(str);
        }
      });
      return list.join(' ');
    },
    getBreadthSizeText({ Length, Width }) {
      return `${Length} X ${Width}mm`;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-print-breadth-page-breadth-table-comp-wrap {
  border-top-color: rgb(230, 230, 230);
  border-left: 1px solid rgb(230, 230, 230);
  .el-table__header-wrapper thead tr th .cell {
    line-height: 36px;
    font-size: 14px;
  }
  .el-table__body-wrapper {
    .el-table__row {
      width: 100%;
      > td {
        > .cell {
          font-size: 12px;
          height: 30px;
          .menu-list {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-right: 12px;
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
                background: url(../../assets/images/Compile.png) no-repeat center center/14px 14px;
                margin-right: 4px;
              }
              &:last-of-type > i {
                background: url(../../assets/images/del.png) no-repeat center center/12px 16px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
