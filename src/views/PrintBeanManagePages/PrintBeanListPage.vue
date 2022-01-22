<template>
  <section class="mp-erp-print-bean-list-page-wrap">
    <header>
      <el-button type="primary" @click="onAddClick">添加印豆设置</el-button>
    </header>
    <main>
      主体区域
    </main>
    <footer>
      底部分页区域
    </footer>
  </section>
</template>

<script>
export default {
  name: 'PrintBeanListPage',
  methods: {
    onAddClick() {
      this.$router.push({
        name: 'printBeanSetup',
        params: {
          ID: 'null',
        },
      });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-print-bean-list-page-wrap {
  display: flex;
  flex-direction: column;
  background: rgb(245, 245, 245);
  width: 100%;
  height: 100%;
  padding-left: 8px;
  box-sizing: border-box;
  overflow: hidden;
  > header {
    flex: none;
    height: 60px;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 20px;
    > button {
      width: 120px;
      height: 30px;
      padding: 0;
      border-radius: 2px;
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    margin-top: 10px;
  }
  > footer {
    flex: none;
    background-color: #fff;
    height: 70px;
  }
}
</style>
