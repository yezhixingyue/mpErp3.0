<template>
  <el-table
    class="mp-erp-material-type-page-material-size-table-comp-wrap"
    :max-height="h"
    :height="h"
    stripe
    border
    :data="localTableData"
    key="mp-erp-material-type-page-material-size-table-comp-wrap"
    fit
    style="width: 100%"
   >
    <el-table-column prop="Name" label="显示名称" width="240"></el-table-column>
    <el-table-column prop="InternalName" label="内部名称" width="240"></el-table-column>
    <el-table-column prop="Elements" label="元素"  min-width="240" show-overflow-tooltip></el-table-column>
    <el-table-column prop="UnionShowText" label="组合显示"  min-width="240" show-overflow-tooltip></el-table-column>
    <el-table-column label="操作" min-width="520" class-name='menu-column'>
      <div class="menu-list" slot-scope="scope">
        <template v-if="Permission && Permission.PermissionList.PermissionMateriel.Obj.Edit">
          <TipsSpanButton text='设置元素' @click.native="onElementSetClick(scope.row)" />
          <TipsSpanButton text='元素组合显示' @click.native="onUnionShowSetClick(scope.row)" />
          <TipsSpanButton text='物料公式' @click.native="onFormulaSetClick(scope.row)" />
          <span class="icon-span" @click="onEditClick(scope.row)"><i></i>编辑</span>
        </template>
        <span v-if="Permission && Permission.PermissionList.PermissionMateriel.Obj.Delete" class="icon-span" @click="onRemoveClick(scope.row)"><i></i>删除</span>
      </div>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import TipsSpanButton from '@/components/common/NewComps/TipsSpanButton.vue';
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
  components: {
    TipsSpanButton,
  },
  computed: {
    ...mapState('common', ['Permission']),
    localTableData() {
      if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return [];
      return this.dataList.map(it => ({
        ...it,
        Elements: it.ElementList.map(_it => _it.Name).join('、'),
        UnionShowText: this.getUnionShowText(it),
      }));
    },
  },
  mixins: [tableMixin],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-material-type-page-wrap > header', 45 + 8);
      this.h = tempHeight;
    },
    onEditClick(item) {
      this.$emit('edit', item);
    },
    onRemoveClick(item) {
      this.$emit('remove', item);
    },
    onElementSetClick(item) {
      this.$emit('setElement', item);
    },
    onUnionShowSetClick(item) {
      this.$emit('setUnionShow', item);
    },
    onFormulaSetClick(item) {
      this.$emit('setFormula', item);
    },
    getUnionShowText({ UnionShowList, ElementList }) {
      // console.log(ElementList, UnionShowList);
      const str = UnionShowList.map(arr => arr.map(it => {
        const t = ElementList.find(_it => _it.ID === it);
        return t ? t.Name : '';
      }).filter(it => it).join('+')).join(' | ');
      return str;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-material-type-page-material-size-table-comp-wrap {
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
          .menu-list {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-right: 12px;
            padding-left: 60px;
            font-size: 12px;
            > span.icon-span {
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
            > span.mp-common-tip-span-btn-box {
              margin-right: 45px;
            }
          }
        }
      }
    }
  }
}
</style>
