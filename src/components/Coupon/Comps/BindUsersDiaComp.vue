<template>
  <el-dialog
    title="查看绑定用户"
    :modal='false'
    :visible.sync="dialogVisible2UsePage"
    width="800px"
    top='18vh'
    v-dialogDrag
    class="mp-img-style-header mp-coupon-use-list-page-dialog-comp-wrap"
    :before-close="handleClose">
    <div class="content-wrap" v-if="dialogData2UsePage && !isLoading">
      <section class="left">
        <header>
          <i>
            <img src="@/assets/images/customer1.png" alt />
          </i>
          <span>基本信息</span>
        </header>
        <ul>
          <li>
            <span class="first-span">
              <i class="is-gray">客户编号：</i>
              <i>{{dialogData2UsePage.CustomerSN}}</i>
            </span>
            <span class="second-span">
              <i class="is-gray">
                名称：
              </i>
              <i>{{dialogData2UsePage.CustomerName}}</i>
            </span>
          </li>
          <li>
            <span class="first-span">
              <i class="is-gray">手机号码：</i>
              <i>{{dialogData2UsePage.Mobile}}</i>
            </span>
            <span class="second-span" v-if="dialogData2UsePage.QQ">
              <i class="is-gray">QQ号：</i>
              <i>{{dialogData2UsePage.QQ}}</i>
            </span>
          </li>
          <li v-if="dialogData2UsePage.AuthenInfo">
            <span class="is-gray">经营地址：</span>
            <span class="is-font-size-12">{{getAddress(dialogData2UsePage.AuthenInfo)}}</span>
          </li>
        </ul>
      </section>
      <section class="right">
        <header>
          <i>
            <img src="@/assets/images/finance.png" alt />
          </i>
          <span>财务信息</span>
        </header>
        <ul>
          <li>
            <span class="is-gray">账户类型：</span>
            <span>{{dialogData2UsePage.Type.Second}}{{dialogData2UsePage.Grade.Second}}</span>
          </li>
          <li>
            <span class="is-gray">可用余额：</span>
            <span class="is-pink">¥{{dialogData2UsePage.FundInfo.Amount.toFixed(2)}}</span>
          </li>
          <li>
            <span class="is-gray">信用额度：</span>
            <span class="is-pink">¥{{dialogData2UsePage.FundInfo.TotalCredit.toFixed(2)}}</span>
          </li>
          <li>
            <span class="is-gray">可用信用额度：</span>
            <span class="is-pink">¥{{
              (dialogData2UsePage.FundInfo.TotalCredit - dialogData2UsePage.FundInfo.UsedCredit)
                .toFixed(2)
              }}</span>
          </li> <!-- 相减  小数位2 -->
        </ul>
      </section>
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

export default {
  components: {
    normalBtn,
    LoadingComp,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('couponStore', ['dialogVisible2UsePage', 'dialogData2UsePage']),
    ...mapState('common', ['isLoading']),
  },
  methods: {
    ...mapMutations('couponStore', ['setDialogVisible2UsePage']),
    handleClose() {
      this.$store.commit('couponStore/setDialogData2UsePage', null);
      this.setDialogVisible2UsePage(false);
    },
    getAddress(addData) {
      if (!addData) return '';
      const { DetailAddress, SellArea } = addData;
      const { RegionalName, CountyName, CityName } = SellArea;
      return `${RegionalName}${CityName}${CountyName}${DetailAddress}`;
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-coupon-use-list-page-dialog-comp-wrap {
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
      min-height: 200px;
      box-sizing: border-box;
      padding: 0;
      color: $--color-text-primary;
      > .content-wrap {
        padding: 30px;
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
        height: 200px;
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
