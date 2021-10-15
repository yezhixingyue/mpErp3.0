<template>
  <li class="mp-promote-comp-add-product-ltem-wrap">
    <div class="header">
      <div class="left">
        <div class="product-title-list">
          <span>活动产品：</span>
          <el-tooltip
            placement="top-start"
            :hasTransition='false'
            popper-class='mp-promote-comp-add-product-ltem-wrap-tip-popper'
            effect="light">
              <ul slot="content" class="product-list-wrap">
                <li v-if="productNameList[0]&&productNameList[0]==='全部产品'">
                  {{productNameList[0]}}
                </li>
                <template v-else>
                  <li v-for="(item, i) in productNameList" :key="item+'-'+i">
                  <div v-for="(value, key, i) in item" :key="value+i">
                    <i v-if="i > 0">、</i>
                    <!-- <span class="title">{{key}}:</span> -->
                    [<ul>
                      <li v-for="(it, i) in value" :key='it+i'>
                        <div v-for="(lastV, lastVKey, lastVI) in it" :key="lastV+lastVI">
                          <span class="title2">{{lastVKey}}</span>
                          <template v-if="lastV.length > 0">
                            (<span
                              v-for="(sub, i) in lastV"
                              :key='sub+i'
                              class="is-gray product-child">
                              {{sub}}
                              <i v-if="i < lastV.length - 1">、</i>
                            </span>)
                          </template>
                        </div>
                        <i v-if="i < value.length - 1">、</i>
                      </li>
                    </ul>]
                  </div>
                </li>
                </template>
              </ul>
            <span class="product-list-wrap">
              {{productNameString}}
            </span>
          </el-tooltip>
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
// eslint-disable-next-line import/extensions
import { getProductArrayList, reg } from '../promoteUtils.js';


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
        default:
          break;
      }
      return _text;
    },
  },
  computed: {
    ...mapState('common', ['PriceUnitList', 'OperatorKeyValueList']),
    ...mapState('promoteStore', ['promoteAddRequestObj']),
    ...mapGetters('common', ['allProductClassify']),
    productNameList() {
      if (!this.data || this.data.length === 0) return '';
      if (this.allProductClassify.length === 0) return '';
      const _list = getProductArrayList(this.data.LimitList, this.allProductClassify);
      const _textArr = [];
      // const reg = /^全部/;
      if (_list === '全部产品') return ['全部产品'];
      _list.forEach(l1 => {
        if (reg.test(l1.children[0])) {
          _textArr.push({ [l1.ClassName]: [{ [`全部${l1.ClassName}产品`]: [] }] });
        } else {
          // _textArr.push(`${l1.ClassName}：[`);
          const _obj = { [l1.ClassName]: [] };
          l1.children.forEach(l2 => {
            const _tempobj = { [l2.ClassName]: [] };
            // let _text = `${l2.ClassName}`;
            if (reg.test(l2.children[0])) {
              // _textArr.push(`${_text}(全部产品)`);
              _tempobj[l2.ClassName] = [l2.children[0]];
              _obj[l1.ClassName].push(_tempobj);
            } else {
              // _text += ':';
              l2.children.forEach((l3) => {
                // if (i === 0) _text += `${l3.ClassName}`;
                // else _text += `、${l3.ClassName}`;
                _tempobj[l2.ClassName].push(l3.ClassName);
              });
              _obj[l1.ClassName].push(_tempobj);
            }
          });
          _textArr.push(_obj);
        }
      });
      return _textArr;
    },
    productNameString() {
      if (this.productNameList[0] && this.productNameList[0] === '全部产品') return '全部产品';
      let _text = '';
      const _arr = this.productNameList.map(item => Object.values(item)[0]);
      _arr.forEach((it, i1) => {
        const _s1 = _arr.length - 1 === i1 ? '' : '、';
        if (reg.test(Object.keys(it[0])[0])) {
          _text += Object.keys(it[0])[0];
        } else {
          it.forEach((lt2, i2) => {
            const _s2 = it.length - 1 === i2 ? '' : '、';
            if (reg.test(Object.keys(lt2)[0])) {
              _text += Object.keys(lt2)[0];
            } else if (reg.test(Object.values(lt2)[0][0])) {
              _text += Object.values(lt2)[0][0];
            } else {
              _text += Object.keys(lt2)[0];
              _text += '(';
              Object.values(lt2)[0].forEach((it3, i3) => {
                const _s3 = Object.values(lt2)[0].length - 1 === i3 ? '' : '、';
                _text += it3;
                _text += _s3;
              });
              _text += ')';
            }
            _text += _s2;
          });
        }
        _text += _s1;
      });
      return _text;
    },
    productList() {
      return this.data.LimitList;
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
      if (!this.data.List || this.data.List.length === 0) return [];
      if (!this.ComparePropertyList || this.ComparePropertyList.length === 0) return this.data.List;
      const list = this.data.List.map(it => {
        if (!it.Constraint) return { ...it, conditionText: '无' };
        const [Constraint, conditionText] = PropertyClass.getConstraintAndTextByImperfectConstraint(it.Constraint, this.ComparePropertyList);
        return { ...it, Constraint, conditionText };
      });
      return list;
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
      const _list = this.data.LimitList.map(it => it.ProductID);
      this.setWatchValue2ProductDia([..._list]);
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
    async preRequestConditionList() {
      let ProductID;
      if (this.data.LimitList.length > 1) {
        ProductID = '';
      } else if (this.data.LimitList.length === 1) {
        ProductID = this.data.LimitList[0].ProductID;
      } else {
        return;
      }
      if (ProductID) {
        const list = await PropertyClass.getPropertyList({ UseModule: 41, ProductID });
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
        > .product-list-wrap {
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
