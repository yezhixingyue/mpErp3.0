<template>
  <section class="mp-erp-time-limit-set-page-content-schema-list-comp-wrap">
    <header>工期列表：</header>
    <div>
      <p> <el-button type="primary" @click="onAddBtnClick" plain>+添加工期</el-button> </p>
      <el-table
        v-if="TimeLimitData"
        border
        :data="TimeLimitData.SchemaList"
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
            <span @click="handleSchemaEdit(scope.$index)"><i></i>编辑</span>
            <span @click="handleSchemaDel(scope.$index)"><i></i>删除</span>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      width="850px"
      top='4vh'
      :modal='false'
      v-dialogDrag
      v-if="SchemaItemData"
      class="mp-img-style-header add-limit-wrap"
      :before-close="handleDialogClose">
      <section class="top">
        <div>
          <span class="title">指定区域：</span>
          <div class="right-content">
            <span class="blue-span" @click="onAreaBtnClick">选择区域</span>
            <span v-if="(areaShowTextArr && areaShowTextArr.length > 0)">
              [
              <i v-if="SchemaItemData.IncludeLimitArea" class="is-success">只限右侧区域生效</i>
              <i v-else class="is-pink">排除右侧已选区域</i>
              ] --
            </span>
            <el-tooltip placement="top-start" :enterable='false'
             transition='none' v-if="areaShowTextArr && areaShowTextArr.length > 0">
              <div slot="content">
                <p v-for="(item, i) in areaShowTextArr" :key="item + '-' + i">
                  {{ item }}
                </p>
              </div>
              <span>{{ areaShowTextArr.join('、') }}</span>
            </el-tooltip>
            <span v-if="areaShowTextArr && areaShowTextArr.length === 0 && !SchemaItemData.IncludeLimitArea">
              全部区域生效
            </span>
          </div>
        </div>
        <div>
          <span class="title">配送方式：</span>
          <div class="right-content" v-if="subExpressList.length > 0">
            <p><el-checkbox v-model="ExpressCheckAll" :indeterminate="isIndeterminate">全选</el-checkbox></p>
            <el-checkbox-group v-model="ExpressCheckList">
              <el-checkbox v-for="it in subExpressList" :key="it.ID" :label="it.ID">{{it.Name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div>
          <span class="title">付款时间：</span>
          <div class="right-content">
            <el-time-select
              v-model="LatestPayTime"
              :picker-options="{
                start: '00:00',
                step: '01:00',
                end: '23:55'
              }"
              placeholder="选择时间">
            </el-time-select>
            <span>之前</span>
          </div>
        </div>
      </section>
      <div class="line"></div>
      <section class="center">
        <div>
          <span class="title">其他条件：</span>
          <div class="right-content">
            <p class="blue-span" @click="onConditonAddClick">+添加条件</p>
            <CommonConditionComp
             :conditionList='ConditionList4ProducePeriodProduct'
             :conditionData='SchemaItemData.Constraint'
             @handleConditionItemDEdit='handleConditionItemDEdit'
             @handleConditionItemDel='handleConditionItemDel'
             :hasDecimal='true'
             />
            <div class="mp-switch">
              <span
               @click="() => onFilterTypeChange(1)"
               :class="SchemaItemData.Constraint.FilterType === 1 ? 'active' : ''">满足以上所有条件时</span>
              <span
               @click="() => onFilterTypeChange(2)"
               :class="SchemaItemData.Constraint.FilterType === 2 ? 'active' : ''">满足以上任一条件时</span>
            </div>
          </div>
        </div>
      </section>
      <div class="line"></div>
      <section class="bottom">
        <div>
          <span class="title">生产工期：</span>
          <div class="right-content">
            <el-input v-model="DurationDay"></el-input><span>天</span>
            <el-input :max="24" v-model="DurationHour"></el-input><span>小时</span>
          </div>
        </div>
        <div>
          <span class="title"><i>( 选填 ) </i>数量递增：</span>
          <div class="right-content">
            <span>产品数量每增加</span><el-input v-model="ProductIncrement"></el-input>
            <span>工期增加</span><el-input v-model='ProductIncrementDuration'></el-input><span>小时</span>
          </div>
        </div>
        <div>
          <span class="title">工艺工期：</span>
          <div class="right-content">
            <p>
              <el-radio-group v-model="CraftPeriodType">
                <el-radio :label="0">不额外增加</el-radio>
                <el-radio :label="1">累加工艺工期</el-radio>
                <el-radio :label="2">仅增加最长工艺工期</el-radio>
                <el-radio :label="3">按工艺种类递增</el-radio>
              </el-radio-group>
            </p>
            <p v-if="CraftPeriodType === 3">
              <span>每增加</span><el-input v-model="CraftIncrement"></el-input>种工艺，
              <span>工期增加</span><el-input v-model='CraftIncrementDuration'></el-input><span>小时</span>
            </p>
          </div>
        </div>
        <div>
          <span class="title">运送时间：</span>
          <div class="right-content">
            <el-radio v-model="IncludeExpress" :label="true">有运送时间</el-radio>
            <el-radio v-model="IncludeExpress" :label="false">无运送时间</el-radio>
          </div>
        </div>
        <div v-if="IncludeExpress" class="delivery-set-box">
          <span class="title">配送工期：</span>
          <div class="right-content">
            <el-input v-model="DeliveryDurationDay"></el-input><span>天</span>
            <el-input :max="24" v-model="DeliveryDurationHour"></el-input><span>小时</span>
          </div>
        </div>
      </section>
      <span slot="footer" class="dialog-footer">
        <normal-btn-full @click.native="handleDialogSave" title='确定' />
        <normalBtn @click.native="handleDialogClose" title="取消" />
      </span>
    </el-dialog>
    <el-dialog
      title="选择区域"
      :visible.sync="showAddressDialog"
      width="750px"
      :modal='false'
      top='8vh'
      v-dialogDrag
      class="mp-img-style-header area-dialog-wrap"
      :before-close="handleAreaDialogClose">
      <section v-if="showAddressDialog">
        <div class="mp-switch">
          <span
            @click="() => IncludeLimitArea = true"
            :class="IncludeLimitArea ? 'active' : ''">生效选中区域</span>
          <span
            @click="() => IncludeLimitArea = false"
            :class="!IncludeLimitArea ? 'active' : ''">生效不选中区域</span>
        </div>
        <tree-comp
          title="行政区域"
          :treeList='allAdAreaTreeList'
          :defaultCheckedKeys='defaultCheckedKeys'
          :handleChangeFunc='handleAreaChangeFunc'
          checkAllTitle='所有地区'
          :defaultProps="{
            children: 'children',
            label: 'Name',
          }"
          ref="TreeComp"
          />
      </section>
      <span slot="footer" class="dialog-footer">
        <normal-btn-full @click.native="handleAreaDialogSave" title='确定' />
        <normalBtn @click.native="handleAreaDialogClose" title="取消" />
      </span>
    </el-dialog>
  </section>
</template>

<script>
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import TreeComp from '@/components/common/TreeComp.vue';
import CommonConditionComp from '@/components/common/NewComps/CommonConditionComp.vue';
import { mapState, mapGetters } from 'vuex';
import SchemaItemClass from '@/store/timeLimit/SchemaItemClass';
import { getAreaList, reg } from '../../../Promote/promoteUtils';

export default {
  components: {
    normalBtnFull,
    normalBtn,
    TreeComp,
    CommonConditionComp,
  },
  data() {
    return {
      showDialog: false,
      showAddressDialog: false,
      dialogTitle: '添加工期',
      IncludeLimitArea: true,
      SellAreaArray: [],
      curEditIndex: 0,
      bool4GetCondition: false,
    };
  },
  computed: {
    ...mapState('timelimit', ['SchemaItemData', 'TimeLimitData', 'ConditionList4ProducePeriodProduct', 'setPageType']),
    ...mapState('common', ['adAreaList', 'OperatorKeyValueList']),
    ...mapGetters('common', ['subExpressList', 'allAdAreaTreeList']),
    allSubAreaList() {
      if (this.allAdAreaTreeList && this.allAdAreaTreeList.length > 0) {
        const list = [];
        this.allAdAreaTreeList.forEach(lv1 => {
          lv1.children.forEach(lv2 => {
            lv2.children.forEach(lv3 => {
              const _temp = {
                RegionalID: lv1.ID,
                CityID: lv2.ID,
                CountyID: lv3.ID,
              };
              list.push(_temp);
            });
          });
        });
        return list;
      }
      return [];
    },
    ExpressCheckAll: {
      get() {
        return this.SchemaItemData.ExpressList.length > 0
          && this.SchemaItemData.ExpressList.length === this.subExpressList.length;
      },
      set(val) {
        const _list = val ? this.subExpressList : [];
        this.$store.commit('timelimit/changeSchemaItemData', ['ExpressList', _list]);
      },
    },
    ExpressCheckList: {
      get() {
        return this.SchemaItemData.ExpressList.map(it => it.ID);
      },
      set(val) {
        const _list = val.map(it => ({ ID: it }));
        this.$store.commit('timelimit/changeSchemaItemData', ['ExpressList', _list]);
      },
    },
    subExpressIDList() {
      if (!this.subExpressList || this.subExpressList.length === 0) return [];
      return this.subExpressList.map(it => it.ID);
    },
    defaultCheckedKeys() {
      return this.SellAreaArray.map(it => it.CountyID);
    },
    areaShowTextArr() {
      if (this.allAdAreaTreeList.length === 0 || !this.SchemaItemData) return [];
      const type = 'Name';
      const temp = getAreaList(this.SchemaItemData.AreaList, this.allAdAreaTreeList, type);
      const _textArr = [];
      if (temp === '全部区域') return ['全部区域'];
      temp.forEach(l1 => {
        if (reg.test(l1.children[0])) {
          _textArr.push(`${l1[type]}`);
        } else {
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
      });
      return _textArr;
    },
    Level2AreaList() {
      if (this.adAreaList.length === 0) return [];
      return this.adAreaList.filter(it => it.Level === 2);
    },
    isIndeterminate() {
      if (this.SchemaItemData.ExpressList.length === 0
       || this.subExpressList.length === this.SchemaItemData.ExpressList.length) return false;
      return this.SchemaItemData.ExpressList.length < this.subExpressList.length;
    },
    LatestPayTime: {
      get() {
        if (!this.SchemaItemData) return '';
        const { First, Second } = this.SchemaItemData.LatestPayTime;
        if ((!First && First !== 0) || (!Second && Second !== 0)) return '';
        const _f = `0${First}`.slice(-2);
        const _s = `0${Second}`.slice(-2);
        return `${_f}:${_s}`;
      },
      set(val) {
        if (!val) return;
        const [First, Second] = val.split(':');
        this.$store.commit('timelimit/changeSchemaItemData', ['LatestPayTime', { First, Second }]);
      },
    },
    DurationDay: {
      get() {
        if (!this.SchemaItemData) return '';
        return this.SchemaItemData.ProduceDurationDay;
      },
      set(val) {
        const _val = val.replace(/[^\d]/g, '');
        this.$store.commit('timelimit/changeSchemaItemData', ['ProduceDurationDay', _val]);
        const _DurationHour = this.SchemaItemData.ProduceDuration
          ? Math.floor(this.SchemaItemData.ProduceDuration % 24) : 0;
        this.$store.commit('timelimit/changeSchemaItemData', ['ProduceDuration', +_DurationHour + +_val * 24]);
      },
    },
    DurationHour: {
      get() {
        if (!this.SchemaItemData) return '';
        return this.SchemaItemData.ProduceDurationHour;
      },
      set(newValue) {
        let _val = newValue.replace(/[^\d]/g, '');
        if (_val >= 24) _val = 23;
        this.$store.commit('timelimit/changeSchemaItemData', ['ProduceDurationHour', _val]);
        const _DurationDay = this.SchemaItemData.ProduceDuration
          ? Math.floor(this.SchemaItemData.ProduceDuration / 24) : 0;
        this.$store.commit('timelimit/changeSchemaItemData', ['ProduceDuration', +_DurationDay * 24 + +_val]);
      },
    },
    DeliveryDurationDay: {
      get() {
        if (!this.SchemaItemData) return '';
        return this.SchemaItemData.DeliveryDurationDay;
      },
      set(val) {
        const _val = val.replace(/[^\d]/g, '');
        this.$store.commit('timelimit/changeSchemaItemData', ['DeliveryDurationDay', _val]);
        const _DurationHour = this.SchemaItemData.DeliveryDuration
          ? Math.floor(this.SchemaItemData.DeliveryDuration % 24) : 0;
        this.$store.commit('timelimit/changeSchemaItemData', ['DeliveryDuration', +_DurationHour + +_val * 24]);
      },
    },
    DeliveryDurationHour: {
      get() {
        if (!this.SchemaItemData) return '';
        return this.SchemaItemData.DeliveryDurationHour;
      },
      set(newValue) {
        let _val = newValue.replace(/[^\d]/g, '');
        if (_val >= 24) _val = 23;
        this.$store.commit('timelimit/changeSchemaItemData', ['DeliveryDurationHour', _val]);
        const _DurationDay = this.SchemaItemData.DeliveryDuration
          ? Math.floor(this.SchemaItemData.DeliveryDuration / 24) : 0;
        this.$store.commit('timelimit/changeSchemaItemData', ['DeliveryDuration', +_DurationDay * 24 + +_val]);
      },
    },
    ProductIncrement: {
      get() {
        if (!this.SchemaItemData) return '';
        return this.SchemaItemData.ProductIncrement;
      },
      set(val) {
        const _val = val.replace(/[^\d]/g, '');
        this.$store.commit('timelimit/changeSchemaItemData', ['ProductIncrement', _val]);
      },
    },
    ProductIncrementDuration: {
      get() {
        if (!this.SchemaItemData) return '';
        return this.SchemaItemData.ProductIncrementDuration;
      },
      set(val) {
        const _val = val.replace(/[^\d]/g, '');
        this.$store.commit('timelimit/changeSchemaItemData', ['ProductIncrementDuration', _val]);
      },
    },
    CraftPeriodType: {
      get() {
        if (!this.SchemaItemData) return 0;
        return this.SchemaItemData.CraftPeriodType;
      },
      set(val) {
        this.$store.commit('timelimit/changeSchemaItemData', ['CraftPeriodType', val]);
      },
    },
    CraftIncrement: {
      get() {
        if (!this.SchemaItemData) return 0;
        return this.SchemaItemData.CraftIncrement;
      },
      set(val) {
        const _val = val.replace(/[^\d]/g, '');
        this.$store.commit('timelimit/changeSchemaItemData', ['CraftIncrement', _val]);
      },
    },
    CraftIncrementDuration: {
      get() {
        if (!this.SchemaItemData) return 0;
        return this.SchemaItemData.CraftIncrementDuration;
      },
      set(val) {
        const _val = val.replace(/[^\d]/g, '');
        this.$store.commit('timelimit/changeSchemaItemData', ['CraftIncrementDuration', _val]);
      },
    },
    IncludeExpress: {
      get() {
        if (!this.SchemaItemData) return 0;
        return this.SchemaItemData.IncludeExpress;
      },
      set(val) {
        this.$store.commit('timelimit/changeSchemaItemData', ['IncludeExpress', val]);
      },
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
  },
  methods: {
    handleDialogSave() {
      if (!this.showDialog) return;
      const key = SchemaItemClass.check(this.SchemaItemData);
      if (key === true) {
        let _list = [];
        if (this.dialogTitle === '编辑工期') {
          _list = [...this.TimeLimitData.SchemaList];
          _list.splice(this.curEditIndex, 1, this.SchemaItemData);
        } else {
          _list = [this.SchemaItemData, ...this.TimeLimitData.SchemaList];
        }
        _list = _list.map(_item => {
          const ExpressList = _item.ExpressList.filter(exItem => this.subExpressIDList.includes(exItem.ID));
          return {
            ..._item,
            ExpressList,
          };
        });
        this.$store.commit('timelimit/setTimeLimitData', ['SchemaList', _list]);
        this.showDialog = false;
      } else if (typeof key === 'string') {
        this.messageBox.failSingleError('保存失败', `[ ${key} ]`);
      }
    },
    handleDialogClose() {
      this.showDialog = false;
    },
    onAddBtnClick() {
      if (!this.TimeLimitData) return;
      if (this.TimeLimitData.ProductList.length === 0) {
        this.$message({
          showClose: true,
          message: '请先选择指定产品',
          type: 'error',
        });
        return;
      }
      this.$store.commit('timelimit/setSchemaItemDataInit', {});
      this.dialogTitle = '添加工期';

      // eslint-disable-next-line max-len
      if (this.setPageType !== 'edit' || this.bool4GetCondition) {
        let Limits = [];
        if (this.TimeLimitData) {
          const { ProductList } = this.TimeLimitData;
          // eslint-disable-next-line prefer-destructuring
          if (ProductList.length > 0) Limits = [...ProductList.map(it => it.ID)];
        }
        const positionID = this.TimeLimitData.ProductClass.SecondLevelID;
        this.$store.dispatch('timelimit/fetchConditionList', { type: 19, Limits, positionID });
      }
      this.showDialog = true;
      if (this.bool4GetCondition && this.setPageType === 'edit') this.bool4GetCondition = false;
    },
    onAreaBtnClick() {
      this.SellAreaArray = this.SchemaItemData.AreaList;
      this.IncludeLimitArea = this.SchemaItemData.IncludeLimitArea;
      this.showAddressDialog = true;
    },
    handleAreaDialogClose() {
      this.showAddressDialog = false;
      this.$refs.TreeComp.clearTreeData();
    },
    handleAreaChangeFunc(checkedNodes) {
      const _level2List = checkedNodes.filter(it => it.Level === 2);
      const _list = checkedNodes.filter(it => it.Level === 3).map(it => {
        const CityID = it.ParentID;
        let _t = _level2List.find(it2 => it2.ID === CityID);
        if (!_t) {
          _t = this.Level2AreaList.find(it4 => it4.ID === CityID);
        }
        const RegionalID = _t ? _t.ParentID : '';
        return ({ CountyID: it.ID, CityID, RegionalID });
      });
      this.SellAreaArray = _list;
    },
    setSchemaItemData(AreaList, IncludeLimitArea) {
      this.$store.commit('timelimit/changeSchemaItemData', ['AreaList', AreaList]);
      this.$store.commit('timelimit/changeSchemaItemData', ['IncludeLimitArea', IncludeLimitArea]);
      this.handleAreaDialogClose();
    },
    getContraryAreaList(list) { // 获取反选列表
      if (!list || list.length === 0) return [];
      const ids = list.map(it => it.CountyID);
      return this.allSubAreaList.filter(it => !ids.includes(it.CountyID));
    },
    handleAreaDialogSave() {
      if (!this.showAddressDialog) return;
      if (this.SellAreaArray.length === 0 && this.IncludeLimitArea) {
        this.messageBox.failSingleError('保存失败', '[ 未选择区域 ]');
        return;
      }
      if (this.SellAreaArray.length <= 2000) { // 设置并关闭
        this.setSchemaItemData(this.SellAreaArray, this.IncludeLimitArea);
        return;
      }
      const callback = () => { // 自动取反保存
        const list = this.getContraryAreaList(this.SellAreaArray);
        this.setSchemaItemData(list, !this.IncludeLimitArea);
      };
      this.messageBox.warnCancelBox('当前生效方式区域选中较多!', '点击确定系统将会自动切换相反生效方式', callback);
    },
    onFilterTypeChange(num) {
      if (!this.SchemaItemData) return;
      if (num === this.SchemaItemData.Constraint.FilterType) return;
      this.$store.commit('timelimit/changeSchemaItemData4FilterType', num);
    },
    onConditonAddClick() {
      if (this.ConditionList4ProducePeriodProduct.length === 0) return;
      // const item = this.ConditionList4ProducePeriodProduct[0];
      const _item = {
        ProductID: '',
        PartID: '',
        CraftID: '',
        GroupID: '',
        PropertyID: '', // 以上5个为回传项
        PropertyType: '', // 条件前半部分
        Operator: '', // 关系
        Value: '', // 条件后半部分： 输入的值 | 选项的ID
        Prefix: '',
        OptionList: [],
        Unit: '',
        selfID: `${Date.now()}`,
        ValueType: 1,
      };
      this.$store.commit('timelimit/addSchemaItemData4Constraint', _item);
      const oWrap = document.querySelector('.add-limit-wrap .center .right-content > ul');
      this.$utils.animateScroll(oWrap.scrollTop, oWrap.scrollHeight, (num) => {
        oWrap.scrollTop = num;
      });
    },
    handleConditionItemDEdit([data, itemIndex]) {
      this.$store.commit('timelimit/editSchemaItemData4Constraint', [itemIndex, data]);
    },
    handleConditionItemDel(itemIndex) {
      this.$store.commit('timelimit/editSchemaItemData4Constraint', [itemIndex]);
    },
    handleSchemaEdit(index) {
      this.$store.commit('timelimit/setSchemaItemDataInit', this.TimeLimitData.SchemaList[index]);
      this.curEditIndex = index;
      let Limits = [];
      this.dialogTitle = '编辑工期';
      if (this.TimeLimitData) {
        const { ProductList } = this.TimeLimitData;
        // eslint-disable-next-line prefer-destructuring
        if (ProductList.length > 0) Limits = [...ProductList.map(it => it.ID)];
      }
      const positionID = this.TimeLimitData.ProductClass.SecondLevelID;
      if (this.bool4GetCondition) {
        this.$store.dispatch('timelimit/fetchConditionList', { type: 19, Limits, positionID });
        this.bool4GetCondition = false;
      }
      this.showDialog = true;
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
  },
  async mounted() {
    this.$store.dispatch('common/getExpressList');
    this.$store.dispatch('common/fetchAdAreaList');
    if (this.setPageType === 'edit') {
      if (this.TimeLimitData.SchemaList.length >= 1) {
        const key = true;
        if (key) {
          let Limits = '';
          if (this.TimeLimitData) {
            const { ProductList } = this.TimeLimitData;
            if (ProductList.length > 0) Limits = ProductList.map(it => it.ID);
          }
          const positionID = this.TimeLimitData.ProductClass.SecondLevelID;
          this.$store.dispatch('timelimit/fetchConditionList', { type: 19, Limits, positionID });
        }
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
// @import "@/assets/css/common/var.scss";
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
          &.top {
            > div {
              &:first-of-type {
                margin-bottom: 32px;
                > .right-content {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  > span {
                    color: #989898;
                    &:first-of-type {
                      margin-right: 25px;
                      font-size: 13px;
                    }
                  }
                }
              }
              &:nth-of-type(2) {
                > .title {
                  line-height: 17px;
                }
                > .right-content {
                  > p {
                    margin-bottom: 5px;
                  }
                  .el-checkbox {
                    margin-bottom: 9px;
                    margin-right: 8px;
                    .el-checkbox__label {
                      min-width: 75px;
                      font-size: 12px;
                      color: #444;
                    }
                  }
                }
              }
              &:last-of-type {
                align-items: center;
                margin-top: 18px;
                > .right-content {
                  font-size: 13px;
                  > .el-date-editor {
                    width: 140px;
                    height: 30px;
                    margin-right: 10px;
                    > input {
                      height: 30px;
                      line-height: 30px;
                      font-size: 13px;
                      border-radius: 5px;
                      &::placeholder {
                        color: #989898;
                        font-size: 12px;
                      }
                    }
                    > span i {
                      line-height: 30px;
                    }
                  }
                }
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
          &.bottom {
            > div {
              > .right-content {
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
              &:first-of-type, &.delivery-set-box {
                align-items: center;
                margin-bottom: 26px;
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
              &:nth-of-type(2) {
                align-items: center;
                > .right-content {
                  font-size: 13px;
                  position: relative;
                  top: 1px;
                  > span {
                    margin-right: 12px;
                  }
                  > .el-input:first-of-type {
                    margin-right: 30px;
                  }
                }
              }
              &:nth-of-type(3) {
                margin-top: 32px;
                > .right-content {
                  > p {
                    margin-bottom: 16px;
                    .el-input {
                      margin-left: 8px;
                    }
                  }
                }
              }
              &.delivery-set-box {
                margin-top: 10px;
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
    &.area-dialog-wrap {
      .el-dialog__header {
        > span::before {
          background: url(../../../../assets/images/add.png) no-repeat center;
        }
        border-radius: 2px 2px 0px 0
      }
      .el-dialog__body {
        height: 520px;
        overflow: auto;
        padding-left: 30px;
        margin-right: 3px;
        .mp-switch {
          margin: 0;
          margin-top: -6px;
          margin-bottom: 30px;
        }
        .mp-common-comps-tree-comp-wrap > .content > .el-tree > .el-tree-node
        > .el-tree-node__children > .el-tree-node > .el-tree-node__content {
          margin-top: -4px;
        }
        .mp-common-comps-tree-comp-wrap > .content > .el-tree > .el-tree-node
         > .el-tree-node__content > .el-tree-node__label > span.title {
          width: 7em;
          overflow: hidden;
          white-space: nowrap;
        }
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

  div.mp-switch {
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
      font-size: 12px;
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
</style>
