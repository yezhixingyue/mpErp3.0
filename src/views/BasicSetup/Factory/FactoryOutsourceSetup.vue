<template>
  <section class="mp-erp-factory-manage-setup-page-wrap">
    <header>
      <div class="factory-manag-setup-header">
        <p class="mp-common-title-wrap">当前工厂：{{FactoryName}}</p> <br>
        <el-button type="primary"
         @click="onFactoryAddClick" class="blue-full-color-btn-styles is-blue-button">添加外发价格</el-button>
      </div>
    </header>
    <main>
      <FactoryManageSetupTable
        :ProductList='ProductList'
        :dataList='filterDataList'
        @handleAddressItemEdit='handleAddressItemEdit'
        @handleAddressItemRemove='handleAddressItemRemove'
       />
      <FactoryManageSetupDialog v-if="FactoryID"
      :visible.sync='dialogVisible'
      :itemData='curItemData' :FactoryID='FactoryID' :ProductList='ProductList'
      @submit="onSubmit" />
    </main>
    <footer>
      <el-button class="cancel-blue-btn" @click="onGoBackClick"><i>＜＜</i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import FactoryManageSetupTable from '../../../components/FactoryManage/FactoryManageSetupTable.vue';
import FactoryManageSetupDialog from '../../../components/FactoryManage/FactoryManageSetupDialog.vue';
import recordScrollPositionMixin from '../../../assets/js/mixins/recordScrollPositionMixin';

export default {
  name: 'FactoryOutsourceSetup',
  mixins: [recordScrollPositionMixin('.mp-erp-factory-manage-setup-page-wrap .el-table__body-wrapper')],
  components: {
    FactoryManageSetupTable,
    FactoryManageSetupDialog,
  },

  computed: {
    ...mapState('common', ['factoryList', 'ProductMultipleClassifyList']),
    ProductList() {
      return this.ProductMultipleClassifyList[0] ? this.ProductMultipleClassifyList[0].List : [];
    },
  },
  data() {
    return {
      FactoryID: null,
      FactoryName: '',
      dialogVisible: false,
      curItemData: null,
      filterDataList: [],
    };
  },
  methods: {
    onGoBackClick() {
      this.$goback();
    },
    onFactoryAddClick() {
      this.curItemData = null;
      this.dialogVisible = true;
    },
    handleAddressItemEdit(itemData) {
      this.curItemData = itemData;
      this.dialogVisible = true;
    },
    async onSubmit(editData) {
      if (!editData) return;
      const keyword = editData.ID === 0 ? '添加' : '编辑';
      const resp = await this.api.getFactoryProductPriceSave(editData);
      if (resp && resp.data.Status === 1000) { //  保存成功
        if (keyword === '添加') this.setStorage();
        const func = () => {
          this.dialogVisible = false;
          this.getPiceList();
        };
        this.messageBox.successSingle(`${keyword}成功!`, func, func);
      }
    },
    handleAddressItemRemove(itemData) {
      this.messageBox.warnCancelBox('确定删除该外发价格吗 ?', `价格名称：[ ${itemData.Price.Name} ]`, () => {
        this.api.getFactoryProductPriceRemove(itemData.ID).then(res => {
          if (res.data.Status === 1000) {
            this.getPiceList();
            this.setStorage();
          }
        });
      });
    },
    setStorage() {
      sessionStorage.setItem('FactoryList', true);
    },
    getPiceList() {
      this.FactoryID = Number(this.$route.params.ID);
      this.FactoryName = this.$route.params.factoryName;
      this.api.getFactoryProductPriceList(this.$route.params.ID).then(res => {
        if (res.data.Status === 1000) {
          this.filterDataList = res.data.Data;
        }
      });
    },
  },
  mounted() {
    // this.$route.params.ID && this.$route.params.ID !== 'null'
    this.getPiceList();
  },
};
</script>
<style lang='scss'>
.mp-erp-factory-manage-setup-page-wrap {
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 6px;
  > header {
    // height: 60px;
    padding: 20px 0;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding-left: 20px;
    justify-content: space-between;
    p {
      margin-bottom: 15px;
    }
    > .input-box {
      display: flex;
      height: 30px;
      align-items: center;
      .el-input {
        width: 160px;
        .el-input__inner {
          height: 30px;
          line-height: 28px;
          font-size: 13px;
          &::placeholder {
            font-size: 12px;
          }
        }
      }
      .el-button {
        height: 30px;
        padding: 0;
        width: 95px;
        border-radius: 2px;
        margin: 0 12px 0 10px;
      }
      .blue-span {
        font-size: 12px;
        margin-right: 15px;
      }
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    margin-top: 8px;
    > .mp-erp-common-dialog-comp-wrap {
      .el-dialog__body {
        padding-right: 110px;
        padding: 45px 105px 35px 60px;
      }
      .el-dialog__footer {
        padding-bottom: 50px;
      }
    }
    // .mp-erp-common-select-comps-three-level-select-comp-wrap{
    //   >li.text{
    //     width: 8em;
    //   }
    // }
  }
  > footer {
    flex: none;
    height: 70px;
    background-color: #fff;
    font-size: 13px;
    padding-top: 30px;
    text-align: center;
    i {
      color: #26bcf9;
      font-weight: 600;
      font-size: 14px;
    }
  }
}
</style>
