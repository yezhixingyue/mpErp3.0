<template>
  <div class="count-wrap" :class="center ? 'is-center' : ''">
        <!-- <div>  左侧加载loading图标， 采用分页后弃用， 暂留存
            <LoadingMiniSpinner class="loading-box" v-show="showLoading" />
        </div> -->
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
// import LoadingMiniSpinner from '@/components/common/LoadingMiniSpinner.vue';

export default {
  components: {
    // LoadingMiniSpinner,
  },
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
  // computed: {
  //   currentPage1: {
  //     get() {
  //       return 10;
  //     },
  //     set(newVal) {
  //     //  console.log(newVal);
  //     },
  //   },
  // },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.count-wrap{
  text-align: right;
  font-size: 12px;
  line-height: 45px;
  padding-right: 72px;
  padding-top: 0px;
  width: 100%;
  height: 45px;
  box-sizing: border-box;
  border-top: none;
  position: relative;
  display: flex;
  justify-content: flex-end;
  font-size: 13px;
  color: $--color-text-regular;
  background-color: $--color-white;
  user-select: none;
  overflow: hidden;
  .loading-box{
    text-align: left;
  }
  .count{
    margin-left: 70px;
    i {
        font-weight: 600;
        color: rgb(45, 189, 249);
        margin: 0 3px;
    }
  }
  .mp-pagination-wrap{
    height: 45px;
    .el-pagination{
      padding-top: 8px;
      color: $--color-text-table-time;
      font-weight: 400;
      .btn-prev, .btn-next{
        position: relative;
        > i {
          &::before{
            content: '';
            position: absolute;
            width: 10px;
            top: 6px;
            height: 15px;
            background: url('../../assets/images/left-arrow.png') center no-repeat;
          }
        }
        &:disabled{
          > i::before {
            background: url('../../assets/images/left-disabled.png') center no-repeat;
          }
        }
      }
      .btn-next{
        > i::before {
            background: url('../../assets/images/right-arrow.png') center no-repeat;
          }
        &:disabled{
          > i::before {
            background: url('../../assets/images/right-disabled.png') center no-repeat;
          }
        }
      }
      .el-pager{
        > li{
          height: 28px;
          padding: 0 3px;
          margin-left: 15px;
          box-sizing: border-box;
          font-size: 14px;
          min-width: 28px;
          border-radius: 5px;
          cursor: pointer;
          &.active, &.active:hover {
            background-color: $--color-primary;
            color: $--color-white;
          }
          &:hover {
            background-color: rgba($color: $--color-primary, $alpha: .15);
            color: $--color-text-table-time;
          }
          &.el-icon.more.el-icon-more:before,
          &.el-icon.more.el-icon-d-arrow-right:before,
          &.el-icon.more.el-icon-d-arrow-left:before  {
            content: "...";
            font-size: 20px;
            position: relative;
            top: -5px;
            color: $--color-text-table-time;
          }
        }
      }
      .el-pagination__jump{
        color: $--color-text-table-time;
        margin-left: 14px;
        > .el-input{
          margin: 0 10px;
          min-width: 32px;
          height: 28px;
          padding: 0;
        }
      }
    }
  }
  &.is-center {
    display: flex;
    align-items: center;
    justify-content: center;
    > .count {
      position: absolute;
      right: 70px;
    }
  }
  @media screen and (max-width: 1000px) {
    > .count {
      display: none;
    }
  }
}
</style>
