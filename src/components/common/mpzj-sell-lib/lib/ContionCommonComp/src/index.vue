<template>
  <LRWidthDragAutoChangeComp :leftWidth="single ? '100%' : leftWidth" class="mp-erp-new-comps-condtion-set-common-comp-wrap" :single='single'>
    <template v-slot:left>
      <slot name="leftHeader"></slot>
      <section class="left-content" v-if="ruleForm">
        <header v-if="showName || showPriority">
          <div v-if="showName" class="name">
            <span class="label">名称：</span>
            <el-input v-model.trim="ruleForm.Name" :maxlength="showNameMaxLength" size="small" show-word-limit></el-input>
          </div>
          <template v-if="showPriority">
            <span class="label">优先级：</span>
            <el-input v-model.trim.number="ruleForm.Priority" maxlength="3" size="small"></el-input>
            <span class="tips-box">
              <i class="el-icon-warning"></i> 注：数字越小优先级越高
            </span>
          </template>
        </header>
        <main>
          <p class="section-title">
            <span class="mp-common-title-wrap">{{leftText}}</span>
            <span class="blue-span" @click="visible=true">+ 添加条件</span>
          </p>
          <!-- 条件区域 -->
          <el-form label-width="260px" class="constraint-ruleForm mp-scroll-wrap" ref="oConstraintForm" @submit.native.prevent>
            <el-form-item
             v-for="(it, index) in ruleForm.Constraint.ItemList"
             :key="it.key || it.Property.StoredContent + index"
             :prop="it.key || it.Property.StoredContent">
              <span slot="label" :title="it.Property.TipsContent || it.Property.DisplayContent.replace(/\[|\]/g, '')"
                >{{it.Property.DisplayContent.replace(/\[|\]/g, '')}}</span>
              <OperatorSelectorComp
                v-model="it.Operator"
                :valueList.sync='it.ValueList'
                :PropertyData='it.Property'
                :productLevel2='productLevel2'
                :areaLevel2='areaLevel2'
                :sellAreaLevel2="sellAreaLevel2"
                :hasCompare='ComparePropertyList && ComparePropertyList.length > 0'
                :hidden='!!(it.ValueList[0] && it.ValueList[0].Property)'
                :adAreaList="adAreaList"
                :allAdAreaTreeList="allAdAreaTreeList"
                :areaList="areaList"
                :allAreaTreeList="allAreaTreeList"
                :allProductClassify="allProductClassify"
                :allProductAndLevelList="allProductAndLevelList" />
              <ValueSelectorComp v-model="it.ValueList" :PropertyData='it.Property' :ComparePropertyList='ComparePropertyList'  />
              <div class="setup-btn" @click="onSetupClick(index)" v-if="ComparePropertyList && ComparePropertyList.length > 0 && it.Property.ValueType !== 5">
                <img src="./images/setup.png" alt="">
                <span>设置</span>
              </div>
              <div class="setup-btn is-disabled" v-if="ComparePropertyList && ComparePropertyList.length > 0 && it.Property.ValueType === 5">
                <img src="./images/setup.png" alt="">
                <span>设置</span>
              </div>
              <div class="del-btn" @click="onRemoveClick(index)">
                <img src="./images/del.png" alt="">
                <span>删除</span>
              </div>
            </el-form-item>
          </el-form>
          <el-radio-group v-model="ruleForm.Constraint.FilterType" size="small" class="mp-common-tab-radio-box">
            <el-radio-button :label="1">满足所有条件</el-radio-button>
            <el-radio-button :label="2">满足任一条件</el-radio-button>
          </el-radio-group>
          <FormulaPanelElementSelectDialog  useType='condition' :fixedPartName='fixedPartName' :DialogTitle='DialogTitle' title="属性选择"
           :visible.sync='visible' :list='PropertyList' @submit='onElementSelect' :selectedElementIDs='selectedElementIDs' />
          <FormulaPanelElementSelectDialog  useType='condition' v-if="ComparePropertyList && ComparePropertyList.length > 0"
             showConstant :curTargetID='curTargetID' :fixedPartName='fixedPartName' :DialogTitle='DialogTitle'
           :visible.sync='CompareVisible' :list='ComparePropertyList' @submit='onCompareElementSelect' :selectedElementIDs='selectedComparePropertyIDs' />
        </main>
      </section>
    </template>
    <template v-slot:right v-if='!single'>
      <section class="right-content">
        <header>
          <p><span class="mp-common-title-wrap">{{rightTitle}}</span><slot name="title"></slot></p>
        </header>
        <main class="right-content-main-wrap">
          <slot></slot>
        </main>
      </section>
    </template>
  </LRWidthDragAutoChangeComp>
</template>

<script>
import LRWidthDragAutoChangeComp from '../../LRWidthDragAutoChangeComp';
import FormulaPanelElementSelectDialog from '../../FormulaPanelElementSelectDialog';
import PropertyClass from '../../js/PropertyClass';
import OperatorSelectorComp from './Comps/OperatorSelectorComp/OperatorSelectorComp.vue';
import ValueSelectorComp from './Comps/ValueSelectorComp.vue';
import { getValueIsOrNotNumber } from '../../js/util';

export default {
  props: {
    PropertyList: {
      type: Array,
      default: () => [],
    },
    curEditData: {
      type: Object,
      default: null,
    },
    leftWidth: {
      type: String,
      default: '45%',
    },
    single: {
      type: Boolean,
      default: false,
    },
    ComparePropertyList: {
      type: Array,
      default: null,
    },
    showPriority: {
      type: Boolean,
      default: true,
    },
    showName: {
      type: Boolean,
      default: false,
    },
    showNameMaxLength: {
      type: Number,
      default: 15,
    },
    curTargetID: {
      type: String,
      default: '',
    },
    leftText: {
      type: String,
      default: '如果',
    },
    rightTitle: {
      type: String,
      default: '则',
    },
    fixedPartName: {
      type: String,
      default: '',
    },
    DialogTitle: {
      type: String,
      default: '',
    },
    canNotNull: {
      type: Boolean,
      default: false,
    },
    productLevel2: { // 产品筛选使用2级分类
      type: Boolean,
      default: false,
    },
    areaLevel2: { // 地区筛选使用2级分类
      type: Boolean,
      default: false,
    },
    sellAreaLevel2: { // 销售筛选使用2级分类
      type: Boolean,
      default: false,
    },
    adAreaList: { // 行政区域列表数据
      type: Array,
      default: () => [],
    },
    allAdAreaTreeList: { // 行政区域树形数据  --- 后续根据使用情况自动由上面数据生成？
      type: Array,
      default: () => [],
    },
    areaList: { // 销售区域列表数据
      type: Array,
      default: () => [],
    },
    allAreaTreeList: { // 销售区域树形数据
      type: Array,
      default: () => [],
    },
    allProductClassify: { // 产品3级结构树形数据
      type: Array,
      default: () => [],
    },
    allProductAndLevelList: { // 产品2级结构树形数据
      type: Array,
      default: () => [],
    },
  },
  components: {
    LRWidthDragAutoChangeComp,
    FormulaPanelElementSelectDialog, // 选择元素弹窗
    OperatorSelectorComp,
    ValueSelectorComp,
  },
  data() {
    return {
      visible: false,
      selectedElementIDs: [],
      ruleForm: {
        ID: '',
        Priority: '', // 优先级
        Name: '',
        Constraint: {
          ConstraintID: '',
          FilterType: 1, // 满足所有 1   满足任一 2
          ItemList: [],
        },
      },
      curSetupIndex: '',
      CompareVisible: false,
    };
  },
  computed: {
    // rules() {
    //   const Constraint = {};
    //   if (this.ruleForm && this.ruleForm.Constraint && Array.isArray(this.ruleForm.Constraint.ItemList)) {
    //     const { ItemList } = this.ruleForm.Constraint;
    //     ItemList.forEach(it => {
    //       const prop = it.key || it.ConstraintID || it.Property.StoredContent;
    //       const { Operator, ValueList, Property } = it;
    //       console.log(Operator, ValueList, Property, prop);
    //       Constraint[prop] = [
    //         // { required: true, message: '请选择活动区域', trigger: 'change' },
    //         { validator: this.conditionValueCheck, trigger: 'blur' },
    //       ];
    //     });
    //   }
    //   return { ...Constraint };
    // },
    selectedComparePropertyIDs() {
      if (this.ComparePropertyList && this.ComparePropertyList.length > 0 && this.curSetupIndex > -1) {
        const t = this.ruleForm.Constraint.ItemList[this.curSetupIndex];
        if (t && t.Property) return [t.Property.StoredContent];
      }
      return [];
    },
  },
  methods: {
    // initPropertyListReplaceHelper() { // 获取可用属性列表并转换完成后，对编辑数据时初始的PropertyList的数据进行修改操作（以获取到的可用属性为准）
    //   if (!this.FormulaData || this.FormulaData.PropertyList.length === 0) return;
    //   this.FormulaData.PropertyList = this.FormulaData.PropertyList.map(it => {
    //     const t = this.PropertyList.find(_it => _it.Element.ID === it.Element.ID && it.FixedType === _it.FixedType);
    //     if (t) return { ...t, DefaultValue: it.DefaultValue };
    //     return null;
    //   }).filter(it => it);
    // },
    onElementSelect(Element) { // 属性弹窗种进行属性选择
      const item = {
        ConstraintID: '',
        Property: Element,
        Operator: '',
        ValueList: [],
        key: Math.random().toString(36).slice(-8),
      };
      this.ruleForm.Constraint.ItemList.push(item);
      setTimeout(() => {
        this.$refs.oConstraintForm.$el.scrollTop = this.$refs.oConstraintForm.$el.scrollHeight;
      }, 0);
    },
    onRemoveClick(i) {
      this.ruleForm.Constraint.ItemList.splice(i, 1);
    },
    getConditonResult() {
      const validateBool = this.validateRuleForm(); // 校验ruleForm信息
      if (validateBool) return this.ruleForm; // 返回结果信息
      return false;
    },
    PriorityChecker(Priority) { // 优先级校验
      if (this.showPriority) {
        if (!Priority && Priority !== 0) {
          this.alertError('请设置优先级');
          return false;
        }
        if ((!getValueIsOrNotNumber(Priority, true)) || Priority < 0) {
          this.alertError('优先级必须为大于等于0的整数类型');
          return false;
        }
      }
      return true;
    },
    EmptyValueChecker(ItemList) { // 条件非空校验
      const i = ItemList.findIndex((it) => {
        const { Property, ValueList } = it;
        const { ValueType } = Property;
        return (ValueType !== 5)
         && (ValueList.length === 0 || (ValueList.length === 1 && !ValueList[0].Value && ValueList[0].Value !== 0 && !ValueList[0].Property));
      });
      if (i > -1) {
        this.alertError(`第${i + 1}行未设置属性值`);
        return false;
      }
      return true;
    },
    NumberValueTypeItemChecker(ItemList) { // 数字值类型属性值校验
      for (let i = 0; i < ItemList.length; i += 1) {
        const { Property, ValueList } = ItemList[i];
        const {
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          ValueType, AvailableValueList, ValueRange, FixedType,
        } = Property;
        if (ValueType === 0 && !ValueList[0].Property) { // 为0 数值校验
          const val = ValueList[0].Value;
          if (!getValueIsOrNotNumber(val) && FixedType !== 41) {
            this.alertError(`第${i + 1}行值应为数字类型`);
            return false;
          }
          if (ValueRange && FixedType !== 41) {
            const { MinValue, MaxValue } = ValueRange;
            if ((MinValue || MinValue === 0) && +val < MinValue) {
              this.alertError(`第${i + 1}行值不能小于${MinValue}`);
              return false;
            }
            if ((MaxValue || MaxValue === 0) && +val > MaxValue && MaxValue !== -1) {
              this.alertError(`第${i + 1}行值不能大于${MaxValue}`);
              return false;
            }
          }
          // if (Operator === 1 && AvailableValueList) { // 相等类型 进入判断
          // if (AvailableValueList) { // 所有关系类型 进入判断
          //   const checkres = PropertyClass.AvailableValueListChecker(val, AvailableValueList);
          //   if (!checkres) {
          //     this.alertError(`第${i + 1}行值不正确，请检查其可取值范围`);
          //     return false;
          //   }
          // }
        }
        if (ValueRange && ValueType !== 0) { // 有这种情况吗 --- 该校验未写
          // const { MinValue, MaxValue } = ValueRange;
        }
      }
      return true;
    },
    validateRuleForm() { // 信息校验
      const { Priority, Constraint, Name } = this.ruleForm;
      if (this.showName && !Name) {
        this.alertError('请设置名称');
        return false;
      }
      if (!this.PriorityChecker(Priority)) return false; // 优先级校验

      const { ItemList } = Constraint;
      if (ItemList.length === 0) {
        if (!this.canNotNull) return true;
        this.alertError('请设置条件');
        return false;
      }
      if (!this.EmptyValueChecker(ItemList)) return false; // 空值校验

      if (!this.NumberValueTypeItemChecker(ItemList)) return false; // 空值校验

      return true;
    },
    alertError(msg) {
      this.messageBox.failSingleError('保存失败', msg);
    },
    onSetupClick(index) {
      this.curSetupIndex = index;
      this.CompareVisible = true;
    },
    onCompareElementSelect(Property) {
      if (!Property) {
        this.ruleForm.Constraint.ItemList[this.curSetupIndex].ValueList = [{ Value: '' }];
        return;
      }
      this.ruleForm.Constraint.ItemList[this.curSetupIndex].ValueList = [{ Property }];
    },
    clearAllItemContent() {
      this.ruleForm.Constraint.FilterType = 1;
      this.ruleForm.Constraint.ItemList = [];
    },
  },
  mounted() {
    if (!this.curEditData) return;
    // 还原编辑数据 ↓
    const {
      Priority, ID, Constraint, Name,
    } = this.curEditData;
    if (ID) this.ruleForm.ID = ID;
    if (Priority || Priority === 0) this.ruleForm.Priority = Priority;
    if (this.showName && Name) this.ruleForm.Name = Name;
    if (Constraint) {
      const ItemList = Constraint.ItemList.map((it) => {
        const Property = PropertyClass.getPerfectPropertyByImperfectProperty(it.Property, this.PropertyList);
        const key = Math.random().toString(36).slice(-8);
        return Property ? { ...it, Property, key } : null;
      }).filter((it) => it);
      this.ruleForm.Constraint = { ...Constraint, ItemList };
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-new-comps-condtion-set-common-comp-wrap {
  > .left {
    > .left-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      > header {
        white-space: nowrap;
        padding: 15px 0;
        padding-top: 10px;
        flex: none;
        .el-input {
          width: 110px;
          margin-right: 20px;
          .el-input__inner {
            height: 30px;
            line-height: 30px;
          }
        }
        .tips-box {
          padding-left: 16px;
          display: inline-block;
          min-width: 220px;
          width: calc(100% - 195px);
          max-width: 400px;
        }
        > .name {
          padding-bottom: 10px;
          .el-input {
            width: 560px;
            input {
              padding-right: 50px;
            }
          }
        }
      }
      > main {
        // min-height: calc(100% - 72px);
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
        > p.section-title {
          padding: 15px 0;
          padding-bottom: 30px;
          flex: none;
          white-space: nowrap;
          .mp-common-title-wrap {
            color: #444;
            font-size: 15px;
            position: relative;
            top: 1px;
            &::before {
              height: 16px;
            }
          }
          .blue-span {
            font-size: 13px;
            margin-left: 15px;
            line-height: 16px;
          }
        }
        > .el-form.constraint-ruleForm {
          flex: 1;
          overflow-y: auto;
          .el-form-item {
            white-space: nowrap;
            .el-form-item__label {
              color: #888E99;
              white-space: nowrap;
              font-size: 13px;
              margin-right: 6px;
              line-height: 31px;
              height: 30px;
              min-width: 260px;
              width: 35% !important;
              > span {
                width: 100%;
                display: inline-block;
                overflow: hidden;
                // text-overflow: ellipsis;
                text-align: right;
              }
            }
            .el-form-item__content {
              white-space: nowrap;
              // height: 30px;
              line-height: 26px;
              display: flex;
              align-items: flex-end;
              > div {
                flex: none;
              }
              .mp-erp-new-comps-condtion-set-common-comp-operator-comp-wrap {
                margin-right: 15px;
              }
              .del-btn, .setup-btn {
                display: flex;
                align-items: center;
                font-size: 12px;
                padding-left: 12px;
                cursor: pointer;
                height: 30px;
                > span {
                  margin-left: 10px;
                  color: #a2a2a2;
                  transition: color 0.1s ease-in-out;
                  user-select: none;
                }
                &:hover > span {
                  color: #444;
                }
              }
              .setup-btn {
                margin-right: 12px;
                padding-left: 24px;
                &.is-disabled {
                  > span {
                    color: #cbcbcb !important;
                  }
                  > img {
                    filter: grayscale(100%);
                  }
                }
              }
            }
          }
        }
        > .el-radio-group {
          width: 100%;
          padding: 18px 0;
          flex: none;
          text-align: center;
          white-space: nowrap;
          > label {
            .el-radio-button__inner {
              padding: 9px 34px;
            }
          }
        }
      }
    }
  }
  > .right {
    > .right-content {
      padding-left: 5vw;
      .mp-common-title-wrap {
        color: #444;
        font-size: 15px;
        min-width: 2em;
        position: relative;
        top: 1px;
        white-space: nowrap;
        &::before {
          height: 16px;
        }
      }
      > header {
        padding-top: 70px;
        padding-bottom: 30px;
        white-space: nowrap;
        .mp-common-title-wrap {
          margin-right: 25px;
        }
      }
      > main {
        font-size: 14px;
      }
    }
  }
  span.label {
    font-size: 14px;
    color: #888E99;
    min-width: 4em;
    display: inline-block;
    text-align: right;
  }
}
.tips-box {
  width:550px;
  background: #FFFBF6;
  border-radius: 3px;
  height: 28px;
  color:rgba(244,163,7, 0.8);
  font-size:12px;
  padding-left:16px;
  line-height: 26px;
  box-sizing: border-box;
  i {
    font-size: 15px;
    position: relative;
    top: 1px;
    margin-right: 10px;
  }
  &.is-pink {
    background: rgb(255, 248, 250);
    color: #ff3769dc !important;
  }
}
.mp-common-title-wrap {
  min-width: 4em;
  line-height: 14px;
  font-size: 14px;
  color: #26bcf9;
  display: inline-block;
  font-weight: 700;
  &::before {
    content: "";
    display: inline-block;
    width: 3px;
    height: 14px;
    margin-right: 10px;
    vertical-align: -15%;
    background: linear-gradient(233deg,  #35dff9 0%, #26bcf9 100%);
  }
  &.black {
    color: #444;
  }
  &.f-15 {
    font-size: 15px;
    &::before {
      height: 16px;
    }
  }
}
.el-radio-group.mp-common-tab-radio-box {
  > label {
    .el-radio-button__inner {
      padding: 9px 34px;
      color: #585858;
      font-size: 14px;
      border-color: #e5e5e5;
    }
    &.is-active {
      position: relative;
      .el-radio-button__inner{
        color: #fff;
        border-color: #26bcf9;
        &::before {
          content: '';
          position: absolute;
          height: 4px;
          width: 4px;
          border-radius: 50%;
          background-color: #fff;
          left: 21px;
          transition: 0.2s ease-in-out;
          top: calc(50% - 1px);
        }
      }
    }
  }
}
.mp-scroll-wrap::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  // display: none;
}
.mp-scroll-wrap::-webkit-scrollbar-thumb {
  background-color: #e6e6e6;
  border-radius: 3px;
  transition: background-color 0.1s ease-in-out;
  &:hover {
    background-color: #cbcbcb;
  }
}
</style>
