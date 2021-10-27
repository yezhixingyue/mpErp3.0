<template>
  <li class="mp-promote-comp-add-product-ltem-wrap">
    <div class="header">
      <div class="left">
        <div class="product-title-list">
          <TableItemShowComp title="活动产品" subTitle='产品' :list='productDisplayList' />
        </div>
      </div>
      <div v-if="!isDisabled" class="right">
        <div v-if="!isDisabled" class="add-price is-blue" @click="addPrice">添加价格</div>
          <span class="is-blue" @click="handleChangeProducts">修改产品</span>
          <span class="is-red" @click="handleDelProducts">删除活动产品</span>
      </div>
    </div>
    <div class="content">
        <el-table :data="localList" style="width: 100%" border stripe>
            <el-table-column label="条件">
              <template slot-scope="scope">
                <el-tooltip effect="light" popper-class='common-property-condition-text-tips-box' placement="bottom-start"
                 v-if="typeof scope.row.conditionText === 'object'">
                  <div slot="content">
                    <p class="if-box"><span class="is-origin">如果</span> {{scope.row.FilterTypeText}}：</p>
                    <p v-for="(it, i) in scope.row.conditionText" :key="it.name + 'tips' + i">
                      <span v-if="i > 0" class="type">{{scope.row.Constraint.FilterType === 1 ? '且' : '或'}}</span>
                      <span class="name">{{it.name}}</span>
                      <span class="is-origin">{{it.operator}}</span>
                      <span class="val">{{it.val}}</span>
                      <span v-if="i === scope.row.conditionText.length - 1" style="margin-left:2px"> 。</span>
                      <span v-else style="margin-left:2px">；</span>
                    </p>
                  </div>
                  <div class="common-property-condition-text-content-box" style="text-align:left">
                    <p class="if-box"><span class="is-origin">如果</span> {{scope.row.FilterTypeText}}：</p>
                    <p v-for="(it, i) in scope.row.conditionText" :key="it.name + 'content' + i">
                      <span v-if="i > 0" class="type">{{scope.row.Constraint.FilterType === 1 ? '且' : '或'}}</span>
                      <span>{{it.name}}</span>
                      <span class="is-origin">{{it.operator}}</span>
                      <span>{{it.val}}</span>
                    </p>
                  </div>
                </el-tooltip>
                <span v-if="typeof scope.row.conditionText === 'string'">{{scope.row.conditionText}}</span>
              </template>
            </el-table-column>
            <el-table-column
            prop="name"
            label="执行价格"
            width="220">
              <template slot-scope="scope">
                <em>
                  {{ scope.row | geConditiontValue }}
                </em>
              </template>
            </el-table-column>
            <el-table-column width="175"  label="操作">
              <template slot-scope="scope">
                <span class='btn-item is-blue'
                 v-if="!isDisabled" @click="handlePriceEdit(scope.$index)">
                  <img src="@/assets/images/Compile.png" alt />修改价格
                </span>
                <span class="btn-item is-disabled-g is-gray" v-else >
                  <img src="@/assets/images/Compile-disabled.png" alt />修改价格
                </span>
                <span class='btn-item is-red'
                 v-if="!isDisabled" @click="handleProductDelete(scope.$index)">
                  <img src="@/assets/images/del.png" alt />删除
                </span>
                <span class='btn-item is-disabled-g is-gray' v-else >
                  <img src="@/assets/images/del-disabled.png" alt />删除
                </span>
              </template>
            </el-table-column>
            <div slot="empty">
              <span>尚未添加价格信息</span>
            </div>
        </el-table>
    </div>
  </li>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import TableItemShowComp from '@/components/common/SelectorComps/NewAreaTreeSpreadComp/TableItemShowComp';
import { getSelectedContentBySelectedDataAndAllData } from '@/components/common/SelectorComps/NewAreaTreeSpreadComp/utils';
import PromoteAddEditObjClassType from '@/store/Promote/PromoteAddEditObjClassType';
// eslint-disable-next-line import/extensions
// import { getProductArrayList, reg } from '../promoteUtils.js';


export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    index: { // ProductList中的索引位信息
      type: Number,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    geConditiontValue(data) {
      if (!data) return '';
      const { Price, PriceUnit } = data;
      if (!Price && !PriceUnit && PriceUnit !== 0 && Price !== 0) return '';
      let _text;
      switch (PriceUnit) {
        case 0:
          _text = `每个产品单价${Price}元`;
          break;
        case 1:
          _text = `每款产品总价${Price}元`;
          break;
        case 3:
          _text = `百分比折扣${Price}%`;
          break;
        case 4:
          _text = `减款${Price}元`;
          break;
        default:
          break;
      }
      return _text;
    },
  },
  components: {
    TableItemShowComp,
  },
  computed: {
    ...mapState('common', ['PriceUnitList', 'OperatorKeyValueList']),
    ...mapState('promoteStore', ['promoteAddRequestObj']),
    ...mapGetters('common', ['allProductClassify4Customer']),
    productNameString() {
      if (typeof this.productDisplayList === 'string') return this.productDisplayList;
      const _list = this.productDisplayList.map(it => {
        if (typeof it === 'string') return it;
        if (typeof it === 'object') {
          if (it.list && it.list.length > 0) return `${it.name}：${it.list.join('；')}`;
          return `${it.name}`.replaceAll('：', ':');
        }
        return '';
      });
      return _list.join('、').replaceAll('：', ':');
    },
    localList() {
      return this.tableDataList.map(it => ({
        ...it,
        FilterTypeText: it.Constraint && it.Constraint.FilterType === 1 ? '满足所有' : '满足任一',
      }));
    },
    ComparePropertyList() {
      if (Array.isArray(this.promoteAddRequestObj.ProductList[this.index].PropertyList)
       && this.promoteAddRequestObj.ProductList[this.index].PropertyList.length > 0) {
        return this.promoteAddRequestObj.ProductList[this.index].PropertyList;
      }
      if (Array.isArray(this.promoteAddRequestObj.commonPropertyList) && this.promoteAddRequestObj.commonPropertyList.length > 0) {
        return this.promoteAddRequestObj.commonPropertyList;
      }
      return [];
    },
    tableDataList() {
      if (!this.data.ItemList || this.data.ItemList.length === 0) return [];
      if (!this.ComparePropertyList || this.ComparePropertyList.length === 0) return this.data.ItemList;
      const list = this.data.ItemList.map(it => {
        if (!it.Constraint) return { ...it, conditionText: '无' };
        const [Constraint, conditionText] = PropertyClass.getConstraintAndTextByImperfectConstraint(it.Constraint, this.ComparePropertyList);
        return { ...it, Constraint, conditionText };
      });
      return list;
    },
    productDisplayList() {
      const content = this.getDisplayListContent(this.data);
      return Array.isArray(content) ? content.filter(it => it !== '不含新加产品') : content;
    },
  },
  methods: {
    // eslint-disable-next-line max-len
    ...mapMutations('promoteStore', ['delPrice4AddRequestObj', 'delProductItem4AddRequestObj', 'setWatchValue2ProductDia', 'setOpenType2ProductDia']),
    handlePriceEdit(index) {
      this.$router.push({
        name: 'promoteConditionSet',
        params: {
          productNames: this.productNameString,
          productIndex: this.index,
          itemIndex: index,
        },
      });
    },
    handleProductDelete(cur2DelIndex) {
      this.messageBox.warnCancelNullMsg('确定删除该条价格信息吗 ?', () => this.delPrice4AddRequestObj([this.index, cur2DelIndex]), null);
    },
    handleDelProducts() {
      this.messageBox.warnCancelBox('确定删除价格表中所有活动产品吗 ?', '[ 确认后此价格表将被移除! ]', () => this.delProductItem4AddRequestObj(this.index), null);
    },
    handleChangeProducts() {
      // const _list = this.data.LimitList.map(it => it.ProductID);
      if (!this.data) return;
      const { IsIncludeIncreasedProduct, ProductClassList } = this.data;
      const temp = { IsIncludeIncreased: IsIncludeIncreasedProduct, List: ProductClassList };
      this.setWatchValue2ProductDia(temp);
      this.setOpenType2ProductDia(this.index);
    },
    addPrice() {
      this.$router.push({
        name: 'promoteConditionSet',
        params: {
          productNames: this.productNameString,
          productIndex: this.index,
          itemIndex: 'new',
        },
      });
    },
    getDisplayListContent(item) {
      const temp = { List: item.ProductClassList, IsIncludeIncreased: item.IsIncludeIncreasedProduct };
      const content = getSelectedContentBySelectedDataAndAllData(temp, this.allProductClassify4Customer, '产品');
      return content || [];
    },
    async preRequestConditionList() {
      const { ProductClassList, IsIncludeIncreasedProduct } = this.data;
      if ((!ProductClassList || ProductClassList.length === 0) && !IsIncludeIncreasedProduct) return;
      const obj = { UseModule: 41 };
      const ProductID = PromoteAddEditObjClassType.getUniqueProductID(this.data);
      if (ProductID) {
        obj.ProductID = ProductID;
        const list = await PropertyClass.getPropertyList(obj);
        if (list) {
          this.$store.commit('promoteStore/addSingleProductPropertyListToAddRequestObj', [list, this.index]);
        }
      }
    },
  },
  mounted() {
    this.preRequestConditionList();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-promote-comp-add-product-ltem-wrap {
  width: 95%;
  padding-top: 40px;
  > .header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    // flex-wrap: wrap;
    // min-height: 25px;
    line-height: 18px;
    margin-bottom: 6px;
    // min-width: 620px;
    width: 100%;
    padding-right: 15px;
    box-sizing: border-box;
    > .left {
      display: flex;
      // flex: 1;
      // max-width: 405px;
      width: calc(100% - 315px);
      .product-title-list {
        display: flex;
        margin-right: 10px;
        font-size: 14px;
        font-weight: 600;
        color: $--color-text-primary;
        width: 100%;
        > span {
          flex: none;
          user-select: none;
          margin-left: 5px;
        }
        > .el-tooltip {
            height: 20px;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 13px;
        }
      }
    }
    > .right {
      flex: none;
      display: flex;
      width: 250px;
      justify-content: flex-end;
      // > div {
      //   // margin-right: 28px;
      //   flex: none;
        > span {
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
          &:hover {
            color: $--color-primary-light !important;
          }
        }
        > span + span {
          margin-left: 15px;
          &:hover {
              color: $--color-text-orgin !important;
          }
        }
        > .add-price {
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
          margin-left: 10px;
          &:hover {
            color: $--color-primary-light !important;
          }
          margin-right: 16px;
        }
      // }
    }
  }
  > .content {
    > .el-table {
      border: 1px solid #EBEEF5;
      border-bottom: none;
      border: none;
      &::after {
        display: none;
      }
      &::before {
        background-color: $--border-color-base;
      }
      > .el-table__header-wrapper {
        thead tr {
          > th {
            height: 40px;
            border: none;
            font-size: 13px;
            // border-bottom: 1px solid $--border-color-base;
            // border-top: 1px solid $--border-color-base;
            &:not(:nth-of-type(3)) {
              > .cell {
              position: relative;
              &::after {
                  content: '';
                  position: absolute;
                  width: 1px;
                  height: 14px;
                  background-color: $--border-color-base;
                  right: 0;
                  top: 3px;
                }
              }
            }
          }
        }
      }
      > .el-table__body-wrapper {
        &::-webkit-scrollbar ,.el-dropdown-menu.el-popper::-webkit-scrollbar{
          width: 6px;
          height: 8px;
          // display: none;
        }
        &::-webkit-scrollbar-thumb ,.el-dropdown-menu.el-popper::-webkit-scrollbar-thumb {
          background-color: $--border-color-base;
          border-radius: 3px;
          &:hover {
            background-color: $--color-text-secondary;
          }
        }
        > .el-table__body {
          > tbody > tr {
            > td {
                border-top: 1px solid #EBEEF5;
                font-size: 13px;
                border: none;
                > .cell {
                  > .btn-item {
                    > img {
                      margin-right: 4px;
                      position: relative;
                      top: 1px;
                    }
                    & + .btn-item > img{
                      top: 2px;
                    }
                  }
                  > span {
                    cursor: pointer;
                    user-select: none;
                    &:hover {
                      color: $--color-primary-light !important;
                    }
                  }
                  > span + span {
                    margin-left: 12px;
                    &:hover {
                        color: $--color-text-orgin !important;
                    }
                  }
                }
                &:first-of-type {
                    > .cell {
                        font-size: 12px;
                        white-space: normal;
                        line-height: 24px;
                        padding-right: 0;
                        .condition-box {
                          // text-align: left;
                          position: relative;
                          // padding-right: 30px;
                          white-space: normal;
                          > div {
                            display: inline;
                            span {
                              > i:first-of-type {
                                font-weight: 600;
                              }
                              word-wrap: break-word;
                              word-break: break-all;
                            }
                          }
                          > span.open-close-btn {
                            width: 30px;
                            display: inline-block;
                            position: absolute;
                            right: 0px;
                            cursor: pointer;
                            color: $--color-primary;
                            &:hover {
                              color: $--color-primary-light;
                            }
                            user-select: none;
                          }
                          &.hidden {
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                          }
                          transition: 0.3s;
                        }
                    }
                }
            }
          }
        }
      }
    }
    .el-dialog__header {
        > span::before {
        background: url(../../../assets/images/add.png) no-repeat center;
        }
        border-radius: 2px 2px 0px 0
    }
    .el-dialog__footer .dialog-footer{
      display: flex;
      justify-content: center;
      > button {
        margin: 0;
        line-height: 24px;
        border-radius: 2px;
        & + button {
          margin-left: 35px;
        }
      }
    }
  }
  .common-property-condition-text-content-box > p.if-box {
    margin-right: 0px;
  }
}
.mp-promote-comp-add-product-ltem-wrap-tip-popper {
  max-width: 520px !important;
  > ul.product-list-wrap {
    // display: block;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
    > li{
      margin-right: 12px;
      white-space: normal;
      line-height: 20px;
      > div {
          display: block;
        > .title {
          font-size: 13px;
          font-weight: 600;
          color: $--color-text-primary;
          flex: none;
          margin-right: 8px;
          margin-right: 5px;
        }
        > ul {
          display: inline;
          > li {
            display: inline;
            > div {
              display: inline;
              > span.title2 {
                font-size: 12px;
                font-weight: 600;
                color: rgba($color: $--color-text-primary, $alpha: 0.75);
                flex: none;
                &:not(:first-of-type) {
                  margin-left: 80px;
                }
              }
              > span.product-child {
                font-size: 12px;
                font-weight: 400;
                color: $--color-text-primary;
                // &:hover {
                //   color: $--color-text-primary !important;
                // }
              }
            }
          }
        }
      }
    }
  }
  transition: none !important;
  animation: none !important;
  padding: 18px;
}
</style>
