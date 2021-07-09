<template>
  <div class="mp-deposit-add-page-comp-wrap">
    <header class="mp-common-title-wrap">{{title}}</header>
    <div class="content">
      <div class="left">
        <deposit-add-page-left-comp />
      </div>
      <div class="right">
        <deposit-add-page-right-comp />
      </div>
    </div>
    <footer>
        <normal-btn-full @click.native="onSubmitClick" title="保存" />
        <normal-btn @click.native="onReturnClick" title="返回" />
    </footer>
  </div>
</template>

<script>
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import DepositAddPageLeftComp from '@/components/Deposit/Main/DepositAddPageLeftComp.vue';
import DepositAddPageRightComp from '@/components/Deposit/Main/DepositAddPageRightComp.vue';

export default {
  name: 'DepositSettingsPage',
  components: {
    normalBtn,
    normalBtnFull,
    DepositAddPageLeftComp,
    DepositAddPageRightComp,
  },
  data() {
    return {
      title: '添加定金设置',
    };
  },
  methods: {
    onSubmitClick() {
      this.$store.dispatch('deposit/SaveDeposit', this.handleSuccess);
    },
    handleSuccess() {
      const { type } = this.$route.params;
      // eslint-disable-next-line no-nested-ternary
      const _text = type === 'add' ? '添加成功' : type === 'edit' ? '修改成功' : '';
      this.messageBox.successSingle(_text, () => {
        this.$store.commit('deposit/setListData', []);
        this.onReturnClick();
      });
    },
    onReturnClick() {
      this.$store.commit('deposit/clearObjForDepositAdd');
      this.$router.replace('/depositList');
    },
  },
  mounted() {
    const { type } = this.$route.params;
    const { ID } = this.$store.state.deposit.objForDepositAdd;
    if (type === 'edit' && !ID) {
      this.onReturnClick();
      return;
    }
    if (type === 'add') this.title = '添加定金设置';
    if (type === 'edit') this.title = '编辑定金设置';
  },
};
</script>

<style lang='scss'>
.mp-deposit-add-page-comp-wrap {
  padding: 25px 45px 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  > header {
    height: 16px;
    width: 100%;
    margin-bottom: 24px;
  }
  > .content {
    display: flex;
    height: calc(100% - 202px);
    > .left {
      width: 42%;
      box-sizing: border-box;
      padding-right: 20px;
      min-width: 521px;
    }
    > .right {
      width: 58%;
      box-sizing: border-box;
      padding-left: 40px;
      min-width: 666px;
      border-left: 1px solid #eeeeee;
    }
  }

  > footer {
    width: 100%;
    height: 160px;
    box-sizing: border-box;
    flex: none;
    padding-top: 94px;
    display: flex;
    justify-content: center;
    > button {
      margin: 0;
      border-radius: 2px;
      line-height: 24px;
      &:first-of-type {
        background: linear-gradient(to right, #26bcf9, #35dff9);
        border: none;
      }
      & + button {
        margin-left: 30px;
      }
    }
  }
}
</style>
