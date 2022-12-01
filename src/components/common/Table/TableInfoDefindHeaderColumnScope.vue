<template>
  <section class="mp-erp-common-table-info-header-column-box">
    <span>操作</span>
    <el-tooltip popper-class="mp-common-tip-span-btn-popper-box" :open-delay='180'
    :visible-arrow='false' transition='none' :enterable='false' content="点击可设置列显示与隐藏" placement="bottom">
      <!-- <i class='el-icon-info' @click="onInfoClick"></i> -->
      <span @click="onInfoClick"><i class="el-icon-d-arrow-left"></i> 设置列</span>
    </el-tooltip>
  </section>
</template>

<script>
export default {
  methods: {
    onInfoClick() {
      this.$emit('onClick');
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-table-info-header-column-box {
  position: relative;
  > span {
    margin-right: 10px;
    margin-left: -4px;
    &:last-of-type {
      position: absolute;
      right: 4px;
      top: 1px;
      color: #26bcf9;
      transition: color 0.1s ease-in-out;
      font-size: 12px;
      // font-weight: 400;
      i {
        font-size: 13px;
      }
      &:hover {
        cursor: pointer;
        color: #ff3769;
      }
    }
  }
  > i {
    cursor: pointer;
    transition: opacity 0.05s ease-in-out;
    &:hover {
      opacity: 0.6;
    }
    &:active {
      opacity: 1;
    }
  }
}
</style>
