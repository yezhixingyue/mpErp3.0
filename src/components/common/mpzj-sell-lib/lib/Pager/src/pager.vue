<template>
  <div class="mpzj-sell-lib-comps-pager-wrap" :class="center ? 'is-center' : ''">
    <slot name="left"></slot>
    <div class="mp-pagination-wrap">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        hide-on-single-page
        :page-size="pageSize"
        :pager-count='5'
        layout="prev, pager, next, jumper"
        :total="count">
      </el-pagination>
    </div>
    <slot></slot>
    <span class="count">共检索出<i>{{count}}</i>条记录</span>
  </div>
</template>

<script>
export default {
  name: 'Pager',
  props: {
    /**
     * 是否显示左侧加载中
     */
    showLoading: {
      type: Boolean,
      default: false,
    },
    /**
     * 页条目数
     */
    pageSize: {
      type: Number,
      default: 30,
    },
    /**
     * 数据总条数
     */
    count: {
      type: Number,
      default: 0,
    },
    /**
     * 页面发生变化时的回调函数
     */
    handlePageChange: {
      type: Function,
      default: () => {},
    },
    /**
     * 监听页面变化，当其为1时修改当前页面为1
     */
    watchPage: {},
    center: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    watchPage: {
      handler(newVal) {
        this.$nextTick(() => {
          if (this.currentPage === newVal) return;
          this.currentPage = newVal;
        });
      },
      immediate: true,
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.handlePageChange(val);
    },
  },
  data() {
    return {
      currentPage: 1,
    };
  },
};
</script>

<style lang='scss'>
</style>
