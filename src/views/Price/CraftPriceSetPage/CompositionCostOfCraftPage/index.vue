<template>
  <section class="mp-erp-price-module-craft-price-cost-composition-set-page-wrap">
    <header>
      <span>当前产品：</span>
      <span>{{ProductName}}</span>
      <span class="name">价格名称：{{PriceName}}</span>
      <span class="name" v-if="!isQuotationPage">设置工艺：{{curCraft.Name}}</span>
      <TopRadioButtonComp
        v-model="curCraftPriceID"
        title="费用"
       :list='SolutionList'
       :loading='isSolutionLoading'
       @remove='onRemoveClick'
       @itemSave='onItemSaveClick'
       />
    </header>
    <main>
      <CraftPriceTitleItemSaveDialog
       :showGroup='!isQuotationPage'
       :visible.sync="visible"
       :rangeList='rangeList'
       :saveData='saveData'
       @submit="handleDialogSubmit" />
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import TopRadioButtonComp from '@/components/common/NewComps/TopRadioButtonComp';
import CraftPriceTitleItemSaveDialog from './Comps/CraftPriceTitleItemSaveDialog.vue';

export default {
  name: 'CompositionCostOfCraft',
  components: {
    TopRadioButtonComp,
    CraftPriceTitleItemSaveDialog,
  },
  computed: {
    ...mapState('priceManage', ['curCraftPriceItemData', 'curPriceItem', 'PriceManageList']),
    curProduct() {
      return this.PriceManageList.find(it => it.ID === this.ProductID);
    },
    curCraft() {
      return (this.curCraftPriceItemData && this.curCraftPriceItemData.Craft) || {};
    },
    rangeList() {
      if (!this.ProductData) return [];
      const list = [];
      // 1. 处理产品
      const temp = {
        PartID: '',
        Name: '产品',
        CraftGroupList: this.getCraftGroupList(this.ProductData.CraftList),
      };
      list.push(temp);
      // 2. 处理部件
      if (Array.isArray(this.ProductData.PartList)) {
        this.ProductData.PartList.forEach(Part => {
          const { ID, Name, CraftList } = Part;
          const _temp = {
            PartID: ID,
            Name,
            CraftGroupList: this.getCraftGroupList(CraftList),
          };
          list.push(_temp);
        });
      }
      return list;
    },
  },
  data() {
    return {
      PriceID: '',
      PriceName: '',
      ProductID: '',
      ProductName: '',
      curCraftPriceID: '',
      visible: false,
      saveData: null,
      ProductData: null,
      isQuotationPage: false, // 是否为价格表页面
      isSolutionLoading: true,
      SolutionList: [],
    };
  },
  methods: {
    onGoBackClick() {
      this.$goback();
    },
    onRemoveClick() {
      this.messageBox.warnCancelBox('确定要删除当前方案吗', `方案名称：[ ${this.curSolutionItem ? this.curSolutionItem.Name : '未知方案名称'} ]`, () => {
        // this.getMakeupSolutionRemove();
        console.log(123, 'onRemoveClick');
      });
    },
    onItemSaveClick(ID) {
      console.log('onItemSaveClick', ID);
      // const data = ID ? this.solutionList.find(it => it.ID === ID) : null;
      const temp = {
        // ID: data ? data.ID : '',
        // Name: data ? data.Name : '',
        // GroupID
        CraftPriceID: this.isQuotationPage ? '' : this.curCraftPriceID,
        // PartID: this.PartID,
        PriceID: this.PriceID,
        CraftID: this.isQuotationPage ? '' : this.curCraft.ID,
        ID: '',
        Name: '',
        GroupID: this.isQuotationPage ? '' : '', // ?
        PartID: '',
      };
      this.saveData = temp;
      this.visible = true;
    },
    async handleDialogSubmit(data) {
      // const nameSameItem = this.solutionList.find(it => it.Name === data.Name);
      // if (nameSameItem) {
      //   if (nameSameItem.ID === data.ID) {
      //     this.messageBox.failSingleError('保存失败', '方案名称未发生更改');
      //   } else {
      //     this.messageBox.failSingleError('保存失败', '存在相同的方案名称');
      //   }
      //   return;
      // }
      const resp = await this.api.getPriceSolutionSave(data).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          console.log('价格方案保存成功后应该做的时候');
          this.visible = false;
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
      console.log('handleDialogSubmit', data);
    },
    async getProductData() {
      const data = await this.$store.dispatch('priceManage/getProductCraftData', this.ProductID);
      this.ProductData = data;
    },
    getCraftGroupList(CraftList) { // 获取一个工艺列表中全部工艺中的可多次使用的元素组的数组列表
      if (!Array.isArray(CraftList)) return [];
      const list = [];
      CraftList.forEach(Craft => {
        if (Array.isArray(Craft.GroupList)) {
          Craft.GroupList.forEach(Group => {
            const { UseTimes } = Group;
            if (UseTimes && UseTimes.MaxValue > 1) list.push(Group);
          });
        }
      });
      return list;
    },
    async getPriceResultList() {
      const resp = await this.api.getPriceResultList(this.PriceID).catch(() => {});
      this.isSolutionLoading = false;
      if (resp && resp.data.Status === 1000) this.SolutionList = resp.data.Data;
    },
  },
  mounted() {
    const isQuotationPage = this.$route.params.isQuotation; // 是否为价格表页面 否则为设置工艺费用组成页面
    if (!isQuotationPage && (!this.curPriceItem || !this.curCraftPriceItemData || !this.curCraftPriceItemData.Craft)) {
      this.$goback();
      return;
    }
    const { ID, Name } = this.curPriceItem;
    this.PriceID = ID;
    this.PriceName = Name;
    this.ProductID = this.$route.params.id;
    this.ProductName = this.$route.params.name;

    if (isQuotationPage) { // 价格表页面执行操作
      this.isQuotationPage = isQuotationPage;
    }
    if (!isQuotationPage) { // 工艺费用组成设置页面
      // 暂无操作
    }
    this.getProductData();
    this.getPriceResultList();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-craft-price-cost-composition-set-page-wrap {
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
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
    .name {
      font-weight: 400;
      margin-left: 80px;
      font-size: 14px;
      & + .name {
        margin-left: 40px;
      }
    }
  }
  > main {
    flex: 1;
    padding-top: 15px;
    padding-left: 5px;
    .mp-common-title-wrap {
      color: #444;
      font-size: 15px;
      &::before {
        height: 15px;
      }
    }
    &.loading {
      opacity: 0.2;
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    flex: none;
    padding-bottom: 5px;
    // width: 1100px;
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
