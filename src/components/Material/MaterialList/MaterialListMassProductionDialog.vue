<template>
  <CommonDialogComp
    width="800px"
    top='15vh'
    :title="title"
    :visible.sync="visible"
    submitText='追加生成'
    showDanger
    @submit="onAddSubmit"
    @danger='onAfreshSubmit'
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-material-size-save-dialog-comp-wrap"
  >
    <template v-if="curMaterialType">
      <SingleElementComp v-model="list[i]" v-for="(it,i) in curMaterialType.ElementList" :key="it.ID" :Element='it' />
    </template>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import { checkNumberSectionList } from '@/assets/js/checker/index';
import SingleElementComp from './SingleElementComp.vue';
// import MaterialSizeClass from '@/assets/js/TypeClass/MaterialSizeClass';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    curMaterialType: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
    SingleElementComp,
  },
  data() {
    return {
      title: '生成规则',
      list: [],
    };
  },
  methods: {
    onAddSubmit() { // 原来基础添加
      this.setSubmit('append');
    },
    onAfreshSubmit() { // 重新生成
      this.setSubmit('refresh');
    },
    checkValueChecker() {
      const list = [];
      this.list.forEach(it => {
        if (it.checkList.length === 0 && (!it.customChecked || !it.customValue)) {
          let required = false;
          if (it.Element.Type === 1 && it.Element.NumbericAttribute?.IsRequired) required = true;
          if (it.Element.Type === 2 && it.Element.OptionAttribute?.IsRequired) required = true;
          if (required) list.push(it.Element.Name);
        }
      });
      if (list.length > 0) {
        this.messageBox.failSingleError('保存失败！', `${list.join('、')}未选中有效内容`);
        return false;
      }
      let t = this.list.find(it => {
        if (!it.customChecked || !it.customValue) return false;
        return !this.$utils.getValueIsOrNotNumber(it.customValue, it.Element.Type === 1 && !it.Element.NumbericAttribute.AllowDecimal);
      });
      if (t) {
        this.messageBox.failSingleError('保存失败！', `${t.Element.Name}自定义值无效，请检查是否为数字类型或是否限定为整数类型`);
        return false;
      }
      t = this.list.find(it => {
        if (it.Element.Type === 1 && it.customChecked && it.customValue) {
          if (it.checkList.includes(+it.customValue)) return true;
          // 判断数字类型时 自定义值是否与选项数值重复
        }
        return false;
      });
      if (t) {
        this.messageBox.failSingleError('保存失败！', `${t.Element.Name}自定义值重复`);
        return false;
      }
      // 判断数字类型时 自定义值是否符合规则 --- 完成判断 ↓
      t = this.list.find(it => {
        if (it.Element.Type === 1 && it.customChecked && it.customValue) {
          const { SectionList, InputContent } = it.Element.NumbericAttribute;
          if (SectionList && Array.isArray(SectionList) && SectionList.length > 0) {
            const valueList = this.$utils.getNumberValueList(InputContent);
            if (valueList.includes(`${it.customValue}`)) {
              return false;
            }
            const msg = checkNumberSectionList(it.customValue, SectionList, valueList);
            return !!msg;
          }
        }
        return false;
      });
      if (t) {
        this.messageBox.failSingleError('保存失败！', `${t.Element.Name}自定义值不正确，请检查其分段控制`);
        return false;
      }
      return true;
    },
    getArrayFromCheckObj({ Element, checkList, customChecked, customValue }) { // 转换checkObj为数组形式
      const { ID, Type, Unit, OptionAttribute, SwitchAttribute } = Element;
      const _list = [...checkList];
      if (customChecked && customValue) _list.push(customValue);
      return _list.map(it => {
        let Third = it;
        if (Type === 1) Third = Unit ? `${Third}${Unit}` : Third; // 数值类型 附上单位Unit
        else if (Type === 2) { // 选项值
          const { OptionList } = OptionAttribute;
          const t = OptionList.find(_it => _it.ID === it);
          if (t) Third = t.Name;
        } else if (Type === 3) { // 开关
          const { OpenValue, CloseValue } = SwitchAttribute;
          if (it === OpenValue) Third = '开';
          if (it === CloseValue) Third = '关';
        }
        return ({ First: ID, Second: it, Third });
      });
    },
    setSubmit(type) { // type: append | refresh
      if (this.checkValueChecker()) { // 弹窗校验通过
        const _array = this.list.map(it => this.getArrayFromCheckObj(it)).filter(it => it.length > 0);
        let set = [];
        if (_array.length === 1) {
          _array[0].forEach(it => { set.push([it]); });
        } else {
          set = this.$utils.calcDescartes(_array);
        }
        const ElementList = set.map(it => ({
          First: '',
          Second: it,
          key: Math.random().toString(32).slice(-8),
          repeat: false,
        }));
        this.$emit('submit', { type, ElementList });
        this.onCancle();
      }
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.$emit('close');
      this.list = [];
    },
    initEditData() { // 数据初始化
      if (!this.curMaterialType) return;
      this.curMaterialType.ElementList.forEach(it => {
        const _temp = {
          checkList: [],
          customChecked: false,
          customValue: '',
          Element: it,
        };
        this.list.push(_temp);
      });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-material-size-save-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 50px;
    height: 460px;
    overflow-y: auto;
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
  }

  // 公共部分
  &.mp-erp-common-dialog-comp-wrap .el-dialog__footer > .dialog-footer {
    padding-bottom: 20px;
    > button + button {
      margin-left: 40px;
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
