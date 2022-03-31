<template>
  <CommonDialogComp
    width="800px"
    top='8vh'
    title="选择幅面"
    submitText='确定'
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-price-module-price-item-breadth-select-dialog-comp-wrap"
  >
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminateAll" class='check-all'>全选</el-checkbox>
    <CheckItem v-for="it in BreadthTreeList" :key="it.ID" :itemData='it' v-model='checkedList' />
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import CheckItem from './CheckItem';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    saveData: {
      type: Array,
      default: () => [],
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
    checkAllList() {
      if (!Array.isArray(this.BreadthTreeList) || this.BreadthTreeList.length === 0) return [];
      const _checkAllList = this.BreadthTreeList
        .map(it => it.list.map(_it => ({ First: { ID: _it.ID }, Second: _it.ModeList.map(sub => sub.Mode) })))
        .reduce((prev, next) => [...prev, ...next]);
      return _checkAllList;
    },
    checkAllListModeList() {
      if (this.checkAllList.length === 0) return [];
      return this.checkAllList.map(it => it.Second).reduce((prev, next) => [...prev, ...next]);
    },
    checkedListModeList() { // 已选择的幅面包含的
      if (this.checkedList.length === 0) return [];
      return this.checkedList.map(it => it.Second).reduce((prev, next) => [...prev, ...next]);
    },
    checkAll: {
      get() {
        return (this.checkedListModeList.length > 0 && this.checkedListModeList.length === this.checkAllListModeList.length);
      },
      set(val) {
        this.checkedList = val ? this.checkAllList : [];
      },
    },
    isIndeterminateAll() {
      return (this.checkedListModeList.length > 0 && this.checkedListModeList.length < this.checkAllListModeList.length);
    },
  },
  data() {
    return {
      checkedList: [],
    };
  },
  methods: {
    async onSubmit() { // 提交
      if (this.checkedList.length === 0) {
        this.messageBox.failSingleError('选择失败', '请至少勾选一种印刷幅面');
        return;
      }
      this.$emit('select', this.checkedList);
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
      if (Array.isArray(this.saveData)) this.checkedList = this.saveData;
      else this.checkedList = [];
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-item-breadth-select-dialog-comp-wrap {

  .el-dialog__body {
    height: 600px;
    overflow: auto;
    padding: 30px 50px;
    .check-all .el-checkbox__label {
      font-size: 14px;
    }
    .el-checkbox__label, .collapse {
      font-size: 12px;
      color: #585858;
    }
    .collapse {
      margin-left: 20px;
      cursor: pointer;
      user-select: none;
      color: #a2a2a2;
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
