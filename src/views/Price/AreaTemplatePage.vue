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
      <PartSaveDialog :visible.sync='visible' :EditData='curEditData' />
    </main>
  </section>
</template>

<script>
import PartSaveDialog from '../../components/PriceComps/AreaTemplate/PartSaveDialog.vue';

export default {
  name: 'AreaTemplate',
  components: {
    PartSaveDialog,
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
  },
};
</script>
<style lang='scss'>
.mp-price-manage-page-area-template-page-wrap {
  padding-left: 20px;
  > header {
    padding: 35px 0;
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
}
</style>
