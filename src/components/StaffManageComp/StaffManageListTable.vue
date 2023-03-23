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
    <el-table-column width="100px" prop="RosterID" show-overflow-tooltip label="花名">
      <span slot-scope="scope">{{getCanUseName(scope.row.RosterID)}}</span>
    </el-table-column>
    <el-table-column width="120px" prop="Mobile" show-overflow-tooltip label="手机号"></el-table-column>
    <el-table-column width="160px" prop='IDCard' show-overflow-tooltip label="身份证号"></el-table-column>
    <el-table-column width="70px" prop="_gender" show-overflow-tooltip label="性别"></el-table-column>
    <el-table-column width="85px" prop="_EducationText" show-overflow-tooltip label="学历"></el-table-column>
    <el-table-column min-width="120px" prop="_address" show-overflow-tooltip label="籍贯"></el-table-column>
    <el-table-column width="100px" prop="_Birthday" show-overflow-tooltip label="出生日期"></el-table-column>
    <el-table-column width="100px" prop="_JoinDate" show-overflow-tooltip label="入职日期"></el-table-column>
    <el-table-column min-width="160px" prop="_department" label="部门岗位">
      <span slot-scope="scope" :title="scope.row._department.replaceAll(' | ', '\r\n')">{{scope.row._department}}</span>
    </el-table-column>
    <el-table-column width="80px" prop="_statusText" show-overflow-tooltip label="状态">
      <!-- <span slot-scope="scope" :class="scope.row._class">{{scope.row._statusText}}</span> -->
    </el-table-column>
    <el-table-column width="80px" prop="CheckUser.StaffName" show-overflow-tooltip label="审核人"></el-table-column>

    <el-table-column :width="lastColWidth" label="操作" v-if="maxMenuLen">
      <div class="menus" slot-scope="scope">
        <CtrlMenus
         :showList="scope.row._icons.filter(it => ['detail', 'check'].includes(it))"
         :isDimission='scope.row._isDimission'
         :canRemove='scope.row._canRemove'
         @detail='onDetailClick(scope.row, scope.$index)'
         @check='onCheckClick(scope.row, scope.$index)'
         @dimission='onDimissionClick(scope.row, scope.$index)'
         @edit='onEditClick(scope.row)'
         @remove='onRemoveClick(scope.row, scope.$index)'
         />
        <el-dropdown trigger="click" placement="bottom"
         :disabled="scope.row._icons.filter(it => !['detail', 'check'].includes(it)).length === 0" @command="(e) => oncommand(e, scope.row, scope.$index)">
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
            更多
          </span>
          <el-dropdown-menu slot="dropdown" class="mp-erp-staff-manage-list-table-menu-dropdown-box">
            <el-dropdown-item v-if="scope.row._icons.includes('dimission')" command="dimission">
              <img v-if="!scope.row._isDimission" src="@/assets/images/dimission.png" alt="">
              <img v-else src="@/assets/images/regain.png" alt="">
              <span>{{ scope.row._isDimission ? '取消离职' : '离职' }}</span>
            </el-dropdown-item>
            <el-dropdown-item v-if="scope.row._icons.includes('edit')" command="edit">
              <img src="@/assets/images/Compile.png" alt="">
              <span>编辑</span>
            </el-dropdown-item>
            <el-dropdown-item :disabled="!scope.row._canRemove" command="del" v-if="scope.row._icons.includes('del')">
              <img src="@/assets/images/del.png" alt="">
              <span>删除</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import api from '@/api';
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
  data() {
    return {
      RosterDataList: [],
    };
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
        _IntranetContent: it.UseIntranet ? '仅限内部网络' : '不限',
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
    maxMenuLen() {
      const lens = this.localDataList.map(it => it._icons.length);
      return lens.length > 0 ? Math.max(...lens) : 0;
    },
    lastColWidth() {
      // if (this.maxMenuLen >= 4) return '310px';
      // if (this.maxMenuLen === 3) return '240px';
      // if (this.maxMenuLen === 2) return '160px';
      // if (this.maxMenuLen === 1) return '120px';
      return '185px';
    },
    getCanUseName() {
      return (id) => {
        const temp = this.RosterDataList.filter(it => it.RosterID === id);
        return temp[0]?.Nickname;
      };
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
      const list = [];
      if (this.localPermission.Edit) {
        list.push('edit');
      }
      if (this.localPermission.Delete) {
        list.push('del');
      }
      if (it.Status === StaffStatusEnumObj.pending.ID) {
        if (this.localPermission.Check) list.push('check');
      } else {
        if (this.localPermission.ViewStaffDetail) {
          list.push('detail');
        }
        if (this.localPermission.Dimission) {
          list.push('dimission');
        }
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
      console.log(item);
      this.$emit('edit', { item, id: item.StaffID });
    },
    onRemoveClick(item, index) {
      this.messageBox.warnCancelBox('确定要删除员工吗 ?', `删除员工：${item.StaffName}`, () => {
        this.$emit('remove', { item, index });
      }, null);
    },
    oncommand(command, item, index) {
      switch (command) {
        case 'dimission':
          this.onDimissionClick(item, index);
          break;

        case 'edit':
          this.onEditClick(item);
          break;

        case 'del':
          this.onRemoveClick(item, index);
          break;

        default:
          break;
      }
    },
  },
  mounted() {
    api.getRosterDataList().then(res => {
      if (res?.data?.Data) {
        this.RosterDataList = res.data.Data;
      }
    });
  },
};
</script>

<style lang="scss">
@import "@/assets/css/var.scss";
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
        .ctrl-menus-container {
          margin-right: 30px;
          > span {
            &.em-4 {
              margin-right: -24px;
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

        .el-dropdown {
          .el-dropdown-link {
            font-size: 12px;
            margin-right: 0px;
            font-size: 12px;
            line-height: 23px;
            > i {
              font-size: 15px;
              transform: rotateZ(90deg);
              font-size: 14px;
              vertical-align: -1px;
              color: #989898;
            }

            &:not([disabled]) {
              color: #989898;
              cursor: pointer;
              > i {
                color: #989898;
              }
              &:hover {
                color: #585858;
              }
            }
            &[disabled] {
              visibility: hidden;
              margin-left: -20px;
            }
          }
        }
      }
    }
  }
}
.mp-erp-staff-manage-list-table-menu-dropdown-box.el-popper {
  overflow: visible;
  width: auto;
  > li {
    font-size: 12px;
    display: flex;
    align-items: center;

    img {
      margin-right: 8px;
    }

    &.is-disabled {
      cursor: not-allowed;
      filter: grayscale(1);
      opacity: 0.7;
    }
  }
  > div {
    display: block !important;
    &::after {
      display: block !important;
    }
  }
  &[x-placement^=bottom] {
    margin-top: 12px;
  }
}
</style>
