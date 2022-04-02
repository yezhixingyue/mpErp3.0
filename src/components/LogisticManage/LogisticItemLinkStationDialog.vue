<template>
  <CommonDialogComp
    width="650px"
    top="18vh"
    title="关联物流配送"
    :visible.sync="localVisible"
    smallBtn
    @submit="submitForm"
    @cancle="localVisible = false"
    @open="onOpen"
    @closed="onClosed"
    class="mp-erp-logistic-item-station-link-dialog-comp-wrap"
  >
    <!-- 内容区 -->
    <el-form v-if="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" @submit.native.prevent>
      <el-form-item label="网点编号:" prop="StationSN">
        <el-input v-model="ruleForm.StationSN" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="网点名称:" prop="StationName">
        <el-input v-model="ruleForm.StationName" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="片区编号:" prop="DistrictSN">
        <el-input v-model="ruleForm.DistrictSN" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="片区名称:" prop="DistrictName">
        <el-input v-model="ruleForm.DistrictName" maxlength="20" show-word-limit></el-input>
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import LogisticItem from '../../assets/js/TypeClass/LogisticTypeClass/LogisticItem';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    editData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      ruleForm: null,
      rules: {
        StationSN: [
          { required: true, message: '请输入网点编号', trigger: 'blur' },
        ],
        StationName: [
          { required: true, message: '请输入网点名称', trigger: 'blur' },
        ],
        DistrictSN: [
          { required: true, message: '请输入片区编号', trigger: 'blur' },
        ],
        DistrictName: [
          { required: true, message: '请输入片区名称', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  methods: {
    onOpen() {
      this.ruleForm = new LogisticItem(this.editData);
    },
    onClosed() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm = null;
    },
    async submitForm() {
      const result = await this.$refs.ruleForm.validate().catch(() => false);
      if (result) this.$emit('submit', this.ruleForm);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-logistic-item-station-link-dialog-comp-wrap {
  .el-dialog__body {
    padding-bottom: 48px;
    padding-top: 40px;
    padding-left: 48px;
    .el-form-item {
      height: 30px;
      .el-form-item__label {
        height: 30px;
        line-height: 30px;
        color: #888E99;
        padding-right: 15px;
      }
      .el-form-item__content {
        height: 30px;
        line-height: 30px;
        color: #585858;
        .el-input {
          height: 30px;
          line-height: 30px;
          width: 330px;
          .el-input__inner {
            height: 30px;
            line-height: 28px;
            font-size: 13px;
          }
          .el-input__suffix {
            top: 2px;
          }
        }
        .el-radio-group {
          .el-radio__label {
            color: #585858;
          }
        }
      }
    }
  }
  .el-dialog__footer {
    text-align: center;
    padding-bottom: 40px;
    button {
      width: 120px;
      height: 30px;
      padding: 0;
      & + button {
        margin-left: 30px;
      }
    }
  }
}
</style>
