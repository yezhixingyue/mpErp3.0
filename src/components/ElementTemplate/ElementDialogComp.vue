<template>
  <CommonDialogComp
    width="850px"
    top='4vh'
    :title="title"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-element-template-element-dialog-comp-wrap"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="element-ruleForm"
      size='mini'
      v-if="ruleForm"
    >
      <el-form-item label="名称：" prop="Name">
        <div class="element-name-box">
          <div>
            <el-input v-model.trim="ruleForm.Name" placeholder="请输入元素名称" maxlength="6" show-word-limit></el-input>
            <template v-if="!isCommon">
              <span class="blue-span" @click="onTemplateSelect">选择模板</span>
              <span class="is-gray" v-if="TempData && TempData.Name">已选：{{TempData.Name}}</span>
            </template>
          </div>
          <div class="checked-box">
            <el-checkbox class="checked-item" v-model="ruleForm.IsNameHidden">界面隐藏名称</el-checkbox>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="类型：" prop="Type">
        <!-- <el-radio-group v-model="ruleForm.Type" :disabled="this.title === '编辑界面元素'"> -->
        <el-radio-group v-model="ruleForm.Type">
          <el-radio :label="it.Name" v-for="it in TypeEnum" :key="it.Name + it.label">{{it.label}}</el-radio>
        </el-radio-group>
        <div class="checked-box hidden-content-box" v-show="ruleForm.Type">
          <el-checkbox class="checked-item" v-model="ruleForm.HiddenToCustomer">客户界面隐藏</el-checkbox>
          <div v-show="ruleForm.HiddenToCustomer">
            <span>隐藏时运算值：</span>
            <el-input v-model.trim="ruleForm.DefaultValue" maxlength="9"></el-input>
          </div>
        </div>
      </el-form-item>
      <!-- 数字值添加内容 ↓ -->
      <template v-if="ruleForm.Type==='Numberic'">
        <el-form-item label="常值类型：" prop="NumbericAttribute.AllowDecimal" key="NumbericAttributeAllowDecimal">
          <el-checkbox class="checked-item" v-model="ruleForm.NumbericAttribute.AllowDecimal">允许小数</el-checkbox>
        </el-form-item>
        <el-form-item label="常规数值：" prop="NumbericAttribute.InputContent" key="InputContent">
          <el-input style='width:600px' v-model="ruleForm.NumbericAttribute.InputContent"></el-input>
        </el-form-item>
        <el-form-item label="" class="tip-wrap">
          <p class="tips-box"><i class="el-icon-warning"></i> 可为空，用空格、逗号分开，分隔符不限全角半角</p>
        </el-form-item>
        <el-form-item label="默认选择：" prop="NumbericAttribute.NumberDefaultValue" key="NumberDefaultValue">
          <el-input style='width:120px' v-model.trim="ruleForm.NumbericAttribute.CheckedValue" maxlength="9"></el-input>
          <span style="font-size:12px;color:#a2a2a2;margin-left:12px">可为空</span>
        </el-form-item>
        <el-form-item label="单位：" prop="NumbericAttribute.NumberValueUnit" key="NumberValueUnit">
          <el-input style='width:120px' v-model.trim="ruleForm.NumbericAttribute.Unit"></el-input>
        </el-form-item>
        <el-form-item label="是否必填：" prop="NumbericAttribute.NumberIsRequired" key="NumberIsRequired">
          <el-checkbox class="checked-item" v-model="ruleForm.NumbericAttribute.IsRequired">必填项</el-checkbox>
        </el-form-item>
        <el-form-item label="显示宽度：" prop="NumbericAttribute.NumberShowWidth" key="NumberShowWidth">
          <el-radio-group v-model="ruleForm.NumbericAttribute.IsWidthAdaption">
            <el-radio :label="true">自动宽度</el-radio>
            <el-radio :label="false">
              <span>固定宽度</span>
              <el-input style='width:90px;margin-left:10px' :disabled='ruleForm.NumbericAttribute.IsWidthAdaption === true'
               v-model.number.trim="ruleForm.NumbericAttribute.DisplayWidth" maxlength="9"></el-input>
              <span style="font-size:12px;color:#a2a2a2;margin-left:6px">px</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义值：" prop="NumbericAttribute.NumberDefine" key="NumberDefine">
          <el-checkbox-group v-model="numberDefine">
            <el-checkbox label="staff">允许自定义</el-checkbox>
            <el-checkbox v-if="numberDefine.includes('staff')" label="customer">客户允许自定义</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="分段控制：" prop="NumbericAttribute.NumberValueLimit" v-if="numberDefine.includes('staff')" key="NumberValueLimit">
          <p style="font-size:12px;">
            <span style="color:#a2a2a2;margin-right:6px">（ -1代表无穷大 ）</span>
            <span class="blue-span" @click="onLimitAddClick"><i class="el-icon-plus"></i> 添加一行</span>
          </p>
          <ul class="limit-list-box">
            <li v-for="it in ruleForm.NumbericAttribute.SectionList" :key="it.key">
              <div>
                <el-input style='width:110px' v-model.trim="it.MinValue" maxlength="9"></el-input>
                <span class="text" style="margin:0 8px">＜值≤</span>
                <el-input style='width:110px' v-model.trim="it.MaxValue" maxlength="9"></el-input>
              </div>
              <div style="padding:0 32px">
                <span class="text" style="margin-right: 6px">增量</span>
                <el-input style='width:110px;margin-right:12px' v-model.trim="it.Increment" maxlength="9" :disabled='it.IsGeneralValue'></el-input>
                <el-checkbox class="checked-item" v-model="it.IsGeneralValue">符合常规数值</el-checkbox>
              </div>
              <span class="text del-btn" @click="onLimitDelClick(it.key)"><i></i> 删除</span>
            </li>
          </ul>
        </el-form-item>
      </template>
      <template v-if="ruleForm.Type==='Option'">
        <el-form-item label="" prop='OptionAttribute.OptionList' class="option-list-wrap" key="OptionList">
          <p>
            <el-button @click="onOptionItemAddClick"><i class="el-icon-plus"></i> 添加一行</el-button>
          </p>
          <div class="list-header">
              <span>默认</span>
              <span>显示</span>
              <span>数值</span>
              <span>客户隐藏</span>
              <span>操作</span>
            </div>
          <ul class="option-list-box">
            <transition-group>
              <li class="item" v-for="(it, i) in ruleForm.OptionAttribute.OptionList" :key="it.key">
                <el-radio
                 v-if="ruleForm.OptionAttribute.ChooseType === 'single'"
                 v-model="ruleForm.OptionAttribute.defaultSingleOption"
                 :label="it.key"
                 @click.native.stop='onDefaultOptionClick(i)'>
                </el-radio>
                <el-checkbox v-model="it.IsChecked" v-if="ruleForm.OptionAttribute.ChooseType === 'multiple'" class="multiple-box"></el-checkbox>
                <el-input style='width:187px' v-model.trim="it.Name"></el-input>
                <el-input style='width:110px' v-model.trim="it.Value"></el-input>
                <el-checkbox v-model="it.HiddenToCustomer"></el-checkbox>
                <div class="ctrl">
                  <span class="del-btn" @click="onOptionItemRemove(it.key)"><i></i> 删除</span>
                  <div>
                    <span v-show="i < ruleForm.OptionAttribute.OptionList.length - 1"  @click="onOptionMove('down', i)"><i class="el-icon-bottom"></i> 下移</span>
                  </div>
                  <div>
                    <span v-show="i > 0" @click="onOptionMove('up', i)"><i class="el-icon-top"></i> 上移</span>
                  </div>
                </div>
              </li>
            </transition-group>
          </ul>
        </el-form-item>
        <el-form-item label="显示宽度：" prop="OptionAttribute.OptionShowWidth" key="OptionShowWidth">
          <el-radio-group v-model="ruleForm.OptionAttribute.IsWidthAdaption">
            <el-radio :label="true">自动宽度</el-radio>
            <el-radio :label="false">
              <span>固定宽度</span>
              <el-input style='width:90px;margin-left:10px' maxlength="9"
               v-model.number.trim="ruleForm.OptionAttribute.DisplayWidth" :disabled='ruleForm.OptionAttribute.IsWidthAdaption === true'></el-input>
              <span style="font-size:12px;color:#a2a2a2;margin-left:6px">px</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义值：" prop="OptionAttribute.OptionValueDefine" class="option-define-box" key="OptionValueDefine">
          <el-checkbox-group v-model="optionDefine" :disabled="ruleForm.OptionAttribute.ChooseType==='multiple'">
            <el-checkbox label="staff">允许自定义</el-checkbox>
            <el-checkbox v-show="optionDefine.includes('staff')" label="customer">客户允许自定义</el-checkbox>
          </el-checkbox-group>
          <template v-if="optionDefine.includes('staff')">
            <span style="color: #585858">自定义数值：</span>
            <el-input style='width:90px' v-model.trim="ruleForm.OptionAttribute.CustomizeValue" maxlength="9"></el-input>
          </template>
        </el-form-item>
        <el-form-item label="选择方式：" prop="optionChooseType" key="optionChooseType">
          <el-radio-group v-model="ruleForm.OptionAttribute.ChooseType">
            <el-radio label="single">单选</el-radio>
            <el-radio label="multiple" :disabled="optionDefine.includes('staff')">多选</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="表现形式：" prop="OptionSelectMode" v-if="ruleForm.OptionAttribute.ChooseType === 'single'" key="OptionSelectMode">
          <el-radio-group v-model="ruleForm.OptionAttribute.SelectMode">
            <el-radio :label="it.ID" v-for="it in SelectModeEnum" :key="it.Name + '-' + it.ID">{{it.Name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否必填：" prop="OptionAttribute.OptionIsRequired" v-if="ruleForm.OptionAttribute.ChooseType === 'single'" key="OptionIsRequired">
          <el-checkbox class="checked-item" v-model="ruleForm.OptionAttribute.IsRequired">必填项</el-checkbox>
        </el-form-item>
        <el-form-item label="项数限制：" prop="OptionAttribute.UseTimes" key="optionUseTimes"
         class="use-times-box" v-if="ruleForm.OptionAttribute.ChooseType !== 'single'">
          <el-input style='width:110px' v-model.number.trim="ruleForm.OptionAttribute.UseTimes.MinValue" maxlength="9"></el-input>
          <span>≤ 项数 ≤</span>
          <el-input style='width:110px' v-model.number.trim="ruleForm.OptionAttribute.UseTimes.MaxValue" maxlength="9"></el-input>
          <span>项</span>
          <p class="tips-box" style="width:240px"><i class="el-icon-warning"></i> 不限制则不填写</p>
        </el-form-item>
      </template>
      <template v-if="ruleForm.Type==='Switch'">
        <el-form-item label="显示文字：" prop='SwitchAttribute.Words' key="SwitchAttributeWords">
          <el-input style='width:400px' v-model.trim="ruleForm.SwitchAttribute.Words"></el-input>
        </el-form-item>
        <el-form-item label="开值：" prop="SwitchAttribute.OpenValue" key="OpenValue">
          <el-input style='width:120px' v-model.trim="ruleForm.SwitchAttribute.OpenValue" maxlength="9"></el-input>
        </el-form-item>
        <el-form-item label="关值：" prop="SwitchAttribute.CloseValue" key="CloseValue">
          <el-input style='width:120px' v-model.trim="ruleForm.SwitchAttribute.CloseValue" maxlength="9"></el-input>
        </el-form-item>
        <el-form-item label="初始值：" prop="SwitchInitValue" class="switch-init-value-box" key="SwitchInitValue">
          <el-switch v-model="ruleForm.SwitchAttribute.DefaultOpen" active-text="初始开值"></el-switch>
          <p class="tips-box" style="width:240px"><i class="el-icon-warning"></i> 不选中则初始关值</p>
        </el-form-item>
        <div class="example-box">
          <p>
            <span>示例：</span>
          </p>
          <p>
            <span>名称：</span>
            <el-switch v-model='testCheck' active-text="显示文字"></el-switch>
          </p>
        </div>
      </template>
    </el-form>
    <ElementTempSelector :visible.sync='elementSelectorVisible' :list='commonList' @submit='onElementSelectClick' />
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import ElementClassType, { SelectModeEnum, TypeEnum } from '@/assets/js/TypeClass/ElementClass';
import ElementTempSelector from './ElementTempSelector.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    curData: {
      type: Object,
      default: null,
    },
    isCommon: {
      type: Boolean,
      default: false,
    },
    commonList: {
      type: Array,
      default: () => [],
    },
    PositionID: {
      type: String,
      default: '',
    },
  },
  components: {
    CommonDialogComp,
    ElementTempSelector,
  },
  data() {
    return {
      title: '添加界面元素',
      ruleForm: null,
      rules: { // 校验规则
        Name: [
          { required: true, message: '请输入元素名称', trigger: 'blur' },
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' },
        ],
        Type: [
          { validator: this.checkFormType, trigger: 'change' },
        ],
        NumbericAttribute: {
          AllowDecimal: [
            { validator: this.DecimalPointChange, trigger: 'change' },
          ],
          InputContent: [
            { validator: this.checkNumberValueList, trigger: 'blur' },
          ],
          NumberDefaultValue: [
            { validator: this.checkNumberDefaultValue, trigger: 'blur' },
          ],
          NumberValueUnit: [
            { validator: this.checkNumberValueUnit, trigger: 'blur' },
          ],
          NumberIsRequired: [
            { validator: this.checkNumberIsRequired, trigger: 'change' },
          ],
          NumberShowWidth: [
            { validator: this.checkNumberShowWidth, trigger: 'change' },
          ],
          NumberDefine: [
            { validator: this.checkNumberDefine, trigger: 'change' },
          ],
          NumberValueLimit: [ // 分段控制
            { validator: this.checkNumberValueLimit, trigger: 'change' },
          ],
        },
        OptionAttribute: {
          OptionShowWidth: [
            { validator: this.checkOptionShowWidth, trigger: 'change' },
          ],
          OptionValueDefine: [
            { validator: this.checkOptionValueDefine, trigger: 'change' },
          ],
          OptionIsRequired: [
            { validator: this.checkOptionIsRequired, trigger: 'blur' },
          ],
          OptionList: [
            { validator: this.checkOptionList, trigger: 'change' },
          ],
          UseTimes: [
            { validator: this.checkOptionUseTimes, trigger: 'blur' },
          ],
        },
        SwitchAttribute: {
          Words: [
            { required: true, message: '请输入显示文字', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
          ],
          OpenValue: [
            { required: true, message: '请设置开值数值', trigger: 'blur' },
            { validator: this.checkOpenValue, trigger: 'blur' },
          ],
          CloseValue: [
            { required: true, message: '请设置关值数值', trigger: 'blur' },
            { validator: this.checkCloseValue, trigger: 'blur' },
          ],
        },
      },
      elementSelectorVisible: false,
      SelectModeEnum,
      TypeEnum,
      TempData: null,
      testCheck: true,
    };
  },
  computed: {
    numberDefine: {
      get() {
        return this.ruleForm.NumbericAttribute.DefineList;
      },
      set(val) {
        if (val.includes('staff')) this.ruleForm.NumbericAttribute.DefineList = val;
        else this.ruleForm.NumbericAttribute.DefineList = [];
      },
    },
    optionDefine: {
      get() {
        return this.ruleForm.OptionAttribute.DefineList;
      },
      set(val) {
        if (val.includes('staff')) this.ruleForm.OptionAttribute.DefineList = val;
        else this.ruleForm.OptionAttribute.DefineList = [];
      },
    },
    curFormType() {
      return this.ruleForm && this.ruleForm.Type;
    },
    formatNumberValueList() {
      if (!this.ruleForm.NumbericAttribute.InputContent || typeof this.ruleForm.NumbericAttribute.InputContent !== 'string') return [];
      return this.$utils.getNumberValueList(this.ruleForm.NumbericAttribute.InputContent);
    },
  },
  methods: {
    // -------------------- ↓  表单校验相关
    checkFormType(rule, value, callback) {
      if (!value) {
        callback(new Error('请选择类型'));
        return;
      }
      if (value && !this.ruleForm.HiddenToCustomer) {
        callback();
        return;
      }
      if (this.ruleForm.Type === 'Option') {
        this.$refs.ruleForm.validateField('OptionAttribute.OptionValueDefine');
        this.$refs.ruleForm.validateField('OptionAttribute.OptionList');
      }
      if (this.ruleForm.Type === 'Numberic' && this.ruleForm.NumbericAttribute.IsRequired && !this.ruleForm.DefaultValue) {
        callback(new Error('元素必填时，隐藏运算值不可为空'));
        return;
      }
      if (this.ruleForm.Type === 'Option' && this.ruleForm.OptionAttribute.IsRequired && !this.ruleForm.DefaultValue) {
        callback(new Error('元素必填时，隐藏运算值不可为空'));
        return;
      }
      if (this.ruleForm.Type === 'Switch' && !this.ruleForm.DefaultValue) {
        callback(new Error('开关类型隐藏时，隐藏运算值不可为空'));
        return;
      }
      callback();
    },
    comonWidthCheck(type, callback) {
      if (this.ruleForm[type].IsWidthAdaption === false) {
        const num = this.ruleForm[type].DisplayWidth;
        if (!num) {
          callback(new Error('请设置固定宽度值（整数， 50 - 150）'));
          return;
        }
        if (num < 50 || num > 150 || !this.$utils.getValueIsOrNotNumber(num, true)) {
          callback(new Error('必须为50 - 150之间（包含）的整数类型'));
          return;
        }
      }
      callback();
    },
    // 下面为数值类型校验
    checkNumberValueList(rule, value, callback) { // 校验常规数值
      const _valueList = this.ruleForm.NumbericAttribute.InputContent;
      if (_valueList) {
        const _list = this.formatNumberValueList;
        const t = _list.find((val) => !this.$utils.getValueIsOrNotNumber(val, !this.ruleForm.NumbericAttribute.AllowDecimal)); // 获取到结果中不合法的子项目存在
        if (t) {
          callback(new Error('常规数值中存在不合法的项目，请检查（应为数字类型，不允许小数时必须为整数类型）'));
          return;
        }
        const len1 = _list.length;
        const len2 = [...new Set(_list)].length;
        if (len1 > len2) {
          callback(new Error('存在重复项，请检查'));
          return;
        }
      }
      this.$refs.ruleForm.validateField('NumbericAttribute.NumberValueLimit');
      this.$refs.ruleForm.validateField('NumbericAttribute.NumberDefaultValue');
      callback();
    },
    checkNumberDefaultValue(rule, value, callback) { // 校验默认选择
      if (!this.ruleForm.NumbericAttribute.CheckedValue) {
        callback();
        return;
      }
      if (!this.$utils.getValueIsOrNotNumber(this.ruleForm.NumbericAttribute.CheckedValue, !this.ruleForm.NumbericAttribute.AllowDecimal)) {
        const msg = !this.ruleForm.NumbericAttribute.AllowDecimal ? '请输入整数数字类型' : '请输入数字类型（允许小数）';
        callback(new Error(msg));
        return;
      }
      if (this.formatNumberValueList.length > 0) {
        if (!this.formatNumberValueList.includes(this.ruleForm.NumbericAttribute.CheckedValue)) {
          callback(new Error('默认选择数值应在常规数值范围内'));
          return;
        }
      }
      callback();
    },
    DecimalPointChange(rule, value, callback) { // 是否允许小数变动时 重新对常规数值和默认选择进行校验
      this.$refs.ruleForm.validateField('NumbericAttribute.InputContent');
      this.$refs.ruleForm.validateField('NumbericAttribute.NumberDefaultValue');
      callback();
    },
    checkNumberValueUnit(rule, value, callback) {
      if (this.ruleForm.NumbericAttribute.Unit && this.ruleForm.NumbericAttribute.Unit.length > 6) callback(new Error('最多可输入6个字符'));
      else callback();
    },
    checkNumberIsRequired(rule, value, callback) {
      if (!this.ruleForm.NumbericAttribute.IsRequired && this.ruleForm.NumbericAttribute.CheckedValue
       && this.ruleForm.NumbericAttribute.DefineList.length === 0) {
        callback(new Error('当前设置不允许自定义且默认选择不为空，此时，客户无法输入空值；请选中必填项，或者清空默认选择，或者允许自定义'));
        return;
      }
      callback();
    },
    checkNumberShowWidth(rule, value, callback) {
      this.comonWidthCheck('NumbericAttribute', callback);
    },
    checkNumberDefine(rule, value, callback) {
      this.$refs.ruleForm.validateField('NumbericAttribute.NumberIsRequired');
      callback();
    },
    checkNumberValueLimit(rule, value, callback) {
      if (this.ruleForm.NumbericAttribute.SectionList.length > 0) {
        let index = this.ruleForm.NumbericAttribute.SectionList.findIndex(it => !it.MinValue || !it.MaxValue || (!it.IsGeneralValue && !it.Increment));
        if (index >= 0) {
          callback(new Error('请填写信息'));
          return;
        }
        index = this.ruleForm.NumbericAttribute.SectionList.findIndex(it => it.MinValue && it.MinValue < 0);
        if (index >= 0) {
          callback(new Error('最小值不能小于0'));
          return;
        }
        index = this.ruleForm.NumbericAttribute.SectionList.findIndex(it => (
          !this.$utils.getValueIsOrNotNumber(it.MinValue, !this.ruleForm.NumbericAttribute.AllowDecimal)
         || !this.$utils.getValueIsOrNotNumber(it.MaxValue, !this.ruleForm.NumbericAttribute.AllowDecimal)
         || (!it.IsGeneralValue && !this.$utils.getValueIsOrNotNumber(it.Increment, !this.ruleForm.NumbericAttribute.AllowDecimal))));
        if (index >= 0) {
          callback(new Error('输入值必须为数字类型，在不允许小数时应为整数类型'));
          return;
        }
        index = this.ruleForm.NumbericAttribute.SectionList.findIndex(it => +it.MaxValue <= +it.MinValue && it.MaxValue !== '-1');
        if (index >= 0) {
          callback(new Error('分段范围值中后面值不能小于等于前面值'));
          return;
        }
        index = this.ruleForm.NumbericAttribute.SectionList.findIndex(it => !it.IsGeneralValue && it.Increment <= 0);
        if (index >= 0) {
          callback(new Error('增量必须大于0'));
          return;
        }
        index = this.ruleForm.NumbericAttribute.SectionList.findIndex(it => !it.IsGeneralValue
         && it.Increment > +it.MaxValue - +it.MinValue && it.MaxValue !== '-1');
        if (index >= 0) {
          callback(new Error('请检查增量，增量值不能大于所在行最大值减去最小值的差值'));
          return;
        }
        index = this.ruleForm.NumbericAttribute.SectionList.findIndex(it => {
          if (!it.IsGeneralValue) return false;
          if (this.formatNumberValueList.length === 0) return true;
          const _target = this.formatNumberValueList.find(val => +val > +it.MinValue && (it.MaxValue === '-1' || +val <= +it.MaxValue));
          if (!_target) return true;
          return false;
        });
        if (index >= 0) {
          callback(new Error('在该设置范围内，没有符合的常规数值'));
          return;
        }
      }
      callback();
    },
    // 下面为选项类型校验
    checkOptionShowWidth(rule, value, callback) {
      this.comonWidthCheck('OptionAttribute', callback);
    },
    checkOptionValueDefine(rule, value, callback) {
      this.$refs.ruleForm.validateField('OptionAttribute.OptionIsRequired');
      if (this.ruleForm.OptionAttribute.OptionList.length === 0 && !this.ruleForm.OptionAttribute.DefineList.includes('staff')) {
        callback(new Error('选项值数量为0时，必须允许自定义'));
        return;
      }
      if (this.ruleForm.OptionAttribute.OptionList.filter(it => !it.HiddenToCustomer).length === 0
        && !this.ruleForm.OptionAttribute.DefineList.includes('customer')
        && !this.ruleForm.HiddenToCustomer) {
        callback(new Error('客户无可选选项且不允许客户自定义时，请选中【客户界面隐藏】或修改选项客户隐藏或客户自定义配置'));
        return;
      }
      if (this.ruleForm.OptionAttribute.DefineList.includes('staff')) {
        if (!this.ruleForm.OptionAttribute.CustomizeValue) {
          callback(new Error('请输入自定义数值'));
          return;
        }
        if (!this.$utils.getValueIsOrNotNumber(this.ruleForm.OptionAttribute.CustomizeValue)) {
          callback(new Error('自定义数值应为数字类型'));
          return;
        }
      }
      callback();
    },
    checkOptionIsRequired(rule, value, callback) {
      if (!this.ruleForm.OptionAttribute.IsRequired && this.ruleForm.OptionAttribute.defaultSingleOption
       && this.ruleForm.OptionAttribute.DefineList.length === 0 && this.ruleForm.OptionAttribute.ChooseType === 'single') {
        callback(new Error('单选不允许自定义的选择项在有默认选项时，无法选择空值，请去掉默认选项，或者选中必填项，或者允许自定义'));
        return;
      }
      callback();
    },
    checkOptionList(rule, value, callback) {
      let t = this.ruleForm.OptionAttribute.OptionList.find(it => !it.HiddenToCustomer);
      if (!t && !this.ruleForm.HiddenToCustomer && this.ruleForm.OptionAttribute.OptionList.length > 0) {
        callback(new Error('客户界面至少显示一个选择项，如果不希望客户选择，请勾选“客户界面隐藏”勾选项'));
        return;
      }
      t = this.ruleForm.OptionAttribute.OptionList.find(it => !it.Name);
      if (!t) t = this.ruleForm.OptionAttribute.OptionList.find(it => !it.Value);
      if (t) {
        callback(new Error('请填写内容'));
        return;
      }
      t = this.ruleForm.OptionAttribute.OptionList.find(it => !this.$utils.getValueIsOrNotNumber(it.Value));
      if (t) {
        callback(new Error('数值应为数字类型，请检查输入'));
        return;
      }
      if (this.ruleForm.OptionAttribute.ChooseType === 'multiple' && this.ruleForm.OptionAttribute.UseTimes.MaxValue) {
        const checkedLen = this.ruleForm.OptionAttribute.OptionList.filter(it => it.IsChecked).length;
        if (checkedLen > this.ruleForm.OptionAttribute.UseTimes.MaxValue) {
          callback(new Error('勾选默认选项数量不能大于最大项数限制数量'));
          return;
        }
      }
      const list = this.ruleForm.OptionAttribute.OptionList.map(it => it.Name);
      const len1 = list.length;
      if (len1 > 1) {
        const len2 = [...new Set(list)].length;
        if (len1 > len2) {
          callback(new Error('选项显示内容重复，请检查'));
          return;
        }
      }
      callback();
    },
    checkOptionUseTimes(rule, value, callback) {
      if (!value) {
        callback(new Error('未获取到值信息'));
        return;
      }
      const { MinValue, MaxValue } = value;
      if ((MinValue || MinValue === 0) && (MaxValue || MaxValue === 0)) {
        const max = this.ruleForm.OptionAttribute.OptionList.length;
        if (MinValue < 0 || MaxValue <= 0) {
          callback(new Error('项数限制数量最小值不能小于0，最大值必须大于0'));
          return;
        }
        if (MinValue > max || MaxValue > max) {
          callback(new Error(`项数限制数量不能超过当前选项值总数量：${max}`));
          return;
        }
        if (MaxValue < MinValue) {
          callback(new Error('最大项数限制数量不能小于最小值'));
          return;
        }
        this.$refs.ruleForm.validateField('OptionAttribute.OptionList');
        callback();
        return;
      }
      if ((MinValue || MinValue === 0) || (MaxValue || MaxValue === 0)) {
        callback(new Error('请补充信息'));
        return;
      }
      callback();
    },
    // 下面为开关类型校验
    // -------------------- ↑  表单校验相关
    checkNumberType(value) {
      if (!this.$utils.getValueIsOrNotNumber(value)) {
        return false;
      }
      return true;
    },
    checkOpenValue(rule, value, callback) {
      if (!this.checkNumberType(value)) {
        callback(new Error('请输入数字类型'));
        return;
      }
      if (value === this.ruleForm.SwitchAttribute.CloseValue) {
        callback(new Error('开值和关值不能重复'));
        return;
      }
      this.$refs.ruleForm.validateField('SwitchAttribute.CloseValue');
      callback();
    },
    checkCloseValue(rule, value, callback) {
      if (!this.checkNumberType(value)) {
        callback(new Error('请输入数字类型'));
        return;
      }
      if (value === this.ruleForm.SwitchAttribute.OpenValue) {
        callback(new Error('开值和关值不能重复'));
        return;
      }
      callback();
    },
    async onSubmit() {
      const validateBool = await this.$refs.ruleForm.validate().catch(() => {});
      if (validateBool) {
        const _data = ElementClassType.formatSubmitData(this.ruleForm);
        this.$emit('submit', _data);
      }
    },
    onCancle() {
      // // 暂时用于尝试更新
      // const Name = Math.random().toFixed(3);
      // const Type = Math.round(Math.random() * 3);
      // this.ruleForm = new ElementClassType({ Name, Type });
      this.$emit('update:visible', false);
    },
    initEditData(data) {
      this.ruleForm = new ElementClassType(data || this.curData, this.PositionID);
      if (this.curData) this.title = '编辑界面元素';
      else this.title = '添加界面元素';
    },
    onOpen() {
      this.TempData = null;
      this.$nextTick(this.initEditData);
    },
    onClosed() {
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
    },
    onElementSelectClick(data) {
      this.TempData = { ...data, ID: this.curData ? this.curData.ID : '' };
      this.initEditData(this.TempData);
    },
    handleToBottomScroll(selectStr) {
      const oWrap = document.querySelector(selectStr);
      this.$utils.animateScroll(oWrap.scrollTop, oWrap.scrollHeight, (num) => { oWrap.scrollTop = num; });
    },
    onLimitAddClick() { // 数字值分段控制添加行方法
      const key = this.$utils.getRandomRangeId(8);
      const _temp = {
        ID: '',
        MinValue: '',
        MaxValue: '',
        Increment: '',
        IsGeneralValue: false, // 符合常规数值
        key,
      };
      this.ruleForm.NumbericAttribute.SectionList.push(_temp);
      this.$nextTick(() => this.handleToBottomScroll('.mp-erp-comps-element-template-element-dialog-comp-wrap .el-dialog__body'));
    },
    onLimitDelClick(key) { // 删除数字分段项
      this.ruleForm.NumbericAttribute.SectionList = this.ruleForm.NumbericAttribute.SectionList.filter(it => it.key !== key);
      this.$refs.ruleForm.validateField('NumbericAttribute.NumberValueLimit');
    },
    onOptionItemAddClick() { // 添加选项值行
      const key = this.$utils.getRandomRangeId(8);
      const Index = this.ruleForm.OptionAttribute.OptionList.length;
      const _temp = {
        ID: '',
        Name: '',
        Value: '',
        HiddenToCustomer: false,
        IsChecked: false,
        Index,
        key,
      };
      this.ruleForm.OptionAttribute.OptionList.push(_temp);
      this.$refs.ruleForm.validateField('OptionAttribute.OptionList');
      this.$refs.ruleForm.validateField('OptionAttribute.OptionValueDefine');
      this.$nextTick(() => this.handleToBottomScroll('.mp-erp-comps-element-template-element-dialog-comp-wrap .el-dialog__body .option-list-box'));
    },
    onOptionItemRemove(key) { // 删除选项值
      this.ruleForm.OptionAttribute.OptionList = this.ruleForm.OptionAttribute.OptionList.filter(it => it.key !== key);
      this.$nextTick(() => {
        this.$refs.ruleForm.validateField('OptionAttribute.OptionList');
      });
    },
    onOptionMove(type, index) { // 排序
      const [item] = this.ruleForm.OptionAttribute.OptionList.splice(index, 1);
      const newIndex = type === 'up' ? index - 1 : index + 1;
      this.ruleForm.OptionAttribute.OptionList.splice(newIndex, 0, item);
      this.ruleForm.OptionAttribute.OptionList.forEach((it, i) => {
        const _it = it;
        _it.Index = i;
      });
    },
    onDefaultOptionClick(i) {
      if (this.ruleForm.OptionAttribute.OptionList[i].key === this.ruleForm.OptionAttribute.defaultSingleOption) {
        setTimeout(() => {
          this.ruleForm.OptionAttribute.defaultSingleOption = '';
        });
      }
    },
    onTemplateSelect() {
      this.elementSelectorVisible = true;
    },
  },
  watch: {
    curFormType(newVal) {
      if (newVal) {
        if (this.$refs.ruleForm) this.$refs.ruleForm.clearValidate();
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-element-template-element-dialog-comp-wrap {
  > .el-dialog {
    > .el-dialog__body {
      height: 706px;
      overflow-y: auto;
      padding-bottom: 0;
      padding-top: 20px;
      // padding: 20px 35px 0;
      color: #585858;
      .element-ruleForm {
        // ------------ ↓  部分通用样式设置
        .el-input {
          height: 30px;
          .el-input__inner {
            height: 30px;
            line-height: 30px;
            // padding-right: 60px;
            border-radius: 3px;
          }
        }
        .el-form-item__label {
          color: #888E99;
          &::before {
            display: none;
          }
        }
        .el-checkbox__label {
          font-size: 12px;
          color: #585858;
        }
        .el-radio__label {
          font-size: 12px;
        }
        .checked-box {
          height: 30px;
          line-height: 30px;
          .checked-item {
            height: 30px;
            line-height: 30px;
          }
        }
        .del-btn {
          font-size: 12px;
          user-select: none;
          > i {
            display: inline-block;
            width: 12px;
            height: 28px;
            vertical-align: top;
            margin-right: 5px;
            background: url(../../assets/images/del.png) no-repeat center center/12px 16px;
          }
          cursor: pointer;
          transition: color 0.05s ease-in-out;
          &:hover {
            color: #444 !important;
          }
        }
        .el-switch__label {
          // line-height: 16px;
          span{
            font-size: 12px;
            color: #585858;
          }
        }
        .el-form-item__error {
          padding-top: 2px;
        }
        // ------------ ↑

        .element-name-box {
          > div {
            .el-input {
              width: 350px;
            }
            > span {
              font-size: 12px;
              margin: 0 10px;
            }
            .el-checkbox {
              line-height: 33px;
            }
          }
        }
        .hidden-content-box {
          display: flex;
          color: #585858;
          > div:last-of-type {
            font-size: 12px;
            margin-left: 40px;
            .el-input {
              width: 90px;
            }
          }
        }
        .tips-box {
          width:584px;
          background: #FFFBF6;
          border-radius: 3px;
          height: 28px;
          color:rgba(244,163,7, 0.7);
          font-size:12px;
          padding-left:16px;
          // margin-top: 12px;
          line-height: 26px;
          i {
            font-size: 14px;
            position: relative;
            top: 1px;
            margin-right: 10px;
          }
        }
        ul.limit-list-box {
          > li {
            display: flex;
            margin-top: 10px;
            span.text {
              font-size: 13px;
              color: #A2A2A2;
            }
            > span.text.del-btn {
              line-height: 28px;
              margin-left: 10px;
            }
          }
        }
        .tip-wrap {
          margin-bottom: 20px;
        }
        // ----------------- ↓ 选项
        .option-list-wrap {
          .el-form-item__content {
            > p {
              > button {
                &:not(:active) {
                  color: #26bcf9;
                  border-color: #26bcf9;
                }
              }
              margin-bottom: 20px;
            }
            > .list-header {
                color: #a2a2a2;
                font-size: 14px;
                height: 36px;
                line-height: 34px;
                position: relative;
                display: flex;
                margin-bottom: 2px;
                &::after {
                  content: '';
                  position: absolute;
                  height: 1px;
                  width: 100%;
                  background-color: #eee;
                  bottom: 0;
                  left: -25px;
                }
                > span {
                  text-align: center;
                  flex: none;
                  &:first-of-type {
                    width: 45px;
                    text-align: left;
                  }
                  &:nth-of-type(2) {
                    width: 200px;
                  }
                  &:nth-of-type(3) {
                    width: 120px;
                  }
                  &:nth-of-type(4) {
                    width: 112px;
                  }
                  &:last-of-type {
                    width: 200px;
                  }
                }
              }
            > .option-list-box {
              max-height: 210px;
              overflow-y: auto;
              .item {
                display: flex;
                padding-top: 10px;
                height: 32px;
                overflow: hidden;
                > .ctrl {
                  font-size: 12px;
                  user-select: none;
                  color: #A2A2A2;
                  width: 180px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  > div {
                    width: 46px;
                    > span {
                      cursor: pointer;
                      transition: color 0.05s ease-in-out;
                      &:hover {
                        color: #444;
                      }
                      > i {
                        font-size: 18px;
                        color: #1dc742;
                        position: relative;
                        top: 3px;
                      }
                    }
                  }
                }
                > .el-radio {
                  margin-right: 35px;
                  line-height: 30px;
                  .el-radio__label {
                    display: none;
                  }
                }
                > .el-input {
                  margin-right: 15px;
                }
                > .el-checkbox {
                  margin-left: 33px;
                  margin-right: 80px;
                  &.multiple-box {
                    margin-left: 0px;
                    margin-right: 35px;
                  }
                }
              }
            }
          }
        }
        .option-define-box .el-form-item__content {
          display: flex;
          justify-content: flex-start;
          > span {
            font-size: 12px;
            margin-left: 27px;
          }
        }
        .example-box {
          border-top: 1px solid #eee;
          margin: 0 15px;
          margin-top: 40px;
          padding-top: 30px;
          > p {
            display: flex;
            align-items: center;
            > span {
              width: 72px;
              text-align: right;
              color: #888E99;
              margin-right: 12px;
            }
            &:first-of-type {
              margin-bottom: 25px;
              > span {
                font-size: 16px;
                width: 73px;
                font-weight: bold;
              }
            }
            > .el-switch {
              .el-switch__label {
                line-height: 20px;
              }
            }
          }
        }
        .use-times-box {
          .el-form-item__content {
            font-size: 12px;
            > span {
              margin: 0 10px;
              color: #585858;
            }
            > p {
              display: inline-block;
              margin-left: 12px;
            }
          }
        }
        .switch-init-value-box {
          .el-form-item__content {
            display: flex;
            align-items: center;
            .tips-box {
              margin-top: 0;
              margin-left: 16px;
            }
          }
        }
      }
    }
    > .el-dialog__footer {
      padding-bottom: 10px;
      padding-top: 5px;
    }
  }
  &.mp-erp-common-dialog-comp-wrap .el-dialog__footer > .dialog-footer {
    // padding-bottom: 20px;
    > button {
      height: 35px;
      border-radius: 3px;
      &.el-button--default {
        border-color: #26bcf9;
        color: #26bcf9;
        &:active {
          border-color: #428dfa;
        }
      }
      &.el-button--primary {
        background: linear-gradient(to right, #26bcf9, #35dff9);
        border: none;
        &:hover {
          opacity: 0.88;
        }
        &:active {
          background: linear-gradient(to right, #428dfa, #26bcf9);
        }
      }
    }
  }

  // .v-enter,.v-leave-to{
  //   opacity: 0;
  //   transform: translateY(80px);
  // }

  // .v-enter-active,.v-leave-active{
  //   transition: all 0.3s ease;
  // }

  .v-move{
    transition: all 0.3s ease;
  }
  // .v-leave-active{
  //   position: absolute;
  // }
}
</style>
