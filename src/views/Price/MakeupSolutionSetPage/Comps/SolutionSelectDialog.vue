<template>
  <CommonDialogComp
    width="700px"
    top='15vh'
    :title="title"
    :visible="visible"
    :disabled='!radio && radio !== 0 && radio !== ""'
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-price-module-price-item-makeup-solution-set-dialog-comp-wrap"
  >
    <el-radio-group v-model="radio">
      <el-radio v-for="it in list" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
    </el-radio-group>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => [],
    },
    initData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    title() {
      return this.initData ? `选择${this.initData.SolutionTypeName}` : '选择方案';
    },
  },
  data() {
    return {
      radio: '',
    };
  },
  methods: {
    onSubmit() { // 提交
      if (this.radio === this.initData.Solution?.ID || (this.radio === '' && this.initData.Solution === null)) {
        this.messageBox.failSingle('选中方案未发生更改');
        return;
      }
      this.$emit('select', this.radio);
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
    },
    initEditData() { // 数据初始化方法
      this.radio = '';
      if (this.initData) this.radio = this.initData.Solution?.ID || '';
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-item-makeup-solution-set-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 60px;
    padding-bottom: 40px;
    padding-top: 50px;
    height: 135px;
    position: relative;
    .el-radio-group {
      .el-radio {
        margin-right: 10px;
        width: 145px;
        margin-bottom: 8px;
        .el-radio__label {
          max-width: 10em;
          font-size: 12px;
          line-height: 18px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          display: inline-block;
          vertical-align: bottom;
        }
      }
    }
  }

}
</style>
