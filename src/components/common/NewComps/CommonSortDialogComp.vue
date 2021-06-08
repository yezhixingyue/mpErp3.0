<template>
  <CommonDialogComp
    width="650px"
    top='15vh'
    title="元素排序"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-common-sort-dialog-comp-wrap"
  >
    <section class="sort-content">
      <header>
        <p class="tips-box"><i class="el-icon-warning"></i> 注：元素拖动排序</p>
      </header>
      <main v-if="localSortList.length > 0">
        <draggable v-bind="dragOptions" v-model="localSortList">
          <div class="sort-item" v-for="it in localSortList" :key='it[defaultProps.key]'>{{it[defaultProps.lable]}}</div>
        </draggable>
      </main>
    </section>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import draggable from 'vuedraggable';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    SortList: {
      type: Array,
      default: () => [],
    },
    defaultProps: {
      type: Object,
      default: () => ({
        key: 'ID',
        lable: 'Name',
        index: 'Index',
      }),
    },
  },
  components: {
    CommonDialogComp,
    draggable,
  },
  data() {
    return {
      localSortList: [],
      dragOptions: {
        animation: 180,
        ghostClass: 'ghost',
      },
    };
  },
  methods: {
    onSubmit() {
      let _list = [...this.localSortList];
      if (this.defaultProps.index) {
        const key = this.defaultProps.index;
        _list = _list.map((it, i) => ({
          ...it,
          [key]: i,
        }));
      }
      this.$emit('submit', _list);
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.localSortList = [];
    },
    initEditData() { // 数据初始化方法
      if (this.SortList && Array.isArray(this.SortList) && this.SortList.length > 0) {
        const _temp = JSON.parse(JSON.stringify(this.SortList));
        this.localSortList = _temp.sort((a, b) => a[this.defaultProps.index] - b[this.defaultProps.index]);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-common-sort-dialog-comp-wrap {
  &.mp-erp-common-dialog-comp-wrap .el-dialog__footer > .dialog-footer {
    padding-bottom: 20px;
    > button {
      height: 35px;
      border-radius: 3px;
      &.el-button--default {
        border-color: #26bcf9;
        color: #26bcf9;
        &:active {
          border-color: #428dfa;
          color: #428dfa;
        }
      }
      &.el-button--primary {
        background: linear-gradient(to right, #26bcf9, #35dff9);
        border: none;
        &:hover {
          opacity: 0.88;
        }
        &:active {
          background: linear-gradient(to right, #428dfa, #26bcf9);
        }
      }
    }
  }
  .sort-content {
    padding-left: 15px;
    > main {
      width: 540px;
      padding-top: 12px;
      padding-left: 20px;
      div.sort-item {
        height: 40px;
        border-bottom: 1px solid #F5F5F5;
        box-sizing: border-box;
        padding-top: 18px;
        padding-left: 70px;
        &:hover {
          cursor: move;
        }
      }
    }

    .tips-box {
      width:550px;
      background: #FFFBF6;
      border-radius: 3px;
      height: 28px;
      color:rgba(244,163,7, 0.7);
      font-size:12px;
      padding-left:16px;
      line-height: 26px;
      box-sizing: border-box;
      i {
        font-size: 14px;
        position: relative;
        top: 1px;
        margin-right: 10px;
      }
    }
  }
}
</style>
