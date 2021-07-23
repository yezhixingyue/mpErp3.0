<template>
  <CommonDialogComp
    width="750px"
    top='8vh'
    :title="`设置${title}库存预警`"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-pruduct-module-stock-page-stock-warn-set-dialog-comp-wrap"
   >
    <div class="title">
      <!-- <span>规格： {{title}}全部规格通用</span> -->
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="204px" class="demo-ruleForm" hide-required-asterisk>
      <el-form-item label="" prop="MinNumber">
        <span class="label">库存数量 <i>≤</i></span>
        <el-input v-model.number.trim="ruleForm.MinNumber" size="small"></el-input>
        <span class="label">个时预警</span>
      </el-form-item>
      <el-form-item label="接收短信预警手机号：" prop="Mobile">
        <el-input v-model="ruleForm.Mobile" size="small" maxlength="200"></el-input>
      </el-form-item>
    </el-form>
    <p class="tips-box"> <i class="el-icon-warning"></i> 注：不填写则不进行短信预警，多个手机号用空格分开</p>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import { MobileReg } from '@/assets/js/utils/regexp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    WarningMobile: {
      type: String,
      default: '',
    },
    MinNumber: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      ruleForm: {
        MinNumber: '',
        Mobile: '',
      },
      rules: {
        MinNumber: [
          { required: true, message: '请输入库存数量', trigger: 'blur' },
          { type: 'integer', min: -1, message: '库存数量必须为大于等于-1的整数,可为0或-1', trigger: 'blur' },
        ],
        Mobile: [
          // { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: this.MobilesChecker, trigger: 'blur' },
        ],
      },
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
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.$refs.ruleForm.resetFields();
    },
    initEditData() { // 数据初始化方法
      this.ruleForm.MinNumber = this.MinNumber ? +this.MinNumber : '';
      this.ruleForm.Mobile = this.WarningMobile;
    },
    MobilesChecker(rule, value, callback) {
      if (value === '') {
        callback();
        return;
      }
      const mobiles = value.split(' ');
      for (let i = 0; i < mobiles.length; i += 1) {
        const mobile = mobiles[i];
        const indexText = mobiles.length > 1 ? `第${i + 1}个` : '';
        if (mobile.length !== 11) {
          callback(new Error(`${indexText}手机号码长度不正确`));
          return;
        }
        if (!MobileReg.test(mobile)) {
          callback(new Error(`${indexText}手机号码格式不正确`));
          return;
        }
      }
      const len1 = mobiles.length;
      const len2 = [...new Set(mobiles)].length;
      if (len1 > len2) {
        callback(new Error('存在重复手机号 请检查'));
        return;
      }
      callback();
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-stock-page-stock-warn-set-dialog-comp-wrap {
  .el-dialog__body {
    font-size: 14px;
    padding-left: 50px;
    padding-right: 20px;
    height: 348px;
    .el-form-item {
      .el-form-item__content .el-input {
        width: 400px;
      }
      &:first-of-type .el-form-item__content {
        .el-input {
          width: 110px;
          margin: 0 10px;
        }
      }
      .el-form-item__label, .label {
        font-size: 14px;
        color: #888E99;
      }
      .label i {
        margin-left: 12px;
      }
    }
    .tips-box {
      margin-left: 160px;
      width: 420px;
    }
    .title {
      padding-left: 160px;
      padding-bottom: 70px;
      // padding-top: 20px;
      color: #585858;
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
