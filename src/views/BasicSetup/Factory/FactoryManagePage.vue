<template>
  <section class="mp-erp-factory-manage-page-wrap">
    <FactoryManageHeader @onFactoryAddClick='onFactoryAddClick' @onFilterClick='onFilterClick' :filterWords='filterWords' />
    <main>
      <FactoryManageTable
        :dataList='filterDataList'
        :filterWords='filterWords'
        :getAddName='getItemAddressName'
        @setting='onSettingClick'
        @handleAddressItemEdit='handleAddressItemEdit'
        @handleAddressItemRemove='handleAddressItemRemove'
       />
      <FactoryManageDialog :visible.sync='dialogVisible' :areaList='allAdAreaTreeList' :itemData='curItemData' @submit="onSubmit" />
    </main>
    <footer>
      <span>共检索出 <i>{{factoryList.length}}</i> 条数据</span>
      <span v-show="filterWords" style="margin-left: 5px">，筛选出 <i>{{filterDataList.length}}</i> 条</span>
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import FactoryManageHeader from '../../../components/FactoryManage/FactoryManageHeader.vue';
import FactoryManageTable from '../../../components/FactoryManage/FactoryManageTable.vue';
import FactoryManageDialog from '../../../components/FactoryManage/FactoryManageDialog.vue';
import recordScrollPositionMixin from '../../../assets/js/mixins/recordScrollPositionMixin';

export default {
  name: 'FactoryManagePage',
  mixins: [recordScrollPositionMixin('.mp-erp-factory-manage-page-wrap .el-table__body-wrapper')],
  components: {
    FactoryManageHeader,
    FactoryManageTable,
    FactoryManageDialog,
  },
  computed: {
    ...mapState('common', ['factoryList']),
    ...mapGetters('common', ['allAdAreaTreeList']),
    filterDataList() {
      if (!this.filterWords) return this.factoryList;
      return this.factoryList.filter(it => it.FactoryName.includes(this.filterWords)
       || it.Address.includes(this.filterWords)
       || it.LinkMan.includes(this.filterWords)
       || it.Mobile.includes(this.filterWords));
    },
  },
  data() {
    return {
      dialogVisible: false,
      curItemData: null,
      filterWords: '',
    };
  },
  methods: {
    onFactoryAddClick() {
      this.curItemData = null;
      this.dialogVisible = true;
    },
    onFilterClick(keywords) {
      this.filterWords = keywords;
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
    onSettingClick(itemData, type) {
      switch (type) {
        case 'outsource': // 外发设置
          this.$router.push({ path: `/factoryOutsourceSetup/${itemData.FactoryID}/${itemData.FactoryName}` });
          break;
        case 'account': // 工厂账号设置
          this.$router.push({ path: `/factoryAccountSetup/${itemData.FactoryID}/${itemData.FactoryName}` });
          break;
        default:
          break;
      }
    },
    handleAddressItemEdit(itemData) {
      this.curItemData = itemData;
      this.dialogVisible = true;
    },
    async onSubmit(editData) {
      if (!editData) return;
      const isAdd = !editData.FactoryID && editData.FactoryID !== 0;
      const keyword = isAdd ? '添加' : '编辑';
      const resp = await this.$store.dispatch('common/getFactorySave', editData);
      if (resp) { //  保存成功
        const func = () => {
          this.dialogVisible = false;
          this.$store.commit('common/setFactoryChange', { type: isAdd ? 'add' : 'edit', data: resp });
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
    sessionStorage.removeItem('FactoryList');
    this.$store.dispatch('common/getFactoryList', { isForce: true, includeConvertServer: true });
    this.$store.dispatch('common/fetchAdAreaList');
  },
  async activated() { // 当从设置页面返回且保存员工设置的时候可以完整执行此处内部代码
    const bool = sessionStorage.getItem('FactoryList') === 'true';
    if (!bool) return;
    sessionStorage.removeItem('FactoryList');
    this.$store.commit('common/setFactoryList', []);
    this.$store.dispatch('common/getFactoryList', { isForce: true, includeConvertServer: true });
    await this.$nextTick();
  },
};
</script>
<style lang='scss'>
.mp-erp-factory-manage-page-wrap {
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 6px;
  > header {
    height: 60px;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding-left: 20px;
    justify-content: space-between;
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
  }
  > footer {
    flex: none;
    height: 16px;
    background-color: #fff;
    font-size: 13px;
    padding: 10px 20px;
    padding-right: 65px;
    line-height: 16px;
    color: #585858;
    text-align: right;
    i {
      color: #26bcf9;
      font-weight: 600;
      font-size: 14px;
    }
  }
}
</style>
