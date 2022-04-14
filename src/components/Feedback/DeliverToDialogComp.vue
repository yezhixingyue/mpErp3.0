<template>
  <CommonDialogComp
    width="500px"
    top='30vh'
    title="转他人处理"
    :visible.sync="visible"
    cancelText='取消'
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    @submit="onSubmit"
    class="mp-erp-comps-customer-setup-module-customer-detail-display-dialog-comp-wrap"
   >
   <template>
    <el-form :model="PostponeRuleForm" status-icon ref="ruleForm" label-width="110px" class="demo-ruleForm" label-position="left">
      <el-form-item label="选择人员：" prop="pass">
        <el-select style="width:100%;" v-model="value1" placeholder="请选择转交人">
          <el-option
            label="里斯"
            :value="1">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="转交原因：" prop="checkPass">
        <el-input type="textarea" placeholder="请输入挂起原因" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
   </template>
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

  },
  components: {
    CommonDialogComp,
  },
  computed: {
    PermissionObj() {
      if (this.Permission?.PermissionList?.PermissionManageCustomer?.Obj) {
        return this.Permission.PermissionList.PermissionManageCustomer.Obj;
      }
      return {};
    },


  },
  data() {
    return {
      a: false,
      value1: '',
      loading: false,
      PostponeRuleForm: {},
    };
  },
  methods: {
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    async onSubmit() { // 仅价格详情使用

    },
    onOpen() {
      this.getCustomerData();
    },
    onClosed() {
    },
    async getCustomerData() { // 获取客户数据
      this.loading = true;

      this.loading = false;
    },

  },
};
</script>
<style lang='scss'>

</style>
