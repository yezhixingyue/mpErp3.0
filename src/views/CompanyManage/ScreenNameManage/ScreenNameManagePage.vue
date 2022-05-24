<template>
  <section class="mp-erp-post-manage-list-page-wrap">
    <header>
      <p class="mp-common-title-wrap">花名管理</p>
    </header>
    <main>
      <ul>
        <li v-if="!RosterDataList.length">
          <span style="display: inline-block;width:300px"></span>
          <CtrlMenus :showList="['add']"  @add='onAddClick' v-if="localPermission.Setup" />
        </li>
        <li v-for="(it, i) in RosterDataList" :key="it.PositionID || it.key">
          <el-input :value="it.Nickname" @input="e => onInput('Nickname', e, i)" placeholder="请输入花名" size="small" maxlength="20"></el-input>
          <el-input :value="it.ContactWay" @input="e => onInput('ContactWay', e, i)" placeholder="请输入工作电话" size="small" maxlength="15"></el-input>
          <el-input :value="it.QQ " @input="e => onInput('QQ', e, i)" placeholder="请输入工作QQ" size="small" maxlength="11"></el-input>
          <CtrlMenus :showList="['del', 'add']"  @remove='onRemoveClick(it, i)' @add='onAddClick' v-if="localPermission.Setup" />
        </li>
      </ul>
    </main>
    <footer>
      <el-button
        type='primary'
        class="is-blue-button"
        :disabled='!RosterDataList || RosterDataList.length === 0'
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
  data() {
    return {
      value1: 100,
      removeIds: [],
    };
  },
  name: 'PostManageListPage',
  mixins: [recordScrollPositionMixin('.mp-erp-post-manage-list-page-wrap > main')],
  components: {
    CtrlMenus,
  },
  computed: {
    ...mapState('companyManage', ['RosterDataList']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionManageJob?.Obj) {
        return this.Permission.PermissionList.PermissionManageJob.Obj;
      }
      return {};
    },
  },
  methods: {
    onInput(key, value, index) { // 花名修改
      this.$store.commit('companyManage/setRosterDataItemNameChange', [key, value, index]);
    },
    onRemoveClick(item, index) { // 花名删除
      if (!item.RosterID && !item.Nickname) {
        this.$store.commit('companyManage/setRosterDataItemRemove', index);
        return;
      }
      this.messageBox.warnCancelBox('确定删除该花名吗', item.Nickname ? `花名：[ ${item.Nickname} ]` : '花名名称为空', () => {
        this.$store.commit('companyManage/setRosterDataItemRemove', index);
        this.removeIds.push(item.RosterID);
      });
    },
    onAddClick() { // 添加一行
      const temp = {
        RosterID: '',
        Nickname: '',
        ContactWay: '',
        QQ: '',
        key: Math.random().toString(16).slice(-8),
      };
      this.$store.commit('companyManage/setRosterDataItemAdd', temp);
      this.$message.success('已添加至最后一行');
    },
    onSubmitClick() { // 校验： 1. 花名名称是否为空 2. ?
      // 处理： 花名ID为空，保存后的处理
      const t = this.RosterDataList.find(it => !it.Nickname || it.Nickname.length > 20);
      if (t) {
        this.messageBox.failSingleError('保存失败', '花名不能为空且不能超过20个字');
        return;
      }
      // 和每一项的名字对比
      const temp = this.RosterDataList.filter(element => this.RosterDataList.filter(it => it.Nickname === element.Nickname).length > 1);
      if (temp.length) {
        this.messageBox.failSingleError('保存失败', '花名不能重复');
        return;
      }
      this.$store.dispatch('companyManage/getRosterDataSave');
    },
  },
  mounted() {
    this.$store.dispatch('companyManage/getRosterDataList');
    this.removeIds = [];
  },
};
</script>
<style lang='scss'>
.message-box-left{
  p{
    text-align: left;
    padding: 0 20px;
  }
}
.mp-erp-post-manage-list-page-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  padding-right: 4px;
  min-width: 900px;
  > header {
    flex: none;
    padding: 25px 35px;
  }
  > main {
    flex: 1;
    padding: 0 35px;
    overflow-y: auto;
    box-sizing: border-box;
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
          >.el-switch{
            transform: rotate(180deg);
          }
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
