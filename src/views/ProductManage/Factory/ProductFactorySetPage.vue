<template>
  <section class="mp-erp-product-list-page-product-factory-set-comp-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
      <p>
        <el-button type="primary" size="small" @click="onFactorySaveClick(null)">+添加工厂策略</el-button>
      </p>
    </header>
    <main>
      <FactoryTable :dataList='FactoryList' :loading='loading'  />
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import FactoryTable from '@/components/ProductManageComps/Factory/FactoryTable.vue';

export default {
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '', // 产品 | 部件
      curEditData: null,
      FactoryList: [],
      loading: false,
    };
  },
  components: {
    FactoryTable,
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
      this.getProductOrderData();
    },
    onFactorySaveClick(data) {
      this.curEditData = data;
      const path = `/ProductFactoryAdd/${this.ProductID}/${this.PartID ? this.PartID : 'null'}/${this.ProductName}/${this.titleType}/${Date.now()}`;
      this.$router.push(path);
    },
    async getProductOrderData(dataType = ['Factory']) { // 获取初始工厂列表信息
      const ID = this.PartID ? this.PartID : this.ProductID;
      const _fetchFunc = this.PartID ? this.api.getPartModuleData : this.api.getProductModuleData;
      const List = this.$utils.getIDFromListByNames(dataType, this.ProductModuleKeyIDList);
      const _temp = { ID, List };
      this.loading = false;
      const resp = await _fetchFunc(_temp).catch(() => {});
      this.loading = true;
      if (resp && resp.data && resp.data.Status === 1000) {
        // 获取数据成功
        const { FactoryList } = resp.data.Data;
        if (dataType.includes('Factory') && FactoryList) this.FactoryList = FactoryList;
      }
    },
    // async setDisplayOrderSubmit(list) { // 保存排序
    //   if (!list || list.length === 0) return;
    //   const { ProductID, PartID } = this;
    //   const List = list.map((it, Index) => ({ ...it, Index }));
    //   const temp = { ProductID, PartID, List };
    //   const resp = await this.api.getProductSetDisplayOrder(temp).catch(() => {});
    //   if (resp && resp.data && resp.data.Status === 1000) {
    //     const cb = () => {
    //       this.onGoBackClick();
    //     };
    //     this.messageBox.successSingle('设置成功', cb, cb);
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
.mp-erp-product-list-page-product-factory-set-comp-wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 45px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    padding: 30px 0;
    padding-bottom: 20px;
    line-height: 15px;
    box-sizing: border-box;
    // height: 15px;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
    > p {
      padding-top: 45px;
      > button {
        font-size: 14px;
      }
    }
  }
  > main {
    flex: 1;
    padding-top: 15px;
  }
  > footer {
    text-align: center;
    padding: 25px;
    flex: none;
    > button {
      width: 120px;
      height: 35px;
      border: 1px solid #26BCF9;
      border-radius: 3px;
      padding: 0;
      &:last-of-type {
        color: #26BCF9;
        margin-left: 30px;
      }
    }
  }
}
</style>
