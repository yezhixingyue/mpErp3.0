<template>
  <section class="mp-erp-product-list-page-product-file-list-page-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
      <p>
        <el-button type="primary" size="small" @click="onFileSaveClick(null)">+添加关联</el-button>
      </p>
    </header>
    <main>
      <FileTable :dataList='localTableData' :loading='loading' :PropertyList='ProductFilePropertyList' @remove='onRemove' @edit='onEdit' />
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import FileTable from '@/components/ProductManageComps/File/FileTable.vue';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';

export default {
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '', // 产品 | 部件
      curEditData: null,
      loading: false,
    };
  },
  components: {
    FileTable,
  },
  computed: {
    ...mapState('productManage', ['ProductManageList', 'ProductModuleKeyIDList', 'ProductFileList', 'ProductFilePropertyList']),
    curProduct() {
      if (!this.ProductID) return null;
      return this.ProductManageList.find(it => it.ID === this.ProductID);
    },
    curPart() {
      if (!this.PartID || !this.curProduct) return null;
      return this.curProduct.PartList.find(it => it.ID === this.PartID);
    },
    localTableData() {
      // eslint-disable-next-line max-len
      if (!this.ProductFileList || this.ProductFileList.length === 0 || !this.ProductFilePropertyList || this.ProductFilePropertyList.length === 0) return [];
      const _ProductFileList = JSON.parse(JSON.stringify(this.ProductFileList)).map(it => {
        const { Constraint } = it;
        Constraint.ItemList = Constraint.ItemList.map(item => {
          const Property = PropertyClass.getPerfectPropertyByImperfectProperty(item.Property, this.ProductFilePropertyList);
          return { ...item, Property };
        }).filter(_it => _it.Property);
        return { ...it, Constraint };
      });
      return _ProductFileList;
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
      this.getPropertyList();
    },
    onFileSaveClick(data) {
      this.$store.commit('productManage/setCurEditFileData', data);
      const path = `/ProductFileSet/${this.ProductID}/${this.PartID ? this.PartID : 'null'}/${this.ProductName}/${this.titleType}/${Date.now()}`;
      this.$router.push(path);
    },
    async getProductOrderData(dataType = ['File']) { // 获取初始工厂列表信息
      const ID = this.PartID ? this.PartID : this.ProductID;
      const List = this.$utils.getIDFromListByNames(dataType, this.ProductModuleKeyIDList);
      const _temp = { ID, List };
      this.loading = true;
      await this.$store.dispatch('productManage/getProductFileList', _temp);
      this.loading = false;
    },
    getPropertyList() {
      this.$store.dispatch('productManage/getProductFilePropertyList', this.ProductID);
    },
    onGoBackClick() {
      this.$router.replace('/ProductManageList');
    },
    onRemove(it, i) {
      const fileListStr = it.FileList.map(_it => _it.File.Name).join('、');
      const msg = it.FileList.length > 2 ? `其中文件类目数量共 [ ${it.FileList.length} ]条` : `文件类目：[ ${fileListStr} ]`;
      this.messageBox.warnCancelBox('确定删除该条文件类目设置吗', msg, () => {
        this.$store.dispatch('productManage/getProductFilePropertyRemove', [it.ID, i]);
      });
    },
    onEdit(it) {
      this.onFileSaveClick(it);
    },
  },
  mounted() {
    this.getPositionID();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-list-page-product-file-list-page-wrap {
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
        width: 125px;
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
