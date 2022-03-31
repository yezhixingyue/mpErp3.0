<template>
  <div class="mp-erp-staff-manage-detail-and-check-dialog-comp-wrap">
    <CommonDialogComp
      width="700px"
      top="12vh"
      :title="title"
      :visible.sync="visible"
      :showDanger="showRemove"
      :submitText='submitText'
      :showSubmit='!disabled'
      dangerText="删除"
      cancelText='关闭'
      @submit="onSetJobClick"
      @danger="onRemove"
      @cancle="visible = false"
      @open="onOpen"
      @closed="onClosed"
      @close='onClose'
      class="detail-and-check-dialog-wrap"
    >
      <!-- 内容区 -->
      <DetailDisplayComp :detailData='editData' />
    </CommonDialogComp>
    <SetJobDialog
      v-model="setJobVisible"
      :list="editData ? editData.PositionList : []"
      :departmentList='departmentList'
      :jobPermissionsList='jobPermissionsList'
      @submit="submit"
     />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CommonDialogComp from '@/packages/CommonDialogComp';
import { StaffStatusEnumObj } from '../../../assets/js/TypeClass/StaffManage/enums';
import DetailDisplayComp from './DetailDisplayComp.vue';
import SetJobDialog from './SetJobDialog.vue';
import Staff from '../../../assets/js/TypeClass/StaffManage/Staff';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    curStaffData: {
      type: Object,
      default: null,
    },
    curIndex: {
      type: Number,
      default: -1,
    },
    departmentList: {
      type: Array,
      default: () => [],
    },
    jobPermissionsList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
    DetailDisplayComp,
    SetJobDialog,
  },
  data() {
    return {
      editData: null,
      setJobVisible: false,
    };
  },
  computed: {
    ...mapState('common', ['Permission']),
    localPermission() {
      return this.Permission?.PermissionList?.PermissionManageStaffBase?.Obj || {};
    },
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    title() {
      if (!this.editData) return '';
      let _title = '';
      switch (this.editData.Status) {
        case StaffStatusEnumObj.pending.ID:
          _title = '审核员工';
          break;

        default:
          _title = '员工详情';
          break;
      }
      return _title;
    },
    submitText() {
      if (!this.editData) return '';
      let _title = '';
      switch (this.editData.Status) {
        case StaffStatusEnumObj.pending.ID:
          _title = '通过';
          break;

        default:
          _title = '设置岗位';
          break;
      }
      return _title;
    },
    showRemove() {
      return this.editData && this.editData.Status === StaffStatusEnumObj.pending.ID;
    },
    disabled() { // 离职状态时禁止设置岗位
      return this.editData?.Status === StaffStatusEnumObj.leaved.ID || !this.localPermission.Check;
    },
  },
  methods: {
    onOpen() {
      this.editData = JSON.parse(JSON.stringify(this.curStaffData));
    },
    onClose() {
      if (this.setJobVisible) this.setJobVisible = false;
    },
    onClosed() {
      this.editData = null;
    },
    onSetJobClick() { // 设置岗位 -- 需要把当前用户信息传入到审核人信息中 --- 如果没有就加上  如果有就不改变
      this.setJobVisible = true;
    },
    onRemove() {
      this.messageBox.warnCancelBox('确定要删除员工吗 ?', `删除员工：${this.editData.StaffName}`, () => {
        this.$emit('remove', { item: this.editData, index: this.curIndex });
      }, null);
    },
    submit(PositionList) { // 审核或修改岗位
      const temp = { ...this.curStaffData, PositionList };
      this.$emit('submit', new Staff(temp));
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-staff-manage-detail-and-check-dialog-comp-wrap {
  .detail-and-check-dialog-wrap {
    .el-dialog__body {
      min-height: 480px;
      display: flex;
      padding: 20px;
      padding-bottom: 5px;
    }
  }
  .staff-set-job-dialog-wrap {
    .el-dialog__body {
      padding-left: 22px;
      min-height: 200px;
      max-height: 300px;
      overflow: auto;
      .content-list {
        > li {
          margin-bottom: 34px;
          > .mp-common-comps-area-select-wrap {
            > li {
              margin-right: 20px;
              &.first-select-box .el-input__inner {
                width: 120px;
              }
              &.text {
                margin-right: 5px;
                position: relative;
                top: -3px;
              }
            }
          }
          > div.bt {
            display: flex;
            align-items: center;
            margin-top: 16px;
            .ctrl-menus-container {
              margin-left: 20px;
              position: relative;
              top: -1px;
            }
            .mp-common-comps-order-channel-selector-wrap > header {
              margin-right: 5px;
              position: relative;
              top: -3px;
            }
          }
          .el-input__inner {
            border-radius: 0;
            width: 120px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
