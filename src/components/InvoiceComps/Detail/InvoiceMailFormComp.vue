<template>
  <div class="mail-info">
    <p class="blue-v-line is-bold is-blue">邮寄信息</p>
    <el-form :inline="true" :model="formForMail" class="mail-form-inline" size="small" :rules="rules" ref="oFormForMail" @submit.native.prevent>
      <el-form-item label="快递公司：" prop="ExpressCompany">
        <el-input v-model.trim="formForMail.ExpressCompany" maxlength="20" placeholder="请填写快递公司"></el-input>
      </el-form-item>
      <el-form-item label="快递单号：" prop="ExpressNumber">
        <el-input v-model.trim="formForMail.ExpressNumber" maxlength="18" placeholder="请填写快递单号"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formForMail: {
        ExpressCompany: '',
        ExpressNumber: '',
      },
      rules: {
        ExpressCompany: [
          { required: true, message: '请输入快递公司名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
        ],
        ExpressNumber: [
          { required: true, message: '请输入配送单号', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs.oFormForMail.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.formForMail);
        }
      });
    },
  },
};
</script>
<style lang='scss'>
</style>
