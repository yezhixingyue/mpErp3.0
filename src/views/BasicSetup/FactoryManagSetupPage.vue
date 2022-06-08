<template>
  <section class="mp-erp-factory-manage-setup-page-wrap">
    <header>
      <div class="factory-manag-setup-header">
        <p class="mp-common-title-wrap">当前工厂：翰威帆布袋</p> <br>
        <el-button type="primary" v-if="Permission && Permission.PermissionList.PermissionSetupFactoryBase.Obj.Setup"
         @click="onFactoryAddClick" class="blue-full-color-btn-styles is-blue-button">添加生产工厂</el-button>
      </div>
    </header>
    <main>
      <FactoryManageSetupTable
        :dataList='filterDataList'
        @handleAddressItemEdit='handleAddressItemEdit'
        @handleAddressItemRemove='handleAddressItemRemove'
       />
       <div class="go-back-box">
       </div>
      <FactoryManageDialog :visible.sync='dialogVisible' :areaList='allAdAreaTreeList' :itemData='curItemData' @submit="onSubmit" />
    </main>
    <footer>
      <el-button class="cancel-blue-btn" @click="onGoBackClick"><i>＜＜</i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import FactoryManageSetupTable from '../../components/FactoryManage/FactoryManageSetupTable.vue';
import FactoryManageDialog from '../../components/FactoryManage/FactoryManageDialog.vue';
import recordScrollPositionMixin from '../../assets/js/mixins/recordScrollPositionMixin';

export default {
  name: 'FactoryManagSetupPage',
  mixins: [recordScrollPositionMixin('.mp-erp-factory-manage-setup-page-wrap .el-table__body-wrapper')],
  components: {
    FactoryManageSetupTable,
    FactoryManageDialog,
  },

  computed: {
    ...mapState('common', ['factoryList', 'Permission']),
    ...mapGetters('common', ['allAdAreaTreeList']),
    filterDataList() {
      return [];
    },
  },
  data() {
    return {
      dialogVisible: false,
      curItemData: null,
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
    getItemAddressName(itemData) {
      if (!itemData || !this.allAdAreaTreeList || this.allAdAreaTreeList.length === 0) return '';
      const Province = this.allAdAreaTreeList.find(it => it.ID === itemData.ProvinceID);
      if (Province) {
        const City = Province.children.find(it => it.ID === itemData.CityID);
        if (City) return `${Province.Name}${City.Name}${itemData.Address}`;
        return `${Province.Name}${itemData.Address}`;
      }
      return `${itemData.Address}`;
    },
    handleAddressItemEdit(itemData) {
      this.curItemData = itemData;
      this.dialogVisible = true;
    },
    async onSubmit(editData) {
      if (!editData) return;
      const keyword = editData.FactoryID === 0 ? '添加' : '编辑';
      const resp = await this.$store.dispatch('common/getFactorySave', editData);
      if (resp) { //  保存成功
        const func = () => {
          this.dialogVisible = false;
          this.$store.commit('common/setFactoryChange', { type: editData.FactoryID === 0 ? 'add' : 'edit', data: resp });
        };
        this.messageBox.successSingle(`${keyword}成功!`, func, func);
      }
    },
    handleAddressItemRemove(itemData) {
      this.messageBox.warnCancelBox('确定删除该工厂吗 ?', `工厂名称：[ ${itemData.FactoryName} ]`, () => {
        this.$store.dispatch('common/getFactoryRemove', itemData);
      });
    },
  },
  mounted() {
    // this.$route.params.ID && this.$route.params.ID !== 'null'
    this.api.getFactoryProductPriceList(this.$route.params.ID).then(res => {
      console.log(res);
    });
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
    .go-back-box{
      position:sticky;
      bottom: 36px;
    }
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
