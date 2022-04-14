<template>
  <CommonDialogComp
    width="500px"
    top='30vh'
    title="挂起"
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
      <el-form-item style="margin:0" label="挂起原因" prop="pass">
        <el-input type="textarea" placeholder="请输入挂起原因" autocomplete="off"></el-input>
        <el-checkbox v-model="a">挂起原因前台客户可见</el-checkbox>
      </el-form-item>
      <el-form-item style="margin:0" label="下次处理时间：" prop="checkPass">
        <div>
          <el-date-picker
            style="width:180px;margin-right:15px"
            v-model="value1"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
           <el-checkbox v-model="a">不确定</el-checkbox>
        </div>
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
