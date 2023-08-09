<template>
  <CommonDialogComp
    width="700px"
    :title="title"
    :visible="visible"
    @submit="onDialogSubmit"
    @cancle="onDialogCancle"
    @open='onOpen'
    @closed='onClosed'
    top="8vh"
    class="mp-erp-factory-manage-edit-item-dialog-comp-wrap"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      @submit.native.prevent
      label-width="100px"
      size="small"
      style="height: 395px"
      v-if="ruleForm"
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
        <el-input v-model.trim="ruleForm.Mobile" placeholder="请输入联系电话" maxlength="11" show-word-limit></el-input>
      </el-form-item>
      <el-form-item >
        <el-checkbox v-model="ruleForm._AutoLink" @change="onAutoLinkChange">
          <span class="ft-12" style="color:#585858">订单自动对接</span>
        </el-checkbox>
      </el-form-item>
      <el-form-item label="转换服务器" prop="Convert.ID" v-show="ruleForm._AutoLink">
        <el-select v-model="ruleForm.Convert.ID" :disabled="loading" placeholder="请选择转换服务器" @change="onServerChange">
          <el-option
            v-for="item in ConvertServerList"
            :key="item.ID"
            :label="item.Name"
            :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="!ruleForm._AutoLink">
        <el-checkbox v-model="ruleForm.AutoReceiveOrder" >
          <span class="ft-12" style="color:#585858">外协自动接单</span>
        </el-checkbox>
      </el-form-item>
      <!-- <el-form-item label="转换器" prop="Convert.ID" v-if="ruleForm._AutoLink">
        <el-select v-model="ruleForm.Convert.ID" :disabled="loading" placeholder="请选择对应转换器">
          <el-option
            v-for="item in ConvertList"
            :key="item.ID"
            :label="item.Name"
            :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import TwoLevelSelectComp from '@/components/common/SelectorComps/TwoLevelSelectComp.vue';
import FactoryClass from './FactoryClass';

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
          level1Val: this.ruleForm?.ProvinceID,
          level2Val: this.ruleForm?.CityID,
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
      if (!this.areaList || this.areaList.length === 0 || !this.ruleForm || !this.ruleForm.ProvinceID) return [];
      const t = this.areaList.find(it => it.ID === this.ruleForm.ProvinceID);
      if (t) return t.children.map(it => ({ Name: it.Name, ID: it.ID }));
      return [];
    },
    title() {
      if (this.ruleForm?.FactoryID) return '编辑生产工厂';
      return '添加生产工厂';
    },
  },
  data() {
    return {
      ruleForm: null,
      rules: {
        FactoryName: [
          { required: true, message: '请输入工厂名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
        ],
        CityID: [
          { required: true, message: '请选择工厂地址', trigger: 'change' },
        ],
        Address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' },
        ],
        LinkMan: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
        ],
        Mobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' },
        ],
        Convert: {
          ID: [
            { validator: this.validateConvert, message: '请选择转换服务器', trigger: 'change' },
          ],
          // Server: {
          //   ID: [
          //     { required: true, message: '请选择转换服务器', trigger: 'change' },
          //   ],
          // },
        },
      },
      loading: false,
      ConvertServerList: [],
      // ConvertList: [],
      curConvertServerID: '',
    };
  },
  methods: {
    validateConvert(rule, value, callback) {
      if (this.ruleForm && this.ruleForm._AutoLink && !value) {
        callback(new Error('请选择转换服务器'));
        return;
      }
      callback();
    },
    onDialogSubmit() {
      if (!this.$refs.ruleForm) return;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.ruleForm.getSubmitInfo(this.ConvertServerList));
          // this.$emit('submit', this.ruleForm.getSubmitInfo(this.ConvertServerList, this.ConvertList));
        }
      });
    },
    onDialogCancle() {
      this.$emit('update:visible', false);
    },
    initEditData() {
      this.ruleForm = new FactoryClass(this.itemData);
      this.getConvertServerList();
      // this.onServerChange();
    },
    onOpen() {
      this.$nextTick(this.initEditData);
    },
    onClosed() {
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
      this.ruleForm = null;
    },
    async getConvertServerList() {
      if (this.ConvertServerList.length > 0) return;
      this.loading = true;
      const resp = await this.api.getConvertServerList().catch(() => null);
      this.loading = false;
      if (resp && resp.data.Status === 1000) {
        this.ConvertServerList = resp.data.Data || [];
      }
    },
    // async getConvertList(id) {
    //   if (!id || this.curConvertServerID === id) return;
    //   this.curConvertServerID = id;
    //   this.loading = true;
    //   const resp = await this.api.getConvertList(id).catch(() => null);
    //   this.loading = false;
    //   if (resp && resp.data.Status === 1000) {
    //     this.ConvertList = resp.data.Data || [];
    //   }
    // },
    onServerChange() {
      // if (!this.ruleForm) return;
      // const id = this.ruleForm.Convert.Server.ID;
      // this.getConvertList(id);
      // if (e) this.ruleForm.Convert.ID = '';
    },
    onAutoLinkChange() {
      if (this.ruleForm) this.ruleForm.AutoReceiveOrder = false;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-factory-manage-edit-item-dialog-comp-wrap {
  .el-form-item__content {
    > .el-input {
      input {
        padding-right: 50px;
      }
    }
  }
}
</style>
