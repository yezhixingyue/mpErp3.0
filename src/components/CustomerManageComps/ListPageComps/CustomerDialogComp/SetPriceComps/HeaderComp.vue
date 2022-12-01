<template>
  <header v-if="customer">
    <p class="mp-common-title-wrap">客户价格信息</p>
    <ul>
      <li>
        <label>编号：</label>
        <span>{{customer.CustomerSN}}</span>
      </li>
      <li class="n">
        <label>名称：</label>
        <span :title="customer.CustomerName">{{customer.CustomerName}}</span>
      </li>
      <li class="m">
        <label>手机号：</label>
        <span>{{customer.Mobile}}</span>
      </li>
      <li>
        <label>QQ号：</label>
        <span class="qq">{{customer.QQ || '--'}}</span>
      </li>
      <li>
        <el-button  @click="onJumpClick" size="small">客户详情</el-button>
      </li>
    </ul>
  </header>
</template>

<script>
export default {
  props: {
    customer: {
      type: Object,
      default: null,
    },
  },
  methods: {
    onJumpClick() { // 跳转客户详情
      this.$emit('jump');
    },
  },
};
</script>
<style lang='scss'>
</style>
