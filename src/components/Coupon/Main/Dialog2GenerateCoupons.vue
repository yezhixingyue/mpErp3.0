<template>
  <el-dialog
    title="手动生成优惠券"
    :visible.sync="dialogVisible"
    width="855px"
    top='8vh'
    v-dialogDrag
    :modal='false'
    @open='handleDialogOpenEvent'
    class="mp-img-style-header mp-coupon-generate-comp-wrap"
    :before-close="handleClose">
    <section class="content-wrap">
      <header class="title mp-common-title-wrap">基本信息</header>
      <div class="content" v-if="dialogData">
        <GenerateDiaShowDeatilComp
         :data="dialogData"
         :dialogProductInfo='dialogProductInfo' /> <!-- 优惠券信息详情 -->
        <div class="generate-box" v-if="Permission.PermissionList.PermissionCoupon.Obj.Generate">
          <StaffSelector
           isLineStyle
           title="领取人"
           :changePropsFunc="changeReceiveUser"
           :typeList="[['ReceiveUser', '']]"
           :value="ReceiveUser.StaffID" />
          <div>
            <SingleBottomLineInputComp  v-model="generateNum" title="生成数量" remark='' />
            <normal-btn-full
              @click.native="handleGenerateClick"
              :disabled="dialogData.ProvideStatus !== 1"
              :title='btnTitle' />
          </div>
        </div>
        <GenerateDiaTableComp
         v-if="dialogData"
         :tableData='generatedCouponList'
         :amount='dialogData.Data.Amount'
         :ValidEndTime='dialogData.ValidEndTime'
         :minPayAmount='dialogData.Data.MinPayAmount'
         @changeGeneratedCouponList='changeGeneratedCouponList' />
      </div>
    </section>
    <span slot="footer" class="dialog-footer">
      <normal-btn @click.native="handleClose()" title="关闭" />
    </span>
  </el-dialog>
</template>

<script>
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import StaffSelector from '@/components/common/SelectorComps/StaffSelector.vue';
import SingleBottomLineInputComp from '@/components/common/SingleBottomLineInputComp.vue';
import { mapState, mapMutations } from 'vuex';
import GenerateDiaShowDeatilComp from '../Comps/GenerateDiaShowDeatilComp.vue';
import GenerateDiaTableComp from '../Comps/GenerateDiaTableComp.vue';

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    dialogData: {
      type: Object,
      default: () => ({}),
    },
    dialogIndex: {
      type: Number,
      default: -1,
    },
    dialogProductInfo: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    normalBtnFull,
    normalBtn,
    GenerateDiaShowDeatilComp,
    StaffSelector,
    SingleBottomLineInputComp,
    GenerateDiaTableComp,
  },
  computed: {
    ...mapState('common', ['Permission']),
    btnTitle() {
      if (!this.dialogData) return '';
      let _str = '';
      switch (this.dialogData.ProvideStatus) {
        case 0:
          _str = '尚未开始发放';
          break;
        case 1:
          _str = '生成';
          break;

        case 2:
          _str = '已结束发放';
          break;

        default:
          break;
      }
      return _str;
    },
  },
  data() {
    return {
      ReceiveUser: {
        StaffID: '',
      },
      generateNum: '',
      generateNumRules: [
        { strategy: 'isNotEmpty', errorMsg: '生成数量不能为空' },
        { strategy: 'isPositiveInt', errorMsg: '生成数量必须为正整数类型' },
        { strategy: 'Maximum:10000', errorMsg: '单次最大生成数量为10000条' },
      ],
      generatedCouponList: [],
    };
  },
  methods: {
    ...mapMutations('couponStore', ['changeCouponListData']),
    handleClose() {
      this.$emit('close');
      this.ReceiveUser.StaffID = '';
      this.generateNum = '';
    },
    changeReceiveUser(arr) {
      const newVal = arr[1];
      this.ReceiveUser.StaffID = newVal;
    },
    async handleGenerateClick() {
      const { ProvideStatus } = this.dialogData;
      if (ProvideStatus === 0) {
        this.messageBox.failSingle('尚未开始发放!');
        return;
      }
      if (ProvideStatus === 2) {
        this.messageBox.failSingle('已结束发放!');
        return;
      }
      if (!this.dialogData.Data) return;
      const { TotalNumber, GenerateNumber } = this.dialogData.Data;
      if (TotalNumber === GenerateNumber) {
        this.messageBox.failSingle('当前优惠券已全部生成!');
        return;
      }
      if (!this.ReceiveUser.StaffID) {
        this.messageBox.failSingle('请输入领取人!');
        return;
      }
      if (this.check(
        this.generateNum, this.generateNumRules, err => this.messageBox.failSingle(err),
      )) {
        if (TotalNumber < GenerateNumber + +this.generateNum) {
          this.messageBox.failSingle('超出最大可生成数量!');
          return;
        }
        // 执行数据提交已进行优惠券数量生成
        const _obj = {
          CouponID: this.dialogData.CouponID,
          Number: this.generateNum,
          ReceiveUser: this.ReceiveUser,
        };
        // 执行网络请求
        const res = await this.api.generateCoupons(_obj);
        if (res.data.Status === 1000) {
          this.messageBox.successSingle('生成成功!', async () => {
            const _count = +this.dialogData.Data.GenerateNumber + +this.generateNum;
            this.ReceiveUser.StaffID = '';
            this.generateNum = '';
            await this.getGeneratedCoupons();
            // 执行其它动作action -- 修改对应数据中的已生成数量 [index, [key1, key2], value]
            if (this.dialogIndex >= 0) {
              this.changeCouponListData([this.dialogIndex, ['Data', 'GenerateNumber'], _count]);
            }
          });
        }
      }
    },
    async getGeneratedCoupons() {
      if (this.dialogData && this.dialogData.CouponID) {
        const res = await this.api.getGeneratedCoupons(this.dialogData.CouponID);
        if (res.data.Status === 1000) {
          this.generatedCouponList = res.data.Data;
        }
      }
    },
    changeGeneratedCouponList(index) {
      if (this.generatedCouponList[index].HaveExported === true) return;
      this.generatedCouponList[index].HaveExported = true;
    },
    handleDialogOpenEvent() {
      this.getGeneratedCoupons();
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-coupon-generate-comp-wrap.mp-img-style-header {
  > .el-dialog{
    > .el-dialog__header {
      > span {
        &::before {
            background: url(../../../assets/images/edit-icon.png) no-repeat center / 100%;
            width: 17px;
            height: 17px;
        }
      }
    }
    > .el-dialog__body {
      height: 600px;
      box-sizing: border-box;
      padding: 25px 20px 0 20px;
      > .content-wrap {
        > .content {
          margin-top: 25px;
          display: flex;
          flex-direction: column;
          align-items: center;
          > .generate-box {
            // display: ;
            margin-top: 25px;
            > section {
              > header {
                font-weight: 400;
              }
              > main > div > div > input {
                text-align: center;
                padding-right: 20px;
              }
            }
            > div {
              margin-top: 18px;
              margin-bottom: 35px;
              position: relative;
              > div {
                > .title {
                  min-width: 5em;
                  font-weight: 400;
                }
                > input {
                  padding-right: 20px;
                  box-sizing: border-box;
                  width: 113px;
                }
              }
              > button {
                position: absolute;
                top: -5px;
                left: 220px;
                margin: 0;
                border-radius: 2px;
                font-size: 12px;
                background-color: $--color-primary;
                border: none;
                line-height: 24px;
              }
            }
          }
        }
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
//   height: 700px;
}
</style>
