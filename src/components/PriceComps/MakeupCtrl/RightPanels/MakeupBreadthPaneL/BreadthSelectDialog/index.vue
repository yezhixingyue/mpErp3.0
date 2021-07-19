<template>
  <CommonDialogComp
    width="800px"
    top='8vh'
    title="选择幅面"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-price-module-price-item-breadth-select-dialog-comp-wrap"
  >
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminateAll" class='check-all'>全选</el-checkbox>
    <CheckItem v-for="it in BreadthTreeList" :key="it.ID" :data='it' />
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import CheckItem from './CheckItem';

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
    BreadthTreeList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
    CheckItem,
  },
  computed: {
    checkAll: {
      get() {
        return false;
      },
      set(val) {
        console.log(val);
      },
    },
    isIndeterminateAll() {
      return false;
    },
  },
  data() {
    return {
    };
  },
  methods: {
    async onSubmit() { // 提交
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
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-item-breadth-select-dialog-comp-wrap {

  .el-dialog__body {
    height: 600px;
    overflow: auto;
    .check-all .el-checkbox__label {
      font-size: 14px;
    }
    .el-checkbox__label, .collapse {
      font-size: 12px;
      color: #585858;
    }
    .collapse {
      margin-left: 35px;
      cursor: pointer;
      user-select: none;
      > i {
        width: 18px;
        height: 18px;
        background-color: #f5f5f5;
        text-align: center;
        line-height: 18px;
        border-radius: 50%;
        color: #a2a2a2;
        margin-left: 4px;
        transition: transform 0.05s ease-in-out;
      }
      &.open > i {
        transform: rotateZ(180deg);
      }
    }
    .item-title {
      font-weight: 700;
    }
    .mp-erp-price-module-breadth-select-check-item-container {
      margin-bottom: 15px;
    }
    .el-checkbox {
      margin-bottom: 12px;
    }
  }

}
</style>
