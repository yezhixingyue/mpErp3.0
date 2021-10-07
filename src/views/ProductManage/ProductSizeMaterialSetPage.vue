<template>
  <section class="mp-erp-product-list-page-size-material-set-comp-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
    </header>
    <main>
      <LRWidthDragAutoChangeComp leftWidth='45%' v-if="curProduct">
        <template v-slot:left>
          <ContentLeft
           ref='oLeft'
           :curProduct='curProduct'
           :curPart='curPart'
           @MaterialSaveSubmit='onMaterialSaveSubmit'
           @MaterialSortSubmit='onMaterialSortSubmit'
           @MaterialSetHiddenSubmit='onMaterialSetHiddenSubmit'
           @MaterialTypeRemove='onMaterialTypeRemoveClick'
           :MaterialList='MaterialList'
           />
        </template>
        <template v-slot:right>
          <ContentRight
           ref='oRight'
           :curProduct='curProduct'
           :curPart='curPart'
           :SizeGroup='SizeGroup'
           @SizeGroupSubmit='onSizeGroupSubmit'
           @GeneralSizeSubmit='onGeneralSizeSubmit'
           @GeneralSizeRemove='onGeneralSizeRemove'
           />
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
  name: 'ProductSizeMaterialSetPage',
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
      MaterialList: [],
      SizeGroup: null,
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
    getInitDataFromPath() { // 从路径获取初始ID信息 并随后获取页面需要数据
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
      this.getMaterialSizeData();
    },
    onGoBackClick() {
      this.$router.replace('/ProductManageList');
    },
    async getMaterialSizeData(dataType = ['Material', 'SizeGroup', 'GeneralSize']) { // 获取初始物料、常规尺寸与尺寸组信息
      const ID = this.PartID ? this.PartID : this.ProductID;
      const _fetchFunc = this.PartID ? this.api.getPartModuleData : this.api.getProductModuleData;
      const List = this.$utils.getIDFromListByNames(dataType, this.ProductModuleKeyIDList);
      const _temp = { ID, List };
      const resp = await _fetchFunc(_temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000 && resp.data.Data) {
        // 获取数据成功
        const { MaterialList, SizeGroup } = resp.data.Data;
        if (dataType.includes('Material') && MaterialList) this.MaterialList = MaterialList;
        if (dataType.includes('SizeGroup') && SizeGroup) this.SizeGroup = SizeGroup;
      }
    },
    async onMaterialSaveSubmit([TypeID, dataList, isEdit]) { // 物料添加与编辑
      const { ProductID, PartID } = this;
      const List = dataList.map(it => it.ID);
      const temp = { ProductID, PartID, TypeID, List };
      const resp = await this.api.getProductMaterialSave(temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const cb = () => {
          if (isEdit) {
            const i = this.MaterialList.findIndex(it => it.Type.ID === TypeID);
            this.MaterialList = this.MaterialList.filter(it => it.Type.ID !== TypeID);
            this.MaterialList.splice(i, 0, ...dataList);
          } else {
            this.MaterialList.push(...dataList);
          }
          this.$refs.oLeft.MaterialSaveVisible = false;
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    async onMaterialSortSubmit(list) { // 一级组合排序
      const { ProductID, PartID } = this;
      // const TypeList = list.map(it => it.ID);
      const List = list;
      const temp = { ProductID, PartID, List };
      const resp = await this.api.getProductMaterialOrder(temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const cb = () => {
          // const _newList = [];
          // const _oldList = JSON.parse(JSON.stringify(this.MaterialList));
          // List.forEach(TypeID => {
          //   _oldList.forEach((it, i) => {
          //     if (it && it.Type.ID === TypeID) {
          //       _newList.push(it);
          //       _oldList.splice(i, 1, null);
          //     }
          //   });
          // });
          this.MaterialList = this.MaterialList.map(it => {
            const t = List.find(_it => _it.MaterialID === it.ID);
            const Index = t ? t.Index : 999;
            return { ...it, Index };
          });
          this.$refs.oLeft.MaterialSortVisible = false;
        };
        this.messageBox.successSingle('保存排序成功', cb, cb);
      }
    },
    async onMaterialSetHiddenSubmit(list) { // 设置客户界面隐藏
      const { ProductID, PartID } = this;
      const temp = { ProductID, PartID, List: list };
      const resp = await this.api.getProductMaterialHiddenSet(temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const cb = () => {
          this.MaterialList = this.MaterialList.map(it => ({ ...it, HiddenToCustomer: list.includes(it.ID) }));
          this.$refs.oLeft.MaterialHiddentVisible = false;
        };
        this.messageBox.successSingle('设置客户隐藏成功', cb, cb);
      }
    },
    async onMaterialTypeRemoveClick(data) {
      if (!data) return;
      const { ID } = data;
      const { ProductID, PartID } = this;
      const temp = { productID: ProductID, partID: PartID, typeID: ID };
      const resp = await this.api.getProductMaterialRemove(temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const cb = () => {
          this.MaterialList = this.MaterialList.filter(it => it.Type.ID !== ID);
        };
        this.messageBox.successSingle('删除类型成功', cb, cb);
      }
    },
    async onSizeGroupSubmit(data) {
      const { ProductID, PartID } = this;
      const temp = { ProductID, PartID, ...data };
      const resp = await this.api.getProductGroupSizeSet(temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const cb = () => {
          this.SizeGroup = JSON.parse(JSON.stringify(temp));
          // this.SizeGroup.SizeList = [];
          this.$refs.oRight.SizeGroupVisible = false;
        };
        this.messageBox.successSingle('设置尺寸组成功', cb, cb);
      }
    },
    async onGeneralSizeSubmit(SizeList) {
      const { ProductID, PartID } = this;
      const temp = { ProductID, PartID, SizeList };
      const resp = await this.api.getGeneralSizeSave(temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const cb = () => {
          this.getMaterialSizeData(['SizeGroup', 'GeneralSize']);
          this.$refs.oRight.GeneralSizeVisible = false;
          // this.SizeGroup.SizeList = [];
        };
        this.messageBox.successSingle('设置固定尺寸成功', cb, cb);
      }
    },
    async onGeneralSizeRemove(ID) {
      const resp = await this.api.getGeneralSizeRemove(ID).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const cb = () => {
          this.SizeGroup.SizeList = this.SizeGroup.SizeList.filter(it => it.ID !== ID);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
  },
  mounted() {
    this.getInitDataFromPath();
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
    // flex: 1;
    height: calc(100% - 85px - 30px);
    .el-checkbox {
      .el-checkbox__label {
        font-size: 12px;
        color: #585858;
      }
    }
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
