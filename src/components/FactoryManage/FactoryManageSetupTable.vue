<template>
  <el-table
    class="mp-erp-factory-manage-setup-page-table-comp-wrap"
    :max-height="h"
    :height="h"
    :data="dataList"
    stripe
    border
    fit
    style="width: 100%"
   >
    <el-table-column prop="FactoryName" label="工厂名称" min-width="160">
    </el-table-column>
    <el-table-column prop="Address" label="工厂地址" min-width="360">
      <span class="is-gray">aaaa</span>
    </el-table-column>
    <el-table-column label="操作" width="320">
      <div class="menu-list" slot-scope="scope" v-if="Permission && Permission.PermissionList.PermissionSetupFactoryBase.Obj.Setup">
        <span @click="onEditClick(scope.row)"><i></i>编辑</span>
        <span @click="onRemoveClick(scope.row)"><i></i>删除</span>
      </div>
    </el-table-column>
  </el-table>
</template>

<script>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import { mapState } from 'vuex';

export default {
  props: {
    dataList: {
      default: () => [],
      type: Array,
    },
  },
  mixins: [tableMixin],
  data() {
    return {
      search: '',
    };
  },
  computed: {
    ...mapState('common', ['Permission']),
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('', 210.5);
      this.h = tempHeight;
    },
    onEditClick(itemData) {
      this.$emit('handleAddressItemEdit', itemData);
    },
    onRemoveClick(itemData) {
      this.$emit('handleAddressItemRemove', itemData);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-factory-manage-setup-page-table-comp-wrap {
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
                width: 14px;
                height: 14px;
                background: url(../../assets/images/Compile.png) no-repeat center center/14px 14px;
                margin-right: 6px;
              }
              &:last-of-type > i {
                width: 12px;
                height: 16px;
                background: url(../../assets/images/del.png) no-repeat center center/12px 16px;
              }
              &:first-of-type > i {
                width: 12px;
                height: 16px;
                background: url(../../assets/images/setup.png) no-repeat center center/14px 14px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
