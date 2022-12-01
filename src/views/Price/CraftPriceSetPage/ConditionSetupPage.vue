<template>
  <section class="mp-erp-price-module-price-table-condition-set-page-wrap">
    <header>
      <span>当前产品：</span>
      <span>{{ProductName}}</span>
      <span class="name">价格名称：{{PriceName}}</span>
      <span class="name" v-if="!isQuotationPage">设置工艺：{{curCraft.Name}}</span>
      <span class="name" v-if="curPartName">设置部件：{{curPartName}}</span>
    </header>
    <main>
      <ContionCommonComp
       v-if="PriceItemPropertyList && PriceItemPropertyList.length > 0"
       ref="oLeftCondition"
       :PropertyList='PriceItemPropertyList'
       :curEditData='curEditPriceItemData'
       :adAreaList="adAreaList" :areaList="areaList" :allAdAreaTreeList="allAdAreaTreeList"
       :allProductClassify="allProductClassify" :allProductAndLevelList="allProductAndLevelList" :allAreaTreeList="allAreaTreeList"
       single
       :ComparePropertyList='PriceItemPropertyList' />
       <div v-if="(!PriceItemPropertyList || PriceItemPropertyList.length === 0)" class="empty">
         <img src="@/assets/images/null.png" alt="">
         <p class="tips-box is-pink"><i class="el-icon-warning"></i> 暂无可用的属性列表。</p>
       </div>
    </main>
    <footer>
      <el-button :disabled='!PriceItemPropertyList || PriceItemPropertyList.length === 0'
       @click="onSubmitClick" class="is-blue-button" type="primary">保存</el-button>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ContionCommonComp } from '@/components/common/mpzj-sell-lib/lib';

export default {
  name: 'CraftPriceTableConditionSet',
  data() {
    return {
      PriceID: '',
      PriceName: '',
      ProductID: '',
      ProductName: '',
      isQuotationPage: false,
      ProductData: null,
    };
  },
  components: {
    ContionCommonComp,
  },
  computed: {
    ...mapState('priceManage', ['curSolutionItem', 'curEditPriceItemData', 'curPriceItem', 'curCraftPriceItemData', 'PriceItemPropertyList']),
    ...mapState('common', ['adAreaList', 'areaList']),
    ...mapGetters('common', ['allAdAreaTreeList', 'allProductClassify', 'allProductAndLevelList', 'allAreaTreeList']),
    curPartName() {
      if (this.isQuotationPage || !this.curCraftPriceItemData || !this.ProductData) return '';
      if (!this.curCraftPriceItemData.PartID) return '产品本身';
      const t = this.ProductData.PartList.find(it => it.ID === this.curCraftPriceItemData.PartID);
      return t ? t.Name : '';
    },
    curCraft() {
      return (this.curCraftPriceItemData && this.curCraftPriceItemData.Craft) || {};
    },
  },
  methods: {
    onSubmitClick() {
      const condition = this.$refs.oLeftCondition.getConditonResult();
      if (!condition) return;
      this.onSubmitSave(condition);
    },
    async onSubmitSave({ Constraint, Priority }) {
      const { ID } = this.curEditPriceItemData;
      if (!ID || !Constraint) return;
      const temp = { TableID: ID, Constraint, Priority };
      const resp = await this.api.getPriceTableSetCondition(temp).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.$store.commit('priceManage/setPriceTableListItemCondition', temp);
          this.onGoBackClick();
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    getInitDataFromRoutePath() { // 初始通过路径params中获取页面信息
      const isQuotationPage = this.$route.params.isQuotation; // 是否为价格表页面 否则为设置工艺费用组成页面
      if (!isQuotationPage && (!this.curPriceItem || !this.curCraftPriceItemData || !this.curCraftPriceItemData.Craft) && !this.curSolutionItem) {
        this.onGoBackClick();
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
        // this.CraftPriceID = this.curCraftPriceItemData.Craft.CraftPriceID;
      }
    },
    onGoBackClick() { // 返回上一页
      const { params } = this.$route;
      const pathName = this.isQuotationPage ? 'QuotationList' : 'CompositionCostOfCraft';
      this.$router.replace(({ name: pathName, params }));
    },
    async getProductData() { // 获取产品信息
      const data = await this.$store.dispatch('priceManage/getProductCraftData', this.ProductID);
      this.ProductData = data;
    },
  },
  mounted() {
    this.getInitDataFromRoutePath();
    this.getProductData();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-price-table-condition-set-page-wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 25px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-width: 1000px;
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
    .name {
      font-weight: 400;
      margin-left: 80px;
      font-size: 14px;
      & + .name {
        margin-left: 40px;
      }
    }
    > p {
      padding-top: 45px;
      > button {
        font-size: 14px;
      }
    }
    .other {
      font-weight: 400;
      font-size: 14px;
      margin-left: 40px;
    }
  }
  > main {
    flex: 1;
    padding-top: 15px;
    overflow: hidden;
    .right-content-main-wrap {
      display: flex;
      > span {
        color: #888E99;
        font-size: 14px;
        margin-right: 10px;
        padding-top: 10px;
      }
      .file-list {
        > li {
          padding: 9px 0;
          display: flex;
          align-items: center;
          > .el-checkbox {
            display: flex;
            align-items: center;
            > .el-checkbox__label {
              color: #585858;
              font-size: 12px;
            }
            &:first-of-type {
              width: 120px;
              overflow: hidden;
              vertical-align: middle;
              margin-right: 0;
              > .el-checkbox__label {
                max-width: 85px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
    .left-content {
      > main {
        > .el-radio-group.mp-common-tab-radio-box {
          width: 782px;
        }
        .el-form.constraint-ruleForm {
          flex: unset !important;
        }
      }
    }
    > .empty {
      padding-top: 50px;
      > img {
        margin-left: 20px;
        margin-bottom: 18px;
      }
    }
  }
  > footer {
    text-align: left;
    padding: 25px;
    padding-top: 40px;
    flex: none;
    padding-left: 252px;
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
