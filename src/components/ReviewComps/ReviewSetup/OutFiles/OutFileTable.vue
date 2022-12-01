<template>
  <el-table
    class="mp-erp-review-output-file-list-page-table-comp-wrap"
    :max-height="h"
    :height="h"
    fit
    :data="list"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column min-width="180px" prop="Name" show-overflow-tooltip label="输出文件名称"></el-table-column>
    <el-table-column min-width="180px" prop="IncludeContent" show-overflow-tooltip label="文件名称包含"></el-table-column>
    <el-table-column min-width="100px" show-overflow-tooltip label="格式">
      <template slot-scope="scope">
        {{scope.row.IsPDF ? 'PDF' : '不限'}}
      </template>
    </el-table-column>
    <el-table-column min-width="120px" show-overflow-tooltip label="自动生成">
      <template slot-scope="scope">
        <template v-if="scope.row.IsPDF">{{scope.row.IsFromPrintFile ? '是' : '否'}}</template>
      </template>
    </el-table-column>
    <el-table-column min-width="80px" prop="Index" show-overflow-tooltip label="摆放顺序">
      <template slot-scope="scope" v-if="scope.row.IsPDF">
        {{scope.row.Index}}
      </template>
    </el-table-column>
    <el-table-column min-width="100px" show-overflow-tooltip label="需要拼版">
      <template slot-scope="scope" v-if="scope.row.IsPDF">
        {{scope.row.IsMakeup ? '需要' : '不需要'}}
      </template>
    </el-table-column>
    <el-table-column min-width="100px" show-overflow-tooltip label="生成缩略图">
      <template slot-scope="scope" v-if="scope.row.IsPDF">
        {{scope.row.IsGenerateThumb ? '生成' : '不生成'}}
      </template>
    </el-table-column>
    <el-table-column min-width="100px" prop="totalTimes" show-overflow-tooltip label="引用次数">
      <template slot-scope="scope">
        {{scope.row.UseTimes}}次
      </template>
    </el-table-column>
    <el-table-column min-width="180px" label="操作" v-if="localPermission.SetupPrintBean">
      <template slot-scope="scope">
        <CtrlMenus
          :canRemove='!scope.row.UseTimes'
          @edit='onEditClick(scope.row, scope.$index)'
          @remove='onRemoveClick(scope.row, scope.$index)'
        />
      </template>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import CtrlMenus from '../../../common/NewComps/CtrlMenus/index.vue';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [tableMixin],
  components: {
    CtrlMenus,
  },
  computed: {
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionManagePrintBean?.Obj) {
        return this.Permission.PermissionList.PermissionManagePrintBean.Obj;
      }
      return {};
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-review-out-file-name-manage-page-wrap > header', 80);
      this.h = tempHeight;
    },
    onEditClick(data, index) {
      this.$emit('edit', data, index);
    },
    onRemoveClick(data, index) {
      this.messageBox.warnCancelBox('确定删除该输出文件吗 ?', `输出文件名称：${data.Name}`, () => {
        this.$emit('remove', data, index);
      }, null);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/var.scss";
.mp-erp-review-output-file-list-page-table-comp-wrap {
  margin-right: 2px;
  border: 1px solid $--border-color-base;
  &.el-table::before {
    display: none;
  }
  .el-table__header-wrapper .el-table__header thead {
    tr {
      th {
        font-size: 14px;
        .cell {
          height: 34px;
          line-height: 34px;
          color: $--color-text-primary;
        }
      }
    }
  }
  .el-table__body-wrapper .el-table__body tbody tr td {
    color: $--color-text-primary;
    &.is-gray > .cell {
      font-size: 12px;
      color: #989898;
    }
    > .cell {
      color: #585858;
      height: 24px;
      line-height: 24px;
    }
  }
}

  .el-tooltip__popper {
    max-width: 400px;
    line-height: 180%;
    // white-space: pre;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 16px;
  }
</style>
