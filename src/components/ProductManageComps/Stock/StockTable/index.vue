<template>
  <section class="mp-erp-product-module-stock-page-list-table-comp-container">
    <header>
      <span class="mp-common-title-wrap">{{title}}库存</span>
      <span class="blue-span" @click="onSpecificationAddClick">+ 添加规格</span>
      <span class="blue-span" @click="handleStockWarnSet">设置库存预警</span>
      <span class="intro" :title="warnText">{{warnText}}</span>
    </header>
    <main>
      <ul v-if="itemData" :class="localStockList.length > 2? 'hide-last-item-border':''">
        <li v-for="it in localStockList" :key="it.ID" class="item">
          <ul class="item-content">
            <li class="specification">
              <span class="is-origin">规格</span>
              <el-tooltip effect="light" popper-class='common-property-condition-text-tips-box'>
                <div slot="content">
                  <template v-if="Array.isArray(it._ConditionText)">
                    <p v-for="(_it, i) in it._ConditionText" :key="_it.name + 'tips' + i">
                      <span v-if="i > 0" class="type">{{it.Constraint.FilterType === 1 ? '且' : '或'}}</span>
                      <span class="name">{{_it.name}}</span>
                      <span class="is-origin">{{_it.operator}}</span>
                      <span class="val">{{_it.val}}</span>
                      <span v-if="i === it._ConditionText.length - 1" style="margin-left:2px"> 。</span>
                      <span v-else style="margin-left:2px">；</span>
                    </p>
                  </template>
                  <p v-else>{{it._ConditionText}}</p>
                </div>
                <div class="common-property-condition-text-content-box">
                  <template v-if="Array.isArray(it._ConditionText)">
                    <p v-for="(_it, i) in it._ConditionText" :key="_it.name + 'content' + i">
                      <span v-if="i > 0" class="type">{{it.Constraint.FilterType === 1 ? '且' : '或'}}</span>
                      <span>{{_it.name}}</span>
                      <span class="is-origin">{{_it.operator}}</span>
                      <span>{{_it.val}}</span>
                    </p>
                  </template>
                  <p v-else>{{it._ConditionText}}</p>
                </div>
              </el-tooltip>
            </li>
            <li class="property">
              <span>核减数量：</span>
              <span :title="it._PropertyName">{{it._PropertyName}}</span>
            </li>
            <li class="number">
              <span>当前库存：</span>
              <span :title="it._StockNumber" :class="it._Warning ? 'is-pink' : ''">{{it._StockNumber}}</span>
            </li>
          </ul>
          <div class="ctrl">
            <span @click="onStockNumberChangeClick(it)">
              <img src="@/assets/images/setup.png" alt="">
              <i>修改库存</i>
            </span>
            <span @click="onRemoveClick(it.ID)">
              <img src="@/assets/images/del.png" alt="">
              <i>删除</i>
            </span>
          </div>
        </li>
        <li class="empty" v-if="itemData.StockList && itemData.StockList.length === 0">
          <span>暂无条目</span>
        </li>
      </ul>
      <StockWarnSetDialog :title='title' @submit='onWarnSubmit' :visible.sync='StockWarnSetVisible' :WarningMobile='WarningMobile' :MinNumber='`${MinNumber}`'/>
      <StockNumberChangeDialog key="StockChange" @submit='onNumberChangeSubmit' :itemData='curStockChangeNumberItem' :visible.sync='StockNumberChangeVisible' />
    </main>
  </section>
</template>

<script>
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import StockWarnSetDialog from './StockWarnSetDialog';
import StockNumberChangeDialog from './StockNumberChangeDialog';

export default {
  props: {
    title: {
      type: String,
      default: '产品',
    },
    itemData: {
      type: Object,
      default: null,
    },
    leftPropertyList: {
      type: Array,
      default: null,
    },
    rightPropertyList: {
      type: Array,
      default: null,
    },
    ProductID: {
      type: String,
      default: '',
    },
    PartID: {
      type: String,
      default: '',
    },
  },
  components: {
    StockWarnSetDialog,
    StockNumberChangeDialog,
  },
  computed: {
    localStockList() {
      if (!this.itemData || !Array.isArray(this.itemData.StockList || this.itemData.StockList.length === 0)) return [];
      if (!Array.isArray(this.leftPropertyList) || this.leftPropertyList.length === 0) return [];
      if (!Array.isArray(this.rightPropertyList) || this.rightPropertyList.length === 0) return [];
      return this.itemData.StockList.map(it => {
        const Property = PropertyClass.getPerfectPropertyByImperfectProperty(it.Property, this.rightPropertyList);
        const [Constraint, _ConditionText] = PropertyClass.getConstraintAndTextByImperfectConstraint(it.Constraint, this.leftPropertyList);
        return {
          ...it,
          Property,
          Constraint,
          _ConditionText,
          _PropertyName: Property && Property.DisplayContent ? Property.DisplayContent.replace(/\[|\]/g, '') : '',
          _StockNumber: `${it.Number}${it.Unit}`,
          _Warning: (this.itemData.MinNumber && this.itemData.MinNumber > 0) ? it.Number <= this.itemData.MinNumber && it.Number !== -1 : false,
        };
      });
    },
    warnText() {
      // 库存数量 ≤ 500个时预警，短信预警手机号：13512341234
      if (!this.itemData) return '';
      const { WarningMobile, MinNumber } = this.itemData;
      if (this.$utils.isPositiveInteger(MinNumber, true, true)) {
        if (MinNumber >= 0) {
          let text = `库存数量 ≤ ${MinNumber}个时预警`;
          if (WarningMobile) text += `，短信预警手机号：${WarningMobile}`;
          return text;
        }
        if (MinNumber === -1) return '库存预警数量设置为-1，已关闭预警';
      }
      return '库存预警未设置';
    },
  },
  data() {
    return {
      MinNumber: '',
      WarningMobile: '',
      StockWarnSetVisible: false,
      StockNumberChangeVisible: false,
      curStockChangeNumberItem: null,
    };
  },
  methods: {
    onSpecificationAddClick() {
      this.$emit('add');
    },
    handleStockWarnSet() {
      if (!this.itemData) return;
      const { WarningMobile, MinNumber } = this.itemData;
      this.WarningMobile = WarningMobile || '';
      this.MinNumber = (MinNumber || MinNumber === 0) ? MinNumber : '';
      this.StockWarnSetVisible = true;
    },
    onWarnSubmit(data) {
      if (!data || !this.itemData) return;
      const { PartID, ProductID } = this;
      const temp = { ...data, PartID, ProductID };
      const cb = () => {
        this.StockWarnSetVisible = false;
      };
      this.$store.dispatch('productManage/getProductStockSetWarning', [temp, cb]);
    },
    onNumberChangeSubmit(data) {
      if (!data || !this.itemData) return;
      const { PartID, ProductID } = this;
      const temp = { ...data, PartID, ProductID };
      const cb = () => {
        this.StockNumberChangeVisible = false;
      };
      this.$store.dispatch('productManage/getProductStockUpdate', [temp, cb]);
    },
    onRemoveClick(id) {
      this.messageBox.warnCancelNullMsg('确定删除该库存规格吗', () => {
        const { PartID, ProductID } = this;
        const temp = { PartID, ProductID, id };
        this.$store.dispatch('productManage/getProductStockRemove', temp);
      });
    },
    onStockNumberChangeClick(item) {
      this.curStockChangeNumberItem = item;
      this.StockNumberChangeVisible = true;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-product-module-stock-page-list-table-comp-container {
  > header {
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    line-height: 18px;
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    max-width: 1600px;
    > span {
      flex: none;
      &.mp-common-title-wrap {
        font-size: 15px;
        color: #444;
        min-width: 6em;
        &::before {
          height: 16px;
        }
      }
      &.blue-span {
        margin: 0 25px;
        & + .blue-span {
          margin-left: 35px;
          margin-right: 30px;
        }
      }
      &.intro {
        flex: 1;
        font-size: 12px;
        color: #999;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  > main {
    > ul {
      min-height: 135px;
      border: 1px solid #eee;
      max-width: 1600px;
      > li {
        border-bottom: 1px solid #eee;
        height: 24px;
        line-height: 24px;
        padding: 10px 0;
        font-size: 12px;
        &.empty {
          font-size: 12px;
          color: #a2a2a2;
          padding: 55px 0;
          text-align: center;
          padding-right: 200px;
          border-color: #fff;
        }
        &.item {
          display: flex;
          transition: background-color 0.1s ease-in-out;
          &:hover {
            background-color: #f5f5f5;
          }
          > ul.item-content {
            flex: 1 1 auto;
            padding-left: 25px;
            display: flex;
            color: #585858;
            max-width: calc(100% - 320px);
            overflow: hidden;
            > li {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              flex: none;
              &.specification {
                margin-right: 50px;
                display: flex;
                flex: 1;
                .is-origin {
                  margin-right: 5px;
                }
                flex: 1 1 auto;
                min-width: 200px;
                > div {
                  width: auto;
                }
              }
              &.property {
                width: 280px;
                margin-right: 10px;
              }
              &.number {
                width: 200px;
                margin-right: 10px;
              }
            }
          }
          > .ctrl {
            flex: 0 0 auto;
            width: 200px;
            text-align: right;
            line-height: 26px;
            padding-right: 80px;
            user-select: none;
            span {
              cursor: pointer;
              img {
                vertical-align: text-bottom;
                margin-right: 5px;
              }
              i {
                color: #a2a2a2;
                transition: color 0.1s ease-in-out;
              }
              & + span {
                margin-left: 20px;
              }
              &:hover i {
                color: #444;
              }
            }
          }
        }
      }
      &.hide-last-item-border {
        > li {
          &:last-of-type {
            border-color: #fff;
          }
        }
      }
    }
  }
}
</style>
