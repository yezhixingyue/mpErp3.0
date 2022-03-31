<template>
  <CommonDialogComp
    width="500px"
    top='20vh'
    :title="`手动${titleType}`"
    :visible.sync="visible"
    @cancle="onCancle"
    @open='onOpen'
    @submit="onSubmit"
    class="mp-erp-comps-customer-setup-module-customer-detail-display-finance-info-rachange-dialog-comp-wrap"
   >
   <el-form :model="ruleForm" ref="ruleForm" label-width="85px" class="demo-ruleForm" hide-required-asterisk size="small">
    <el-form-item
      :label="`${titleType}金额：`"
      prop="Amount"
      class="amount-box"
      :rules="[
        { required: true, message: `请输入${titleType}金额`},
        { pattern: /(^\d*[1-9]\d*(\.\d{1,2})?$)|0\.(\d?[1-9]|[1-9]\d?)$/, message: `${titleType}金额必须为大于0的数字且最多允许2位小数`},
      ]"
    >
      <span class="l">￥</span>
      <el-input v-model="ruleForm.Amount" autocomplete="off" maxlength="9" size="small"></el-input>
      <span class="l">元</span>
    </el-form-item>
    <el-form-item
      :label="`${titleType}原因：`"
      prop="Remark"
      :rules="[
        { required: true, message: `请输入${titleType}原因`},
        { max: 30, message: `${titleType}原因不能超过30个字符`},
      ]"
    >
      <el-input v-model.trim="ruleForm.Remark" autocomplete="off" maxlength="30" size="small"></el-input>
    </el-form-item>
  </el-form>
  </CommonDialogComp>
</template>

<script>
/* eslint-disable no-unused-expressions */
import CommonDialogComp from '@/packages/CommonDialogComp';
import { ReChangeTypeEnumList } from '../../../../../store/customerManage/Enums';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    CustomerID: {
      type: String,
      default: '',
    },
    type: {
      type: Number,
      default: -1,
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    titleType() {
      const t = ReChangeTypeEnumList.find(it => it.ID === this.type);
      return t ? t.Name : '';
    },
  },
  data() {
    return {
      ruleForm: {
        Amount: '',
        Remark: '',
      },
    };
  },
  methods: {
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    resetForm() {
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
    },
    onSubmit() {
      this.$refs.ruleForm && this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.$utils.getValueIsOrNotNumber(this.ruleForm.Amount)) {
            const temp = {
              Type: this.type,
              CustomerID: this.CustomerID,
              ...this.ruleForm,
            };
            this.$emit('recharge', temp, `${this.titleType}成功`);
          }
        }
      });
    },
    onOpen() { // 打开时初始化数据
      this.resetForm();
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-customer-setup-module-customer-detail-display-finance-info-rachange-dialog-comp-wrap {
  .el-dialog__body {
    padding: 20px 70px;
    min-height: 125px;
    .el-form-item {
      .el-form-item__content {
        .el-input {
          margin-left: 14px;
          > input {
            border: none;
            border-radius: 0;
            border-bottom: 1px solid #ddd;
          }
        }
        .el-form-item__error {
          text-indent: 14px;
          line-height: 16px;
        }
      }
      &.amount-box {
        .el-form-item__content {
          display: flex;
          .el-input {
            width: 100px;
            margin-left: 0;
            > input {
              border: none;
              border-radius: 0;
              border-bottom: 1px solid #ddd;
            }
          }
          > span.l {
            color: #585858;
          }
        }
      }
      &.is-error .el-form-item__content .el-input > input {
        border-color: #ff3769;
      }
    }
  }
}
</style>
