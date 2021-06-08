<template>
  <section class="mp-erp-common-comps-formula-set-panel-comp--wrap" v-if="PropertyList && FormulaData">
    <header>
      <span>{{pageLabel}}：</span>
      <span>{{pageTitle}}</span>
      <div>
        <div>
          <span>公式名称：</span>
          <el-input size='small' style="width: 250px" v-model.trim="FormulaData.Name" maxlength="10" show-word-limit></el-input>
        </div>
        <div>
          <span>结果单位：</span>
          <el-input size='small' style="width: 100px" v-model.trim="FormulaData.Unit" maxlength="4" show-word-limit></el-input>
        </div>
      </div>
    </header>
    <main>
      <LRWidthDragAutoChangeComp leftWidth='45%'>
        <template v-slot:left>
          <section class="mp-erp-common-comps-formula-set-panel-comp-left-content-wrap">
            <header>
              <p class="btn-box">
                <el-button type="primary" size="small" @click='onElementAddClick'>+添加元素</el-button>
              </p>
              <p class="tips-box"><i class="el-icon-warning"></i> 注：当为空值时设置的值指当某一界面元素被禁用/隐藏或者客户未选择未填写任何值时，以此值参与运算</p>
            </header>
            <main>
              <p class="module-title">已选元素概览</p>
              <ul>
                <li v-for="(it, i) in FormulaData.PropertyList" :key="it.Element.ID + i">
                  <span class="name" v-if="!it.TipsContent">{{it.DisplayContent}}</span>
                  <TipsSpanButton v-else class="name" :text='it.DisplayContent' :tipContent='it.TipsContent' />
                  <span class="default">
                    <i>空值设为：</i>
                    <el-input size="small" v-model.trim="it.DefaultValue"></el-input>
                    <i> {{it.Unit}}</i>
                  </span>
                  <span class="del" @click="deleteElement(it, i)"><i></i>删除</span>
                  <span class="join blue-span" @click="joinElement(it)">加入 <i class="el-icon-d-arrow-right"></i> </span>
                </li>
              </ul>
            </main>
          </section>
        </template>
        <template v-slot:right>
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
                <el-input size="small" v-model.trim="FormulaData.Remark" maxlength="50" show-word-limit></el-input>
              </p>
              <p class="module-title">试算</p>
              <div class="test-box">
                <div>
                  <div v-for="it in FormulaData.PropertyList" :key="it.DisplayContent">
                    <span>{{it.DisplayContent}}：</span>
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
      <FormulaPanelElementSelectDialog
        :visible.sync='selectVisible' :list='PropertyList' @submit='onElementSelect' :selectedElementIDs='selectedElementIDs' />
    </main>
    <footer>
      <el-button type="primary" @click="onSubmitClick">保存</el-button>
      <el-button @click="onGoBackClick" class="go-back">返回</el-button>
    </footer>
  </section>
</template>

<script>
import FormulaClass from '@/assets/js/TypeClass/FormulaClass';
import LRWidthDragAutoChangeComp from '@/components/common/NewComps/LRWidthDragAutoChangeComp.vue';
import TipsSpanButton from '@/components/common/NewComps/TipsSpanButton.vue';
import FormulaPanelElementSelectDialog from './FormulaPanelElementSelectDialog.vue';

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
    NowEditFormulaData: {
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
  },
  components: {
    LRWidthDragAutoChangeComp,
    FormulaPanelElementSelectDialog,
    TipsSpanButton,
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
    };
  },
  computed: {
    selectedElementIDs() {
      if (this.FormulaData && this.FormulaData.PropertyList && Array.isArray(this.FormulaData.PropertyList)) {
        return this.FormulaData.PropertyList.map(it => it.Element.ID);
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
  },
  methods: {
    initData() {
      if (this.isloading) return;
      this.isloading = true;
      let temp;
      if (this.NowEditFormulaData) temp = { ...this.NowEditFormulaData };
      else {
        temp = { PositionID: this.PositionID, UseModule: this.moduleIndex };
      }
      this.FormulaData = new FormulaClass(temp); // 初始化公式数据
      this.getPropertyList(); // 获取属性列表信息
    },
    onGoBackClick() {
      this.$emit('goback');
    },
    async getPropertyList() {
      const resp = await this.api.getFormulaPropertyList(this.PositionID, this.moduleIndex).catch(() => {});
      this.isloading = false;
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        this.PropertyList = resp.data.Data.map(it => this.transformProperty(it)).filter(it => it);
        this.initPropertyListReplaceHelper();
      }
    },
    initPropertyListReplaceHelper() { // 获取可用属性列表并转换完成后，对编辑数据时初始的PropertyList的数据进行修改操作（以获取到的可用属性为准）
      if (this.FormulaData.PropertyList.length === 0) return;
      this.FormulaData.PropertyList = this.FormulaData.PropertyList.map(it => {
        const t = this.PropertyList.find(_it => _it.Element.ID === it.Element.ID);
        if (t) return { ...t, DefaultValue: it.DefaultValue };
        return null;
      }).filter(it => it);
    },
    transformProperty(property) {
      if (!property || Object.prototype.toString.call(property) !== '[object Object]') return null;
      const { Element } = property;
      if (!Element || Object.prototype.toString.call(Element) !== '[object Object]') return null;
      const { Type, DefaultValue, NumbericAttribute, OptionAttribute, SwitchAttribute } = Element;
      let TipsContent = '';
      const AvailableValueList = []; // 子项可为数值 也可为对象信息(此时为限制范围)
      if (DefaultValue || DefaultValue === 0) {
        AvailableValueList.push(DefaultValue);
        TipsContent += `隐藏运算值：${DefaultValue}；`;
      }
      switch (Type) {
        case 1: // 1 数字值 DefaultValue NumbericAttribute
          if (NumbericAttribute && Object.prototype.toString.call(NumbericAttribute) === '[object Object]') {
            const { SectionList, InputContent, AllowDecimal } = NumbericAttribute;
            if (SectionList && Array.isArray(SectionList) && SectionList.length > 0) {
              const _list = SectionList.map(it => {
                const { MinValue, MaxValue, IsGeneralValue, Increment } = it;
                const str = IsGeneralValue ? `需从${InputContent}中取符合该范围取值` : `增量应为${Increment}`;
                TipsContent += `范围在(${MinValue},${MaxValue}]时，${str}；`;
                return { ...it, InputContent, AllowDecimal };
              });
              AvailableValueList.push(..._list);
            }
          }
          break;
        case 2: // 选项值 DefaultValue OptionAttribute
          if (OptionAttribute && OptionAttribute.OptionList && Array.isArray(OptionAttribute.OptionList)) {
            OptionAttribute.OptionList.forEach((option, i) => {
              if (option.Value || option.Value === 0) {
                AvailableValueList.push(option.Value);
                TipsContent += `${i + 1}、 ${option.Name}（值：${option.Value}）；`;
              }
            });
          }
          break;
        case 3: // 开关 DefaultValue SwitchAttribute
          if (SwitchAttribute && Object.prototype.toString.call(SwitchAttribute) === '[object Object]') {
            const { CloseValue, OpenValue } = SwitchAttribute;
            if (OpenValue || OpenValue === 0) {
              AvailableValueList.push(OpenValue);
              TipsContent += `开值：${OpenValue}；`;
            }
            if (CloseValue || CloseValue === 0) {
              AvailableValueList.push(CloseValue);
              TipsContent += `关值：${CloseValue}`;
            }
          }
          break;
        default:
          break;
      }
      return { ...property, TipsContent, AvailableValueList };
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
    async insertVariable(value, num) {
      const myField = document.querySelector('.mp-erp-common-comps-formula-set-panel-comp-right-content-wrap .el-textarea__inner');
      if (!myField) {
        this.messageBox.failSingle('获取公式输入对象失败');
        return;
      }

      if (myField.selectionStart || myField.selectionStart === 0) {
        const startPos = myField.selectionStart;

        const endPos = myField.selectionEnd;

        this.FormulaData.Content = myField.value.substring(0, startPos) + value + myField.value.substring(endPos, myField.value.length);

        await this.$nextTick(); // 这句是重点, 圈起来

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
          this.onGoBackClick();
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
  },
  watch: {
    watchContent() {
      this.CalculateRes = '';
    },
  },
  mounted() {
    this.initData();
  },
  activated() {
    this.initData();
  },
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
                > .el-input {
                  width: 120px;
                }
                > i:last-of-type {
                  font-size: 12px;
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
          margin-left: 10px;
        }
        > .test-box {
          padding-left: 15px;
          > p {
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
