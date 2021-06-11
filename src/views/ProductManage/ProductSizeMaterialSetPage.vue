<template>
  <section class="mp-erp-product-list-page-size-material-set-comp-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
    </header>
    <main>
      <LRWidthDragAutoChangeComp leftWidth='45%' v-if="curProduct">
        <template v-slot:left>
          <ContentLeft :curProduct='curProduct' :curPart='curPart' />
        </template>
        <template v-slot:right>
          <ContentRight />
        </template>
      </LRWidthDragAutoChangeComp>
    </main>
    <footer>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import LRWidthDragAutoChangeComp from '@/components/common/NewComps/LRWidthDragAutoChangeComp.vue';
import ContentLeft from '@/components/ProductManageComps/SizeMaterial/ContentLeft.vue';
import ContentRight from '@/components/ProductManageComps/SizeMaterial/ContentRight.vue';
import { mapState } from 'vuex';

export default {
  components: {
    LRWidthDragAutoChangeComp,
    ContentLeft,
    ContentRight,
  },
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '',
    };
  },
  computed: {
    ...mapState('productManage', ['ProductManageList']),
    curProduct() {
      if (!this.ProductID) return null;
      return this.ProductManageList.find(it => it.ID === this.ProductID);
    },
    curPart() {
      if (!this.PartID || !this.curProduct) return null;
      return this.curProduct.PartList.find(it => it.ID === this.PartID);
    },
  },
  methods: {
    getPositionID() {
      if (!this.$route.params) {
        this.onGoBackClick();
        return;
      }
      const { ProductID, PartID, name, type } = this.$route.params;
      if (!ProductID || !PartID || !name || !type) {
        this.onGoBackClick();
        return;
      }
      this.ProductID = ProductID;
      this.PartID = PartID !== 'null' ? PartID : '';
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
.mp-erp-product-list-page-size-material-set-comp-wrap {
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
