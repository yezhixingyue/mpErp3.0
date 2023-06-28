<template>
  <CommonDialogComp
    width="660px"
    :title="title"
    :visible.sync="localVisible"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    @closed="closed"
    class="mp-erp-review-output-file-setup-dialog-comp-wrap"
  >
    <el-form v-if="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="output-ruleForm" size="small" hide-required-asterisk>
      <el-form-item label="文件种类名称：" prop="Name">
        <el-input v-model.trim="ruleForm.Name" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="文件名称包含：" prop="IncludeContent">
        <el-input type="textarea" rows="4" v-model.trim="ruleForm.IncludeContent" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item>
        <p class="tips-box"><i class="el-icon-warning"></i>注：多个词条使用 “ | ” 分隔</p>
        <div>
          <el-checkbox v-model="ruleForm.IsPDF">PDF格式</el-checkbox>
          <transition name="el-fade-in-linear">
            <el-checkbox v-show="ruleForm.IsPDF" v-model="ruleForm.IsMakeup">需要拼版</el-checkbox>
          </transition>
          <transition name="el-fade-in-linear">
            <el-checkbox v-show="ruleForm.IsPDF" v-model="ruleForm.IsGenerateThumb">生成缩略图</el-checkbox>
          </transition>
        </div>
        <el-checkbox v-show="ruleForm.IsPDF" v-model="ruleForm.IsFromPrintFile">自动生成</el-checkbox>
        <span v-show="ruleForm.IsPDF" class="is-gray ft-12">( 使用 CDR 活动文档自动生成 PDF 文件 )</span>
      </el-form-item>
      <el-form-item label="摆放顺序：" prop="Index" v-if="ruleForm.IsPDF">
        <el-input style="width:100px;" v-model.number="ruleForm.Index" maxlength="4"></el-input>
        <span class="is-gray ft-12 ml-10">( 指CDR/AI 页面摆放顺序，自动生成时才生效 )</span>
      </el-form-item>
    </el-form>
    <p class="is-pink mt-10 ft-12 tip">注:文件是PDF格式时才可以检测尺寸、页数及生成缩略图等</p>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../../packages/CommonDialogComp';
import OutputFileFormClass from './OutputFileFormClass';
import { getFormatDateString } from '../../../../assets/js/utils/util';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: null,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
    title() {
      return this.item ? '编辑输出文件' : '添加输出文件';
    },
  },
  data() {
    return {
      ruleForm: null,
      rules: {
        Name: [
          { required: true, message: '请设置文件种类名称' },
          { validator: this.validateRepeat, trigger: 'blur' },
        ],
        IncludeContent: [
          { required: true, message: '请设置包含词条' },
          { pattern: /^[^|]+(\|[^|]+)*$/, message: '格式不正确', trigger: 'blur' },
        ],
        Index: [
          { required: true, message: '请设置摆放顺序' },
          { pattern: /^\d+$/, message: '请输入整数类型，且不能小于0' },
          { type: 'number', max: 5000, message: '摆放顺序值不能大于5000' },
        ],
      },
    };
  },
  methods: {
    onOpen() {
      this.ruleForm = new OutputFileFormClass(this.item);
    },
    submit() {
      if (!this.$refs.ruleForm) return;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.getOutputFileSave();
        }
      });
    },
    cancel() {
      this.localVisible = false;
    },
    closed() {
      this.ruleForm = null;
    },
    validateRepeat(rule, value, callback) {
      const t = this.list.find(it => it.ID !== this.ruleForm.ID && it.Name === value);
      if (t) {
        callback(new Error('名称重复'));
        return;
      }
      callback();
    },
    async getOutputFileSave() {
      const temp = this.ruleForm.getSubmitData();
      const resp = await this.api.getOutputFileSave(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const title = this.item ? '编辑成功' : '添加成功';
        const cb = () => {
          if (!temp.ID && temp.ID !== 0 && (resp.data.Data || resp.data.Data === 0)) {
            temp.ID = +resp.data.Data;
            temp.CreateTime = getFormatDateString();
          }
          this.$emit('submited', temp);
        };
        this.messageBox.successSingle(title, cb, cb);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-output-file-setup-dialog-comp-wrap {
  .output-ruleForm {
    margin-left: 20px;
    margin-right: 40px;
    height: 350px;
    input {
      border-radius: 3px;
    }
    .tips-box {
      margin-top: 2px;
      margin-bottom: 2px;
      width: 225px;
      background: #fff;
    }
    .is-pink {
      font-size: 12px;
    }
    .el-checkbox__label {
      font-size: 12px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .el-dialog__body {
    padding-bottom: 10px;
    .tip {
      margin-left: 160px;
    }
  }
}
</style>
