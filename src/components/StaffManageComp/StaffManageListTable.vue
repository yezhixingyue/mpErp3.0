<template>
  <el-table
    class="mp-erp-staff-manage-list-page-main-table-comp-wrap"
    :max-height="h"
    :height="h"
    fit
    :data="localDataList"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column width="100px" prop="StaffName" show-overflow-tooltip label="姓名"></el-table-column>
    <el-table-column width="120px" prop="Mobile" show-overflow-tooltip label="手机号"></el-table-column>
    <el-table-column width="160px" prop='IDCard' show-overflow-tooltip label="身份证号"></el-table-column>
    <el-table-column width="70px" prop="_gender" show-overflow-tooltip label="性别"></el-table-column>
    <el-table-column width="85px" prop="_EducationText" show-overflow-tooltip label="学历"></el-table-column>
    <el-table-column width="140px" prop="_address" show-overflow-tooltip label="籍贯"></el-table-column>
    <el-table-column width="100px" prop="_Birthday" show-overflow-tooltip label="出生日期"></el-table-column>
    <el-table-column width="100px" prop="_JoinDate" show-overflow-tooltip label="入职日期"></el-table-column>
    <el-table-column min-width="160px" prop="_department" label="部门岗位">
      <span slot-scope="scope" :title="scope.row._department.replaceAll(' | ', '\r\n')">{{scope.row._department}}</span>
    </el-table-column>
    <el-table-column width="80px" prop="_statusText" show-overflow-tooltip label="状态">
      <!-- <span slot-scope="scope" :class="scope.row._class">{{scope.row._statusText}}</span> -->
    </el-table-column>
    <el-table-column width="80px" prop="CheckUser.StaffName" show-overflow-tooltip label="审核人"></el-table-column>

    <el-table-column width="310px" label="操作">
      <div class="menus" slot-scope="scope">
        <CtrlMenus
         :showList="scope.row._icons"
         :isDimission='scope.row._isDimission'
         :canRemove='scope.row._canRemove'
         @detail='onDetailClick(scope.row, scope.$index)'
         @check='onCheckClick(scope.row, scope.$index)'
         @dimission='onDimissionClick(scope.row, scope.$index)'
         @edit='onEditClick(scope.row)'
         @remove='onRemoveClick(scope.row, scope.$index)'
         />
      </div>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import { SexEnumObj, StaffStatusEnumObj, EducationEnumList, StaffStatusEnumList } from '../../assets/js/TypeClass/StaffManage/enums';
import CtrlMenus from '../common/NewComps/CtrlMenus/index.vue';

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
    departmentLevelList: {
      type: Array,
      default: () => [],
    },
  },
  mixins: [tableMixin],
  components: {
    CtrlMenus,
  },
  computed: {
    ...mapState('common', ['Permission']),
    ...mapGetters('common', ['allAdAreaTreeList']),
    localPermission() {
      return this.Permission?.PermissionList?.PermissionManageStaffBase?.Obj || {};
    },
    localDataList() {
      if (!Array.isArray(this.list)) return [];
      return this.list.map(it => ({
        ...it,
        _gender: it.Sex === SexEnumObj.male.ID ? '男' : '女',
        _EducationText: this.formatEnumName(it.Education, EducationEnumList),
        _address: this.getAddressContent(it.LinkArea, this.allAdAreaTreeList),
        _Birthday: this.formatDate(it.TimeRecord?.Birthday),
        _JoinDate: this.formatDate(it.TimeRecord?.JoinDate),
        _department: this.formatDepartment(it, this.departmentLevelList),
        _statusText: this.formatEnumName(it.Status, StaffStatusEnumList),
        _icons: this.getIconList(it),
        _isDimission: it.Status === StaffStatusEnumObj.leaved.ID,
        _canRemove: it.Status === StaffStatusEnumObj.pending.ID,
        _class: this.getItemDisplayClass(it.Status),
      }));
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-staff-manage-list-page-wrap > header', 58);
      this.h = tempHeight;
    },
    formatEnumName(id, list) {
      const t = list.find(it => it.ID === id);
      return t ? t.Name : '';
    },
    getAddressContent({ RegionalID, CityID }, list) {
      const Regional = list.find(it => it.ID === RegionalID);
      if (Regional) {
        const City = Regional.children.find(it => it.ID === CityID);
        if (City) return `${Regional.Name}${City.Name}`;
      }
      return '';
    },
    formatDate(date) {
      if (date && date.includes('T')) {
        return date.split('T')[0];
      }
      return '';
    },
    formatDepartment({ PositionList }, departmentLevelList) {
      if (Array.isArray(PositionList) && PositionList.length > 0) {
        const list = PositionList.map(({ First, Second }) => {
          const { FirstDepartmentID, SecondDepartmentID, ThirdDepartmentID } = First;
          const { PositionName } = Second;
          let str = '';
          const _getDepartmentName = (id, _list) => {
            if ((!id && id !== 0) || id === -666 || !Array.isArray(_list)) return undefined;
            const t = _list.find(it => it.ID === id);
            return t && { ClassName: t.ClassName, arr: t.children };
          };
          const f = _getDepartmentName(FirstDepartmentID, departmentLevelList);
          if (f) {
            str += f.ClassName;
            const s = _getDepartmentName(SecondDepartmentID, f.arr);
            if (s) {
              str += `-${s.ClassName}`;
              const third = _getDepartmentName(ThirdDepartmentID, s.arr);
              if (third) {
                str += `-${third.ClassName}`;
              }
            }
          }
          return [str, PositionName].filter(it => it).join(' ');
        });
        return list.filter(it => it).join(' | ');
      }
      return '';
    },
    getIconList(it) {
      const list = ['edit', 'del'];
      if (it.Status === StaffStatusEnumObj.pending.ID) {
        list.push('check');
      } else {
        list.push('detail', 'dimission');
      }
      return list;
    },
    getItemDisplayClass(Status) {
      return {
        'is-pink': Status === StaffStatusEnumObj.pending.ID,
        'is-success': Status === StaffStatusEnumObj.approved.ID,
        'is-font-size-12': true,
      };
    },
    onDetailClick(item, index) {
      this.$emit('detail', { item, index });
    },
    onCheckClick(item, index) {
      this.$emit('check', { item, index });
    },
    onDimissionClick(item, index) { // 离职|取消离职
      let title;
      let msg;
      let expectStatus;
      if (item._isDimission) { // 取消离职
        title = '确定要取消离职吗 ?';
        msg = `取消离职：${item.StaffName}`;
        expectStatus = StaffStatusEnumObj.approved.ID;
      } else { // 设置离职
        title = '确定设为离职状态吗 ?';
        msg = `员工离职：${item.StaffName}`;
        expectStatus = StaffStatusEnumObj.leaved.ID;
      }
      this.messageBox.warnCancelBox(title, msg, () => {
        this.$emit('dimission', { item, expectStatus, index });
      }, null);
    },
    onEditClick(item) {
      this.$emit('edit', { item, id: item.StaffID });
    },
    onRemoveClick(item, index) {
      this.messageBox.warnCancelBox('确定要删除员工吗 ?', `删除员工：${item.StaffName}`, () => {
        this.$emit('remove', { item, index });
      }, null);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/common/var.scss";
.mp-erp-staff-manage-list-page-main-table-comp-wrap {
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
      font-size: 13px;
    }
    > .cell {
      color: #585858;
      height: 24px;
      line-height: 24px;
      font-size: 13px;
      .menus {
        text-align: right;
        padding-right: 16px;
        .ctrl-menus-container > span {
          &.em-4 {
            margin-right: -21px;
            i {
              display: inline-block;
              width: 4em;
              text-align: left;
            }
          }
          & + span {
            margin-left: 28px;
          }
        }
      }
    }
  }
}

</style>
