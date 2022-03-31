<template>
    <CommonDialogComp
      width="750px"
      top="12vh"
      :title="title"
      :visible.sync="localVisible"
      submitText='确定'
      @cancle="localVisible = false"
      @open="onOpen"
      @closed="onClosed"
      @submit="submitForm"
      class="mp-erp-print-bean-setup-right-bean-table-item-dialog-comp-wrap"
    >
      <!-- 内容区 -->
      <el-form
        v-if="ruleForm"
        :model="ruleForm"
        hide-required-asterisk
        :rules="rules"
        @submit.native.prevent
        ref="ruleForm"
        label-width="275px"
        class="recharge-ruleForm"
        size="small"
      >
        <el-form-item label="印豆数量：" prop="BeanNumber">
          <el-input v-model.trim.number="ruleForm.BeanNumber" maxlength="9" :disabled='disabled'></el-input>
          <span class="unit">个</span>
          <span class="tips-box"><i class="el-icon-warning"></i> 注：10个印豆价值1元</span>
        </el-form-item>
        <el-form-item label="价格：" prop="Price" class="price">
          <el-input v-model.trim="ruleForm.Price" maxlength="9" :disabled='disabled'></el-input>
          <span class="unit">元</span>
        </el-form-item>
        <el-form-item label="总份数：" prop="TotalNumber">
          <el-input v-model.trim.number="ruleForm.TotalNumber" maxlength="9"></el-input>
          <span class="unit">份（ 选填 ）</span>
        </el-form-item>
        <el-form-item label="每个客户可购买总份数：" prop="BuyMaxNumber">
          <el-input v-model.trim.number="ruleForm.BuyMaxNumber" maxlength="9"></el-input>
          <span class="unit">份（ 选填 ）</span>
        </el-form-item>
        <el-form-item label="每个客户每日可购买份数：" prop="DayBuyMaxNumber">
          <el-input v-model.trim.number="ruleForm.DayBuyMaxNumber" maxlength="9"></el-input>
          <span class="unit">份（ 选填 ）</span>
        </el-form-item>
        <el-form-item>
          <span class="remark">( 总份数不填则表示不限 )</span>
        </el-form-item>
      </el-form>
    </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import PrintBeanTableItemClass from '../../store/printBean/PrintBeanTableItemClass';

export default {
  props: {
    editData: {
      type: Object,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    isStarted: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    const createValidator = ([rule, value, callback], title) => {
      if (rule.field === 'TotalNumber') {
        this.$refs.ruleForm.validateField('BuyMaxNumber');
        this.$refs.ruleForm.validateField('DayBuyMaxNumber');
      } else if (rule.field === 'BuyMaxNumber') {
        this.$refs.ruleForm.validateField('DayBuyMaxNumber');
      }
      if (typeof value !== 'number') {
        callback();
        return;
      }
      if (value <= 0) {
        callback(new Error(`${title}必须大于0`));
        return;
      }
      if (rule.field === 'TotalNumber' && typeof this.ruleForm.SellNumber === 'number') {
        if (value < this.ruleForm.SellNumber) {
          callback(new Error(`${title}不能小于已售份数：${this.ruleForm.SellNumber}`));
          return;
        }
        this.$refs.ruleForm.validateField('BuyMaxNumber');
        this.$refs.ruleForm.validateField('DayBuyMaxNumber');
      }
      if (rule.field === 'BuyMaxNumber' && typeof this.ruleForm.TotalNumber === 'number') {
        if (value > this.ruleForm.TotalNumber) {
          callback(new Error(`${title}不能大于总份数：${this.ruleForm.TotalNumber}`));
          return;
        }
        this.$refs.ruleForm.validateField('DayBuyMaxNumber');
      }
      if (rule.field === 'DayBuyMaxNumber' && typeof this.ruleForm.TotalNumber === 'number') {
        if (value > this.ruleForm.TotalNumber) {
          callback(new Error(`${title}不能大于总份数：${this.ruleForm.TotalNumber}`));
          return;
        }
      }
      if (rule.field === 'DayBuyMaxNumber' && typeof this.ruleForm.BuyMaxNumber === 'number') {
        if (value > this.ruleForm.BuyMaxNumber) {
          callback(new Error(`${title}不能大于单客户可购买总份数：${this.ruleForm.BuyMaxNumber}`));
          return;
        }
      }
      callback();
    };
    const createRuleArray = title => [
      { pattern: /^\d+$/, message: `${title}必须为整数数字值` },
      { validator: (...args) => createValidator(args, title) }, // 数值验证 > 0 且 满足相互关系
    ];
    return {
      field: '添加',
      ruleForm: null,
      rules: {
        BeanNumber: [
          { required: true, message: '印豆数量不能为空' },
          ...createRuleArray('印豆数量'),
        ],
        Price: [
          { required: true, message: '价格不能为空' },
          { pattern: /(^\d*[1-9]\d*(\.\d{1,2})?$)|0\.(\d?[1-9]|[1-9]\d?)$/, message: '价格必须大于0且最多允许2位小数' },
        ],
        TotalNumber: createRuleArray('总份数'),
        BuyMaxNumber: createRuleArray('可购买总份数'),
        DayBuyMaxNumber: createRuleArray('每日可购买份数'),
      },
    };
  },
  computed: {
    title() {
      return `${this.field}`;
    },
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
    disabled() { // 仅作用于印豆数量和价格 -- 在已经开始的时候不允许进行编辑 -- 当前新增的条目不算
      return (this.isStarted && this.editData && typeof this.editData.ID === 'number');
    },
  },
  methods: {
    onOpen() {
      this.field = this.editData ? '编辑' : '添加';
      this.ruleForm = new PrintBeanTableItemClass(this.editData);
    },
    onClosed() {
      this.ruleForm = null;
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('save', this.ruleForm);
        }
      });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-print-bean-setup-right-bean-table-item-dialog-comp-wrap {
  &.mp-img-style-header .el-dialog__header > span {
    color: #888E99;
    font-size: 15px;
  }
  .el-dialog__body {
    padding-top: 56px;
    padding-bottom: 5px;
    .recharge-ruleForm {
      > .el-form-item {
        .el-form-item__label {
          color: #888E99;
        }
        .el-form-item__content {
          color: #585858;
          .el-input {
            width: 126px;
            margin-right: 6px;
            input {
              border-radius: 3px;
              &::placeholder {
                color: #a2a2a2;
              }
            }
          }
          .remark, .unit {
            font-size: 12px;
            color: #a2a2a2;
          }
          .remark {
            position: relative;
            top: -10px;
            user-select: none;
          }
          .tips-box {
            font-size: 12px;
            display: inline-block;
            width: 220px;
            margin-left: 18px;
          }
        }
        &.price {
          margin-bottom: 35px;
        }
      }
    }
  }
}
</style>
