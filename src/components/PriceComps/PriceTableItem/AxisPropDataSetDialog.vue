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
    class="mp-erp-comps-price-module-price-table-item-axis-prop-data-set-dialog-comp-wrap"
    :class="showGroup?'show-group':''"
  >
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
      title: '添加费用',
      ruleForm: {
      },
    };
  },
  methods: {
    async onSubmit() { // 提交
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
      this.title = this.saveData.ID ? '编辑费用' : '添加费用';
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-table-item-axis-prop-data-set-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 30px;
    padding-bottom: 10px;
    padding-top: 30px;
    min-height: 163px;
  }
}
</style>
