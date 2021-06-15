<template>
  <CommonDialogComp
    width="700px"
    top='18vh'
    :title="title"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-print-breadth-save-dialog-comp-wrap"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="138px"
      class="file-ruleForm"
      size='small'
      v-if="ruleForm"
    >
      <el-form-item label="名称：" prop="Name" key="FileName">
        <el-input style="width:350px" v-model.trim="ruleForm.Name" placeholder="请输入印刷幅面名称" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="最小物料尺寸：" key="MinMaterialSize">
        <el-col :span="6.6">
          <el-form-item prop="MinMaterialSize.Length">
            <el-input style="width:110px" v-model.trim.number="ruleForm.MinMaterialSize.Length" maxlength="20" placeholder="长"></el-input>
            <span style="margin: 0 10px">X</span>
          </el-form-item>
        </el-col>
        <el-col :span="6.6">
          <el-form-item prop="MinMaterialSize.Width">
            <el-input style="width:110px" v-model.trim.number="ruleForm.MinMaterialSize.Width" maxlength="20" placeholder="宽"></el-input>
            <span style="margin-left:10px;color:#a2a2a2">mm</span>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="最大物料尺寸：" key="MaxMaterialSize">
        <el-col :span="6.6">
          <el-form-item prop="MaxMaterialSize.Length">
            <el-input style="width:110px" v-model.trim.number="ruleForm.MaxMaterialSize.Length" maxlength="20" placeholder="长"></el-input>
            <span style="margin: 0 10px">X</span>
          </el-form-item>
        </el-col>
        <el-col :span="6.6">
          <el-form-item prop="MaxMaterialSize.Width">
            <el-input style="width:110px" v-model.trim.number="ruleForm.MaxMaterialSize.Width" maxlength="20" placeholder="宽"></el-input>
            <span style="margin:0 10px;color:#a2a2a2">mm</span>
          </el-form-item>
        </el-col>
        <span class="tips-box"><i class="el-icon-warning"></i> 注：最小最大物料尺寸包含白边</span>
      </el-form-item>
      <el-form-item label="分类：" prop="Class" key="ruleFormClass">
        <el-select v-model="localClass" placeholder="请选择分类" style="width:140px">
          <el-option v-for="it in classList" :key="it.ID" :label="it.Name" :value="it.ID"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="允许拼版方式：" prop="ModeList" key="ruleFormModeList">
        <div v-for="it in ruleForm.ModeList" :key="it.key" class="MakeupMode-box">
          <el-checkbox v-model="it.checked">{{it.Name}}</el-checkbox>
          <template v-if="it.checked">
            <span style="margin:0 4px 0 28px;">白边：</span>
            <el-input style="width:100px" v-model.trim.number="it.WhiteEdge.Length" maxlength="20" placeholder="长"></el-input>
            <el-input style="width:100px;margin-left:25px" v-model.trim.number="it.WhiteEdge.Width" maxlength="20" placeholder="宽"></el-input>
            <span style="margin-left:10px;color:#a2a2a2">mm</span>
          </template>
        </div>
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import PrintBreadth from '@/assets/js/TypeClass/PrintBreadth';

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
    classList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    localClass: { // 转换PrintBreadth中的class属性  不再在类中进行转换了
      get() {
        return this.ruleForm.Class ? this.ruleForm.Class.ID : '';
      },
      set(ID) {
        const t = this.classList.find(it => it.ID === ID);
        if (t) this.ruleForm.Class = t;
      },
    },
  },
  data() {
    return {
      title: '添加印刷幅面',
      ruleForm: null,
      rules: {
        Name: [
          { required: true, message: '请输入印刷幅面名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
        ],
        MinMaterialSize: {
          Length: [
            { required: true, message: '长值不能为空' },
            { type: 'number', min: 1, message: '请输入正整数数值' },
          ],
          Width: [
            { required: true, message: '短值不能为空' },
            { type: 'number', min: 1, message: '请输入正整数数值' },
          ],
        },
        MaxMaterialSize: {
          Length: [
            { required: true, message: '长值不能为空' },
            { type: 'number', message: '请输入正整数数值或-1' },
            { validator: this.MaxMaterialSizeLength, trigger: 'blur' },
          ],
          Width: [
            { required: true, message: '短值不能为空' },
            { type: 'number', message: '请输入正整数数值或-1' },
            { validator: this.MaxMaterialSizeWidth, trigger: 'blur' },
          ],
        },
        Class: [
          { required: true, message: '请选择所属分型', trigger: 'change' },
        ],
        ModeList: [
          { validator: this.checkModeList, trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      const validateBool = await this.$refs.ruleForm.validate().catch(() => {});
      if (validateBool) {
        const data = PrintBreadth.formatSubmit(this.ruleForm); // 就差转换了
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
      this.ruleForm = new PrintBreadth(this.curData);
      this.title = this.curData ? '编辑印刷幅面' : '添加印刷幅面';
    },
    checkModeList(rule, value, callback) { // 校验拼版方式 及 白边数值限制
      if (!value || !Array.isArray(value) || value.length === 0) {
        callback(new Error('拼版方式值获取错误，请刷新重试'));
        return;
      }
      const checkedList = value.filter(it => it.checked);
      if (checkedList.length === 0) {
        callback(new Error('请选择拼版方式'));
        return;
      }
      let t = checkedList.find(it => it.WhiteEdge.Length === '' || it.WhiteEdge.Width === '');
      if (t) {
        callback(new Error('请设置白边，如果不想在此处设置白边的话可设为0'));
        return;
      }
      t = checkedList.find(it => !Number.isInteger(it.WhiteEdge.Length) || !Number.isInteger(it.WhiteEdge.Width)
       || it.WhiteEdge.Length < 0 || it.WhiteEdge.Width < 0);
      if (t) {
        callback(new Error('请输入大于等于0的整数类型数字值'));
        return;
      }
      t = checkedList.find(it => (this.ruleForm.MinMaterialSize.Length && it.WhiteEdge.Length >= this.ruleForm.MinMaterialSize.Length)
      || (this.ruleForm.MinMaterialSize.Width && it.WhiteEdge.Width >= this.ruleForm.MinMaterialSize.Width));
      if (t) {
        callback(new Error('白边长值和宽值不能大于等于最小物料尺寸的对应长值和宽值'));
        return;
      }
      callback();
    },
    MaxMaterialSizeLength(rule, value, callback) { // 校验最大物料尺寸
      if (value <= 0 && value !== -1) {
        callback(new Error('请输入正整数数值或-1'));
        return;
      }
      if (this.ruleForm.MinMaterialSize.Length && value < this.ruleForm.MinMaterialSize.Length && value !== -1) {
        callback(new Error('不能小于最小物料尺寸长'));
        return;
      }
      callback();
    },
    MaxMaterialSizeWidth(rule, value, callback) { // 校验最大物料尺寸
      if (value <= 0 && value !== -1) {
        callback(new Error('请输入正整数数值或-1'));
        return;
      }
      if (this.ruleForm.MinMaterialSize.Width && value < this.ruleForm.MinMaterialSize.Width && value !== -1) {
        callback(new Error('不能小于最小物料尺寸宽'));
        return;
      }
      callback();
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-print-breadth-save-dialog-comp-wrap {

  .el-dialog__body {
    .MakeupMode-box {
      height: 34px;
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
  }
  .el-checkbox__label {
    font-size: 12px;
  }
  .el-col {
    height: 34px;
  }
}
</style>
