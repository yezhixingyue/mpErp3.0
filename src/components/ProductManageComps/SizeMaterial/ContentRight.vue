<template>
  <section class="mp-erp-product-page-material-size-comp-right-conten-wrap">
    <header>
      <el-button type="primary" size="small" @click="onGeneralSizeSaveClick">设置固定尺寸</el-button>
      <span class="label">尺寸组：</span>
      <span class="name">未设置</span>
      <span class="blue-span">设置尺寸组</span>
    </header>
  </section>
</template>

<script>
export default {
  methods: {
    onGeneralSizeSaveClick() { // 设置固定尺寸
      console.log('onGeneralSizeSaveClick, 设置固定尺寸');
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
