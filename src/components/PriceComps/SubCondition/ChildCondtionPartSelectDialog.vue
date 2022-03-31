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
    class="mp-erp-comps-price-module-price-item-child-condition-set-dialog-comp-wrap"
  >
    <el-radio-group v-model="radio">
      <el-radio v-for="it in list" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
    </el-radio-group>
    <p class="tips-box is-pink"> <i class="el-icon-warning"></i> 注：设定后不允许更改</p>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    list: {
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
      title: '添加子条件',
      radio: '',
    };
  },
  methods: {
    onSubmit() { // 提交
      if (!this.radio) {
        this.messageBox.failSingle('请选择部件');
        return;
      }
      const t = this.list.find(it => it.ID === this.radio);
      if (!t) return;
      this.$emit('select', t);
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
      this.radio = '';
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-item-child-condition-set-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 60px;
    padding-bottom: 40px;
    padding-top: 50px;
    height: 135px;
    position: relative;
    .el-radio-group {
      .el-radio {
        margin-right: 10px;
        width: 145px;
        margin-bottom: 8px;
        .el-radio__label {
          max-width: 10em;
          font-size: 12px;
          line-height: 18px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          display: inline-block;
          vertical-align: bottom;
        }
      }
    }
    > .tips-box {
      position: absolute;
      bottom: 6px;
      width: 250px;
      left: calc(50% - 128px);
      letter-spacing: 1px;
    }
  }

}
</style>
