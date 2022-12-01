<template>
  <section class="mp-erp-review-group-members-manage-list-page-wrap">
    <header>
      <Crumbs :list="crumbsList" />
      <div class="c">
        <el-button type="primary" @click="onAddClick" v-if="localPermission.MemberSetup">添加成员</el-button>
        <span class="is-bold is-blue">当前组：{{curGroup && curGroup.Name ? curGroup.Name : ''}}</span>
        <p class="tips-box">
          <i class="el-icon-warning"></i>
          <span>注：括号内的数字表示已分配给当前该成员但还未审稿的订单数量</span>
        </p>
      </div>
    </header>
    <main>
      <MemberMainTable :list="MemberList" :loading="loading" @remove="onItemRemove" :hasPermission="localPermission.MemberSetup" />
      <MemberAddDialog v-if="curGroup" :visible.sync="visible" :group="curGroup" :existIds="MemberList.map(it => it.ID)" @submit="submit" />
    </main>
    <footer>
      <span class="s">
        <i class="online status-box "></i>
        在线
      </span>
      <span class="s">
        <i class="ing status-box"></i>
        分配正常
      </span>
      <span class="s">
        <i class="stop status-box"></i>
        停止分配（或未开始分配）
      </span>
      <p>
        <el-button class="cancel-blue-btn" @click="$goback">返回</el-button>
      </p>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import Crumbs from '../../../components/common/NewComps/Crumbs.vue';
import MemberMainTable from '../../../components/ReviewComps/ReviewGroup/Members/MemberMainTable.vue';
import MemberAddDialog from '../../../components/ReviewComps/ReviewGroup/Members/MemberAddDialog.vue';

export default {
  name: 'reviewGroupMembersManagePage',
  mixins: [recordScrollPositionMixin('.mp-erp-review-group-members-manage-list-page-wrap .el-table__body-wrapper')],
  components: {
    Crumbs,
    MemberMainTable,
    MemberAddDialog,
  },
  computed: {
    ...mapState('review', ['reviewGroupList']),
    ...mapState('common', ['Permission']),
    localPermission() {
      return this.Permission?.PermissionList?.PermissionCheckFileMemberGroup?.Obj || {};
    },
    curGroup() {
      return this.reviewGroupList.find(it => it.ID === this.id);
    },
  },
  data() {
    return {
      crumbsList: [
        { name: '人员分组', path: '/reviewGroupManage' },
        { name: '查看组成员' },
      ],
      id: '',
      loading: false,
      MemberList: [],
      MemberListNumber: 0,
      visible: false,
    };
  },
  methods: {
    async getMemberGroupMemberList() {
      if (!this.id) return;
      this.loading = true;
      this.MemberList = [];
      const resp = await this.api.getMemberGroupMemberList(this.id).catch(() => null);
      this.loading = false;
      if (resp && resp.data.Status === 1000) {
        this.MemberList = resp.data.Data;
        this.MemberListNumber = resp.data.DataNumber;
      }
    },
    onAddClick() {
      this.visible = true;
    },
    async submit([temp, newList]) { // 添加成员提交
      const resp = await this.api.getMemberGroupAddMember(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          // 1. 修改当前数据（ 当前页面、仓库列表数据 ）  2. 关闭弹窗
          this.MemberList.push(...newList);
          const number = newList.length;
          const OnlineChangeNumber = newList.filter(it => it.IsOnline).length;
          const StopDistributionChangeNumber = newList.filter(it => it.IsDistributionSuspended).length;
          this.MemberListNumber += number;
          this.$store.commit('review/changeReviewGroupItemNumber', {
            id: this.id,
            number,
            OnlineChangeNumber,
            StopDistributionChangeNumber,
          });
          this.visible = false;
        };
        this.messageBox.successSingle('添加成功', cb, cb);
      }
    },
    async onItemRemove(item) {
      const groupID = this.id;
      const staffID = item.ID;
      const resp = await this.api.getMemberGroupRemoveMember(groupID, staffID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          // 1. 修改当前数据（ 当前页面、仓库列表数据 ）
          this.MemberList = this.MemberList.filter(it => it.ID !== staffID);
          this.MemberListNumber -= 1;
          this.$store.commit('review/changeReviewGroupItemNumber', {
            id: this.id,
            number: -1,
            OnlineChangeNumber: item.IsOnline ? -1 : 0, // 字段需要修改 ?
            StopDistributionChangeNumber: item.IsDistributionSuspended ? -1 : 0,
          });
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    this.getMemberGroupMemberList();
  },
};
</script>
<style lang='scss'>
.mp-erp-review-group-members-manage-list-page-wrap {
  padding-left: 30px;
  padding-right: 30px;
  font-size: 14px;
  > header {
    padding: 8px 0;
    padding-bottom: 16px;
    > .c {
      display: flex;
      align-items: center;
      margin-top: 10px;
      > .el-button {
        width: 120px;
        height: 30px;
        padding: 0;
        margin-right: 20px;
      }
      > .is-bold {
        margin-right: 15px;
      }
      > .tips-box {
        width: 405px;
      }
    }
  }
  > main {
    width: 866px;
  }
  > footer {
    padding-top: 22px;
    > .s {
      margin-right: 25px;
      color: #444;
      font-weight: 700;
      > i {
        vertical-align: -2px;
        margin-right: 2px;
      }
    }
    > p {
      text-align: center;
      width: 860px;
      margin-top: 30px;
      button {
        width: 120px;
        height: 35px;
        padding: 0;
        border-radius: 3px;
      }
    }
  }
  .status-box {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    &.ing {
      background: #A1EAE8;
    }
    &.stop {
      background: #F4A307;
    }
    &.online {
      background-color: #70B603;
    }
  }
}
</style>
