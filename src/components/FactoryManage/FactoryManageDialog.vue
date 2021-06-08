<template>
  <CommonDialogComp
    width="700px"
    :title="title"
    :visible.sync="visible"
    @submit="onDialogSubmit"
    @cancle="onDialogCancle"
    @open='onOpen'
    @closed='onClosed'
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="工厂名称" prop="FactoryName">
        <el-input v-model="ruleForm.FactoryName" placeholder="请输入工厂名称" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="工厂地址" prop="CityID">
        <TwoLevelSelectComp v-model="locationIDs" :level1Options='level1Options' :level2Options='level2Options' />
      </el-form-item>
      <el-form-item label="详细地址" prop="Address">
        <el-input v-model="ruleForm.Address" placeholder="请输入详细地址" maxlength="60" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="LinkMan">
        <el-input v-model.trim="ruleForm.LinkMan" placeholder="请输入联系人" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="Mobile">
        <el-input v-model.trim.number="ruleForm.Mobile" placeholder="请输入联系电话" maxlength="11" show-word-limit></el-input>
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import TwoLevelSelectComp from '@/components/common/SelectorComps/TwoLevelSelectComp.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    areaList: {
      type: Array,
      default: () => [],
    },
    itemData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
    TwoLevelSelectComp,
  },
  computed: {
    locationIDs: {
      get() {
        return {
          level1Val: this.ruleForm.ProvinceID,
          level2Val: this.ruleForm.CityID,
        };
      },
      set({ level1Val, level2Val }) {
        this.ruleForm.ProvinceID = level1Val;
        this.ruleForm.CityID = level2Val;
      },
    },
    level1Options() {
      if (!this.areaList || this.areaList.length === 0) return [];
      return this.areaList.map(it => ({ Name: it.Name, ID: it.ID }));
    },
    level2Options() {
      if (!this.areaList || this.areaList.length === 0 || !this.ruleForm.ProvinceID) return [];
      const t = this.areaList.find(it => it.ID === this.ruleForm.ProvinceID);
      if (t) return t.children.map(it => ({ Name: it.Name, ID: it.ID }));
      return [];
    },
    title() {
      if (this.ruleForm.FactoryID) return '编辑生产工厂';
      return '添加生产工厂';
    },
  },
  data() {
    return {
      ruleForm: {
        FactoryName: '',
        ProvinceID: '',
        CityID: '',
        Address: '',
        LinkMan: '',
        Mobile: '',
        FactoryID: 0,
      },
      rules: {
        FactoryName: [
          { required: true, message: '请输入工厂名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
        ],
        CityID: [
          { required: true, message: '请选择工厂地址', trigger: 'change' },
        ],
        Address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 2, max: 60, message: '长度在 2 到 60 个字符', trigger: 'blur' },
        ],
        LinkMan: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
        ],
        Mobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    onDialogSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.ruleForm);
        }
      });
    },
    onDialogCancle() {
      this.$emit('update:visible', false);
    },
    initEditData() {
      if (!this.itemData) {
        Object.keys(this.ruleForm).forEach(key => {
          this.ruleForm[key] = '';
        });
        this.ruleForm.FactoryID = 0;
        if (this.level1Options.length > 0) this.ruleForm.ProvinceID = this.level1Options[0].ID;
        if (this.level2Options.length > 0) this.ruleForm.CityID = this.level2Options[0].ID;
      } else {
        Object.keys(this.ruleForm).forEach(key => {
          if (this.itemData[key] || this.itemData[key] === 0) this.ruleForm[key] = this.itemData[key];
        });
      }
    },
    onOpen() {
      this.$nextTick(this.initEditData);
    },
    onClosed() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>
<style lang='scss'>
</style>
