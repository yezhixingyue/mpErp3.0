<template>
  <section class="mp-erp-product-page-material-size-comp-right-conten-wrap">
    <header>
      <el-button type="primary" size="small" @click="onGeneralSizeSaveClick">设置固定尺寸</el-button>
      <span class="label">尺寸组：</span>
      <span class="name">{{SizeGroup && SizeGroup.GroupInfo ? SizeGroup.GroupInfo.Name : '未设置'}}</span>
      <span class="blue-span" @click="setSizeGroupClick">设置尺寸组</span>
    </header>
    <main>
      <SizeGroupSetDialog :visible.sync='SizeGroupVisible' :PositionID='curPositionID' v-model="localSizeGroup" />
      <GeneralSizeSetDialog :visible.sync="GeneralSizeVisible" :SizeGroup='SizeGroup' />
    </main>
  </section>
</template>

<script>
import SizeGroupSetDialog from './SizeGroupSetDialog.vue';
import GeneralSizeSetDialog from './GeneralSizeSetDialog.vue';

export default {
  props: {
    curProduct: {
      type: Object,
      default: null,
    },
    curPart: {
      type: Object,
      default: null,
    },
    SizeGroup: {
      type: Object,
      default: null,
    },
  },
  components: {
    SizeGroupSetDialog,
    GeneralSizeSetDialog,
  },
  data() {
    return {
      SizeGroupVisible: false,
      GeneralSizeVisible: false,
    };
  },
  computed: {
    curPositionID() {
      if (!this.curProduct) return '';
      if (this.curPart) return this.curPart.ID;
      return this.curProduct.ID;
    },
    localSizeGroup: {
      get() {
        return this.SizeGroup;
      },
      set(val) {
        this.$emit('SizeGroupSubmit', val);
      },
    },
  },
  methods: {
    onGeneralSizeSaveClick() { // 设置固定尺寸
      if (!this.SizeGroup) {
        this.messageBox.failSingle('请先设置尺寸组');
        return;
      }
      this.GeneralSizeVisible = true;
      console.log('onGeneralSizeSaveClick, 设置固定尺寸');
    },
    setSizeGroupClick() {
      this.SizeGroupVisible = true;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-product-page-material-size-comp-right-conten-wrap {
  padding-left: 45px;
  > header {
    white-space: nowrap;
    > span {
      font-size: 14px;
      white-space: nowrap;
      &.label {
        color: #888E99;
        margin-left: 23px;
      }
      &.name {
        margin-left: 6px;
        color: #585858;
        font-weight: 700;
      }
      &.blue-span {
        font-size: 12px;
        margin-left: 25px;
      }
    }
  }
}
</style>
