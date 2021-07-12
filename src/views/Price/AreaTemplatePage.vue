<template>
  <section class="mp-price-manage-page-area-template-page-wrap">
    <header>
      <p class="mp-common-title-wrap is-black">
        <span>设置适用范围模板</span>
      </p>
      <div>
        <el-button type="primary" @click="setAreaTemplateHandler(null)">新建模板</el-button>
      </div>
    </header>
    <main>
      <AreaTempSaveDialog :visible.sync='visible' :EditData='curEditData' />
    </main>
    <footer>
      <el-button class="goback" @click="onGobackClick"> <i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import AreaTempSaveDialog from '../../components/PriceComps/AreaTemplate/AreaTempSaveDialog.vue';

export default {
  name: 'AreaTemplate',
  components: {
    AreaTempSaveDialog,
  },
  data() {
    return {
      curEditData: null,
      visible: false,
    };
  },
  methods: {
    setAreaTemplateHandler(data) {
      this.curEditData = data;
      this.visible = true;
    },
    onGobackClick() {
      this.$goback();
    },
  },
};
</script>
<style lang='scss'>
.mp-price-manage-page-area-template-page-wrap {
  padding-left: 20px;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  > header {
    padding: 35px 0;
    flex: none;
    > p {
      font-size: 14px;
      &::before {
        height: 15px;
      }
      padding-bottom: 40px;
    }
    > div > button {
      width: 125px;
      height: 35px;
      padding: 0;
    }
  }
  > main {
    flex: 1;
    overflow-y: auto;
  }
  > footer {
    height: 60px;
    width: 750px;
    text-align: center;
    flex: none;
    padding-top: 15px;
  }
}
</style>
