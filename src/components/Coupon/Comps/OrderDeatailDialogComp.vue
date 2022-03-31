<template>
  <el-dialog
    title="相关订单"
    :visible.sync="dialogVisible2UsePageOrderDetail"
    width="850px"
    top='6vh'
    :modal='false'
    v-dialogDrag
    class="mp-img-style-header mp-coupon-use-list-page-dialog-order-detail-comp-wrap"
    :before-close="handleClose">
    <div class="content-wrap" v-if="dialogVisible2UsePageOrderDetail && !isLoading">
      <OrderDetail :detailData='dialogData2UsePageOrderDetail' />
    </div>
    <loading-comp v-else />
    <span slot="footer" class="dialog-footer">
      <normal-btn @click.native="handleClose()" title="关闭" />
    </span>
  </el-dialog>
</template>

<script>
import normalBtn from '@/components/common/normalBtn.vue';
import { mapState, mapMutations } from 'vuex';
import LoadingComp from '@/components/common/LoadingComp.vue';
import OrderDetail from '../../order/DialogContent/OrderDetail.vue';

export default {
  components: {
    normalBtn,
    LoadingComp,
    OrderDetail,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('couponStore', ['dialogVisible2UsePageOrderDetail', 'dialogData2UsePageOrderDetail']),
    ...mapState('common', ['isLoading']),
  },
  methods: {
    ...mapMutations('couponStore', ['setDialogVisible2UsePageOrderDetail']),
    handleClose() {
      this.$store.commit('couponStore/setDialogData2UsePageOrderDetail', null);
      this.setDialogVisible2UsePageOrderDetail(false);
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-coupon-use-list-page-dialog-order-detail-comp-wrap {
  > .el-dialog{
    > .el-dialog__header {
      > span {
        &::before {
            background: url(../../../assets/images/detail.png) no-repeat center / 100%;
            width: 17px;
            height: 17px;
        }
      }
    }
    > .el-dialog__body {
      height: 700px;
      box-sizing: border-box;
      padding: 0;
      color: $--color-text-primary;
      > .content-wrap {
        padding: 0;
        padding-bottom: 18px;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        > section {
          > header {
            display: flex;
            align-items: center;
            font-weight: 600;
            height: 40px;
            padding-left: 10px;
            border-left: 1px solid $--color-primary;
            > i {
              background-image: linear-gradient(233deg, rgb(53,223,249), rgb(38,188,249));
              background-repeat: no-repeat;
              background-size: 100% 100%;
              width: 26px;
              height: 26px;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-right: 6px;
            }
          }
          &.left {
            width: 440px;
            > ul {
              padding: 20px;
              > li {
                &:first-of-type {
                  padding-bottom: 20px;
                }
                &:last-of-type {
                  padding-top: 25px
                }
                > span {
                  &.first-span {
                    width: 180px;
                    display: inline-block;
                  }
                  > .is-gray {
                    min-width: 5em;
                    text-align: right;
                    display: inline-block;
                  }
                  &.second-span {
                    width: calc(100% - 180px);
                    display: inline-block;
                    > i:last-of-type {
                      width: calc(100% - 5em);
                      display: inline-block;
                      vertical-align: top;
                    }
                  }
                }
                > span.is-font-size-12 {
                  display: inline-block;
                  width: calc(100% - 6em);
                  vertical-align: top;
                  position: relative;
                  top: -2px;
                  line-height: 18px
                }
              }
            }
          }
          &.right {
            width: 280px;
            > ul {
              padding: 20px;
              > li {
                margin-bottom: 16px;
                &:last-of-type {
                  margin: 0;
                }
                &:first-of-type {
                  margin-bottom: 23px;
                }
              }
            }
          }
          box-shadow: 0px 2px 8px #ddd;
          min-height: 200px;
        }
      }
      > .mp-common-loading-wrap > .loading-box {
        height: 350px;
      }
    }
    > .el-dialog__footer {
      padding: 0;
      padding-bottom: 30px;
      text-align: center;
      > .dialog-footer {
        display: inline-block;
        > button {
          margin: 0;
          height: 30px;
        }
      }
    }
  }
}
</style>
