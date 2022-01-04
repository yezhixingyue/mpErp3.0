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
    class="mp-erp-comps-price-module-price-solution-item-save-dialog-comp-wrap"
    :class="showGroup?'show-group':''"
  >
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" hide-required-asterisk @submit.native.prevent>
      <el-form-item
        label="费用名称："
        prop='Name'
        :rules="[
          { required: true, message: '费用名称不能为空'}
        ]"
      >
        <el-input v-model.trim="ruleForm.Name" show-word-limit maxlength="8" size="small"></el-input>
      </el-form-item>
      <el-form-item
        label="应用范围："
      >
        <el-radio-group v-model="ruleForm.PartID" :disabled='!!(saveData && saveData.ID)'>
          <el-radio :title="it.Name" :label="it.PartID" v-for="it in rangeList" :key="it.PartID || it.Name">{{it.Name}}</el-radio>
        </el-radio-group>
        <p v-show="GroupList.length > 0">
          <!-- <span>应用至所选范围内可多次使用的指定元素组（可不指定）：</span> -->
        </p>
        <el-radio-group v-model="ruleForm.GroupID" v-show="GroupList.length > 0" :disabled='!!(saveData && saveData.ID)'>
          <el-radio :title="it.Name" :label="it.ID" v-for="it in localGroupList" :key="it.ID">{{it.Name}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #foot-tip>
      <p class="tips-box is-pink">
        <i class="el-icon-warning"></i>
        <span>注：应用范围只能在添加时设定，</span>
        <span class="is-bold">后期不能更改 ！</span>
      </p>
    </template>
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
    rangeList: {
      type: Array,
      default: () => [],
    },
    showGroup: { // 是否展示工艺中可多次使用元素组，价格表页面不显示
      type: Boolean,
      default: false,
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    GroupList() {
      if (!this.showGroup) return [];
      const t = this.rangeList.find(it => it.PartID === this.ruleForm.PartID);
      return t ? [...t.CraftGroupList] : [];
    },
    curPartID() {
      return this.ruleForm.PartID;
    },
    localGroupList() {
      return [{ Name: '不限', ID: '' }, ...this.GroupList];
    },
  },
  data() {
    return {
      title: '添加费用',
      ruleForm: {
        ID: '',
        Name: '',
        PartID: '',
        GroupID: '',
        PriceID: '',
        CraftID: '',
      },
      selectedGroupIDObj: {},
    };
  },
  methods: {
    async onSubmit() { // 提交
      const bool = await this.$refs.ruleForm.validate().catch(() => {});
      if (!bool) return;
      if (this.ruleForm.GroupID) {
        const t = this.GroupList.find(it => it.ID === this.ruleForm.GroupID);
        this.ruleForm.CraftID = t ? t.CraftID : '';
      } else {
        this.ruleForm.CraftID = '';
      }
      const { CraftID, GroupID, PartID } = this.ruleForm;
      const ApplyRange = {
        CraftID,
        GroupID,
        PartID,
      };
      const temp = { ...this.ruleForm, ApplyRange };
      delete temp.CraftID;
      delete temp.GroupID;
      delete temp.PartID;
      this.$emit('submit', temp);
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
      this.selectedGroupIDObj = {};
      if (this.saveData && this.saveData.GroupID) this.selectedGroupIDObj[this.saveData.PartID || 'product'] = this.saveData.GroupID;
      this.ruleForm = { ...this.saveData };
    },
  },
  watch: {
    curPartID(newVal, oldVal) {
      const newKey = newVal || 'product';
      const oldKey = oldVal || 'product';
      if (this.ruleForm.GroupID) this.selectedGroupIDObj[oldKey] = this.ruleForm.GroupID;
      this.ruleForm.GroupID = this.selectedGroupIDObj[newKey] || '';
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-solution-item-save-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 30px;
    padding-bottom: 10px;
    padding-top: 30px;
    min-height: 163px;
    .el-form {
      .el-form-item__label {
        font-size: 14px;
        color: #888E99;
      }
      .el-input {
        width: 350px;
      }
      .el-form-item__content {
        .el-radio-group {
          padding-top: 5px;
          .el-radio {
            padding: 6px 0;
            width: 130px;
            padding-right: 4px;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            .el-radio__label {
              font-size: 12px;
              color: #585858;
              line-height: 18px;
            }
            .el-radio__input {
              top: 1px;
            }
          }
        }
        > p {
          font-size: 12px;
          color: #888E99;
          margin-top: 25px;
          height: 10px;
          padding-top: 4px;
          width: 360px;
          border-top: 1px solid #eee;
        }
      }
    }
  }
  .is-disabled .el-radio__label{
    color: #cbcbcb !important;
  }
  .tips-box {
    width: 400px;
    margin: 0 auto;
  }
  &.show-group .el-dialog__body {
    min-height: 260px;
  }
}
</style>
