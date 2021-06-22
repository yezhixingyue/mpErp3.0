<template>
  <el-table
    class="mp-erp-material-list-page-material-size-table-comp-wrap"
    :max-height="h"
    :height="h"
    stripe
    border
    :data="localTableData"
    key="mp-erp-material-list-page-material-size-table-comp-wrap"
    fit
    style="width: 100%"
   >
    <el-table-column prop="Type.Name" label="物料类型" width="260"></el-table-column>
    <el-table-column prop="MaterialText" label="物料"  min-width="240" show-overflow-tooltip></el-table-column>
    <el-table-column label="操作" min-width="380" class-name='menu-column'>
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
        MaterialText: this.getMaterialText(it),
      }));
    },
  },
  mixins: [tableMixin],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-material-list-page-wrap > header', 45 + 8);
      this.h = tempHeight;
    },
    onEditClick(itemData) {
      this.$emit('edit', itemData);
    },
    onRemoveClick(itemData, index) {
      this.messageBox.warnCancelBox('确定删除该物料吗', `物料信息：[ ${itemData.MaterialText} ]`, () => {
        this.$emit('remove', itemData, index);
      });
    },
    getMaterialText(item) {
      const { ElementList, UnionShowList } = item.Type;
      const list = [];
      UnionShowList.forEach(lv1List => {
        lv1List.forEach(ElementID => {
          const t = ElementList.find(it => it.ID === ElementID);
          if (t) {
            if (t.Type === 2) { // 选项值
              const { OptionList, Allow, AllowCustomer } = t.OptionAttribute;
              const _t = OptionList.find(_it => _it.ID === t.CustomerInputValue);
              if (_t) list.push(_t.Name);
              if (!_t && Allow && (AllowCustomer || t.HiddenToCustomer) && t.CustomerInputValue) list.push(t.CustomerInputValue);
            }
            if (t.Type === 3) { // 开关
              const { OpenValue, CloseValue } = t.SwitchAttribute;
              let text = +t.CustomerInputValue === OpenValue ? '开' : '';
              if (!text) text = +t.CustomerInputValue === CloseValue ? '关' : '';
              list.push(text);
            }
            if (t.Type === 1) {
              list.push(`${t.CustomerInputValue}${t.Unit}`);
            }
          }
        });
      });
      return list.join(' ');
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-material-list-page-material-size-table-comp-wrap {
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
