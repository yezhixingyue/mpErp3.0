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
    class="mp-erp-comps-price-module-solution-item-save-dialog-comp-wrap"
  >
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" hide-required-asterisk>
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
        <el-radio-group v-model="ruleForm.PartID">
          <el-radio :title="it.Name" :label="it.PartID" v-for="it in rangeList" :key="it.PartID || it.Name">{{it.Name}}</el-radio>
        </el-radio-group>
        <el-radio-group v-model="ruleForm.GroupID" v-show="GroupList.length > 0">
          <el-radio :title="it.Name" :label="it.ID" v-for="it in GroupList" :key="it.ID">{{it.Name}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
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
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    GroupList() {
      const t = this.rangeList.find(it => it.PartID === this.ruleForm.PartID);
      return t ? t.CraftGroupList : [];
    },
    // GroupListIDs() {
    //   return this.GroupList.map(it => it.ID);
    // },
    curPartID() {
      return this.ruleForm.PartID;
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
        CraftPriceID: '',
        PriceID: '',
        CraftID: '',
      },
      selectedGroupIDObj: {},
    };
  },
  methods: {
    async onSubmit() { // 提交
      const bool = await this.$refs.ruleForm.validate().catch(() => {});
      if (bool) this.$emit('submit', this.ruleForm);
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
.mp-erp-comps-price-module-solution-item-save-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 30px;
    padding-bottom: 10px;
    padding-top: 30px;
    min-height: 225px;
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
          & + .el-radio-group {
            border-top: 1px solid #eee;
            margin-top: 18px;
            width: 550px;
            padding-top: 10px;
            position: relative;
          }
        }
      }
    }
  }

}
</style>
