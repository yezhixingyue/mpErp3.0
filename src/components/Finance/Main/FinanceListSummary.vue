
<template>
  <div class="mp-finance-list-summary">
      <div class="right">
          <span>总金额：￥{{TotalAmount}}元</span>
          <span>预付：￥{{HavePaid}}元</span>
          <span>
              应收：<i class="is-red is-thick-line">￥{{UnPaidAmount}}元</i>
          </span>
          <template v-if="localPermission.WriteOff">
            <!-- <span @click="filterPackageList" class="clear-btn">清除当前页已销账的包裹</span> -->
            <span>
                <normalBtnFull @click.native="handleSelectList" title="销账选中" />
            </span>
            <span>
                <normalBtnFull @click.native="handleAllList" title="销账全部" />
            </span>
          </template>
      </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import normalBtnFull from '@/components/common/normalBtnFull.vue';

export default {
  props: {
    UnPaidAmount: {
      type: Number,
      required: true,
    },
    HavePaid: {
      type: Number,
      required: true,
    },
    TotalAmount: {
      type: Number,
      required: true,
    },
  },
  components: {
    normalBtnFull,
  },
  computed: {
    ...mapState('finance', ['will2WriteCheckedList', 'searchCondition4Finance', 'PackageList', 'count']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionFinance?.Obj) {
        return this.Permission.PermissionList.PermissionFinance.Obj;
      }
      return {};
    },
  },
  filters: {
    toDate(value) {
      if (!value) return '';
      const date = new Date(value);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      //   const hour = (date.getHours() - 8 + 24) % 24;
      //   const minutes = date.getMinutes();
      return `${year}年${month}月${day}日8时0分`;
    },
  },
  methods: {
    ...mapMutations('finance', ['filterPackageList']),
    ...mapActions('finance', ['setWriteOffAll', 'setWriteOffChecked']),
    handleSelectList() {
      if (this.will2WriteCheckedList.length === 0) {
        this.$message({
          showClose: true,
          message: '没有选中的包裹!',
          type: 'error',
        });
        return;
      }
      let msg = '确定销账选中包裹吗 ?';
      const t1 = this.will2WriteCheckedList.find(it => it.Status !== '已完成');
      if (t1) msg = '有包裹未签收,是否要销账 ?';
      const t2 = this.will2WriteCheckedList.find(it => it.UnpaidAmount > 0);
      if (t2) msg = '有包裹未结清,是否要销账 ?';
      if (this.will2WriteCheckedList.length > 1 && t2) {
        this.messageBox.failSingleError('销账失败', '有未结清包裹，不支持批量销账');
        return;
      }
      this.messageBox.warnCancelNullMsg(msg, () => this.setWriteOffChecked(), null);
    },
    handleAllList() {
      if (this.searchCondition4Finance.Page === 1
          && this.PackageList.length === 0
          && this.count === 0) {
        this.$message({
          showClose: true,
          message: '当前条件没有可销账的包裹!',
          type: 'error',
        });
        return;
      }
      this.messageBox.warnCancelNullMsg('是否对全部包裹进行销账 ?', () => this.setWriteOffAll(), null);
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-finance-list-summary{
  box-shadow: 0px 3px 7px rgba(196, 196, 196, 1);
  height: 58px;
  padding: 0 20px;
  padding-right: 50px;
  display: flex;
  align-items: center;
  border-top: 1px solid $--bg-color-base;
  border-bottom: 1px solid $--bg-color-base;
  justify-content: flex-end;
  > .right {
    font-size: 14px;
    color: $--color-text-primary;
    white-space: nowrap;
    > span {
        >.normal-full-btn {
            margin: 0;
            line-height: 30px;
            width: 140px;
            border-radius: 2px;
            background-color: $--color-primary;
            border-color: $--color-primary;
            font-size: 14px;
            letter-spacing: 1px;
            height: 35px;
        }

        & + span {
            margin-left: 40px;
        }

        &.clear-btn {
          color: $--color-primary;
          user-select: none;
          cursor: pointer;
          &:hover {
            color: $--color-primary-light;
          }
        }
        > .is-thick-line {
          font-size: 16px;
        }
    }
  }
}
</style>
