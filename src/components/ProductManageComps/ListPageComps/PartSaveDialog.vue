<template>
  <CommonDialogComp
    width="800px"
    top='13vh'
    :title="title"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-pruduct-module-part-save-dialog-comp-wrap"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="188px"
      class="file-ruleForm"
      size='small'
      @submit.native.prevent
      v-if="ruleForm"
    >
      <el-form-item label="名称：" prop="Name" key="FileName">
        <el-input style="width:350px" v-model.trim="ruleForm.Name" placeholder="请输入部件名称" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="使用次数：" prop="UseTimes" class="use-times-box" key="GroupUseTimes">
        <el-input style='width:110px' :disabled='isEdit&&curData.UseTimes.MinValue===1&&curData.UseTimes.MaxValue===1' maxlength="9"
         v-model.number.trim="ruleForm.UseTimes.MinValue"></el-input>
        <span>≤ 次数 ≤</span>
        <el-input style='width:110px' :disabled='isEdit&&curData.UseTimes.MinValue===1&&curData.UseTimes.MaxValue===1' maxlength="9"
         v-model.number.trim="ruleForm.UseTimes.MaxValue"></el-input>
      </el-form-item>
      <!-- <el-form-item label="编辑时，需要注意以下几点：">
        <p class="tips-box">①、 使用次数1至1次时：使用次数不能更改，影响很大</p>
        <p class="tips-box">②、 1至多次：不能改为1至1次，影响很大。改为0至多次，有些影响。</p>
        <p class="tips-box">③、 多至多次：不能改为1至1次，影响很大。改为0至多次，有些影响。</p>
      </el-form-item> -->
        <p class="remark">编辑时，需要注意以下几点：</p>
        <p class="tips-box"><i class="el-icon-warning"></i> 使用次数1至1次时：使用次数不能更改，影响很大。</p>
        <p class="tips-box"><i class="el-icon-warning"></i> 1至多次：不能改为1至1次，影响很大。改为0至多次，有些影响。</p>
        <p class="tips-box"><i class="el-icon-warning"></i> 多至多次：不能改为1至1次，影响很大。改为0至多次，有些影响。</p>
    </el-form>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
// import Part from '@/assets/js/TypeClass/PartClass';
import { normalNameReg } from '@/assets/js/utils/regexp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    curData: {
      type: Object,
      default: null,
    },
    ProductID: {
      type: String,
      default: '',
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      title: '添加部件',
      ruleForm: null,
      isEdit: false,
      rules: {
        Name: [
          { required: true, message: '请输入部件名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
          { pattern: normalNameReg, message: '名称仅支持中文、英文(全角/半角)、+-_(全角/半角)、数字(全角/半角)', trigger: 'blur' },
        ],
        UseTimes: [
          { validator: this.checkUseTimes, trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      const validateBool = await this.$refs.ruleForm.validate().catch(() => {});
      if (validateBool) {
        this.$emit('submit', this.ruleForm);
      }
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.ruleForm = null;
      this.isEdit = false;
    },
    initEditData() { // 数据初始化方法
      this.title = this.curData ? '编辑部件' : '添加部件';
      this.isEdit = !!this.curData;
      const temp = { ID: '', Name: '', UseTimes: { MinValue: '', MaxValue: '' }, ProductID: this.ProductID };
      if (this.isEdit) {
        const { ID, Name, UseTimes } = this.curData;
        temp.ID = ID;
        temp.Name = Name;
        temp.UseTimes = { ...UseTimes };
      }
      this.ruleForm = temp;
    },
    checkUseTimes(rule, value, callback) { // 使用次数校验规则
      if (!value) {
        callback(new Error('未获取到填写数值'));
        return;
      }
      const { MinValue, MaxValue } = value;
      // 1. 必填   2. 可以为0 但不能同时为0  3. 最大值必须大于等于最小值  4. 不能为负，最大不可设为-1  5. 可以均不填写 代表不限制 (不行 取消该条)
      if ((!MinValue && MinValue !== 0) || (!MaxValue && MaxValue !== 0)) {
        callback(new Error('请填写和补充最大最小值'));
        return;
      }
      if (!this.$utils.isPositiveInteger(MinValue, false, true)) {
        callback(new Error('最小值应为数字类型且不小于0'));
        return;
      }
      if (!this.$utils.isPositiveInteger(MaxValue)) {
        callback(new Error('最大值应为数字类型且必须为正整数'));
        return;
      }
      if (MinValue === 0 && MaxValue === 0) {
        callback(new Error('最大最小值不能同时为0'));
        return;
      }
      if (MinValue < 0 || MaxValue < 0) {
        callback(new Error('输入值不能为负，最大值不可设为-1'));
        return;
      }
      if (MaxValue < MinValue) {
        callback(new Error('最大值不能小于最小值'));
        return;
      }
      if (this.isEdit && this.curData) {
        if (this.curData.UseTimes.MinValue > 0 && this.curData.UseTimes.MaxValue > 1) { // 1至多次 多至多次
          if (MaxValue === 1 && MinValue === 1) { // 不能改为1至1次
            callback(new Error('1至多次及多至多次均不能改为1至1次'));
            return;
          }
          if (MinValue === 0 && MaxValue > 1) { // 不能0至多次
            callback(new Error('1至多次及多至多次均不能改为0至多次'));
            return;
          }
        }
      }
      callback();
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-part-save-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 55px;
    padding-top:82px;
    padding-bottom: 120px;
    input {
      font-size: 12px;
    }
    .use-times-box {
      margin-top: 40px;
      margin-bottom: 40px;
      .el-form-item__content {
        > span {
          font-size: 14px;
          margin: 0 10px;
          color: #a2a2a2;
        }
      }
    }
    .tips-box {
      margin-bottom: 8px;
      margin-left: 185px;
      width: 440px;
      letter-spacing: 1px;
      &:first-of-type {
        margin-top: 2px;
      }
    }
    .remark {
      margin-left: 18px;
      font-size: 12px;
      color: #a2a2a2;
      position: relative;
      top: 20px;
      width: 170px;
    }
  }

  // 公共部分
  &.mp-erp-common-dialog-comp-wrap .el-dialog__footer > .dialog-footer {
    padding-bottom: 20px;
    > button {
      height: 35px;
      border-radius: 3px;
      &.el-button--default {
        border-color: #26bcf9;
        color: #26bcf9;
        &:active {
          border-color: #428dfa;
          color: #428dfa;
        }
      }
      &.el-button--primary {
        background: linear-gradient(to right, #26bcf9, #35dff9);
        border: none;
        &:hover {
          opacity: 0.88;
        }
        &:active {
          background: linear-gradient(to right, #428dfa, #26bcf9);
        }
      }
    }
  }
  .el-form-item__label {
    color: #888E99;
    &::before {
      display: none;
    }
  }
  input {
    border-radius: 3px;
  }
}
</style>
