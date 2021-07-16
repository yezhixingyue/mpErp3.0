<template>
  <CommonDialogComp
    width="800px"
    top='8vh'
    title="修改库存"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-pruduct-module-stock-page-stock-number-change-dialog-comp-wrap"
   >
    <div class="title">
      <span>规格：</span>
      <div class="content mp-scroll-wrap" v-if="itemData">
        <p v-if="typeof itemData._ConditionText === 'string'">{{itemData._ConditionText}}</p>
        <template v-else>
          <p v-for="(_it, i) in itemData._ConditionText" :key="_it.name + 'tips' + i">
            <span v-if="i > 0" class="type">{{itemData.Constraint.FilterType === 1 ? '且' : '或'}}</span>
            <span class="name">{{_it.name}}</span>
            <span class="is-origin">{{_it.operator}}</span>
            <span class="val">{{_it.val}}</span>
            <span v-if="i === itemData._ConditionText.length - 1 && i !== 0" style="margin-left:2px"> 。</span>
            <span v-else style="margin-left:2px">；</span>
          </p>
        </template>
      </div>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm" hide-required-asterisk>
      <el-form-item label="新库存：" prop="number">
        <el-input v-model.number.trim="ruleForm.number" size="small"></el-input>
        <span class="label">{{Unit}}</span>
        <span class="label is-font-size-12" style="margin-left:8px">（ -1代表无穷大 ）</span>
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    itemData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      ruleForm: {
        id: '',
        number: '',
      },
      rules: {
        number: [
          { required: true, message: '请输入库存数量', trigger: 'blur' },
          { type: 'integer', min: -1, message: '库存数量必须为大于等于-1的整数,可为0或-1', trigger: 'blur' },
          { validator: this.NumberChecker, trigger: 'blur' },
        ],
      },
      Unit: '',
    };
  },
  computed: {
  },
  methods: {
    async onSubmit() {
      const bool = await this.$refs.ruleForm.validate().catch(() => {});
      if (bool) {
        this.$emit('submit', this.ruleForm);
      }
    },
    NumberChecker(rule, value, callback) {
      if (value === this.itemData.Number) {
        callback(new Error('库存数量未发生更改'));
      }
      callback();
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.Unit = '';
      this.ruleForm.number = '';
      this.ruleForm.id = '';
      this.$refs.ruleForm.resetFields();
    },
    initEditData() { // 数据初始化方法
      if (!this.itemData) return;
      const { Number, ID, Unit } = this.itemData;
      this.ruleForm.number = Number;
      this.ruleForm.id = ID;
      this.Unit = Unit;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-stock-page-stock-number-change-dialog-comp-wrap {
  .el-dialog__body {
    font-size: 14px;
    padding-left: 70px;
    padding-right: 20px;
    min-height: 348px;
    max-height: 460px;
    .el-form-item {
      .el-input {
        width: 200px;
        margin-right: 8px;
      }
      .el-form-item__label, .label {
        font-size: 14px;
        color: #888E99;
      }
    }
    .tips-box {
      margin-left: 160px;
      width: 420px;
    }
    .title {
      padding-left: 152px;
      padding-bottom: 70px;
      padding-top: 10px;
      color: #585858;
      display: flex;
      > span {
        flex: none;
      }
      > div.content {
        width: 480px;
        max-height: 270px;
        overflow-y: auto;
        p {
          margin-bottom: 8px;
          .type {
            color: #999;
          }
          &:first-of-type {
            margin-left: 1em;
          }
        }
      }
    }
  }
  .el-dialog__footer {
    .dialog-footer {
      button + button {
        margin-left: 35px;
      }
    }
  }
}
</style>
