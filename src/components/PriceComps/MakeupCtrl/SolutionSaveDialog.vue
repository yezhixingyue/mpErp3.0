<template>
  <CommonDialogComp
    width="700px"
    top='15vh'
    :title="title"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-price-module-price-item-save-dialog-comp-wrap"
  >
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" hide-required-asterisk>
      <el-form-item
        label="方案名称："
        prop='Name'
        :rules="[
          { required: true, message: '方案名称不能为空'}
        ]"
      >
        <el-input v-model.trim="ruleForm.Name" show-word-limit maxlength="8" size="small"></el-input>
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
    saveData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
  },
  data() {
    return {
      title: '添加方案',
      ruleForm: {
        ID: '',
        Name: '',
        Type: '',
        ProductID: '',
      },
    };
  },
  methods: {
    async onSubmit() { // 提交
      const bool = await this.$refs.ruleForm.validate().catch(() => {});
      if (bool) this.$emit('submit', this.ruleForm);
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
      this.title = this.saveData.ID ? '编辑方案' : '添加方案';
      this.ruleForm = { ...this.saveData };
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-item-save-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 100px;
    padding-bottom: 10px;
    padding-top: 90px;
    height: 135px;
    .el-form {
      .el-form-item__label {
        font-size: 14px;
        color: #888E99;
      }
      .el-input {
        width: 350px;
      }
    }
  }

}
</style>
