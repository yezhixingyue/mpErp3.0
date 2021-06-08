<template>
  <CommonDialogComp
    width="600px"
    top='20vh'
    title="选择模板"
    :visible.sync="visible"
    :showSubmit='false'
    cancelText='关闭'
    @cancle="onCancle"
    class="mp-erp-comps-element-template-element-select-comp-wrap"
  >
    <TipsSpanButton v-for="it in list" :key="it.ID" @click.native="onSubmit(it)" :text='it.Name' />
    <p v-if="list && list.length === 0" style="font-size:12px;color:#888E99">暂无模板数据，可到元素模板页面中添加常用元素模板</p>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import TipsSpanButton from '@/components/common/NewComps/TipsSpanButton.vue';

export default {
  components: {
    CommonDialogComp,
    TipsSpanButton,
  },
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
  methods: {
    onSubmit(data) {
      this.$emit('submit', data);
      this.onCancle();
    },
    onCancle() {
      this.$emit('update:visible', false);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-element-template-element-select-comp-wrap {
  .el-dialog__body {
    padding-left: 67px;
    padding-right: 37px;
    max-height: 360px;
    overflow-y: auto;
    > span {
      display: inline-block;
      width: 145px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      color: #585858;
      margin-right: 14px;
      line-height: 34px;
      &:hover {
        color: #26BCF9;
      }
    }
  }
}

</style>
