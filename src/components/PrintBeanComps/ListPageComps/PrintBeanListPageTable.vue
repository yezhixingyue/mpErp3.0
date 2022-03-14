<template>
  <el-table
    class="mp-print-bean-list-page-main-table-comp-wrap"
    :max-height="h"
    :height="h"
    fit
    :data="localDataList"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column min-width="160px" prop="Title" show-overflow-tooltip label="标题"></el-table-column>
    <el-table-column min-width="180px" prop="Describe" show-overflow-tooltip label="描述"></el-table-column>
    <el-table-column width="85px"  label="优先级">
      <template slot-scope="scope">{{scope.row.Priority}}级</template>
    </el-table-column>
    <el-table-column width="180px" prop="_TimeContent" show-overflow-tooltip label="时间范围"></el-table-column>
    <el-table-column width="185px" prop="_CustomerContent" show-overflow-tooltip label="客户名称"></el-table-column>
    <el-table-column width="170px" prop="_CusotomerTypeContent" show-overflow-tooltip label="客户类型"></el-table-column>
    <el-table-column width="170px" prop="_CusotomerGradeContent" show-overflow-tooltip label="客户等级"></el-table-column>
    <el-table-column width="230px" label="销售区域">
      <template slot-scope="scope">
        <TableItemShowComp :list='scope.row._AreaContent' effect='dark' />
      </template>
    </el-table-column>

    <el-table-column width="220px" label="操作" v-if="localPermission.SetupPrintBean">
      <template slot-scope="scope">
        <CtrlMenus
          @edit='onEditClick(scope.row)'
          @remove='onRemoveClick(scope.row, scope.$index)'
          :canRemove='scope.row._canRemove'
        />
      </template>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import { getSelectedContentBySelectedDataAndAllData } from '@/components/common/SelectorComps/NewAreaTreeSpreadComp/utils';
import TableItemShowComp from '@/components/common/SelectorComps/NewAreaTreeSpreadComp/TableItemShowComp';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';

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
    TableItemShowComp,
    CtrlMenus,
  },
  computed: {
    ...mapState('common', ['userTypeList', 'userRankList']),
    ...mapGetters('common', ['allAreaTreeList']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionManagePrintBean?.Obj) {
        return this.Permission.PermissionList.PermissionManagePrintBean.Obj;
      }
      return {};
    },
    localDataList() {
      if (!Array.isArray(this.list)) return [];
      return this.list.map(it => ({
        ...it,
        _TimeContent: this.getTimeContent(it),
        _AreaContent: this.getAreaContent(it),
        _CustomerContent: this.getCustomerContent(it),
        _CusotomerTypeContent: this.getCusotomerTypeContent(it.CustomerTypeList, this.userTypeList),
        _CusotomerGradeContent: this.getCusotomerTypeContent(it.GradeList, this.userRankList),
        _canRemove: this.getCanRemove(it.StartTime),
      }));
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-print-bean-list-page-wrap > header', 55);
      this.h = tempHeight;
    },
    onEditClick(data) {
      this.$emit('edit', data.ID);
    },
    onRemoveClick(data, index) {
      this.messageBox.warnCancelBox('确定删除该条设置吗 ?', `标题：${data.Title}`, () => {
        this.$emit('remove', [data, index]);
      }, null);
    },
    getAreaContent(item) {
      if ((!item.AreaList || item.AreaList.length === 0) && !item.IsIncludeIncreasedArea) return '';
      const temp = { List: item.AreaList, IsIncludeIncreased: item.IsIncludeIncreasedArea };
      const content = getSelectedContentBySelectedDataAndAllData(temp, this.allAreaTreeList);
      return content;
    },
    getTimeContent({ StartTime, EndTime }) {
      const start = StartTime && StartTime.length >= 10 ? StartTime.slice(0, 10) : '';
      const end = EndTime && EndTime.length >= 10 ? EndTime.slice(0, 10) : '';
      if (start && end) {
        return `${start}至${end}`;
      }
      if (start && !EndTime) {
        return `${start}（长期执行）`;
      }
      return '';
    },
    getCustomerContent({ Customer }) {
      if (Customer) {
        const { CustomerName, CustomerSN } = Customer;
        return `${CustomerName}${CustomerName && CustomerSN ? '(' : ''}${CustomerSN}${CustomerName && CustomerSN ? ')' : ''}`;
      }
      return '';
    },
    getCusotomerTypeContent(idArr, list) {
      if (Array.isArray(idArr) && idArr.length > 0) {
        const ids = idArr.map(it => it.ID);
        const arr = this.$utils.getNameFromListByIDs(ids, list, { label: 'CategoryName', value: 'CategoryID' });
        return Array.isArray(arr) ? arr.join('、') : arr;
      }
      return '';
    },
    getCanRemove(StartTime) {
      return new Date(StartTime).getTime() > Date.now();
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/common/var.scss";
.mp-print-bean-list-page-main-table-comp-wrap {
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
