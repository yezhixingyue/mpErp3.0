<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal='false'
    :width="width"
    :top='top'
    v-dialogDrag
    :modal='false'
    @open='onOpen'
    @opened='onOpened'
    @close='onClose'
    @closed='onClosed'
    class="mpzj-sell-lib-comps-dialog-comp-wrap"
    :class="{smallBtn: smallBtn}"
    :before-close="onCancleClick">
  <span class="el-dialog__title" slot="title" v-if="$slots['title']">
    <slot name="title"></slot>
  </span>
  <slot></slot>
  <span slot="footer" class="dialog-footer">
    <div v-if="$slots['foot-tip']">
      <slot name="foot-tip"></slot>
    </div>
    <p>
      <Button type="primary" :loading='loading' @click="onSubmitClick" v-if="showSubmit" :disabled='disabled'>{{loading?'加载中':submitText}}</Button>
      <Button type="danger"  @click="onDangerClick" v-if="showDanger">{{dangerText}}</Button>
      <Button :type="cancelBlue ? 'primary' : 'default'" @click="onCancleClick" v-if="showCancel">{{cancelText}}</Button>
      <span class="clear" v-if="showClear" @click="onClearClick">{{clearText}}</span>
    </p>
  </span>
</el-dialog>
</template>

<script>
// ---- 使用方式示例：
// <CommonDialogComp width='580px' title="测试弹窗" :visible.sync='addNewProductVisible' @submit="onTestDialogSubmit" @cancle="onTestDialogCancle" >
//   测试弹窗组件 --- slot内容区
// </CommonDialogComp>
import Button from '../../Button';

export default {
  name: 'CommonDialogComp',
  model: {
    prop: 'value',
    event: 'change',
  },
  components: {
    Button,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '提示',
    },
    width: {
      default: '30%',
    },
    top: {
      type: String,
      default: '15vh',
    },
    showSubmit: {
      type: Boolean,
      default: true,
    },
    submitText: {
      type: String,
      default: '保存',
    },
    dangerText: {
      type: String,
      default: '重新生成',
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
    cancelBlue: {
      type: Boolean,
      default: false,
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showDanger: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    smallBtn: {
      type: Boolean,
      default: false,
    },
    showClear: {
      type: Boolean,
      default: false,
    },
    clearText: {
      type: String,
      default: '清除',
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(bool) {
        this.$emit('update:visible', bool);
      },
    },
  },
  data() {
    return {
    };
  },
  methods: {
    onCancleClick() {
      this.$emit('cancle');
      this.$emit('cancel');
    },
    onSubmitClick(evt) {
      if (!this.dialogVisible) return;
      if (evt.target.nodeName === 'BUTTON') evt.target.blur();
      else if (evt.target.parentNode.nodeName === 'BUTTON') evt.target.parentNode.blur();
      this.$emit('submit');
    },
    onDangerClick() {
      this.$emit('danger');
    },
    onClearClick() {
      this.$emit('clear');
    },
    onOpen() {
      this.$emit('open');
    },
    onOpened() {
      this.$emit('opened');
    },
    onClose() {
      this.$emit('close');
    },
    onClosed() {
      this.$emit('closed');
    },
  },
};
</script>
<style lang='scss'>
</style>
