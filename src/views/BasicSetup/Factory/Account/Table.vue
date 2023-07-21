<template>
  <el-table
    class="mp-erp-factory-manage-setup-account-page-table-comp-wrap"
    :max-height="h"
    :height="h"
    :data="list"
    stripe
    border
    fit
    style="width: 100%"
   >
    <el-table-column label="账号名称" min-width="160" prop="Name"></el-table-column>
    <el-table-column prop="Mobile" label="手机号码" min-width="160"></el-table-column>
    <el-table-column label="启用状态" min-width="120">
      <span slot-scope="scope">
        {{ scope.row.Status === 1 ? '已启用' : '未启用' }}
      </span>
    </el-table-column>
    <el-table-column label="创建时间" min-width="160">
      <span slot-scope="scope">
        {{ scope.row.CreateTime | format2MiddleLangTypeDate }}
      </span>
    </el-table-column>
    <el-table-column label="操作" width="320">
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
    list: {
      default: () => [],
      type: Array,
    },
    loading: {
      type: Boolean,
    },
  },
  mixins: [tableMixin],
  data() {
    return {
      search: '',
    };
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('', 210.5);
      this.h = tempHeight;
    },
    onEditClick(itemData) {
      this.$emit('edit', itemData);
    },
    onRemoveClick(itemData) {
      this.$emit('remove', itemData);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-factory-manage-setup-account-page-table-comp-wrap {
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
                background: url(@/assets/images/Compile.png) no-repeat center center/14px 14px;
                margin-right: 6px;
              }
              &:last-of-type > i {
                width: 12px;
                height: 16px;
                background: url(@/assets/images/del.png) no-repeat center center/12px 16px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
