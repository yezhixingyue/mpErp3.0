<template>
  <section class="mp-erp-product-list-page-display-sort-set-comp-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
    </header>
    <main>产品与部件显示排序内容区域</main>
    <footer>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '',
    };
  },
  computed: {
    ...mapState('productManage', ['ProductManageList', 'ProductModuleKeyIDList']),
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
    // async getProductOrPartCraftData(dataType = ['Craft', 'CraftCondition']) { // 获取初始物料、常规尺寸与尺寸组信息
    //   const ID = this.PartID ? this.PartID : this.ProductID;
    //   const _fetchFunc = this.PartID ? this.api.getPartModuleData : this.api.getProductModuleData;
    //   const List = this.$utils.getIDFromListByNames(dataType, this.ProductModuleKeyIDList);
    //   const _temp = { ID, List };
    //   const resp = await _fetchFunc(_temp).catch(() => {});
    //   if (resp && resp.data && resp.data.Status === 1000) {
    //     // 获取数据成功
    //     console.log(resp);
    //     // const { MaterialList, SizeGroup } = resp.data.Data;
    //     // if (dataType.includes('Material') && MaterialList) this.MaterialList = MaterialList;
    //     // if (dataType.includes('SizeGroup') && SizeGroup) this.SizeGroup = SizeGroup;
    //   }
    // },
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
.mp-erp-product-list-page-display-sort-set-comp-wrap {
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
