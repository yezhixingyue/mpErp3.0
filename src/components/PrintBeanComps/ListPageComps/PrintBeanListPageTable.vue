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
    <el-table-column min-width="170px" prop="Title" show-overflow-tooltip label="标题"></el-table-column>
    <!-- <el-table-column min-width="180px" prop="Describe" show-overflow-tooltip label="描述"></el-table-column> -->
    <el-table-column width="85px"  label="优先级">
      <template slot-scope="scope">{{scope.row.Priority}}级</template>
    </el-table-column>
    <el-table-column width="240px" prop="_TimeContent" show-overflow-tooltip label="时间范围" class-name='left'></el-table-column>
    <el-table-column width="185px" prop="_CustomerContent" show-overflow-tooltip label="客户名称"></el-table-column>
    <el-table-column min-width="170px" prop="_CusotomerTypeContent" show-overflow-tooltip label="客户类型"></el-table-column>
    <el-table-column min-width="170px" prop="_CusotomerGradeContent" show-overflow-tooltip label="客户等级"></el-table-column>
    <el-table-column min-width="220px" label="销售区域" class-name='left'>
      <template slot-scope="scope">
        <TableItemShowComp :list='scope.row._AreaContent' effect='dark' />
      </template>
    </el-table-column>

    <el-table-column width="220px" label="操作" v-if="localPermission.SetupPrintBean">
      <template slot-scope="scope">
        <CtrlMenus
          @edit='onEditClick(scope.row)'
          @remove='onRemoveClick(scope.row, scope.$index)'
          :canRemove='scope.row._canRemove && !removeDisabledIDs.includes(scope.row.ID)'
          :canEdit='scope.row._canEdit && !editDisabledIDs.includes(scope.row.ID)'
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
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import TableItemShowComp from '../../common/SelectorComps/NewAreaTreeSpreadComp/TableItemShowComp.vue';

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
        _canRemove: this.getCanRemove(it),
        _canEdit: this.getCanEdit(it.EndTime),
      }));
    },
  },
  data() {
    return {
      editDisabledIDs: [],
      removeDisabledIDs: [],
    };
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-print-bean-list-page-wrap > header', 55);
      this.h = tempHeight;
    },
    onEditClick(data) {
      if (data.EndTime && new Date(data.EndTime).getTime() <= Date.now()) {
        const cb = () => {
          this.editDisabledIDs.push(data.ID);
        };
        this.messageBox.failSingleError('编辑失败', '该条设置已过期', cb, cb);
        return;
      }
      this.$emit('edit', data.ID);
    },
    onRemoveClick(data, index) {
      if (new Date(data.StartTime).getTime() <= Date.now()) {
        const cb = () => {
          this.removeDisabledIDs.push(data.ID);
        };
        this.messageBox.failSingleError('删除失败', '该条设置已开始生效', cb, cb);
        return;
      }
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
      const func = str => {
        if (!str) return '';
        const [date, time] = str.split('T');
        if (date && time) {
          return `${date} ${time.slice(0, 5)}`;
        }
        return '';
      };
      const start = func(StartTime);
      const end = func(EndTime);
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
    getCanRemove({ StartTime }) {
      return new Date(StartTime).getTime() > Date.now();
    },
    getCanEdit(EndTime) {
      return !EndTime || new Date(EndTime).getTime() > Date.now();
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
    &.left {
      text-align: left;
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
