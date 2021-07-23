<template>
  <CommonDialogComp
    width="800px"
    top='10vh'
    title="选择拼版规则"
    submitText='确定'
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-price-module-price-item-makeup-rule-select-dialog-comp-wrap"
  >
    <el-checkbox-group v-model="checkList">
      <el-checkbox
       v-for="it in listData"
       :key="it.ID"
       :label="it.ID"
       :title="`${it.ColumnNumber}列 X ${it.RowNumber}行`"
       >{{it.ColumnNumber}}列 X {{it.RowNumber}}行</el-checkbox>
    </el-checkbox-group>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    listData: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
  },
  data() {
    return {
      checkList: [],
    };
  },
  methods: {
    onSubmit() { // 提交
      const list = this.checkList.map(it => this.listData.find(_it => _it.ID === it)).filter(it => it);
      this.$emit('change', list);
      this.onCancle();
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
    },
    initEditData() { // 数据初始化方法
      this.checkList = Array.isArray(this.value) ? this.value.map(it => it.ID) : [];
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-item-makeup-rule-select-dialog-comp-wrap {

  .el-dialog__body {
    padding: 30px 70px;
    padding-right: 60px;
    min-height: 220px;
    max-height: 520px;
    overflow-y: auto;
    .el-checkbox-group {
      .el-checkbox {
        margin-right: 10px;
        margin-bottom: 10px;
        .el-checkbox__label {
          font-size: 12px;
          color: #585858;
          line-height: 20px;
          width: 96px;
          vertical-align: bottom;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

}
</style>
