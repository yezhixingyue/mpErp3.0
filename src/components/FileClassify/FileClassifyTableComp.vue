<template>
  <el-table
    class="mp-erp-file-classify-page-file-table-comp-wrap"
    :max-height="h"
    :height="h"
    stripe
    border
    :data="localTableData"
    key="mp-erp-file-classify-page-file-table-comp-wrap"
    fit
    style="width: 100%"
   >
    <el-table-column prop="Name" label="类目名称" width="185"></el-table-column>
    <el-table-column prop="TypeText" label="文件类型" width="220"></el-table-column>
    <el-table-column prop="Remark" label="说明文字" width="240" show-overflow-tooltip></el-table-column>
    <el-table-column prop="FailTips" label="未上传提示文字" show-overflow-tooltip></el-table-column>
    <el-table-column prop="ShowIndex" label="显示顺序" sortable="" width="160"></el-table-column>
    <el-table-column label="操作" width="180">
      <div class="menu-list" slot-scope="scope" v-if="Permission && Permission.PermissionList.PermissionFileCategory.Obj.Setup">
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
    FileTypeList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState('common', ['Permission']),
    localTableData() {
      if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return [];
      return this.dataList.map(it => ({
        ...it,
        TypeText: this.getTypeText(it),
      }));
    },
  },
  mixins: [tableMixin],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-file-manage-page-wrap > header', 45);
      this.h = tempHeight;
    },
    onEditClick(itemData) {
      this.$emit('edit', itemData);
    },
    onRemoveClick(itemData) {
      this.$emit('remove', itemData);
    },
    getTypeText(data) {
      if (!data || !this.FileTypeList || this.FileTypeList.length === 0) return '';
      const { TypeList } = data;
      if (TypeList && Array.isArray(TypeList) && TypeList.length > 0) {
        const arr = TypeList.map(it => {
          const t = this.FileTypeList.find(type => type.ID === it.ID);
          if (t) return t.Name;
          return '';
        }).filter(it => it);
        if (arr) return arr.join('  ');
      }
      return '';
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-file-classify-page-file-table-comp-wrap {
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
