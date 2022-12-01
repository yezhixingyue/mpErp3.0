<template>
  <section class="mp-statistic-analyse-home-page-wrap">
    <header v-if="showTab">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="统计列表" name="StatisticalList"></el-tab-pane>
        <el-tab-pane label="汇总面板" name="StatisticalSummary"></el-tab-pane>
      </el-tabs>
    </header>
    <!-- <keep-alive> -->
      <router-view></router-view>
    <!-- </keep-alive> -->
  </section>
</template>

<script>
export default {
  name: 'StatisticAnalyseHomePage',
  data() {
    return {
      activeName: 'StatisticalList',
    };
  },
  computed: {
    showTab() {
      const list = ['StatisticalList', 'StatisticalSummary'];
      return list.includes(this.$route.name);
    },
    // pageWidth() {
    //   return process.env.NODE_ENV === 'development' ? 'width:calc(100vw - 180px)' : 'width:100vw';
    // },
    curPathName() {
      return this.$route.name;
    },
  },
  methods: {
    handleClick() {
      if (this.activeName === this.$route.name || !this.showTab) return;
      this.$router.push(`/${this.activeName}`);
    },
  },
  watch: {
    curPathName: {
      handler() {
        if (this.showTab && this.activeName !== this.$route.name) this.activeName = this.$route.name;
      },
      immediate: true,
    },
  },
};
</script>

<style lang='scss'>
.mp-statistic-analyse-home-page-wrap {
  width: 100%;
  > header {
    padding: 20px;
    padding-bottom: 0;
    box-sizing: border-box;
    border-bottom: 1px solid rgb(228, 231, 237);
    > .el-tabs {
      > .el-tabs__header {
        margin-bottom: 0;
        border-bottom: none;
        .el-tabs__nav {
          border-radius: 0;
          border-top: none;
          > .el-tabs__item {
            height: 37px;
            box-sizing: border-box;
            border-top: 3px solid rgba($color: #000000, $alpha: 0);
            background-color: #f5f5f5;
            line-height: 32px;
            border-bottom: 1px solid rgb(228, 231, 237);
            width: 120px;
            text-align: center;
            color: #585858;
            user-select: none;
            position: relative;
            &::before {
              content: '';
              position: absolute;
              left: 0px;
              right: 0px;
              top: -3px;
              height: 1px;
              background-color: rgb(228, 231, 237);
            }
            &.is-active {
              background-color: #fff;
              border-bottom: 1px solid #fff;
              border-top: 3px solid #26BCF9;
              font-weight: 700;
              color: #26BCF9;
              &::before {
                background-color: #26BCF9;
              }
            }
          }
        }
      }
    }
  }
}
</style>
