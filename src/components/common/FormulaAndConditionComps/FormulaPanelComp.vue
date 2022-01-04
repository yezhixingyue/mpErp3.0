<template>
  <section class="mp-erp-common-comps-formula-set-panel-comp--wrap" :class="{isSingle: isSingle}">
    <header v-if="!hiddenHeader">
      <span>{{pageLabel}}：</span>
      <span>{{pageTitle}}</span>
      <slot name="title"></slot>
      <div v-if="FormulaData">
        <div>
          <span>{{FormulaLabel}}：</span>
          <el-input size='small' style="width: 250px" v-model.trim="FormulaData.Name" maxlength="15" show-word-limit></el-input>
        </div>
        <div v-if="!hiddenUnit">
          <span>结果单位：</span>
          <el-input size='small' style="width: 125px" v-model.trim="FormulaData.Unit" maxlength="6" show-word-limit></el-input>
        </div>
      </div>
    </header>
    <main>
      <LRWidthDragAutoChangeComp :leftWidth='isSingle?"100%":"45%"' v-if="PropertyList && FormulaData" :single='isSingle'>
        <template v-slot:left>
          <section class="mp-erp-common-comps-formula-set-panel-comp-left-content-wrap">
            <header>
              <p class="btn-box">
                <el-button type="primary" size="small" @click='onElementAddClick' v-if="!isSingle">+添加元素</el-button>
                <span class="blue-span" @click='onElementAddClick' v-else>+添加元素</span>
              </p>
              <p class="tips-box">
                <span class="lt">
                  <i class="el-icon-warning"></i>注：
                </span>
                <span class="rt">
                  <i>当为空值时设置的值指当某一界面元素被禁用/隐藏或者客户未选择未填写任何值时，以此值参与运算</i>
                  <i v-if="isSingle">表数据指根据当前数据表匹配的结果数值，如果没有任何匹配，则此公式运算结果为空。</i>
                </span>
              </p>
            </header>
            <main>
              <p class="module-title" v-if="!isSingle">已选元素概览</p>
              <ul>
                <li v-for="(it, i) in FormulaData.PropertyList" :key="it.StoredContent + '' + i">
                  <span class="name" v-if="!it.TipsContent" :class="{'is-bold': it.Type === 8 || it.Type === 9}">{{it.DisplayContent}}</span>
                  <TipsSpanButton v-else class="name" :text='it.DisplayContent' :tipContent='it.TipsContent' />
                  <span class="default">
                    <template v-if="it.Type !== 8 && !(it.Type === 9 && it.CraftOptionList && it.CraftOptionList.length > 0)">
                      <i>空值设为：</i>
                      <el-input size="small" v-model.trim="it.DefaultValue"></el-input>
                      <i> {{it.Unit}}</i>
                    </template>
                    <template v-if="it.Type === 9 && it.CraftOptionList && it.CraftOptionList.length > 0">
                      <span class="cost-selected-text" :title="getCostSelectedText(it)">{{getCostSelectedText(it)}}</span>
                      <span class="blue-span" @click="onCostSetupClick(it)">选择</span>
                    </template>
                  </span>
                  <span class="del" @click="deleteElement(it, i)"><i></i>删除</span>
                  <span class="join blue-span" @click="joinElement(it)">加入 <i class="el-icon-d-arrow-right"></i> </span>
                </li>
              </ul>
              <!-- 相同公式面板1 后面提取公共组件 -->
              <section class="mp-erp-common-comps-formula-set-panel-comp-right-content-wrap show-left" v-if="isSingle">
                <header>
                  <p class="module-title">公式</p>
                </header>
                <main>
                  <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 100}"  v-model.trim="FormulaData.Content" />
                  <div class="ctrl-box">
                    <span :class="it.isMini?'mini':''" v-for="it in ArithmeticOperatorList" :key='it.value'
                    @click="onArithmeticOperatorClick(it)">{{it.label}}</span>
                  </div>
                  <p class="intro">
                    <span>公式说明：</span>
                    <el-input size="small" v-model.trim="FormulaData.Remark" maxlength="150" show-word-limit></el-input>
                  </p>
                  <p class="module-title">试算</p>
                  <div class="test-box">
                    <div>
                      <div v-for="it in FormulaData.PropertyList" :key="it.DisplayContent">
                        <span :title="it.DisplayContent">{{it.DisplayContent}}：</span>
                        <el-input v-model.trim="it.CalculateValue" size="small" @input="onCalculateInput"
                        :disabled='!FormulaData.Content.includes(it.DisplayContent)'></el-input>
                        <span>{{it.Unit}}</span>
                      </div>
                    </div>
                    <p>
                      <span class="blue-span" @click="onCalculateClick" :class="!(FormulaData && FormulaData.Content) ? 'disabled' : ''">测试运算</span>
                      <span v-if="CalculateRes || CalculateRes === 0">测试运算结果：<i class="is-pink">{{CalculateRes}}</i></span>
                    </p>
                  </div>
                </main>
              </section>
            </main>
          </section>
        </template>
        <template v-slot:right v-if="!isSingle">
          <!-- 相同公式面板2 后面提取公共组件 -->
          <section class="mp-erp-common-comps-formula-set-panel-comp-right-content-wrap">
            <header>
              <p class="module-title">公式</p>
            </header>
            <main>
              <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 100}"  v-model.trim="FormulaData.Content" />
              <div class="ctrl-box">
                <span :class="it.isMini?'mini':''" v-for="it in ArithmeticOperatorList" :key='it.value'
                 @click="onArithmeticOperatorClick(it)">{{it.label}}</span>
              </div>
              <p class="intro">
                <span>公式说明：</span>
                <el-input size="small" v-model.trim="FormulaData.Remark" maxlength="150" show-word-limit></el-input>
              </p>
              <p class="module-title">试算</p>
              <div class="test-box">
                <div>
                  <div v-for="it in FormulaData.PropertyList" :key="it.DisplayContent">
                    <span :title="it.DisplayContent">{{it.DisplayContent}}：</span>
                    <el-input v-model.trim="it.CalculateValue" size="small" @input="onCalculateInput"
                     :disabled='!FormulaData.Content.includes(it.DisplayContent)'></el-input>
                    <span>{{it.Unit}}</span>
                  </div>
                </div>
                <p>
                  <span class="blue-span" @click="onCalculateClick" :class="!(FormulaData && FormulaData.Content) ? 'disabled' : ''">测试运算</span>
                  <span v-if="CalculateRes || CalculateRes === 0">测试运算结果：<i class="is-pink">{{CalculateRes}}</i></span>
                </p>
              </div>
            </main>
          </section>
        </template>
      </LRWidthDragAutoChangeComp>
      <FormulaCostOptionSetupDialog :visible.sync="CostSetupVisible" :prop='curSetupCostProp' @submit='onCostSetupSubmit' />
      <FormulaPanelElementSelectDialog useType='formula' :DialogTitle="subFromulaDialogTitle" v-if="PropertyList && FormulaData"
        :visible.sync='selectVisible' :list='PropertyList' @submit='onElementSelect' :selectedElementIDs='selectedElementIDs' />
    </main>
    <footer v-if="!isSingle">
      <el-button type="primary" @click="onSubmitClick">保存</el-button>
      <el-button @click="onGoBackClick" class="go-back">返回</el-button>
    </footer>
  </section>
</template>

<script>
import FormulaClass from '@/assets/js/TypeClass/FormulaClass';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import LRWidthDragAutoChangeComp from '@/components/common/NewComps/LRWidthDragAutoChangeComp.vue';
import TipsSpanButton from '@/components/common/NewComps/TipsSpanButton.vue';
import FormulaPanelElementSelectDialog from './FormulaPanelElementSelectDialog.vue';
import FormulaCostOptionSetupDialog from './FormulaCostOptionSetupDialog.vue';

export default {
  props: {
    PositionID: {
      type: String,
      default: '',
    },
    moduleIndex: {
      type: Number,
      default: 0,
    },
    NowEditFormulaData: { // 公式编辑数据 （非子公式）
      type: Object,
      default: null,
    },
    curSubFormulaAddProperty: { // 子公式添加使用
      type: Object,
      default: null,
    },
    curEditSubFormulaData: { // 子公式编辑数据
      type: Object,
      default: null,
    },
    Condition4getProperty: {
      type: Object,
      default: null,
    },
    pageTitle: {
      type: String,
      default: '',
    },
    pageLabel: {
      type: String,
      default: '当前物料类型',
    },
    PositionType: {
      type: String,
      default: '',
    },
    hiddenUnit: {
      type: Boolean,
      default: false,
    },
    hiddenHeader: {
      type: Boolean,
      default: false,
    },
    isSingle: {
      type: Boolean,
      default: false,
    },
    FormulaLabel: {
      type: String,
      default: '公式名称',
    },
    PriceID: {
      type: String,
      default: '',
    },
  },
  components: {
    LRWidthDragAutoChangeComp,
    FormulaPanelElementSelectDialog,
    TipsSpanButton,
    FormulaCostOptionSetupDialog,
  },
  data() {
    return {
      PropertyList: null,
      FormulaData: null,
      selectVisible: false,
      ArithmeticOperatorList: [
        { label: '+', isMini: true, value: '+', num: 0 }, // num为-1时指插入内容后光标退后一位
        { label: '-', isMini: true, value: '-', num: 0 },
        { label: '×', isMini: true, value: '*', num: 0 },
        { label: '÷', isMini: true, value: '/', num: 0 },
        { label: '(', isMini: false, value: '(', num: 0 },
        { label: ')', isMini: false, value: ')', num: 0 },
        { label: '取余', isMini: false, value: '%', num: 0 },
        { label: '向上取整', isMini: false, value: 'Ceiling()', num: -1 },
        { label: '向下取整', isMini: false, value: 'Floor()', num: -1 },
        { label: '最大值', isMini: false, value: 'Max()', num: -1 },
        { label: '最小值', isMini: false, value: 'Min()', num: -1 },
      ],
      CalculateRes: '',
      isloading: false,
      CostSetupVisible: false, // 设置工艺费弹窗
      curSetupCostProp: null,
    };
  },
  computed: {
    selectedElementIDs() {
      if (this.FormulaData && this.FormulaData.PropertyList && Array.isArray(this.FormulaData.PropertyList)) {
        return this.FormulaData.PropertyList.map(it => it.StoredContent);
      }
      return [];
    },
    haveInputElementList() {
      if (this.FormulaData && this.FormulaData.PropertyList && Array.isArray(this.FormulaData.PropertyList) && this.FormulaData.Content.length > 0) {
        return this.FormulaData.PropertyList.filter(it => this.FormulaData.Content.includes(it.DisplayContent));
      }
      return [];
    },
    watchContent() {
      if (!this.FormulaData) return '';
      return this.FormulaData.Content;
    },
    isSubFormula() { // 是否为子公式设置
      return this.moduleIndex === 2 || this.moduleIndex === 4;
    },
    subFromulaDialogTitle() {
      if (!this.isSubFormula) return '';
      if (this.curSubFormulaAddProperty) return `当前设置子公式：${this.curSubFormulaAddProperty.DisplayContent.replace(/\[|\]/g, '')}`;
      return '';
    },
  },
  methods: {
    async initData() {
      if (this.isloading) return;
      this.isloading = true;
      let temp;
      // let isSubEdit = false;
      let _IDsObj;
      if (!this.isSubFormula) {
        if (this.NowEditFormulaData) temp = { ...this.NowEditFormulaData }; // 编辑 子公式编辑是否可涵盖在里面？ 尚不确定 。 curEditSubFormulaData
        else temp = { [this.PositionType]: this.PositionID, UseModule: this.moduleIndex, PriceID: this.PriceID };
      } else {
        if (this.curEditSubFormulaData) { // 编辑
          temp = { ...this.curEditSubFormulaData };
          _IDsObj = PropertyClass.getPropIDsObj(this.curEditSubFormulaData);
        }
        if (this.curSubFormulaAddProperty) { // 添加
          _IDsObj = PropertyClass.getPropIDsObj(this.curSubFormulaAddProperty);
          temp = { ..._IDsObj, UseModule: this.moduleIndex };
        }
        _IDsObj.UseModule = this.moduleIndex;
        // 编辑时尚未处理 看是否可共用上面编辑模式
      }
      // if (isSubEdit) return;

      // 当上面编辑模式不能共用时 下面这个取值也需要修改
      let _data4FetchProperty = !this.isSubFormula ? { [this.PositionType]: this.PositionID, UseModule: this.moduleIndex } : temp;
      if (this.Condition4getProperty) _data4FetchProperty = this.Condition4getProperty;
      this.FormulaData = new FormulaClass(temp); // 初始化公式数据
      const propertyList = await PropertyClass.getPropertyList(_data4FetchProperty);
      this.isloading = false;
      if (propertyList) {
        this.PropertyList = propertyList;
        this.initPropertyListReplaceHelper();
      } else {
        this.onGoBackClick();
      }
      // this.getPropertyList(); // 获取属性列表信息
    },
    onGoBackClick(type) {
      this.$emit('goback', type);
    },
    initPropertyListReplaceHelper() { // 获取可用属性列表并转换完成后，对编辑数据时初始的PropertyList的数据进行修改操作（以获取到的可用属性为准）
      if (this.FormulaData.PropertyList.length === 0) return;
      this.FormulaData.PropertyList = this.FormulaData.PropertyList.map(it => {
        const t = PropertyClass.getPerfectPropertyByImperfectProperty(it, this.PropertyList);
        return t ? { ...t, DefaultValue: it.DefaultValue } : null;
      }).filter(it => it);
    },
    onElementAddClick() {
      this.selectVisible = true;
    },
    onElementSelect(Element) {
      if (this.FormulaData && Element) {
        this.FormulaData.PropertyList.push(Element);
      }
    },
    deleteElement(Element, index) {
      if (this.FormulaData && (index || index === 0)) {
        this.FormulaData.PropertyList.splice(index, 1);
        const str = Element.DisplayContent.replace('[', '').replace(']', '');
        const reg = new RegExp(`\\[${str}\\]`, 'g');
        this.FormulaData.Content = this.FormulaData.Content.replace(reg, '');
      }
    },
    joinElement(Element) {
      if (!Element || !Element.DisplayContent) return;
      this.insertVariable(Element.DisplayContent);
    },
    async insertVariable(value, num = 0) {
      const myField = document.querySelector('.mp-erp-common-comps-formula-set-panel-comp-right-content-wrap .el-textarea__inner');
      if (!myField) {
        this.messageBox.failSingle('获取公式输入对象失败');
        return;
      }

      if (myField.selectionStart || myField.selectionStart === 0) {
        const startPos = myField.selectionStart;

        const endPos = myField.selectionEnd;

        this.FormulaData.Content = myField.value.substring(0, startPos) + value + myField.value.substring(endPos, myField.value.length);

        await this.$nextTick();

        myField.focus();

        myField.setSelectionRange(endPos + value.length + num, endPos + value.length + num);
      } else {
        this.FormulaData.Content = value;
      }
    },
    onArithmeticOperatorClick(it) {
      if (!it) return;
      this.insertVariable(it.value, it.num || 0);
    },
    async submitSave(data) {
      const resp = await this.api.getFormulaSave(data).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        // 保存成功
        const isEdit = !!data.ID;
        const msg = isEdit ? '编辑成功' : '添加成功';
        const callback = () => {
          this.$emit('successSubmit', [isEdit, data, resp.data.Data]);
          this.onGoBackClick('success');
        };
        this.messageBox.successSingle(msg, callback, callback);
      }
    },
    async useCalculate(data) {
      const resp = await this.api.getFormulaCalculate(data).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        // 保存成功
        this.CalculateRes = resp.data.Data;
      }
    },
    onSubmitClick() {
      const checkBool = FormulaClass.checkSubmit(this.FormulaData);
      if (checkBool) { // 提交验证通过
        // console.log(this.FormulaData);
        this.submitSave(this.FormulaData);
      }
    },
    onCalculateClick() {
      const checkBool = FormulaClass.checkCalculate(this.FormulaData);
      if (checkBool) { // 测算验证通过
        this.CalculateRes = '';
        this.useCalculate(this.FormulaData);
      }
    },
    onCalculateInput() {
      this.CalculateRes = '';
    },
    getFormulaData() {
      const checkBool = FormulaClass.checkSubmit(this.FormulaData, this.hiddenHeader);
      return checkBool ? this.FormulaData : null;
    },
    getCostSelectedText(it) {
      if (!it || !Array.isArray(it.CraftOptionList) || it.CraftOptionList.length === 0) return '';
      const list = []; // [{ Name: '产品工艺', List: [] }]
      it.CraftOptionList.filter(_it => _it.IsChecked).forEach(item => {
        const Name = item.Part ? `${item.Part.Name}` : '产品';
        const ValueText = item.DefaultValue || item.DefaultValue === 0 ? `（${item.DefaultValue}）` : '';
        const t = list.find(_it => _it.Name === Name);
        if (t) t.List.push(`${item.Name}${ValueText}`);
        else list.push({ Name, List: [`${item.Name}${ValueText}`] });
      });
      return list.map(({ Name, List }) => {
        const lists = List.join('、');
        return `${Name}：${lists}`;
      }).join(' ');
    },
    onCostSetupClick(it) {
      if (!it) return;
      this.curSetupCostProp = it;
      this.CostSetupVisible = true;
    },
    onCostSetupSubmit(e) {
      const t = this.FormulaData?.PropertyList.find(it => it.StoredContent === this.curSetupCostProp.StoredContent);
      if (t) {
        t.CraftOptionList = [...e];
      }
      this.CostSetupVisible = false;
    },
  },
  watch: {
    watchContent() {
      this.CalculateRes = '';
    },
  },
  mounted() {
    this.initData();
  },
  // activated() {
  //   this.initData();
  // },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-formula-set-panel-comp--wrap {
  padding-left: 20px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    padding: 25px 0;
    line-height: 15px;
    box-sizing: border-box;
    flex: none;
    > span {
      font-size: 15px;
      color: #21CAE3;
      font-weight: bold;
    }
    .name {
      margin-left: 40px;
      font-weight: 400;
      font-size: 14px;
    }
    > div {
      display: flex;
      padding-top: 45px;
      > div {
        display: flex;
        align-items: center;
        > span {
          white-space: nowrap;
          font-size: 14px;
          color: #888E99;
        }
        &:first-of-type {
          margin-right: 36px;
        }
        .el-input__suffix {
          right: 2px;
        }
      }
    }
  }
  > main {
    flex: 1;
    padding-bottom: 10px;
    .mp-erp-common-comps-formula-set-panel-comp-left-content-wrap {
      > header {
        padding-top: 15px;
        > p.btn-box {
          padding-bottom: 40px;
          > button {
            width: 110px;
          }
        }
        > p.tips-box {
          width: 700px;
          display: flex;
          height: auto;
          > .lt {
            padding-top: 3px;
            padding-right: 2px;
            white-space: nowrap;
          }
          > .rt {
            > i {
              font-size: 12px;
              padding: 6px 0 4px 0;
              display: block;
              line-height: 18px;
              letter-spacing: 1px;
              & + i {
                padding: 3px 0 9px 0;
              }
            }
          }
        }
      }
      > main {
        padding-top: 25px;
        > ul {
          padding-top: 30px;
          > li {
            font-size: 12px;
            display: flex;
            align-items: center;
            min-width: 700px;
            margin-bottom: 15px;
            > span {
              &.name {
                color: #585858;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 260px;
                padding-right: 10px;
                font-size: 13px;
                line-height: 15px;
              }
              &.default {
                font-size: 13px;
                color: #888E99;
                width: 260px;
                white-space: nowrap;
                overflow: hidden;
                line-height: 18px;
                > .el-input {
                  width: 120px;
                }
                > i:last-of-type {
                  font-size: 12px;
                }
                > span {
                  font-size: 12px;
                  &.cost-selected-text {
                    display: inline-block;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    vertical-align: bottom;
                    width: 190px;
                    padding-right: 5px;
                  }
                }
              }
              &.del {
                color: #a2a2a2;
                transition: color 0.05s ease-in-out;
                cursor: pointer;
                margin: 0 10px;
                display: flex;
                align-items: center;
                user-select: none;
                margin-right: 15px;
                &:hover {
                  color: #444;
                }
                > i {
                  width: 16px;
                  height: 16px;
                  background: url(../../../assets/images/del.png) no-repeat center center/12px 16px;
                  margin-right: 4px;
                }
              }
              &.join {
                font-size: 14px;
                margin-left: 18px;
              }
            }
          }
        }
      }
    }
    .mp-erp-common-comps-formula-set-panel-comp-right-content-wrap {
      padding-left: 45px;
      padding-top: 15px;
      overflow: hidden;
      // min-width: 780px;
      > header {
        padding-bottom: 30px;
      }
      > main {
        width: 765px;
        > .ctrl-box {
          display: flex;
          margin: 20px 0;
          justify-content: space-between;
          > span {
            width: 65px;
            height: 35px;
            border: 1px solid #B2E4F9;
            border-radius: 5px;
            text-align: center;
            line-height: 33px;
            box-sizing: border-box;
            font-size: 13px;
            color: #26BCF9;
            user-select: none;
            cursor: pointer;
            transition: 0.1s ease-in-out;
            &.mini {
              font-size: 20px;
            }
            &:hover {
              background-color: #b2e4f954;
            }
            &:active {
              background-color: #26bdf971;
              border-color: #26BCF9;
              color: #08b0f3;
            }
          }
        }
        > .intro {
          display: flex;
          align-items: center;
          padding-bottom: 50px;
          > span {
            font-size: 14px;
            color: #888E99;
            flex: none;
          }
          input {
            border-radius: 5px;
            padding-right: 45px;
          }
          .el-input__suffix {
            right: 1px;
          }
        }
        > .module-title {
          padding-bottom: 30px;
        }
        > .test-box {
          padding-left: 15px;
          padding-bottom: 10px;
          > p {
            display: flex;
            align-items: center;
            line-height: 16px;
            height: 20px;
            > span {
              font-size: 14px;
              color: #888E99;
              &.blue-span {
                margin-right: 40px;
              }
              > i {
                font-size: 16px;
              }
            }
          }
          > div {
            display: flex;
            flex-wrap: wrap;
            padding-bottom: 15px;
            > div {
              width: 360px;
              margin-right: 14px;
              display: flex;
              align-items: center;
              overflow: hidden;
              margin-bottom: 15px;
              > span {
                white-space: nowrap;
                flex: none;
                font-size: 12px;
                color: #888E99;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 16px;
                &:first-of-type {
                  font-size: 13px;
                  width: 186px;
                  text-align: right;
                }
              }
              > .el-input {
                width: 100px;
                margin: 0 4px;
              }
            }
          }
        }
      }
      &.show-left {
        padding-left: 0;
        .module-title {
          padding-left: 0;
          padding-bottom: 10px;
          &::before {
            display: none;
          }
        }
        > header {
          padding-bottom: 8px;
        }
        > main {
          > .test-box {
            > div > div {
              margin-bottom: 10px;
            }
          }
          > .intro {
            padding-bottom: 32px;
          }
        }
      }
    }
    .el-input {
      input {
        height: 30px;
        line-height: 30px;
      }
    }
  }

  &.isSingle {
    padding-left: 0px;
    margin-top: -59px;
    > main {
      .mp-erp-common-comps-formula-set-panel-comp-left-content-wrap {
        > header {
          > .btn-box {
            padding-left: 120px;
            padding-bottom: 32px;
          }
        }
        > main {
          padding-top: 5px;
          > ul {
            padding-top: 24px;
          }
        }
      }
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    bottom: 20px;
    > button {
      width: 120px;
      height: 35px;
      border-radius: 3px;
      padding: 0;
      &.go-back {
        border: 1px solid #26BCF9;
        color: #26BCF9;
        margin-left: 40px;
      }
    }
  }
  p.module-title {
    font-size: 15px;
    font-weight: 700;
    padding-left: 13px;
    position: relative;
    color: #444;
    user-select: none;
    &::before {
      content: '';
      position: absolute;
      width: 3px;
      height: 15px;
      background-color: #26BCF9;
      left: 0;
    }
  }
}
</style>
