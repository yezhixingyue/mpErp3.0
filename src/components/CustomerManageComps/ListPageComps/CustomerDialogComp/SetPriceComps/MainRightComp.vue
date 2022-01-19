<template>
  <section class="mp-erp-comps-customer-detail-display-dialog-comp-set-price-index-main-right-comp-wrap" v-if="customer">
    <header>
      <el-radio-group v-model="FundInfo.CashBackType" size="mini">
        <el-radio :label="it.ID" v-for="it in CashBackTypeEnumList" :key="it.ID">{{it.Name}}</el-radio>
      </el-radio-group>
      <div class="tips">
        <label for="">提示：</label>
        <div>
          <span v-if="FundInfo.CashBackType===CashBackTypeEnum.Recharge.ID">
            选用此种方式后，只要单次充值金额达到下面指定的金额则立即按照返点比例返现至余额账户。
            但此帐号将不能提现且不能参加任何其他优惠活动。帐户余额仅能购买左侧指定产品，其他产品必须先付款，再生产，即停用该帐号的信誉额度。
          </span>
          <span v-if="FundInfo.CashBackType===CashBackTypeEnum.Consume.ID">
            选用此种方式后，只要月消费金额达到下面指定的金额则在次月初按照返点比例返现至余额账户，不限产品。
            但此帐号将不能提现且不能参加任何其他优惠活动。
          </span>
        </div>
      </div>
    </header>
    <main>
      <el-form :model="FundInfo" ref="FundInfo" label-width="120px" class="demo-FundInfo" hide-required-asterisk size="mini">
        <el-form-item
          :label="amountLabel"
          prop="MinAmount"
          class="amount-box"
          :rules="[
            { required: true, message: `请输入金额`},
            { pattern: /^\d+(\.\d{1,2})?$/, message: `格式不正确，应为不小于0的数字 且 最多2位小数`},
          ]"
        >
          <el-input v-model="FundInfo.MinAmount" autocomplete="off" maxlength="9" size="mini"></el-input>
          <span class="l">元</span>
        </el-form-item>
        <el-form-item
          label="返点百分比："
          prop="BackPercent"
          :rules="[
            { required: true, message: `请输入返点百分比`},
            { pattern: /^[1-9]?\d?(\.\d{1,2})?$/, message: `格式不正确，应0-100之间的数字 且 最多2位小数`},
          ]"
        >
          <el-input v-model="FundInfo.BackPercent" autocomplete="off" maxlength="9" size="mini"></el-input>
          <span class="l">%</span>
        </el-form-item>
      </el-form>
    </main>
  </section>
</template>

<script>
import { CashBackTypeEnum, CashBackTypeEnumList } from '../../../../../store/customerManage/Enums';

export default {
  props: {
    customer: {
      type: Object,
      default: null,
    },
  },
  computed: {
    amountLabel() {
      if (this.FundInfo.CashBackType === CashBackTypeEnum.Recharge.ID) return '返现最小充值金额：';
      if (this.FundInfo.CashBackType === CashBackTypeEnum.Consume.ID) return '月消费金额：';
      return '';
    },
  },
  data() {
    return {
      CashBackTypeEnumList,
      CashBackTypeEnum,
      FundInfo: {
        CashBackType: CashBackTypeEnum.Recharge.ID,
        MinAmount: '',
        BackPercent: '',
      },
    };
  },
  methods: {
    checker() {
      return new Promise(resolve => {
        if (this.$refs.FundInfo) {
          this.$refs.FundInfo.validate((valid) => {
            if (valid) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        } else {
          resolve(false);
        }
      });
    },
  },
  mounted() {
    if (this.customer && this.customer.FundInfo) {
      const { CashBackType, MinAmount, BackPercent } = this.customer.FundInfo;
      if (CashBackType || CashBackType === 0) this.FundInfo.CashBackType = CashBackType;
      if (MinAmount || MinAmount === 0) this.FundInfo.MinAmount = MinAmount;
      if (BackPercent || BackPercent === 0) this.FundInfo.BackPercent = BackPercent;
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-customer-detail-display-dialog-comp-set-price-index-main-right-comp-wrap {
  flex: 1 !important;
  border-left: 1px solid #eee;
  padding-left: 25px;
  > header {
    padding-top: 36px;
    .el-radio {
      &:first-of-type {
        margin-right: 42px;
      }
      .el-radio__label {
        font-size: 12px;
        color: #444;
        position: relative;
        top: 1px;
      }
    }
    .tips {
      padding-top: 18px;
      color: #aaaaaa !important;
      line-height: 20px;
      > div {
        display: inline-block;
        width: 330px;
        vertical-align: top;
      }
    }
  }
  > main {
    padding-top: 28px;
    .el-form-item {
      .el-form-item__label {
        font-size: 12px;
        color: #444;
      }
      .el-form-item__content {
        display: flex;
        .el-input {
          width: 200px;
          > input {
            border: none;
            border-radius: 0;
            border-bottom: 1px solid #ddd;
          }
        }
        > span.l {
          color: #aaa;
          font-size: 12px;
        }
        .el-form-item__error {
          line-height: 16px;
        }
      }
      &.is-error .el-form-item__content .el-input > input {
        border-color: #ff3769;
      }
    }
  }
}
</style>
