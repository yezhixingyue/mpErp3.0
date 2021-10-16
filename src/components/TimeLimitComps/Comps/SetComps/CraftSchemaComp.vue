<template>
  <section class="mp-erp-time-limit-set-page-content-craft-schema-comp-wrap">
    <header>工艺工期：</header>
    <div>
      <p>
        <span @click="onSingleCraftClick(null)" class="blue-span">+添加单个工艺工期</span>
        <span @click="onMultipleCraftClick" class="blue-span">+添加多个工艺工期</span>
      </p>
      <el-table
        v-if="TimeLimitData"
        border
        :data="TimeLimitData.CraftPeriodList"
        max-height="261"
        style="width: 1600px">
        <el-table-column
          label="工艺"
          show-overflow-tooltip
          width="291">
          <template slot-scope="scope">
            {{CraftListNames[scope.$index]}}
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          show-overflow-tooltip
          label="类型">
          <template slot-scope="scope">
            {{`${scope.row.IsSignle ? '单个工艺' : '多个工艺' }`}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          width="595"
          show-overflow-tooltip
          label="其它条件">
          <!-- 其它条件 -->
          <template slot-scope="scope">
            <span
              v-for="(it, i) in ConditionTextList[scope.$index]._list"
              :key="it.Prefix + '-' + i"
            >
              <i v-if="i > 0" class="is-gray">{{ConditionTextList[scope.$index].type}}</i>
              {{it.Prefix}}<em >{{it.Operator}}</em>{{it.Value}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          width="320"
          show-overflow-tooltip
          label="工期">
          <span class="is-success" slot-scope="scope">
            {{scope.row.Duration >= 24
             ? `${Math.floor(scope.row.Duration / 24)}天 ${scope.row.Duration % 24}小时 / 工艺`
             : `${scope.row.Duration}小时 / 工艺`}}
          </span>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <div class="menu-list" slot-scope="scope">
            <span @click="handleSchemaEdit(scope.$index)"><i></i>编辑</span>
            <span @click="handleSchemaDel(scope.$index)"><i></i>删除</span>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="dialogTitle"
      :modal='false'
      :visible.sync="showSingleDialog"
      width="850px"
      top='8vh'
      v-dialogDrag
      v-if="CraftPeriodItemData"
      class="mp-img-style-header single-craft-wrap">
      <span slot="footer" class="dialog-footer">
        <normal-btn-full @click.native="handleDialogSave" title='确定' />
        <normalBtn @click.native="handleDialogClose" title="取消" />
      </span>
    </el-dialog>
    <el-dialog
      :title="dialogTitle"
      :modal='false'
      :visible.sync="showMultipleDialog"
      width="850px"
      top='8vh'
      v-dialogDrag
      v-if="CraftPeriodItemData"
      class="mp-img-style-header multiple-craft-wrap"
      :before-close="handleMultipleDialogClose">
      <section>
        <div>
          <span class="title">工艺选择：</span>
          <div class="right-content-check-box-wrap">
            <p><el-checkbox v-model="CheckAllCraft" :indeterminate="isIndeterminate">全选</el-checkbox></p>
            <el-checkbox-group v-model="selectedCraftList">
              <el-checkbox v-for="it in craftList" :key="it.ID" :label="it.ID">{{it.Name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div>
          <span class="title">工期：</span>
          <div class="right-content">
            <el-input v-model="DurationDay"></el-input><span>天</span>
            <el-input :max="24" v-model="DurationHour"></el-input><span>小时</span>
          </div>
        </div>
      </section>
      <span slot="footer" class="dialog-footer">
        <normal-btn-full @click.native="handleDialogSave" title='确定' />
        <normalBtn @click.native="handleDialogClose" title="取消" />
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import CraftPeriodClass from '@/store/timeLimit/CraftPeriodClass';

export default {
  components: {
    normalBtnFull,
    normalBtn,
  },
  data() {
    return {
      dialogOpenType: 'add', // add | edit
      showMultipleDialog: false,
      conditionList: [],
      curEditIndex: 0,
      showSingleDialog: false,
    };
  },
  computed: {
    ...mapState('timelimit', ['TimeLimitData', 'CraftPeriodItemData', 'CraftPeriodCraftListData']),
    ...mapState('common', ['OperatorKeyValueList']),
    dialogTitle() {
      if (!this.showSingleDialog && !this.showMultipleDialog) return '';
      const _openType = this.dialogOpenType === 'add' ? '添加' : '编辑';
      // eslint-disable-next-line no-nested-ternary
      const _diaType = this.showSingleDialog ? '单个' : (this.showMultipleDialog ? '多个' : '');
      return `${_openType}${_diaType}工艺工期`;
    },
    DurationDay: {
      get() {
        if (!this.CraftPeriodItemData) return '';
        return this.CraftPeriodItemData.DurationDay;
      },
      set(val) {
        const _val = val.replace(/[^\d]/g, '');
        this.$store.commit('timelimit/setCraftPeriodItemData', ['DurationDay', _val]);
        const _DuraHour = this.CraftPeriodItemData.Duration ? Math.floor(this.CraftPeriodItemData.Duration % 24) : 0;
        this.$store.commit('timelimit/setCraftPeriodItemData', ['Duration', +_DuraHour + +_val * 24]);
      },
    },
    DurationHour: {
      get() {
        if (!this.CraftPeriodItemData) return '';
        return this.CraftPeriodItemData.DurationHour;
      },
      set(newValue) {
        let _val = newValue.replace(/[^\d]/g, '');
        if (_val >= 24) _val = 23;
        this.$store.commit('timelimit/setCraftPeriodItemData', ['DurationHour', _val]);
        const _DurationDay = this.CraftPeriodItemData.Duration ? Math.floor(this.CraftPeriodItemData.Duration / 24) : 0;
        this.$store.commit('timelimit/setCraftPeriodItemData', ['Duration', +_DurationDay * 24 + +_val]);
      },
    },
    CheckAllCraft: {
      get() {
        return this.CraftPeriodItemData.CraftList.length > 0
          && this.CraftPeriodItemData.CraftList.length === this.craftList.length;
      },
      set(val) {
        // console.log(val);
        const _list = val ? this.craftList.map(it => ({ ID: it.ID })) : [];
        this.$store.commit('timelimit/setCraftPeriodItemData', ['CraftList', _list]);
      },
    },
    isIndeterminate() {
      if (this.CraftPeriodItemData.CraftList.length === 0
       || this.craftList.length === this.CraftPeriodItemData.CraftList.length) return false;
      return this.CraftPeriodItemData.CraftList.length < this.craftList.length;
    },
    CraftListNames() {
      // eslint-disable-next-line max-len
      if (this.craftList.lenght === 0 || !this.TimeLimitData.CraftPeriodList || this.TimeLimitData.CraftPeriodList.length === 0) return [];
      const _list = this.TimeLimitData.CraftPeriodList.map(it => {
        const _arr = [];
        it.CraftList.forEach(it2 => {
          const _t = this.craftList.find(craft => it2.ID === craft.ID);
          if (_t) _arr.push(_t.Name);
        });
        return _arr.length > 0 ? _arr.join('、') : '';
      });
      return _list;
    },
    ConditionTextList() {
      return this.TimeLimitData.CraftPeriodList.map(
        it => (it.Constraint ? this.getConditionText(it.Constraint.ItemList, it.Constraint.FilterType) : {
          type: '',
          _list: [],
        }),
      );
    },
    craftList: {
      get() {
        return this.CraftPeriodCraftListData;
      },
      set(val) {
        this.$store.commit('timelimit/setCraftPeriodCraftListData', val);
      },
    },
    selectedCraftList: {
      get() {
        if (this.showMultipleDialog) return this.CraftPeriodItemData.CraftList.map(it => it.ID);
        return '';
      },
      set(val) {
        const _list = val.map(it => ({ ID: it }));
        this.$store.commit('timelimit/setCraftPeriodItemData', ['CraftList', _list]);
      },
    },

  },
  methods: {
    async getCraftList() { // 获取当前产品分类设定的工艺列表信息
      if (!this.TimeLimitData || this.craftList.length > 0) return;
      const { FirstLevelID, SecondLevelID } = this.TimeLimitData.ProductClass;
      const _temp = {
        ProductClass: {
          First: FirstLevelID,
          Second: SecondLevelID,
        },
      };
      const res = await this.api.getCraftList(_temp).catch(() => {});
      if (res && res.data.Status !== 1000) return;
      this.craftList = res.data.Data;
    },
    onSingleCraftClick(index) {
      this.$store.commit('timelimit/setCraftPeriodItemDataInit', { IsSignle: true });
      this.$router.push({
        name: 'SingleCraftPeriodItemSet',
        params: {
          EditIndex: index || index === 0 ? index : 'new',
        },
      });
    },
    onMultipleCraftClick() {
      this.dialogOpenType = 'add';
      this.showMultipleDialog = true;
      this.$store.commit('timelimit/setCraftPeriodItemDataInit', { IsSignle: false });
    },
    handleMultipleDialogClose() {
      this.showMultipleDialog = false;
    },
    handleConditionItemDEdit([data, itemIndex]) {
      this.$store.commit('timelimit/editCraftPeriodItemData4Constraint', [itemIndex, data]);
    },
    handleConditionItemDel(itemIndex) {
      this.$store.commit('timelimit/editCraftPeriodItemData4Constraint', [itemIndex]);
    },
    onFilterTypeChange(num) {
      if (!this.CraftPeriodItemData) return;
      if (num === this.CraftPeriodItemData.Constraint.FilterType) return;
      this.$store.commit('timelimit/changeCraftPeriodItemData4FilterType', num);
    },
    handleDialogSave() {
      if (!this.showMultipleDialog) return;
      const key = CraftPeriodClass.check(this.CraftPeriodItemData);
      if (key === true) {
        let _list = [];
        if (this.dialogOpenType === 'edit') {
          _list = [...this.TimeLimitData.CraftPeriodList];
          _list.splice(this.curEditIndex, 1, { ...this.CraftPeriodItemData });
        } else {
          _list = [{ ...this.CraftPeriodItemData }, ...this.TimeLimitData.CraftPeriodList];
        }
        this.$store.commit('timelimit/setTimeLimitData', ['CraftPeriodList', _list]);
        if (this.showMultipleDialog) this.showMultipleDialog = false;
      } else if (typeof key === 'string') {
        this.messageBox.failSingleError('保存失败', `[ ${key} ]`);
      }
    },
    handleDialogClose() {
      if (this.showMultipleDialog) this.showMultipleDialog = false;
    },
    async handleSchemaEdit(index) {
      this.$store.commit('timelimit/setCraftPeriodItemDataInit', this.TimeLimitData.CraftPeriodList[index]);
      this.curEditIndex = index;
      this.dialogOpenType = 'edit';
      const { IsSignle } = this.TimeLimitData.CraftPeriodList[index];

      if (IsSignle) {
        this.showSingleDialog = true;
        let Limits = [];
        if (this.TimeLimitData) {
          const { CraftList } = this.TimeLimitData.CraftPeriodList[index];
          // eslint-disable-next-line prefer-destructuring
          if (CraftList.length === 1) Limits = [CraftList[0].ID];
        }
        const positionID = this.TimeLimitData.ProductClass.SecondLevelID;
        this.conditionList = [];
        const res = await this.api.getConditionList4ProducePeriod({ type: 20, Limits, positionID });
        if (res.data.Status !== 1000) return;
        this.conditionList = res.data.Data;
      } else this.showMultipleDialog = true;
    },
    handleSchemaDel(index) {
      this.messageBox.warnCancelNullMsg(
        '确定删除该条工艺工期吗 ?',
        () => this.$store.commit('timelimit/deleteTimeLimitCraftPeriodItem', index),
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
        const _item = {};
        _item.Prefix = it.Prefix;
        const Operator = this.OperatorKeyValueList.find(item => item.ID === it.Operator);
        _item.Operator = Operator.name;
        if (it.ValueType === 1) {
          _item.Value = `${it.Value}${it.Unit ? it.Unit : ''}`;
        } else if (it.ValueType === 2) {
          const _tempObj = it.OptionList ? it.OptionList.find(Option => Option.OptionID === it.Value) : null;
          const _value = _tempObj ? _tempObj.Value : '';
          _item.Value = _value;
        }
        _obj._list.push(_item);
      });
      return _obj;
    },
  },
  mounted() {
    this.getCraftList();
  },
};
</script>

<style lang='scss'>
.mp-erp-time-limit-set-page-content-craft-schema-comp-wrap {
  margin-top: 40px;
  > div {
    > p {
      line-height: 19px;
      margin-bottom: 16px;
      > span {
        &:first-of-type {
          margin-right: 100px;
        }
      }
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
    }
    &.mp-img-style-header {
      .el-dialog__header {
        > span::before {
          background: url(../../../../assets/images/add-blue.png) no-repeat center;
        }
        border-radius: 2px 2px 0px 0
      }
      .el-dialog__body {
        font-size: 12px;
        padding: 30px 35px;
        padding-right: 25px;
        padding-left: 35px;
        padding-bottom: 120px;
        min-height: 400px;
        > section {
          > div {
            display: flex;
            color: #444;
            margin-bottom: 35px;
            > .title {
              flex: 0 0 auto;
              font-weight: 700;
              font-size: 14px;
              width: 94px;
              text-align: right;
              margin-right: 6px;
              user-select: none;
              > i {
                color: #989898;
                font-weight: 400;
                font-size: 13px;
              }
            }
            > div {
              > label {
                margin-right: 8px;
                margin-bottom: 15px;
                > span {
                  font-size: 12px;
                  &.el-radio__label {
                    min-width: 84px;
                    display: inline-block;
                    padding-left: 8px;
                  }
                }
              }
              &.right-condition-content {
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
                > div {
                  display: flex;
                  margin-top: 22px;
                  > span {
                    width: 150px;
                    height: 25px;
                    line-height: 23px;
                    box-sizing: border-box;
                    border: 1px solid #DCDFE6;
                    display: inline-block;
                    text-align: center;
                    user-select: none;
                    transition: background-color 0.15s;
                    cursor: pointer;
                    &:first-of-type {
                      border-right: none;
                    }
                    &:last-of-type {
                      border-left: none;
                    }
                    &.active {
                      background-color: #26bcf9;
                      color: #fff;
                      border: none;
                      line-height: 25px;
                    }
                  }
                }
              }
              &.right-content {
                .el-input {
                  width: 80px;
                  margin-right: 10px;
                  > input {
                    height: 30px;
                    line-height: 30px;
                    border-radius: 5px;
                    text-align: center;
                  }
                }
                .el-radio {
                  .el-radio__label {
                    font-size: 12px;
                    color: #444;
                  }
                }
              }
              &.right-content-check-box-wrap {
                margin-top: -3px;
                > p {
                  line-height: 15px;
                  margin-bottom: 15px;
                }
                .el-checkbox__label {
                  font-size: 12px;
                }
                > div {
                  > label {
                    margin-right: 8px;
                    margin-bottom: 15px;
                    > span {
                      font-size: 12px;
                      &.el-checkbox__label {
                        min-width: 84px;
                        display: inline-block;
                        padding-left: 8px;
                      }
                    }
                  }
                }
              }
            }
            &:first-of-type > div {
              min-height: 60px;
            }
            &:last-of-type {
              align-items: center;
              font-size: 13px;
              > .right-content {
                > span{
                  color: #989898;
                  &:first-of-type {
                    margin-right: 30px;
                  }
                }
              }
            }
          }
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
}
</style>
