<template>
  <div class="mp-coupon-add-page-wrap">
    <header>
      <span class="mp-common-title-wrap">{{pageTitle}}</span>
    </header>
    <div class="content">
      <div class="left">
        <CouponAddPageLeftComp class="mp-scroll-wrap" />
      </div>
      <div class="right">
        <CouponAddPageRightComp class="mp-scroll-wrap" />
      </div>
    </div>
    <footer>
        <normalBtnFull
         v-if="Permission.PermissionList.PermissionCoupon.Obj.Setup"
         @click.native="onSubmitClick" title="保存" />
        <normalBtn @click.native="onReturnClick" title="返回" />
    </footer>
  </div>
</template>

<script>
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import CouponAddPageLeftComp from '@/components/Coupon/Main/CouponAddPageLeftComp.vue';
import CouponAddPageRightComp from '@/components/Coupon/Main/CouponAddPageRightComp.vue';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'CouponAddPage',
  components: {
    normalBtn,
    normalBtnFull,
    CouponAddPageLeftComp,
    CouponAddPageRightComp,
  },
  data() {
    return {
      pageTitle: '添加优惠券',
    };
  },
  computed: {
    ...mapState('common', ['Permission']),
  },
  methods: {
    ...mapActions('couponStore', ['submitOrEditCoupon']),
    async onSubmitClick() {
      const _key = await this.submitOrEditCoupon();
      if (_key) {
        const { type } = this.$route.params;
        // eslint-disable-next-line no-nested-ternary
        const _text = type === 'add' ? '添加成功' : type === 'edit' ? '修改成功' : '';
        const cb = () => {
          this.onReturnClick();
          this.$store.dispatch('couponStore/getCouponList');
        };
        this.messageBox.successSingle(_text, cb, cb);
      }
    },
    onReturnClick() {
      this.$store.commit('couponStore/clearCondition2CouponSave');
      this.$router.replace('/couponList');
    },
  },
  mounted() {
    const { type } = this.$route.params;
    const { CouponID } = this.$store.state.couponStore.condition2CouponSave;
    if (type === 'edit' && !CouponID) {
      this.onReturnClick();
      return;
    }
    if (type === 'add') {
      this.$store.commit('couponStore/clearCondition2CouponSave');
      this.pageTitle = '添加优惠券';
    }
    if (type === 'edit') this.pageTitle = '编辑优惠券';
  },
};
</script>

<style lang="scss">
.mp-coupon-add-page-wrap {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  > header {
    padding: 26px 0 30px 45px;
    flex: none;
  }
  > .content {
    flex: 1;
    display: flex;
    overflow: hidden;
    > .left {
      width: 40%;
      flex: none;
      min-width: 550px;
      // margin-right: 50px;
    }
    > .right {
      flex: none;
      width: 60%;
      min-width: 590px;
      border-left: 1px solid #eee;
    }
    .mp-common-comps-tree-comp-wrap > .content > .el-tree > .el-tree-node
    > .el-tree-node__children > .el-tree-node > .el-tree-node__content {
      margin-top: -4px;
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
