<template>
  <CommonDialogComp
    width="950px"
    top='10vh'
    title="设置固定尺寸"
    cancelText='关闭'
    :visible="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-pruduct-module-general-size-set-dialog-comp-wrap"
   >
    <SizeAddPanelComp
     v-if="SizeGroup && showComp"
     :List='SizeList'
     :Elements='ElementList'
     :sizeTemp='template'
     ref='oPanel'
    />
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import SizeAddPanelComp from './SizeAddPanelComp.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    SizeGroup: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
    SizeAddPanelComp,
  },
  data() {
    return {
      ElementList: [],
      SizeList: [],
      template: null,
      showComp: false,
    };
  },
  methods: {
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.template = null;
      this.showComp = false;
    },
    initEditData() { // 数据初始化方法
      if (!this.SizeGroup || !this.SizeGroup.GroupInfo) return;
      this.ElementList = this.SizeGroup.GroupInfo.ElementList;
      this.SizeList = JSON.parse(JSON.stringify(this.SizeGroup.SizeList));
      this.template = {
        ID: '',
        Name: '',
        Index: 0,
        HiddenToCustomer: false,
        List: [],
      };
      this.ElementList.forEach((it) => {
        const temp = { First: it.ID, Second: '' };
        this.template.List.push(temp);
        this.SizeList.forEach(size => {
          const sizeListIDs = size.List.map(_it => _it.First);
          // 补充后面增加元素
          if (!sizeListIDs.includes(it.ID)) size.List.push(temp);
        });
      });
      // 删除后面取消元素
      this.SizeList.forEach(size => {
        const elementIDs = this.ElementList.map(_it => _it.ID);
        // eslint-disable-next-line no-param-reassign
        size.List = size.List.filter(_it => elementIDs.includes(_it.First));
      });
      // 排序
      this.SizeList = this.SizeList.map(size => {
        const list = [];
        this.ElementList.forEach(it => {
          const t = size.List.find(_it => _it.First === it.ID);
          if (t) list.push(t);
        });
        return { ...size, List: list };
      });
      this.showComp = true;
    },
    onSubmit() {
      const SizeList = this.$refs.oPanel.onSubmit();
      if (SizeList) this.$emit('submit', SizeList);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-general-size-set-dialog-comp-wrap {
  .el-dialog__body {
    font-size: 14px;
    padding-left: 30px;
    padding-right: 40px;
  }
  .el-dialog__footer {
    .dialog-footer {
      button + button {
        margin-left: 35px;
      }
    }
  }
}
</style>
