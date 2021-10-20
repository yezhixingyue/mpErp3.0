<template>
  <section class="mp-erp-timelimit-page-schema-item-set-page-wrap" v-if="!loading">
    <ContionCommonComp
      ref="oLeftComp"
      :PropertyList="PropertyList"
      :ComparePropertyList="PropertyList"
      :showPriority="false"
      leftWidth="40%"
      leftText='其它条件：'
      :curEditData="SchemaItemData"
      rightTitle=" "
    >
      <template v-slot:leftHeader>
        <!-- 左侧上方部分参数配置区域 -->
        <section class="top">
          <div>
            <span class="title">指定区域：</span>
            <div class="content-item">
              <span class="blue-span" @click="onAreaBtnClick">选择区域</span>
              <span v-if="areaShowTextArr && areaShowTextArr.length > 0">
                [
                <i v-if="SchemaItemData.IncludeLimitArea" class="is-success"
                  >只限右侧区域生效</i
                >
                <i v-else class="is-pink">排除右侧已选区域</i>
                ] --
              </span>
              <el-tooltip
                placement="top-start"
                :enterable="false"
                transition="none"
                v-if="areaShowTextArr && areaShowTextArr.length > 0"
              >
                <div slot="content">
                  <p v-for="(item, i) in areaShowTextArr" :key="item + '-' + i">
                    {{ item }}
                  </p>
                </div>
                <span>{{ areaShowTextArr.join("、") }}</span>
              </el-tooltip>
              <span
                v-if="
                  areaShowTextArr &&
                  areaShowTextArr.length === 0 &&
                  !SchemaItemData.IncludeLimitArea
                "
              >
                全部区域生效
              </span>
            </div>
          </div>
          <div>
            <span class="title">配送方式：</span>
            <div class="content-item" v-if="subExpressList.length > 0">
              <p>
                <el-checkbox
                  v-model="ExpressCheckAll"
                  :indeterminate="isIndeterminate"
                  >全选</el-checkbox
                >
              </p>
              <el-checkbox-group v-model="ExpressCheckList">
                <el-checkbox
                  v-for="it in subExpressList"
                  :key="it.ID"
                  :label="it.ID"
                  >{{ it.Name }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
          <div>
            <span class="title">付款时间：</span>
            <div class="content-item">
              <el-time-picker
                v-model="LatestPayTime"
                :editable='false'
                :clearable='false'
                value-format='HH:mm'
                :picker-options="{ format: 'HH:mm' }"
                :default-value='defaultBeginTime'
                placeholder="20:00"
              />
              <span>之前</span>
            </div>
          </div>
        </section>
      </template>
      <section class="right-area">
        <div>
          <span class="title">生产工期：</span>
          <div class="content-item">
            <el-input v-model="DurationDay"></el-input><span>天</span>
            <el-input :max="24" v-model="DurationHour"></el-input><span>小时</span>
          </div>
        </div>
        <div>
          <span class="title"><i>( 选填 ) </i>数量递增：</span>
          <div class="content-item">
            <span>产品数量每增加</span><el-input v-model="ProductIncrement"></el-input>
            <span>工期增加</span><el-input v-model='ProductIncrementDuration'></el-input><span>小时</span>
          </div>
        </div>
        <div>
          <span class="title">工艺工期：</span>
          <div class="content-item">
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
          <div class="content-item">
            <el-radio v-model="IncludeExpress" :label="true">有运送时间</el-radio>
            <el-radio v-model="IncludeExpress" :label="false">无运送时间</el-radio>
          </div>
        </div>
        <div v-if="IncludeExpress" class="delivery-set-box">
          <span class="title">配送工期：</span>
          <div class="content-item">
            <el-input v-model="DeliveryDurationDay"></el-input><span>天</span>
            <el-input :max="24" v-model="DeliveryDurationHour"></el-input><span>小时</span>
          </div>
        </div>
      </section>
    </ContionCommonComp>
    <!-- 指定区域选择 -->
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
    <footer>
      <el-button @click="onSubmitClick" type="primary">确定</el-button>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
// 单个工期设置页面 （  新增 | 编辑  ）
import { mapState, mapGetters } from 'vuex';
import ContionCommonComp from '@/components/common/FormulaAndConditionComps/ContionCommonComp';
import { getAreaList, reg } from '@/components/Promote/promoteUtils';
import TreeComp from '@/components/common/TreeComp.vue';
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import SchemaItemClass from '@/store/timeLimit/SchemaItemClass';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';

export default {
  name: 'SchemaItemSet',
  components: {
    ContionCommonComp,
    TreeComp,
    normalBtnFull,
    normalBtn,
  },
  computed: {
    ...mapState('timelimit', ['SchemaItemData', 'TimeLimitData', 'setPageType']),
    ...mapState('common', ['adAreaList']),
    ...mapGetters('common', ['subExpressList', 'allAdAreaTreeList']),
    areaShowTextArr() {
      if (this.allAdAreaTreeList.length === 0 || !this.SchemaItemData) { return []; }
      const type = 'Name';
      const temp = getAreaList(
        this.SchemaItemData.AreaList,
        this.allAdAreaTreeList,
        type,
      );
      const _textArr = [];
      if (temp === '全部区域') return ['全部区域'];
      temp.forEach((l1) => {
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
    ExpressCheckAll: {
      get() {
        return (
          this.SchemaItemData.ExpressList.length > 0
          && this.SchemaItemData.ExpressList.length === this.subExpressList.length
        );
      },
      set(val) {
        const _list = val ? this.subExpressList : [];
        this.$store.commit('timelimit/changeSchemaItemData', [
          'ExpressList',
          _list,
        ]);
      },
    },
    ExpressCheckList: {
      get() {
        return this.SchemaItemData.ExpressList.map((it) => it.ID);
      },
      set(val) {
        const _list = val.map((it) => ({ ID: it }));
        this.$store.commit('timelimit/changeSchemaItemData', [
          'ExpressList',
          _list,
        ]);
      },
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
        this.$store.commit('timelimit/changeSchemaItemData', [
          'LatestPayTime',
          { First, Second },
        ]);
      },
    },
    isIndeterminate() {
      if (
        this.SchemaItemData.ExpressList.length === 0
        || this.subExpressList.length === this.SchemaItemData.ExpressList.length
      ) { return false; }
      return (
        this.SchemaItemData.ExpressList.length < this.subExpressList.length
      );
    },
    defaultCheckedKeys() {
      return this.SellAreaArray.map(it => it.CountyID);
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
    IncludeExpress: {
      get() {
        if (!this.SchemaItemData) return 0;
        return this.SchemaItemData.IncludeExpress;
      },
      set(val) {
        this.$store.commit('timelimit/changeSchemaItemData', ['IncludeExpress', val]);
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
    Level2AreaList() {
      if (this.adAreaList.length === 0) return [];
      return this.adAreaList.filter(it => it.Level === 2);
    },
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
    defaultBeginTime() {
      return new Date(new Date(new Date(new Date().setHours(20)).setMinutes(0)).setSeconds(0));
    },
    subExpressIDList() {
      if (!this.subExpressList || this.subExpressList.length === 0) return [];
      return this.subExpressList.map(it => it.ID);
    },
    PropertyList() {
      return this.TimeLimitData ? this.TimeLimitData.SchemaPropertyList || [] : [];
    },
  },
  data() {
    return {
      loading: true,
      IncludeLimitArea: true,
      SellAreaArray: [],
      showAddressDialog: false,
    };
  },
  methods: {
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
    onSubmitClick() {
      const key = SchemaItemClass.check(this.SchemaItemData);
      if (key === true) {
        const condition = this.$refs.oLeftComp.getConditonResult();
        if (!condition) return;
        this.$store.commit('timelimit/changeSchemaItemData', ['Constraint', condition.Constraint]);
        let _list = [];
        if (this.$route.params.EditIndex !== 'new') {
          _list = [...this.TimeLimitData.SchemaList];
          _list.splice(this.$route.params.EditIndex, 1, this.SchemaItemData);
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
        this.onGoBackClick();
      } else if (typeof key === 'string') {
        this.messageBox.failSingleError('保存失败', `[ ${key} ]`);
      }
    },
    onGoBackClick() {
      this.$goback();
    },
    async getSchemaPropertyList() {
      if (!this.TimeLimitData.SchemaPropertyList || this.TimeLimitData.SchemaPropertyList.length === 0) {
        const { ProductList } = this.TimeLimitData;
        const temp = { UseModule: 41 };
        if (ProductList.length === 1) {
          temp.ProductID = ProductList[0].ID;
        }
        const list = await PropertyClass.getPropertyList(temp);
        if (list) {
          this.$store.commit('timelimit/setTimeLimitData', ['SchemaPropertyList', list]);
        }
      }
      this.loading = false;
    },
  },
  mounted() {
    if (!this.TimeLimitData || !this.TimeLimitData.ProductList || this.TimeLimitData.ProductList.length === 0) {
      this.onGoBackClick();
      return;
    }
    this.getSchemaPropertyList();
  },
};
</script>
<style lang='scss'>
.mp-erp-timelimit-page-schema-item-set-page-wrap {
  height: 100%;
  padding-top: 50px;
  box-sizing: border-box;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  .top {
    max-width: 700px;
    padding-bottom: 15px;
    > div {
      display: flex;
      color: #444;
      > .title {
        flex: 0 0 auto;
        font-weight: 700;
        font-size: 14px;
        width: 86px;
        text-align: right;
        margin-right: 6px;
        user-select: none;
        > i {
          color: #989898;
          font-weight: 400;
          font-size: 13px;
        }
      }
      &:first-of-type {
        margin-bottom: 32px;
        > .content-item {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          > span {
            color: #989898;
            font-size: 12px;
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
        > .content-item {
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
        > .content-item {
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
              padding-right: 75px;
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
  .right-area {
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
      > .content-item {
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
        > .content-item {
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
        > .content-item {
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
        > .content-item {
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
  .area-dialog-wrap {
    .el-dialog__header {
      > span::before {
        background: url(../../assets/images/add.png) no-repeat center;
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
  .mp-erp-common-comps-left-and-right-width-drap-auto-change-comp-wrap {
    > .left.mp-scroll-wrap {
      display: flex;
      flex-direction: column;
    }
    > .right {
      > .right-content {
        padding-left: 30px;
        > header {
          display: none;
        }
      }
    }
  }
  > footer {
    flex: none;
    padding: 25px 0 30px 0;
    text-align: center;
    > button.el-button {
      padding: 0;
      width: 120px;
      height: 35px;
      & + button.el-button {
        margin-left: 30px;
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
