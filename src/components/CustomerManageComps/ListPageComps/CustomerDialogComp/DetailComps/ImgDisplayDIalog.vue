<template>
  <CommonDialogComp
    width="800px"
    top='10vh'
    title="营业执照照片"
    :visible.sync="visible"
    :showSubmit="false"
    cancelText="关闭"
    @cancle="onCancle"
    class="mp-erp-comps-customer-setup-module-customer-detail-display-authen-info-img-display-dialog-comp-wrap"
   >
   <el-image :src="url" fit='contain' :preview-src-list="[url]" :mpCloseViewer='()=>{}'></el-image>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../../common/NewComps/CommonDialogComp.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      default: '',
    },
  },
  components: {
    CommonDialogComp,
  },
  methods: {
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-customer-setup-module-customer-detail-display-authen-info-img-display-dialog-comp-wrap {
  .el-dialog__body {
    padding: 20px 25px;
    .el-image {
      width: 100%;
      height: 480px;
    }
  }
}
</style>
