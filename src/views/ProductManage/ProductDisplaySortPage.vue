<template>
  <section class="mp-erp-product-list-page-display-sort-set-comp-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
    </header>
    <main>
      <p class="tips-box"> <i class="el-icon-warning"></i> 注：拖动排序</p>
      <draggable v-if="DisplayList" v-bind="{ tag: 'ul', animation: 120 }" v-model="DisplayList">
        <li v-for="it in DisplayList" :key="it.key">{{it.Property.Name}}</li>
      </draggable>
    </main>
    <footer>
      <el-button type="primary" @click="onSubmitClick">保存</el-button>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import draggable from 'vuedraggable';

export default {
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '', // 产品 | 部件
      materialName: '', // url传入的物料名称，未使用
      DisplayList: [],
    };
  },
  components: {
    draggable,
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
      const { ProductID, PartID, name, type, materialName } = this.$route.params;
      if (!ProductID || !PartID || !name || !type) {
        this.onGoBackClick();
        return;
      }
      this.ProductID = ProductID;
      this.PartID = PartID !== 'null' ? PartID : '';
      this.ProductName = name;
      this.titleType = type;
      this.materialName = materialName;
      this.getProductOrderData();
    },
    async getProductOrderData(dataType = ['Order']) { // 获取初始物料、常规尺寸与尺寸组信息
      const ID = this.PartID ? this.PartID : this.ProductID;
      const _fetchFunc = this.PartID ? this.api.getPartModuleData : this.api.getProductModuleData;
      const List = this.$utils.getIDFromListByNames(dataType, this.ProductModuleKeyIDList);
      const _temp = { ID, List };
      const resp = await _fetchFunc(_temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        // 获取数据成功
        const { DisplayList } = resp.data.Data;
        if (dataType.includes('Order') && DisplayList) this.DisplayList = DisplayList.map(it => ({ ...it, key: Math.random().toString(36).slice(-8) }));
      }
    },
    async setDisplayOrderSubmit(list) { // 保存排序
      if (!list || list.length === 0) return;
      const { ProductID, PartID } = this;
      const List = list.map((it, Index) => ({ ...it, Index }));
      const temp = { ProductID, PartID, List };
      const resp = await this.api.getProductSetDisplayOrder(temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const cb = () => {
          this.onGoBackClick();
        };
        this.messageBox.successSingle('设置成功', cb, cb);
      }
    },
    onGoBackClick() {
      this.$router.replace('/ProductManageList');
    },
    onSubmitClick() {
      this.setDisplayOrderSubmit(this.DisplayList);
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
    width: 700px;
    padding-top: 15px;
    > p.tips-box {
      width: 700px;
    }
    > ul {
      padding-top: 35px;
      > li {
        font-size: 14px;
        color: #585858;
        border-bottom: 1px solid #f5f5f5;
        width: 700px;
        height: 42px;
        line-height: 28px;
        padding: 11px 70px;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: move;
      }
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    bottom: 20px;
    padding-top: 40px;
    flex: none;
    width: 700px;
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
