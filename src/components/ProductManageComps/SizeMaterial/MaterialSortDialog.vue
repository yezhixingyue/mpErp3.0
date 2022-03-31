<template>
  <CommonDialogComp
    width="650px"
    top='12vh'
    :title="title"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-pruduct-module-material-sort-dialog-comp-wrap"
   >
    <p class="tips-box"> <i class="el-icon-warning"></i> 注：拖动排序</p>
    <draggable v-bind="{ tag: 'ul' }" v-model="sortList">
      <li v-for="it of sortList" :key='it.ID'>{{it.Name}}</li>
    </draggable>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import draggable from 'vuedraggable';

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
    value: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '一级组合排序',
    },
  },
  components: {
    CommonDialogComp,
    draggable,
  },
  data() {
    return {
      sortList: [],
    };
  },
  methods: {
    onSubmit() {
      this.$emit('change', this.sortList);
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.sortList = [];
    },
    initEditData() { // 数据初始化方法
      this.sortList = [...this.value];
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-material-sort-dialog-comp-wrap {
  .el-dialog__body {
    font-size: 14px;
    padding-left: 35px;
    .tips-box {
      padding-left: 0;
    }
    > ul {
      padding-left: 20px;
      padding-top: 10px;
      width: 540px;
      min-height: 275px;
      max-height: 430px;
      overflow-y: auto;
      > li {
        height: 41px;
        box-sizing: border-box;
        padding: 15px 0 10px 0;
        line-height: 15px;
        border-bottom: 1px solid #f5f5f5;
        padding-left: 70px;
        font-size: 14px;
        color: #585858;
        &:hover {
          cursor: move;
          // background: #f5f5f5;
        }
      }
    }
  }
}
</style>
