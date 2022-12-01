<template>
  <ul v-if="list && list.length > 0" class="mp-erp-common-comps-crumbs-comp-wrap">
    <li v-for="it in list" :key="it.path">
      <span :class="it.path ? 'blue-span' : 'is-blue'" @click="onClick(it)">{{it.name}}</span>
      <i v-if="it.path" class="is-blue el-icon-arrow-right"></i>
    </li>
  </ul>
</template>

<script>
// 后续需验证跳页返回时页面缓存的变化（ 是否会清除掉不用页面的缓存 ? ）

export default {
  props: {
    list: { // 最后一项不能有path属性，其它的必须有path属性
      type: Array,
      default: () => [],
      required: true,
    },
  },
  methods: {
    onClick(it) {
      if (it.path) {
        this.$router.replace(it.path);
      }
    },
  },
  mounted() {
    if (Array.isArray(this.list)) {
      const i = this.list.findIndex(it => !it.path);
      if (i !== this.list.length - 1) {
        throw new Error('面包屑list传入格式不正确');
      }
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-crumbs-comp-wrap {
  display: inline-block;
  font-size: 12px;
  line-height: 30px;
  > li {
    display: inline-block;
    > i {
      margin: 0 3px;
    }
    > span {
      &.blue-span {
        opacity: 0.7;
        // border-bottom: 1px solid rgba($color: #000000, $alpha: 0);
        transition: all 0.05s ease-in-out;
        &:hover, &:active {
          opacity: 1;
        }
        &:hover {
          color: darken($color: #26bcf9, $amount: 3) !important;
          border-color: #26bcf9;
        }
        &:active {
          color: darken($color: #26bcf9, $amount: 20) !important;
          border-color: darken($color: #26bcf9, $amount: 20);
        }
      }
    }
  }
}
</style>
