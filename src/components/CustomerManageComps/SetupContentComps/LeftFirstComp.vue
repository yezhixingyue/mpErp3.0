<template>
  <el-form v-if="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="customer-first-ruleForm-wrap"  @submit.native.prevent>
    <el-form-item label="客户简称：" prop="CustomerName" size="small">
      <el-input v-model.trim="ruleForm.CustomerName" maxlength="20" :disabled='!PermissionObj.EditOther && isEdit' placeholder="客户的简短称呼，方便识别"></el-input>
    </el-form-item>
    <el-form-item label="手机号：" prop="Mobile" size="small">
      <el-input v-model.trim="ruleForm.Mobile" maxlength="11" :disabled='!PermissionObj.EditMobile && isEdit' placeholder="手机号将作为客户的登录账号"></el-input>
    </el-form-item>
    <el-form-item label="QQ号：" prop="QQ" size="small">
      <el-input v-model.trim="ruleForm.QQ" maxlength="11" placeholder="客户传单的常用QQ号" :disabled='!PermissionObj.EditOther && isEdit'></el-input>
    </el-form-item>

    <el-form-item label="客户分类：" size="small">
      <el-select v-model="ruleForm.Type.First" placeholder="请选择" @change="onTypeChange" :disabled='!PermissionObj.EditType && isEdit'>
        <el-option
          v-for="item in userTypeListNoneEmpty"
          :key="item.CategoryID"
          :label="item.CategoryName"
          :value="item.CategoryID">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="客户等级：" size="small">
      <el-select v-model="ruleForm.Grade.First" placeholder="请选择" @change="onGradeChange" :disabled='!PermissionObj.EditGrade && isEdit'>
        <el-option
          v-for="item in userRankListNoneEmpty"
          :key="item.CategoryID"
          :label="item.CategoryName"
          :value="item.CategoryID">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="功能分类：" size="small">
      <el-select v-model="ruleForm.Feature.First" placeholder="请选择" @change="onFeatureChange" :disabled='!PermissionObj.EditFunction && isEdit'>
        <el-option
          label="无"
          :value="-777">
        </el-option>
        <el-option
          v-for="item in userfunctionClassEmpty"
          :key="item.CategoryID"
          :label="item.CategoryName"
          :value="Number(item.CategoryID)">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item size="mini">
      <el-checkbox v-model="ruleForm.Config.IsAcceptNotify">接收未付款订单提醒</el-checkbox>
    </el-form-item>
    <!-- <el-form-item label="企业名称：" prop="AuthenInfo.CompanyName" size="small">
      <el-input v-model.trim="ruleForm.AuthenInfo.CompanyName" maxlength="30"
       placeholder="须与营业执照上的名称一致" :disabled='!PermissionObj.EditOther && isEdit'></el-input>
    </el-form-item> -->
    <!-- <el-form-item label="纳税人识别号：" size="small">
      <el-input v-model.trim="ruleForm.AuthenInfo.TaxID" maxlength="20" placeholder="营业执照上的纳税人识别号" :disabled='!PermissionObj.EditOther && isEdit'></el-input>
    </el-form-item>
    <el-form-item label="法人：" size="small">
      <el-input v-model.trim="ruleForm.AuthenInfo.LegalMan" maxlength="10" placeholder="营业执照上的法人名称" :disabled='!PermissionObj.EditOther && isEdit'></el-input>
    </el-form-item>
    <el-form-item label="法人手机号：" prop="AuthenInfo.Mobile" size="small">
      <el-input v-model.trim="ruleForm.AuthenInfo.Mobile" maxlength="11" placeholder="法人的手机号码" :disabled='!PermissionObj.EditOther && isEdit'></el-input>
    </el-form-item> -->
    <!-- <el-form-item label="企业类型：" size="small">
      <el-select v-model="ruleForm.AuthenInfo.Type" placeholder="请选择" :disabled='!PermissionObj.EditOther && isEdit'>
        <el-option
          v-for="item in CompanyTypeEnumList"
          :key="item.ID"
          :label="item.Name"
          :value="item.ID">
        </el-option>
      </el-select>
      <el-select v-model="ruleForm.AuthenInfo.Scale" placeholder="请选择" :disabled='!PermissionObj.EditOther && isEdit'>
        <el-option
          v-for="item in CompanyScaleEnumList"
          :key="item.ID"
          :label="item.Name"
          :value="item.ID">
        </el-option>
      </el-select>
    </el-form-item> -->
    <!-- <el-form-item label="经营场所：" size="small">
      <el-select v-model="ruleForm.AuthenInfo.Place" placeholder="请选择" :disabled='!PermissionObj.EditOther && isEdit'>
        <el-option
          v-for="item in CompanyPlaceEnumList"
          :key="item.ID"
          :label="item.Name"
          :value="item.ID">
        </el-option>
      </el-select>
    </el-form-item> -->
    <!-- <el-form-item label="主营产品：" size="small">
      <el-button class="cancel-blue-btn" @click="onScopeArraySetupClick">选择主营产品</el-button>
      <ScopeArrayDialog v-model="ruleForm.AuthenInfo.ScopeArray" :visible.sync='visible' />
    </el-form-item> -->
  </el-form>
</template>

<script>
import { MobileReg } from '@/assets/js/utils/regexp';
import { mapState } from 'vuex';
import Customer from '@/store/customerManage/Customer';
import { CompanyTypeEnumList, CompanyPlaceEnumList, CompanyScaleEnumList } from '@/store/customerManage/Enums';
// import ScopeArrayDialog from './ScopeArrayDialog.vue';

export default {
  props: {
    customer: {
      type: Object,
      default: () => ({}),
    },
    PermissionObj: {
      type: Object,
      default: () => ({}),
    },
    isEdit: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    // ScopeArrayDialog,
  },
  computed: {
    ...mapState('common', ['userTypeListNoneEmpty', 'userRankListNoneEmpty', 'userfunctionClassEmpty']),
  },
  data() {
    return {
      ruleForm: null,
      rules: {
        CustomerName: [
          { required: true, message: '请输入客户简称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
        ],
        Mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '长度应为11位', trigger: 'blur' },
          { pattern: MobileReg, message: '手机号码格式不正确', trigger: 'blur' },
        ],
        QQ: [
          // { required: true, message: '请输入QQ号码', trigger: 'blur' },
          { min: 5, max: 11, message: 'QQ长度应在5 - 11位之间', trigger: 'blur' },
          { pattern: /^\d+$/, message: 'QQ应为纯数字组成', trigger: 'blur' },
        ],
        AuthenInfo: {
          Mobile: [
            { min: 11, max: 11, message: '长度应为11位', trigger: 'blur' },
            { pattern: MobileReg, message: '手机号码格式不正确', trigger: 'blur' },
          ],
        },
      },
      CompanyTypeEnumList,
      CompanyPlaceEnumList,
      CompanyScaleEnumList,
      visible: false,
    };
  },
  methods: {
    async initData() {
      this.ruleForm = new Customer(this.customer);
      await this.$store.dispatch('common/getUserClassify');
      if (!this.ruleForm.Type.First && this.ruleForm.Type.First !== 0 && this.userTypeListNoneEmpty.length > 0) {
        this.ruleForm.Type.First = this.userTypeListNoneEmpty[0].CategoryID;
        this.ruleForm.Type.Second = this.userTypeListNoneEmpty[0].CategoryName;
      }
      if (!this.ruleForm.Grade.First && this.ruleForm.Grade.First !== 0 && this.userRankListNoneEmpty.length > 0) {
        this.ruleForm.Grade.First = this.userRankListNoneEmpty[0].CategoryID;
        this.ruleForm.Grade.Second = this.userRankListNoneEmpty[0].CategoryName;
      }
      if (!this.ruleForm.Feature.First && this.ruleForm.Feature.First !== 0 && this.userfunctionClassEmpty.length > 0) {
        this.ruleForm.Feature.First = -777;
        this.ruleForm.Feature.Second = '无';
      }
      // 如果有且等于 1
      if (this.ruleForm.Feature.First === 1 && this.userfunctionClassEmpty.length > 0) {
        this.ruleForm.Feature.First = -777;
        this.ruleForm.Feature.Second = '无';
      }
    },
    onScopeArraySetupClick() {
      this.visible = true;
    },
    onTypeChange(e) {
      const t = this.userTypeListNoneEmpty.find(it => it.CategoryID === e);
      if (t) this.ruleForm.Type.Second = t.CategoryName;
    },
    onGradeChange(e) {
      const t = this.userRankListNoneEmpty.find(it => it.CategoryID === e);
      if (t) this.ruleForm.Grade.Second = t.CategoryName;
    },
    onFeatureChange(e) {
      const t = this.userfunctionClassEmpty.find(it => it.CategoryID === e);
      if (t) this.ruleForm.Feature.Second = t.CategoryName;
    },
    async submitForm(formName = 'ruleForm') {
      const bool = await this.$refs[formName].validate().catch(() => false);
      return bool ? this.ruleForm : false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  async mounted() {
    this.initData();
  },
};
</script>
<style lang='scss'>
.customer-first-ruleForm-wrap {
  .el-form-item {
    .el-form-item__label {
      color: #888e99;
    }
    .el-form-item__content {
      .el-select {
        width: 134px;
        & + .el-select {
          margin-left: 11px;
        }
      }
      .el-button {
        width: 150px;
        height: 32px;
      }
      .el-checkbox__label {
        color: #585858;
        font-size: 13px;
      }
      .el-input {
        height: 32px;
        > input {
          position: relative;
          top: -2px;
        }
      }
    }
  }
}
</style>
