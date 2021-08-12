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
    class="mp-erp-comps-price-module-price-item-part-mixin-excludes-number-ctrl-dialog-comp-wrap"
  >
    <el-radio-group v-model="radio">
      <el-radio v-for="it in list" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
    </el-radio-group>
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
    curData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
  },
  data() {
    return {
      title: '排除数量设置',
      radio: '',
      list: [{ ID: '', Name: '无' }],
    };
  },
  methods: {
    onSubmit() { // 提交
      if (this.curData && (this.radio === this.curData.ExcludeNumberFormula?.ID || (!this.radio && !this.curData.ExcludeNumberFormula))) {
        this.messageBox.failSingle('设置未发生更改');
        return;
      }
      this.$emit('submit', this.radio);
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
      if (this.curData) {
        const { ExcludeNumberFormula, ExcludeNumberFormulaList } = this.curData;
        this.radio = ExcludeNumberFormula ? ExcludeNumberFormula.ID : '';
        this.list = [...ExcludeNumberFormulaList, { ID: '', Name: '无' }] || [{ ID: '', Name: '无' }];
      } else {
        this.radio = '';
        this.list = [{ ID: '', Name: '无' }];
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-item-part-mixin-excludes-number-ctrl-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 60px;
    padding-bottom: 10px;
    padding-top: 50px;
    height: 135px;
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
  }

}
</style>
