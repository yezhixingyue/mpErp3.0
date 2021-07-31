<template>
  <section class="mp-erp-price-module-price-table-common-set-page-wrap" v-if="PriceTableData">
    <header>
      <div class="title-box">
        <h2>{{$route.params.name}}</h2>
        <span>价格名称：{{curPriceItem ? curPriceItem.Name : ''}}</span>
        <span v-if="!isQuotationPage && curCraftPriceItemData">设置工艺：{{curCraftPriceItemData.Craft.Name}}</span>
      </div>
      <div class="import">
        <span class="mp-common-title-wrap black f-15">{{curSolutionItem.ShowName}}</span>
        <div>
          <span class="blue-span" @click="onExcelImportClick">导入表</span>
          <span class="condition">{{ConstraintContent}}</span>
        </div>
      </div>
      <div class="setup">
        <ul class="l">
          <li>
            <span class="label">横轴：</span>
            <span class="blue-span" @click="onAxisPropSetupClick('X')" :class="{disabled: loading}">设置</span>
            <span class="content">{{XAxisProp?XAxisProp.DisplayContent.replace(/\[|\]/g, ""):'未设置'}}</span>
            <span class="blue-span" @click="onAxisDataSetupClick('X')" :class="{disabled: !XAxisProp}">设置数据</span>
            <el-checkbox :disabled='!XAxisProp' v-model="PriceTableData.XAxis.IsCumsum">分段累加</el-checkbox>
          </li>
          <li>
            <span class="label">竖轴：</span>
            <span class="blue-span" @click="onAxisPropSetupClick('Y')" :class="{disabled: loading}">设置</span>
            <span class="content">{{YAxisProp?YAxisProp.DisplayContent.replace(/\[|\]/g, ""):'未设置'}}</span>
            <span class="blue-span" @click="onAxisDataSetupClick('Y')" :class="{disabled: !YAxisProp}">设置数据</span>
            <el-checkbox :disabled='!YAxisProp' v-model="PriceTableData.YAxis.IsCumsum">分段累加</el-checkbox>
          </li>
        </ul>
        <div class="r">
          <span class="label">数据：</span>
          <span class="blue-span" @click="onTableItemDataSetClick">设置</span>
          <div>
            <p>数据单位：{{FormDataUnit || '无'}}</p>
            <p>其他数据：{{OtherDataUnit || '未设置'}}</p>
          </div>
        </div>
      </div>
    </header>
    <main>
      <FormulaPanelElementSelectDialog
       :visible.sync='AxisPropVisible'
       :selectedElementIDs='selectedElementIDs'
       :list='PriceItemPropertyList'
       @submit='onAxisPropSelect' />
       <AxisPropDataSetDialog ::visible.sync="AxisPropDataSetVisible" />
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import PriceTableClass from '@/assets/js/TypeClass/PriceTableClass';
import FormulaPanelElementSelectDialog from '@/components/common/FormulaAndConditionComps/FormulaPanelElementSelectDialog.vue';
import AxisPropDataSetDialog from '@/components/PriceComps/PriceTableItem/AxisPropDataSetDialog.vue';

export default {
  name: 'CraftPriceTableItemSet',
  components: {
    FormulaPanelElementSelectDialog,
    AxisPropDataSetDialog,
  },
  data() {
    return {
      productData: null,
      PriceID: '',
      PriceName: '',
      ProductID: '',
      ProductName: '',
      isQuotationPage: false,
      checked: false,
      PriceTableData: null,
      AxisPropVisible: false, // 控制横竖轴属性选择弹窗展示
      loading: true,
      curAxisPropSetType: '', // 当前正在设置的轴属性类型 X | Y
      selectedElementIDs: [],
      AxisPropDataSetVisible: false, // 控制横竖轴设置数据弹窗展示
    };
  },
  computed: {
    // curEditPriceItemData 为null时为添加
    ...mapState('priceManage', ['curSolutionItem', 'curEditPriceItemData', 'curPriceItem', 'curCraftPriceItemData', 'PriceItemPropertyList']),
    ConstraintContent() { // 顶部条件信息
      if (!this.PriceTableData) return '';
      const { Constraint } = this.PriceTableData;
      if (!Constraint || !Array.isArray(Constraint.ItemList) || Constraint.ItemList.length === 0) return '条件为空';
      return '有条件，尚未编写显示';
    },
    XAxisProp() { // X轴上选中的属性
      return this.PriceTableData?.XAxis?.Property;
    },
    YAxisProp() { // X轴上选中的属性
      return this.PriceTableData?.YAxis?.Property;
    },
    FormDataUnit() { // 数据单位
      return this.PriceTableData?.Unit;
    },
    OtherDataUnit() { // 其它数据
      return this.PriceTableData?.ElementList.map(it => (it.Unit ? `${it.Name}（单位：${it.Unit}` : `${it.Name}`)).join('、');
    },
  },
  methods: {
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
    async FetchInitDatas() { // 获取产品数据 X Y轴属性选择列表
      const [productData] = await Promise.all([
        this.$store.dispatch('priceManage/getProductCraftData', this.$route.params.id),
        this.$store.dispatch('priceManage/getPriceTablePropertyList', this.$route.params.id),
      ]);
      this.productData = productData;
      this.loading = false;
    },
    onGoBackClick() { // 返回上一页
      const { params } = this.$route;
      const pathName = this.isQuotationPage ? 'QuotationList' : 'CompositionCostOfCraft';
      this.$router.replace(({ name: pathName, params }));
    },
    onAxisPropSetupClick(type) { // 横轴竖轴属性点击设置 X | Y
      if (type === 'X' && this.XAxisProp) this.selectedElementIDs = [this.XAxisProp.StoredContent];
      else if (type === 'Y' && this.YAxisProp) this.selectedElementIDs = [this.YAxisProp.StoredContent];
      else this.selectedElementIDs = [];
      this.curAxisPropSetType = type;
      this.AxisPropVisible = true;
    },
    onAxisDataSetupClick(type) { // 横轴竖轴选中属性后的设置数据点击事件
      this.curAxisPropSetType = type;
      this.AxisPropDataSetVisible = true;
    },
    onTableItemDataSetClick() { // 表单项设置
      console.log('onTableItemDataSetClick, 设置表单项');
    },
    onAxisPropSelect(e) { // X Y轴设置选中属性事件
      if (this.curAxisPropSetType === 'X') {
        this.PriceTableData.XAxis.Property = e;
      }
      if (this.curAxisPropSetType === 'Y') {
        this.PriceTableData.YAxis.Property = e;
      }
    },
    onExcelImportClick() { // 导入表格点击
      console.log('onExcelImportClick');
    },
  },
  created() {
    this.PriceTableData = new PriceTableClass(this.curEditPriceItemData);
  },
  mounted() {
    this.getInitDataFromRoutePath();
    this.FetchInitDatas();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-price-table-common-set-page-wrap {
  padding: 0 10px;
  background-color: #f5f5f5;
  min-width: 980px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  > header {
    padding: 20px;
    padding-bottom: 25px;
    line-height: 15px;
    background-color: #fff;
    box-sizing: border-box;
    flex: none;
    > div {
      &.title-box {
        white-space: nowrap;
        display: flex;
        font-size: 15px;
        color: #21CAE3;
        font-weight: bold;
        > span {
          font-weight: 400;
          margin-left: 80px;
          font-size: 14px;
          & + span {
            margin-left: 40px;
          }
        }
      }
      &.import {
        display: flex;
        align-items: center;
        padding: 40px 0 30px 0;
        > div {
          padding-left: 25%;
          flex: 1;
          display: flex;
          overflow: hidden;
          align-items: center;
          .blue-span {
            font-size: 14px;
            padding-right: 12px;
            display: inline-block;
            border-right: 1px solid #eee;
            margin-right: 12px;
            flex: none;
          }
          .condition {
            font-size: 14px;
            flex: 1;
            color: #999;
            padding-right: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            max-width: 560px;
          }
        }
      }
      &.setup {
        display: flex;
        font-size: 12px;
        color: #999999;
        height: 55px;
        align-items: center;
        overflow: hidden;
        width: 100%;
        .label {
          font-weight: 700;
          color: #585858;
          font-size: 14px;
        }
        .el-checkbox__label {
          font-size: 12px;
          color: #585858;
        }
        .is-disabled .el-checkbox__label {
          color: #cbcbcb;
        }
        .blue-span {
          margin-right: 15px;
        }
        > ul.l {
          padding-right: 35px;
          border-right: 1px solid #eee;
          height: 44px;
          overflow: hidden;
          li {
            padding-bottom: 3px;
            display: flex;
            > span {
              flex: none;
              line-height: 19px;
              &.content {
                flex: 1;
                margin-right: 20px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                min-width: 5em;
              }
            }
          }
        }
        > div.r {
          padding-left: 25px;
          display: flex;
          line-height: 19px;
          height: 44px;
          overflow: hidden;
          .blue-span {
            margin-right: 20px;
          }
          > span {
            flex: none;
          }
          > div {
            overflow: hidden;
            > p {
              padding-bottom: 3px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    padding-left: 20px;
    padding-top: 30px;
    padding-right: 8px;
    &.loading {
      opacity: 0.2;
    }
  }
  > footer {
    background-color: #fff;
    padding: 20px;
    text-align: center;
    padding-right: 120px;
    flex: none;
    margin-bottom: 10px;
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
