<template>
  <section class="mp-batch-upload-page-header-comps-address-setup-comp-wrap">
    <ConsigneeAddressSetpComp
      v-if="customer"
      ref="oConsigneeAddressSetpComp"
      isBatchUploadUse
      :watchClearVal="customer"
      :customerInfo="customer"
      :ExpressList="ExpressList"
      @changeAddressInfo="setAddressInfo4PlaceOrder"
      @validChange='handleValidChange'
    />
    <div v-if="customer" class="option">
      <label class="title">下单选项：</label>
      <el-checkbox v-model="localPayInFull">支付全款</el-checkbox>
      <el-checkbox v-model="localUsePrintBean">使用印豆</el-checkbox>
    </div>
  </section>
</template>

<script>
import ConsigneeAddressSetpComp from '@/components/common/NewComps/ConsigneeAddressSetpComp';
import { mapState } from 'vuex';

export default {
  props: {
    customer: {
      type: Object,
      default: null,
    },
    PayInFull: {
      type: Boolean,
      default: false,
    },
    UsePrintBean: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ConsigneeAddressSetpComp,
  },
  computed: {
    ...mapState('common', ['ExpressList']),
    localPayInFull: {
      get() {
        return this.PayInFull;
      },
      set(val) {
        this.$emit('update:PayInFull', val);
      },
    },
    localUsePrintBean: {
      get() {
        return this.UsePrintBean;
      },
      set(val) {
        this.$emit('update:UsePrintBean', val);
      },
    },
  },
  methods: {
    setAddressInfo4PlaceOrder(data) {
      this.$emit('change', data);
    },
    handleValidChange(onlyAddChange) { // 触发有效地址改变事件（指会影响到运费计算的地址改变 1. 配送方式发生改变 2. 配送方式未改变但省市区发生改变 3. 注意避免省市区改变后影响到配送方式改变的重复事件触发）
      this.$emit('validAddChange', onlyAddChange);
    },
  },
  mounted() {
    this.$store.dispatch('common/getExpressList');
  },
};
</script>
<style lang='scss'>
.mp-batch-upload-page-header-comps-address-setup-comp-wrap {
  font-size: 14px;
  .option {
    margin-top: -9px;
    label.title {
      width: 96px;
      margin-right: 2px;
      line-height: 25px;
      display: inline-block;
      text-align: right;
      color: #888;
    }
    label.el-checkbox {
      .el-checkbox__label {
        font-size: 12px;
      }
      margin-right: 24px;
    }
  }
}
</style>
