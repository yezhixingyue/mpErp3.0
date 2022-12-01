<template>
  <CommonDialogComp
    width="600px"
    :title="title"
    :visible.sync="localVisible"
    class="mp-erp-review-group-manage-list-page-comps-item-edit-comp-wrap"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    top="20vh"
  >
    <label>组名称：</label>
    <el-input v-if="ruleForm" v-model.trim="ruleForm.Name" maxlength="20" show-word-limit size="small"></el-input>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../../packages/CommonDialogComp';
import ReviewGroupClass from '../../../../store/review/TypeClass/ReviewGroup/ReviewGroupClass';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: null,
    },
    list: { // 列表数据，用于重复组名称判断
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
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
      return this.item ? '修改组名称' : '添加分组';
    },
  },
  data() {
    return {
      ruleForm: null,
    };
  },
  methods: {
    onOpen() {
      this.ruleForm = new ReviewGroupClass(this.item);
    },
    submit() {
      const bool = this.ruleForm.checker(this.list);
      if (bool) {
        this.ruleForm.save(this.handleSuccess);
      }
    },
    cancel() {
      this.localVisible = false;
    },
    handleSuccess(data) {
      this.cancel();
      this.$emit('success', data);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-group-manage-list-page-comps-item-edit-comp-wrap {
  .el-dialog__body {
    padding-top: 55px;
    padding-bottom: 55px;
    text-align: center;
    .el-input {
      width: 420px;
    }
    label {
      color: #888E99;
      margin-right: 2px;
    }
  }
  .el-dialog__footer {
    padding-bottom: 45px;
  }
}
</style>
