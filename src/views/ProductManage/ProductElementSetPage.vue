<template>
  <section class="mp-erp-product-list-page-product-element-set-comp-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
    </header>
    <CommonElementSetPageComp v-if="PositionID" :PositionID='PositionID' />
    <footer>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import CommonElementSetPageComp from '@/components/CommonElementSet/CommonElementSetPageComp.vue';

export default {
  components: {
    CommonElementSetPageComp,
  },
  data() {
    return {
      PositionID: '',
      ProductName: '',
      titleType: '',
    };
  },
  methods: {
    getPositionID() {
      if (!this.$route.params) {
        this.onGoBackClick();
        return;
      }
      const { id, name, type } = this.$route.params;
      if (!id || !name || !type) {
        this.onGoBackClick();
        return;
      }
      this.PositionID = id;
      this.ProductName = name;
      this.titleType = type;
    },
    onGoBackClick() {
      this.$router.replace('/ProductManageList');
    },
  },
  mounted() {
    this.getPositionID();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-list-page-product-element-set-comp-wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 45px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    padding: 30px 0;
    padding-bottom: 40px;
    line-height: 15px;
    box-sizing: border-box;
    height: 15px;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
  }
  > main {
    flex: 1;
  }
  > footer {
    text-align: center;
    padding: 25px;
    bottom: 20px;
    flex: none;
    > button {
      width: 120px;
      height: 35px;
      border: 1px solid #26BCF9;
      border-radius: 3px;
      padding: 0;
      color: #26BCF9;
    }
  }
}
</style>
