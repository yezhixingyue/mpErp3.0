<template>
  <CommonDialogComp
    width="720px"
    top='15vh'
    :title="title"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-material-size-save-dialog-comp-wrap"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="208px"
      class="ruleForm"
      size='small'
      v-if="curMaterialType && ruleForm"
    >
      <el-form-item :label="`${it.Name}：`" :prop="it.ID" v-for="it in ElementList" :key='it.ID'>
        <el-input style="width:178px" v-model.trim="ruleForm[it.ID]" v-if="it.Type === 1 && !it.NumbericAttribute.InputContent"></el-input>
        <el-select
          v-if="it.Type === 1 && it.NumbericAttribute.InputContent"
          v-model="ruleForm[it.ID]"
          filterable
          default-first-option
          @blur="(e) => onNumberInpBlur(e, it.ID)"
          @focus="(e) => onNumberInpFocus(e, it.ID)"
          placeholder='请选择或输入数字'
          allow-create>
          <el-option
            v-for="item in getNumberOptions(it.NumbericAttribute.InputContent)"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-model="ruleForm[it.ID]" placeholder="请选择" v-if="it.Type === 2 && it.OptionAttribute.OptionList.length > 3">
          <el-option
            v-for="item in it.OptionAttribute.OptionList"
            :key="item.ID"
            :label="item.Name"
            :value="item.ID">
          </el-option>
        </el-select>
        <el-radio-group v-model="ruleForm[it.ID]" v-if="it.Type === 2 && it.OptionAttribute.OptionList.length <= 3">
          <el-radio v-for="item in it.OptionAttribute.OptionList" :key="item.ID" :label="item.ID">{{item.Name}}</el-radio>
        </el-radio-group>
        <el-switch v-model="ruleForm[it.ID]" v-if="it.Type === 3" :active-text="it.SwitchAttribute.Words"></el-switch> <!-- 需转换布尔值为开值和关值 -->
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
// import MaterialSizeClass from '@/assets/js/TypeClass/MaterialSizeClass';

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
    curMaterialType: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      title: '添加物料',
      TypeID: '',
      ElementList: [],
      ruleForm: null,
      rules: null,
      ID: '',
    };
  },
  methods: {
    async onSubmit() {
      const validateBool = await this.$refs.ruleForm.validate().catch(() => {});
      if (validateBool) {
        // console.log('表单通过', this.ruleForm); // 此处应该转换为开关类型的数据格式 ( 布尔值转换为开值和关值 )
        const _Element = { ...this.ruleForm };
        this.ElementList.forEach(it => {
          if (it.Type === 3 && typeof _Element[it.ID] === 'boolean') {
            _Element[it.ID] = _Element[it.ID] ? it.SwitchAttribute.OpenValue : it.SwitchAttribute.CloseValue;
          }
          if (it.Type === 1 && _Element[it.ID] && typeof _Element[it.ID] === 'string') {
            _Element[it.ID] = +_Element[it.ID];
          }
        });
        const First = this.ID || '';
        const Second = [];
        Object.keys(_Element).forEach(key => {
          Second.push({
            First: key,
            Second: _Element[key],
          });
        });
        const _temp = {
          TypeID: this.TypeID,
          ElementList: [{
            First,
            Second,
          }],
        };
        const resp = await this.api.getMaterialSave(_temp).catch(() => {});
        if (resp && resp.status === 200 && resp.data.Status === 1000) {
          const cb = () => {
            const isEdit = !!First;
            const _tempData = {
              ID: First || resp.data.Data,
              Type: {
                ...this.curMaterialType,
                ElementList: this.curMaterialType.ElementList.map(it => this.transformSaveElementData(it, _temp)),
              },
            };
            this.handleSaveSuccess(isEdit, _tempData);
          };
          this.messageBox.successSingle(`${this.title}成功`, cb, cb);
        }
      }
    },
    transformSaveElementData(item, data) {
      const { ElementList } = data;
      const { ID } = item;
      let CustomerInputValue = '';
      const t = ElementList[0].Second.find(it => it.First === ID);
      if (t) CustomerInputValue = t.Second;
      return {
        ...item,
        CustomerInputValue,
      };
    },
    handleSaveSuccess(isEdit, data) {
      this.$emit('submitSuccess', isEdit, data);
      this.onCancle();
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.ruleForm = null;
      this.ElementList = [];
      this.rules = null;
      this.ID = '';
      this.TypeID = '';
      this.$emit('close');
    },
    initEditData() { // 数据初始化
      if (!this.curMaterialType) return;
      const { ElementList, ID } = this.curMaterialType;
      this.TypeID = ID;
      this.ID = this.curData ? this.curData.ID : '';
      this.ElementList = ElementList;
      const _temp = {};
      const _tempRules = {};
      ElementList.forEach(it => {
        let _value;
        if (this.curData) {
          // 为 value 赋值 分开关和其它类型
          const t = this.curData.Type.ElementList.find(_it => _it.ID === it.ID);
          if (t) {
            if (t.Type === 1) _value = +t.CustomerInputValue;
            if (t.Type === 2) _value = t.CustomerInputValue;
            if (t.Type === 3) {
              const { OpenValue } = t.SwitchAttribute;
              _value = +t.CustomerInputValue === OpenValue;
            }
          } else {
            _value = it.Type === 3 ? it.SwitchAttribute.DefaultOpen : '';
          }
        } else {
          _value = it.Type === 3 ? it.SwitchAttribute.DefaultOpen : '';
        }
        _temp[it.ID] = _value; // 如果为编辑模式 则在此进行赋值
        _tempRules[it.ID] = [{
          validator: (rule, value, callback) => this.checkValidator(rule, value, callback, it), trigger: it.Type === 1 ? 'blur' : 'change',
        }];
        if (it.Type !== 3) {
          const message = it.Type === 1 ? `请输入${it.Name}` : `请选择${it.Name}`;
          const trigger = it.Type === 1 && !it.NumbericAttribute.InputContent ? 'blur' : 'change';
          _tempRules[it.ID].unshift(
            { required: true, message, trigger },
          );
        }
      });
      this.ruleForm = _temp;
      this.rules = _tempRules;
      this.title = this.curData ? '编辑物料' : '添加物料';
      // ID 编辑模式
    },
    getNumberOptions(InputContent) {
      if (!InputContent) return [];
      const valueList = this.$utils.getNumberValueList(InputContent);
      return valueList;
    },
    checkValidator(rule, value, callback, target) {
      const { Type, NumbericAttribute } = target;
      if (Type !== 1) callback();
      else {
        // 判断值类型是否符合规范
        const { AllowDecimal, SectionList, InputContent } = NumbericAttribute;
        const isConformNumberType = this.$utils.getValueIsOrNotNumber(+value, !AllowDecimal);
        if (!isConformNumberType) {
          callback(`输入值错误，请输入正确的数字类型（${AllowDecimal ? '允许小数' : '不允许小数'}）`);
        } else if (SectionList && Array.isArray(SectionList) && SectionList.length > 0) {
          const valueList = this.$utils.getNumberValueList(InputContent);
          if (valueList.includes(`${value}`)) {
            callback();
            return;
          }
          for (let i = 0; i < SectionList.length; i += 1) {
            const section = SectionList[i];
            const { MinValue, MaxValue, IsGeneralValue, Increment } = section;
            if (+value > MinValue && (+value <= MaxValue || MaxValue === -1)) { // 符合范围区间 进入判断
              if (!IsGeneralValue && (+value - MinValue) % Increment !== 0) {
                callback(new Error(`输入值不合法，（${MinValue}, ${MaxValue}]区间内应符合增量为${Increment}`));
                return;
              }
              if (IsGeneralValue) {
                callback(new Error(`输入值不合法，（${MinValue}, ${MaxValue}]区间内应从${InputContent}对应区间中取值`));
                return;
              }
            }
          }
        }
        callback();
      }
    },
    // eslint-disable-next-line no-unused-vars
    onNumberInpBlur(e, key) {
      // if (e.target.value !== this.ruleForm[key]) {
      //   this.ruleForm[key] = e.target.value;
      // }
    },
    // eslint-disable-next-line no-unused-vars
    onNumberInpFocus(e, key) {
      // console.log(e.target, e.target.value, key, this.ruleForm[key]);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-material-size-save-dialog-comp-wrap {

  .el-dialog__body {
    .tips-box {
      margin-top: 6px;
      width: 500px;
    }
    .size-content {
      padding-bottom: 10px;
      span.text {
        margin: 0 10px;
        color: #A2A2A2;
      }
      input {
        text-align: center;
      }
    }
    .el-switch__label > span {
      font-size: 12px;
      color: #585858;
    }
  }

  // 公共部分
  &.mp-erp-common-dialog-comp-wrap .el-dialog__footer > .dialog-footer {
    padding-bottom: 20px;
    > button {
      height: 35px;
      border-radius: 3px;
      &.el-button--default {
        border-color: #26bcf9;
        color: #26bcf9;
        &:active {
          border-color: #428dfa;
          color: #428dfa;
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
  .el-form-item__label {
    color: #888E99;
    &::before {
      display: none;
    }
  }
  .el-form-item__content {
    font-size: 12px;
    color: #585858;
  }
  input {
    border-radius: 3px;
    font-size: 12px;
    height: 30px !important;
    line-height: 30px !important;
  }
  .el-checkbox__label {
    font-size: 12px;
  }
  .el-col {
    height: 34px;
  }
  .el-radio__label {
    font-size: 12px;
  }
}
</style>
