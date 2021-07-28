<template>
  <CommonDialogComp
    width="750px"
    top='15vh'
    :title="title"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-material-size-save-dialog-comp-wrap"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="118px"
      class="ruleForm"
      size='small'
      v-if="ruleForm"
    >
      <el-form-item label="尺寸名称：" prop="Name" key="MaterialSizeName">
        <el-input style="width:350px" v-model.trim="ruleForm.Name" placeholder="请输入尺寸名称" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="长度：" prop="Length" key="MaterialSizeLength" class="size-content">
        <el-radio-group v-model="ruleForm.SingleLenRadio">
          <el-radio :label="true">单个尺寸</el-radio>
          <el-radio :label="false">多个尺寸</el-radio>
        </el-radio-group>
        <p v-if="ruleForm.SingleLenRadio" key="isSingleLenRadio">
          <el-input style="width:110px" v-model.trim.number="ruleForm.SingleLength" maxlength="9"></el-input>
          <span class="text">mm</span>
        </p>
        <p v-else key="isNotSingleLenRadio">
          <el-input style="width:110px" v-model.trim.number="ruleForm.MinLength" maxlength="9"></el-input>
          <span class="text">≤ 长度 ≤</span>
          <el-input style="width:110px;margin-right:12px" v-model.trim.number="ruleForm.MaxLength" maxlength="9"></el-input>
          <span class="text">增量：</span>
          <el-input style="width:110px" v-model.trim.number="ruleForm.LengthIncrement" maxlength="9"></el-input>
          <span class="text">mm</span>
        </p>
        <el-checkbox v-model="ruleForm.IsLengthSplit">长度可加工</el-checkbox>
      </el-form-item>
      <el-form-item label="宽度：" prop="Width" key="MaterialSizeWidth" class="size-content">
        <el-radio-group v-model="ruleForm.SingleWidthRadio">
          <el-radio :label="true">单个尺寸</el-radio>
          <el-radio :label="false">多个尺寸</el-radio>
        </el-radio-group>
        <p v-if="ruleForm.SingleWidthRadio" key="isSingleWidthRadio">
          <el-input style="width:110px" v-model.trim.number="ruleForm.SingleWidth" maxlength="9"></el-input>
          <span class="text">mm</span>
        </p>
        <p v-else key="isNotSingleWidthRadio">
          <el-input style="width:110px" v-model.trim.number="ruleForm.MinWidth" maxlength="9"></el-input>
          <span class="text">≤ 宽度 ≤</span>
          <el-input style="width:110px;margin-right:12px" v-model.trim.number="ruleForm.MaxWidth" maxlength="9"></el-input>
          <span class="text">增量：</span>
          <el-input style="width:110px" v-model.trim.number="ruleForm.WidthIncrement" maxlength="9"></el-input>
          <span class="text">mm</span>
        </p>
        <el-checkbox v-model="ruleForm.IsWidthSplit">宽度可加工</el-checkbox>
      </el-form-item>
      <el-form-item>
        <p class="tips-box"><i class="el-icon-warning"></i> 注：尺寸可加工指的是该物料是否可以改变固有尺寸，例如纸张开白料</p>
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import MaterialSizeClass from '@/assets/js/TypeClass/MaterialSizeClass';

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
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      title: '添加物料尺寸',
      ruleForm: null,
      rules: {
        Name: [
          { required: true, message: '请输入尺寸名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
        ],
        Length: [
          { validator: this.checkLength, trigger: 'change' },
        ],
        Width: [
          { validator: this.checkWidth, trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      const validateBool = await this.$refs.ruleForm.validate().catch(() => {});
      if (validateBool) {
        const data = MaterialSizeClass.formatSubmit(this.ruleForm); // 就差转换了
        this.$emit('submit', data);
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
    },
    initEditData() { // 数据初始化
      this.ruleForm = new MaterialSizeClass(this.curData);
      this.title = this.curData ? '编辑物料尺寸' : '添加物料尺寸';
    },
    getCheckRes(radio, single, min, max, increment) {
      const { isPositiveInteger } = this.$utils;
      if (radio) {
        if (!isPositiveInteger(single, true)) {
          return '必须为正整数类型数字值，请填写或检查输入，不能为0，单尺寸可为-1';
        }
        return true;
      } if (!isPositiveInteger(min) || !isPositiveInteger(max, true) || !isPositiveInteger(increment)) {
        return '请填写或补充正整数类型数字值，如已输入请检查输入值类型是否正确，不能为0，仅最大值可为-1（无穷大）';
      } if (max <= min && max !== -1) {
        return '最大值必须大于最小值';
      } if (increment > max - min && max !== -1) {
        return '增量大小不能大于最大最小值最大范围区间差值';
      }
      return true;
    },
    checkLength(rule, value, callback) { // 校验长度
      const { SingleLenRadio, SingleLength, MinLength, MaxLength, LengthIncrement } = this.ruleForm;
      // 需要判断： 1 是否为空 2 是否为数字类型 3 必须大于0   4 单个尺寸和多个尺寸的最大值可为-1   5. 最大值必须大于最小值  6.增量必填 必须大于0
      const res = this.getCheckRes(SingleLenRadio, SingleLength, MinLength, MaxLength, LengthIncrement);
      if (typeof res === 'string') {
        callback(new Error(res));
      } else {
        callback();
      }
    },
    checkWidth(rule, value, callback) { // 校验长度
      const { SingleWidthRadio, SingleWidth, MinWidth, MaxWidth, WidthIncrement } = this.ruleForm;
      // 需要判断： 1 是否为空 2 是否为数字类型 3 必须大于0   4 单个尺寸和多个尺寸的最大值可为-1   5. 最大值必须大于最小值  6.增量必填 必须大于0
      const res = this.getCheckRes(SingleWidthRadio, SingleWidth, MinWidth, MaxWidth, WidthIncrement);
      if (typeof res === 'string') {
        callback(new Error(res));
      } else {
        callback();
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-material-size-save-dialog-comp-wrap {

  .el-dialog__body {
    .tips-box {
      margin-top: 6px;
      width: 500px;
    }
    .size-content {
      padding-bottom: 10px;
      span.text {
        margin: 0 10px;
        color: #A2A2A2;
      }
      input {
        text-align: center;
      }
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
  .el-form-item__content {
    font-size: 12px;
    color: #585858;
  }
  input {
    border-radius: 3px;
    font-size: 12px;
    height: 30px !important;
    line-height: 30px !important;
  }
  .el-checkbox__label {
    font-size: 12px;
  }
  .el-col {
    height: 34px;
  }
  .el-radio__label {
    font-size: 12px;
  }
}
</style>
