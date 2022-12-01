<template>
  <CommonDialogComp
    width="650px"
    top="18vh"
    :title="title"
    :visible.sync="localVisible"
    smallBtn
    @submit="submitForm"
    @cancle="localVisible = false"
    @open="onOpen"
    @closed="onClosed"
    class="mp-erp-logistic-item-save-dialog-comp-wrap"
  >
    <!-- 内容区 -->
    <el-form v-if="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" @submit.native.prevent>
      <el-form-item label="名称:" prop="Name">
        <el-input v-model="ruleForm.Name" maxlength="12" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="分类:" prop="Type">
        <el-radio-group v-model="ruleForm.Type" :disabled="!!editData">
          <el-radio :label="it.ID" v-for="it in logisticTypeEnumList" :key='it.ID'>{{it.Name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否启用:" prop="IsEnabled">
        <el-switch v-model="ruleForm.IsEnabled"></el-switch>
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import LogisticItem from '../../assets/js/TypeClass/LogisticTypeClass/LogisticItem';
import { logisticTypeEnumList } from '../../assets/js/TypeClass/LogisticTypeClass/logisticEnums';

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
    list: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      ruleForm: null,
      rules: {
        Name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' },
          { validator: this.uniqueNameValidator, message: '名称不能重复' },
        ],
        Type: [
          { required: true, message: '请选择分类', trigger: 'change' },
        ],
      },
      logisticTypeEnumList,
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
    title() {
      return !this.editData ? '添加物流快递' : '编辑物流快递';
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
    uniqueNameValidator(rule, value, callback) {
      const t = this.list.find(it => it.Name === value && it.ID !== this.ruleForm.ID);
      callback(t ? new Error('') : undefined);
    },
    async submitForm() {
      const result = await this.$refs.ruleForm.validate().catch(() => false);
      if (result) this.$emit('submit', this.ruleForm);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-logistic-item-save-dialog-comp-wrap {
  .el-dialog__body {
    padding-bottom: 48px;
    padding-top: 40px;
    padding-left: 55px;
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
          width: 270px;
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
          .is-disabled {
            .el-radio__label {
              color: #cbcbcb;
            }
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
