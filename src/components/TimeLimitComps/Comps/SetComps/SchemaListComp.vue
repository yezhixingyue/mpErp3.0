<template>
  <section class="mp-erp-time-limit-set-page-content-schema-list-comp-wrap">
    <header>工期列表：</header>
    <div>
      <p> <el-button type="primary" @click="onAddOrEditBtnClick(null)" plain>+添加工期</el-button> </p>
      <el-table
        v-if="TimeLimitData"
        border
        :data="tableDataList"
        max-height="261"
        style="width: 1600px">
        <el-table-column
          label="选中区域"
          width="186">
          <template slot-scope="scope">
            <el-tooltip placement="top-start" :enterable='true' transition='none'
            v-if="SellAreaArrayList[scope.$index] && SellAreaArrayList[scope.$index].length > 0">
              <div slot="content">
                <p v-for="(item, i) in SellAreaArrayList[scope.$index]" :key="item + '-' + i">
                  {{ item }}
                </p>
              </div>
              <span class="area-span">{{ SellAreaArrayList[scope.$index].join(' ') }}</span>
            </el-tooltip>
            <span v-if="SellAreaArrayList[scope.$index] && SellAreaArrayList[scope.$index].length === 0">全部区域<i
             class="is-gray">（反选）</i>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          width="105"
          show-overflow-tooltip
          label="生效方式">
          <template slot-scope="scope">
            <span v-if="!scope.row.IncludeLimitArea && SellAreaArrayList[scope.$index]
             && SellAreaArrayList[scope.$index].length === 0" class="is-success">全部区域生效</span>
            <span v-else-if="scope.row.IncludeLimitArea">选中区域生效</span>
            <span v-else class="is-pink">非选中区域生效</span>
          </template>
        </el-table-column>
        <el-table-column
          label="配送方式"
          show-overflow-tooltip
          width="180">
          <template slot-scope="scope">
            {{
                subExpressList.length > scope.row.ExpressList.length
                ? getExpressNames(scope.row.ExpressList)
                : '所有配送方式'
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          width="365"
          show-overflow-tooltip
          label="其它条件">
          <!-- 其它条件 -->
          <template slot-scope="scope">
            <el-tooltip effect="light" popper-class='common-property-condition-text-tips-box' placement="bottom-start"
              v-if="scope.row.conditionText && typeof scope.row.conditionText === 'object'">
              <div slot="content">
                <p class="if-box"><span class="is-origin">如果</span> {{scope.row.Constraint && scope.row.Constraint.FilterType === 1 ? '满足所有' : '满足任一'}}：</p>
                <p v-for="(it, i) in scope.row.conditionText" :key="it.name + 'tips' + i">
                  <span v-if="i > 0" class="type">{{scope.row.Constraint.FilterType === 1 ? '且' : '或'}}</span>
                  <span class="name">{{it.name}}</span>
                  <span class="is-origin">{{it.operator}}</span>
                  <span class="val">{{it.val}}</span>
                  <span v-if="i === scope.row.conditionText.length - 1" style="margin-left:2px"> 。</span>
                  <span v-else style="margin-left:2px">；</span>
                </p>
              </div>
              <div class="common-property-condition-text-content-box">
                <p class="if-box"><span class="is-origin">如果</span> {{scope.row.Constraint && scope.row.Constraint.FilterType === 1 ? '满足所有' : '满足任一'}}：</p>
                <p v-for="(it, i) in scope.row.conditionText" :key="it.name + 'content' + i">
                  <span v-if="i > 0" class="type">{{scope.row.Constraint.FilterType === 1 ? '且' : '或'}}</span>
                  <span>{{it.name}}</span>
                  <span class="is-origin">{{it.operator}}</span>
                  <span>{{it.val}}</span>
                </p>
              </div>
            </el-tooltip>
            <span v-if="scope.row.conditionText && typeof scope.row.conditionText === 'string'">{{scope.row.conditionText}}</span>
            <span v-if="!scope.row.conditionText">无</span>
          </template>
        </el-table-column>
        <el-table-column
          width="125"
          show-overflow-tooltip
          label="付款时间">
          <template slot-scope="scope">
            {{`${('0' + scope.row.LatestPayTime.First).slice(-2)
            }:${('0' + scope.row.LatestPayTime.Second).slice(-2)}之前`}}
          </template>
        </el-table-column>
        <el-table-column
          width="105"
          show-overflow-tooltip
          label="生产工期">
          <span class="is-success" slot-scope="scope">
            {{scope.row.ProduceDuration >= 24
             ? `${Math.floor(scope.row.ProduceDuration / 24)}天 ${scope.row.ProduceDuration % 24}小时`
             : `${scope.row.ProduceDuration}小时`}}
          </span>
        </el-table-column>
        <el-table-column
          width="115"
          show-overflow-tooltip
          label="数量递增">
          <template slot-scope="scope">
            {{scope.row.ProductIncrementDuration && scope.row.ProductIncrement
             ? `${scope.row.ProductIncrementDuration}小时 / ${scope.row.ProductIncrement}`
             : ''}}
          </template>
        </el-table-column>
        <el-table-column
          width="125"
          show-overflow-tooltip
          label="工艺工期">
          <template slot-scope="scope">
            {{scope.row.CraftPeriodType === 3
             ? `${scope.row.CraftIncrementDuration}小时 / ${scope.row.CraftIncrement}种` : ''}}
            <span v-if="scope.row.CraftPeriodType === 0">不额外增加</span>
            <span v-if="scope.row.CraftPeriodType === 1">累加工艺工期</span>
            <span v-if="scope.row.CraftPeriodType === 2">仅增长最长工艺工期</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          width="80"
          show-overflow-tooltip
          label="配送工期">
          <span :class="scope.row.IncludeExpress ? '' : 'is-gray'" slot-scope="scope">
            {{scope.row.IncludeExpress ? (scope.row.DeliveryDuration >= 24
             ? `${Math.floor(scope.row.DeliveryDuration / 24)}天 ${scope.row.DeliveryDuration % 24}小时`
             : `${scope.row.DeliveryDuration}小时`) : '不含'}}
          </span>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <div class="menu-list" slot-scope="scope">
            <span @click="onAddOrEditBtnClick(scope.$index)"><i></i>编辑</span>
            <span @click="handleSchemaDel(scope.$index)"><i></i>删除</span>
          </div>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { PropertyClass } from '@/components/common/mpzj-sell-lib/lib';
import { getAreaList, reg } from '../../../Promote/promoteUtils';

export default {
  components: {
  },
  data() {
    return {
      dialogTitle: '添加工期',
      IncludeLimitArea: true,
      curEditIndex: 0,
      bool4GetCondition: false,
    };
  },
  computed: {
    ...mapState('timelimit', ['SchemaItemData', 'TimeLimitData', 'ConditionList4ProducePeriodProduct', 'setPageType']),
    ...mapState('common', ['OperatorKeyValueList']),
    ...mapGetters('common', ['subExpressList', 'allAdAreaTreeList']),
    subExpressIDList() {
      if (!this.subExpressList || this.subExpressList.length === 0) return [];
      return this.subExpressList.map(it => it.ID);
    },
    SellAreaArrayList() {
      if (this.allAdAreaTreeList.length === 0) return [];
      const _list = this.TimeLimitData.SchemaList.map(data => data.AreaList);
      const _tempList = _list.map(item => getAreaList(item, this.allAdAreaTreeList, 'Name'));
      const type = 'Name';
      if (!_tempList || _tempList.length === 0) return '';
      const list = _tempList.map(temp => {
        const _textArr = [];
        if (temp === '全部区域') return ['全部区域'];
        temp.forEach(l1 => {
          if (reg.test(l1.children[0])) {
            _textArr.push(`${l1[type]}`);
          } else {
            // _textArr.push(`${l1[type]}：`);
            let _text = `${l1[type]}：[`;
            l1.children.forEach((l2, i2) => {
              if (i2 > 0) _text += '、';
              if (reg.test(l2.children[0])) {
                _text += `${l2[type]}全部区域 `;
              } else {
                _text += `${l2[type]}: `;
                l2.children.forEach((l3, i) => {
                  if (i === 0) _text += `${l3[type]}`;
                  else _text += `、${l3[type]}`;
                });
              }
            });
            _text += ' ]';
            _textArr.push(_text);
          }
          // _text += ';';
        });
        return _textArr;
      });
      return list;
    },
    ConditionTextList() {
      return this.TimeLimitData.SchemaList.map(
        it => (it.Constraint ? this.getConditionText(it.Constraint.ItemList, it.Constraint.FilterType) : {
          type: '',
          _list: [],
        }),
      );
    },
    watchVal4SetBool4GetCondition() {
      if (!this.TimeLimitData) return 0;
      return this.TimeLimitData.ProductList ? this.TimeLimitData.ProductList.length : 0;
    },
    tableDataList() {
      if (!this.TimeLimitData.SchemaList || this.TimeLimitData.SchemaList.length === 0) return [];
      if (!this.TimeLimitData.SchemaPropertyList || this.TimeLimitData.SchemaPropertyList.length === 0) return this.TimeLimitData.SchemaList;
      const list = this.TimeLimitData.SchemaList.map(it => {
        if (!it.Constraint) return { ...it, conditionText: '无' };
        const [Constraint, conditionText] = PropertyClass.getConstraintAndTextByImperfectConstraint(it.Constraint, this.TimeLimitData.SchemaPropertyList);
        return { ...it, Constraint, conditionText };
      });
      return list;
    },
  },
  methods: {
    onAddOrEditBtnClick(index) {
      if (!this.TimeLimitData) return;
      if (this.TimeLimitData.ProductList.length === 0) {
        this.$message({
          showClose: true,
          message: '请先选择指定产品',
          type: 'error',
        });
        return;
      }
      this.$store.commit('timelimit/setSchemaItemDataInit', index || index === 0 ? this.TimeLimitData.SchemaList[index] : {});

      this.$router.push({
        name: 'SchemaItemSet',
        params: {
          EditIndex: index || index === 0 ? index : 'new',
        },
      });
    },
    handleSchemaDel(index) {
      this.messageBox.warnCancelNullMsg(
        '确定删除该条工期吗 ?',
        () => this.$store.commit('timelimit/deleteTimeLimitSchemaItem', index),
        null,
      );
    },
    getConditionText(data, type) {
      // eslint-disable-next-line no-nested-ternary
      const _str = type === 1 ? '并且' : type === 2 ? '或者' : '';
      const _obj = {
        type: _str,
        _list: [],
      };
      data.forEach(it => {
        const condition = this.ConditionList4ProducePeriodProduct.find(item => item.PropertyType === it.PropertyType
            && item.PropertyID === it.PropertyID && item.GroupID === it.GroupID
            && item.CraftID === it.CraftID
            && item.PartID === it.PartID && item.ProductID === it.ProductID);
        if (!condition) return;
        const _item = {};
        _item.Prefix = condition.Prefix;
        const Operator = this.OperatorKeyValueList.find(item => item.ID === it.Operator);
        _item.Operator = Operator.name;
        if (condition.ValueType === 1) {
          _item.Value = `${it.Value}${condition.Unit}`;
        } else if (condition.ValueType === 2) {
          const _tempObj = condition.OptionList.find(Option => Option.OptionID === it.Value);
          const _value = _tempObj ? _tempObj.Value : '';
          _item.Value = _value;
        }
        _obj._list.push(_item);
      });
      return _obj;
    },
    getExpressNames(list) {
      const _list = list.filter(it => this.subExpressIDList.includes(it.ID));
      if (_list.length === 0 || this.subExpressList.length === 0) return '';
      if (_list.length === this.subExpressList.length - 1) {
        let key = true;
        _list.forEach(_it => {
          if (_it.ID === 1 || !key) key = false;
        });
        if (key) return '名片之家除外';
      }
      const _arr = [];
      _list.forEach(it => {
        const _t = this.subExpressList.find(_it => _it.ID === it.ID);
        if (_t) _arr.push(_t.Name);
      });
      return _arr.join('、');
    },
    async getSchemaPropertyList() {
      if (!this.TimeLimitData.SchemaPropertyList || this.TimeLimitData.SchemaPropertyList.length === 0) {
        const { ProductList } = this.TimeLimitData;
        const temp = { UseModule: 41 };
        if (ProductList.length === 1) {
          temp.ProductID = ProductList[0].ID;
        }
        const list = await PropertyClass.getPropertyList(temp, this.api.getFormulaPropertyList);
        if (list) {
          this.$store.commit('timelimit/setTimeLimitData', ['SchemaPropertyList', list]);
        }
      }
    },
  },
  async mounted() {
    this.$store.dispatch('common/getExpressList');
    this.$store.dispatch('common/fetchAdAreaList');
    if (this.setPageType === 'edit') {
      if (this.TimeLimitData.SchemaList.length >= 1) {
        this.getSchemaPropertyList();
      }
    }
  },
  watch: {
    watchVal4SetBool4GetCondition() {
      this.bool4GetCondition = true;
    },
  },
};
</script>

<style lang='scss'>
// @import "@/assets/css/var.scss";
.mp-erp-time-limit-set-page-content-schema-list-comp-wrap {
  font-size: 14px;
  > header {
    line-height: 35px !important;
  }
  > div {
    > p {
      > button {
        width: 110px;
        height: 35px;
        padding: 0;
        background-color: #fff !important;
        border-color: #26bcf9 !important;
        &:hover {
          background-color: #26bcf9 !important;
        }
        &:active {
          background-color: #22a9e0 !important;
          border-color: #22a9e0 !important;
        }
        &:focus {
          background-color: mix(#26bcf9, #fff, 80%) !important;
          border-color: mix(#26bcf9, #fff, 80%) !important;
        }
      }
      margin-bottom: 20px;
    }
    > .el-table {
      .el-table__header-wrapper {
        .el-table__header {
          > thead {
            > tr {
              > th {
                height: 40px;
                font-size: 14px;
                // &.is-leaf {
                //   &:last-of-type {
                //     &::after {
                //       display: none !important;
                //     }
                //   }
                // }
              }
            }
          }
        }
      }
      .menu-list {
        color: #a2a2a2;
        > span {
          transition: 0.2s;
          cursor: pointer;
          user-select: none;
          &:hover {
            color: #444;
          }
          margin: 0 14px;
          > i {
            display: inline-block;
            vertical-align: -2px;
            margin-right: 4px;
          }
          &:first-of-type {
            > i {
              width: 14px;
              height: 14px;
              background: url(../../../../assets/images/Compile.png) no-repeat center/14px 14px;
            }
          }
          &:last-of-type {
            > i {
              width: 12px;
              height: 16px;
              background: url(../../../../assets/images/del.png) no-repeat center/12px 16px;
            }
          }
        }
      }
      .area-span {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: bottom;
      }
    }
    &.add-limit-wrap {
      .el-dialog__header {
        > span::before {
          background: url(../../../../assets/images/add-blue.png) no-repeat center;
        }
        border-radius: 2px 2px 0px 0
      }
      .el-dialog__body {
        font-size: 12px;
        padding: 30px 48px;
        padding-left: 35px;
        > section {
          > div {
            display: flex;
            color: #444;
            > .title {
              flex: 0 0 auto;
              font-weight: 700;
              font-size: 14px;
              width: 118px;
              text-align: right;
              margin-right: 6px;
              user-select: none;
              > i {
                color: #989898;
                font-weight: 400;
                font-size: 13px;
              }
            }
          }
          &.center {
            > div {
              > .right-content {
                > p {
                  font-size: 13px;
                  margin-bottom: 22px;
                  width: 100px;
                }
                > ul {
                  &::-webkit-scrollbar {
                    width: 6px;
                    height: 8px;
                  }
                  &::-webkit-scrollbar-thumb {
                    background-color: #cbcbcb;
                    border-radius: 3px;
                    &:hover {
                      background-color: #989898;
                    }
                  }
                  max-height: 120px;
                  overflow: auto;
                  > li {
                    margin-top: 18px;
                    &:first-of-type {
                      margin: 0;
                    }
                    > span {
                      display: none;
                    }
                    span {
                      font-size: 12px !important;
                    }
                    input {
                      font-size: 12px !important;
                    }
                  }
                }
              }
            }
          }
        }
        > div.line {
          width: 745px;
          height: 1px;
          background-color: #eee;
          margin: 15px 0 25px 20px;
        }
      }
      .el-dialog__footer {
        padding-bottom: 35px;
        padding-top: 20px;
        > .dialog-footer {
          display: flex;
          justify-content: center;
          > button {
            margin: 0 15px;
            width: 120px;
            height: 30px;
            border-radius: 2px;
            &:first-of-type {
              background: linear-gradient(to right, #26bcf9, #35dff9);
              border: none;
            }
          }
        }
      }
    }
  }
  .common-property-condition-text-content-box > p.if-box {
    margin-right: 0px;
  }
}
</style>
