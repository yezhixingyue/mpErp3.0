<template>
  <section class="mp-erp-post-manage-list-page-wrap">
    <header>
      <p class="mp-common-title-wrap">岗位管理</p>
    </header>
    <main>
      <ul>
        <li v-for="(it, i) in JobPermissionsDataList" :key="it.PositionID || it.key">
          <el-input :value="it.PositionName" @input="e => onInput(e, i)" placeholder="" size="small" maxlength="10"></el-input>
          <span class="blue-span" @click="onPermissionSetupClick(it)" v-if="localPermission.SetupPermission">权限设置</span>
          <CtrlMenus :showList="['del', 'add']" @remove='onRemoveClick(it, i)' @add='onAddClick' v-if="localPermission.Setup" />
        </li>
      </ul>
    </main>
    <footer>
      <el-button
        type='primary'
        class="is-blue-button"
        :disabled='!JobPermissionsDataList || JobPermissionsDataList.length === 0'
        v-if="localPermission.Setup"
        @click="onSubmitClick">
       保存
      </el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  name: 'PostManageListPage',
  mixins: [recordScrollPositionMixin('.mp-erp-post-manage-list-page-wrap > main')],
  components: {
    CtrlMenus,
  },
  computed: {
    ...mapState('companyManage', ['JobPermissionsDataList']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionManageJob?.Obj) {
        return this.Permission.PermissionList.PermissionManageJob.Obj;
      }
      return {};
    },
  },
  methods: {
    onInput(value, index) { // 岗位名称修改
      this.$store.commit('companyManage/setJobPermissionsItemNameChange', [value, index]);
    },
    onRemoveClick(item, index) { // 岗位删除
      if (!item.PositionName && !item.PositionID) {
        this.$store.commit('companyManage/setJobPermissionsItemRemove', index);
        return;
      }
      this.messageBox.warnCancelBox('确定删除该岗位吗', item.PositionName ? `岗位名称：[ ${item.PositionName} ]` : '岗位名称为空', () => {
        this.$store.commit('companyManage/setJobPermissionsItemRemove', index);
      });
    },
    onAddClick() { // 添加一行
      const temp = {
        PositionID: '',
        PositionName: '',
        key: Math.random().toString(16).slice(-8),
      };
      this.$store.commit('companyManage/setJobPermissionsItemAdd', temp);
      this.$message.success('已添加至最后一行');
    },
    onPermissionSetupClick({ PositionID }) { // 权限设置
      if (!PositionID) {
        this.messageBox.failSingleError('操作失败', '需要先保存岗位');
        return;
      }
      this.$router.push({ name: 'PostManageSetup', params: { PositionID } });
    },
    onSubmitClick() { // 校验： 1. 岗位名称是否为空 2. ?
      // 处理： 岗位ID为空，保存后的处理
      const t = this.JobPermissionsDataList.find(it => !it.PositionName || it.PositionName.length > 10);
      if (t) {
        this.messageBox.failSingleError('保存失败', '职务名称不能为空且不能超过10个字');
        return;
      }
      this.$store.dispatch('companyManage/getJobSave');
    },
  },
  mounted() {
    this.$store.dispatch('companyManage/getJobPermissionsDataList');
  },
};
</script>
<style lang='scss'>
.mp-erp-post-manage-list-page-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  padding-right: 4px;
  > header {
    flex: none;
    padding: 25px 35px;
  }
  > main {
    flex: 1;
    padding: 0 35px;
    overflow-y: auto;
    box-sizing: border-box;
    min-width: 800px;
    > ul {
      > li {
        font-size: 14px;
        margin-bottom: 12px;
        > .el-input {
          width: 160px;
          input {
            text-align: center;
            padding: 0 8px;
            font-size: 14px;
            color: #585858;
            border-radius: 3px;
            border-color: #aaa;
          }
          margin-right: 65px;
        }
        > .blue-span {
          margin-right: 40px;
        }
        > .ctrl-menus-container {
          > span {
            > i {
              font-size: 14px;
            }
            & + span {
              margin-left: 25px;
            }
          }
        }
      }
    }
  }
  > footer {
    flex: none;
    height: 70px;
    text-align: center;
    padding-top: 30px;
    button {
      width: 120px;
      height: 35px;
      padding: 0;
      border-radius: 3px;
    }
  }
}
</style>
