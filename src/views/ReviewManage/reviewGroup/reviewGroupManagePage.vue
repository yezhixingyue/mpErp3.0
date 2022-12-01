<template>
  <section class="mp-erp-review-group-manage-list-page-wrap">
    <header>
      <el-button type="primary" @click="onItemEditClick([null, -1])" v-if="localPermission.GroupSetup">添加分组</el-button>
      <span class="red-span is-bold ml-20" @click="onStrongBackListClick" v-if="localPermission.QueryForcedExit">强退人员名单</span>
    </header>
    <main>
      <GroupTable :list="reviewGroupList" :loading="loading" @edit="onItemEditClick" @remove="onItemRemoveClick" @member="onMemberViewClick" />
      <GroupEditDialog :visible.sync="visible" :item="curEditItem" @success="handleSaveSuccess" :list="reviewGroupList" />
    </main>
    <footer>
      <span>共检索出 <i class="is-blue is-bold">{{reviewGroupListNumber}}</i> 条记录</span>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import GroupEditDialog from '../../../components/ReviewComps/ReviewGroup/GroupListPage/GroupEditDialog.vue';
import GroupTable from '../../../components/ReviewComps/ReviewGroup/GroupListPage/GroupTable.vue';

export default {
  name: 'reviewGroupManagePage',
  mixins: [recordScrollPositionMixin('.mp-erp-review-group-manage-list-page-wrap .el-table__body-wrapper')],
  components: {
    GroupEditDialog,
    GroupTable,
  },
  data() {
    return {
      curEditItem: null,
      visible: false,
    };
  },
  computed: {
    ...mapState('review', ['reviewGroupList', 'reviewGroupListNumber', 'loading']),
    ...mapState('common', ['Permission']),
    localPermission() { // localPermission.Setup
      return this.Permission?.PermissionList?.PermissionCheckFileMemberGroup?.Obj || {};
    },
  },
  methods: {
    onItemEditClick([item, index]) {
      this.curEditItem = item;
      this.curIndex = index;
      this.visible = true;
    },
    handleSaveSuccess(item) { // 添加|修改 成功
      this.$store.commit('review/setReviewGroupItemChange', { item, index: this.curIndex });
    },
    onItemRemoveClick([item, index]) { // 删除
      this.$store.dispatch('review/getMemberGroupRemove', [item, index]);
    },
    onMemberViewClick(id) { // 查看成员
      this.$router.push({ name: 'reviewGroupMembers', params: { id } });
    },
    onStrongBackListClick() { // 强退人员名单
      this.$router.push('/ForceExitRecord');
    },
  },
  mounted() {
    this.$store.dispatch('review/getReviewGroupList');
  },
};
</script>
<style lang='scss'>
.mp-erp-review-group-manage-list-page-wrap {
  font-size: 14px;
  // padding-left: 25px;
  // padding-right: 25px;
  background-color: #f5f5f5;
  padding-left: 8px;
  > header {
    padding: 16px 20px;
    white-space: nowrap;
    background-color: #fff;
    .el-button {
      width: 120px;
      height: 30px;
      padding: 0;
    }
    margin-bottom: 8px;
  }
  > footer {
    text-align: right;
    padding-right: 5px;
    height: 40px;
    line-height: 40px;
    color: #444;
    background-color: #fff;
  }
}
</style>
