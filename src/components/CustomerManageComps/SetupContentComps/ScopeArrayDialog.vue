<template>
  <CommonDialogComp
    width="760px"
    top='12vh'
    title="选择主营产品"
    :visible.sync="visible"
    submitText='确定'
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-customer-setup-module-customer-scope-array-setup-dialog-comp-wrap"
   >
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      list: [],
      dataList: [],
    };
  },
  methods: {
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.getDataList();
      this.$nextTick(this.initEditData);
    },
    onClosed() {

    },
    onSubmit() {

    },
    initEditData() {
      // console.log(this.value);
    },
    async getDataList() {
      // console.log(this.dataList);
      if (this.dataList.length > 0) return;
      const resp = await this.api.getScopeArrayDataList().catch(() => null);
      if (resp && resp.data.Status === 1000 && Array.isArray(resp.data.Data)) {
        const _lv1List = resp.data.Data.filter(it => it.Level === 1).map(it => ({ ...it, children: [] }));
        const _lv2List = resp.data.Data.filter(it => it.Level === 2);
        _lv1List.forEach(lv1 => {
          const _list = _lv2List.filter(it => it.ParentID === lv1.ID);
          lv1.children.push(..._list);
        });
        this.dataList = _lv1List.filter(it => it.children.length > 0);
      }
    },
  },
};
</script>
<style lang='scss'>
</style>
