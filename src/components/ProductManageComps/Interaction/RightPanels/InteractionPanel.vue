<template>
  <ul class="mp-erp-product-module-interaction-interaction-panel-container">
    <li v-for="(it, i) in localList" :key="it.StoredContent">
      <!-- 删除 -->
      <div class="del" @click="onRemoveClick(i)">
        <img src="@/assets/images/del.png" alt="">
        <span>删除</span>
      </div>
      <!-- 关系 -->
      <div class="operator">
        <el-select v-model="it.Operator" v-if="it.OperatorOptions.length > 1" placeholder="请选择" size="mini">
          <el-option v-for="item in it.OperatorOptions" :key="item.ID" :label="item.Name" :value="item.ID"></el-option>
        </el-select>
        <span v-if="it.OperatorOptions.length === 1">{{it.OperatorOptions[0].Name}}</span>
      </div>
      <!-- 名称 -->
      <span class="name" :title="it.TipsContent || it.ShowName">{{it.ShowName}}</span>
      <!-- 结果 -->
      <div class="result">
        <!-- 元素 | 元素组 -->
        <div v-if="it.ResultType === 'element' || it.ResultType === 'group'" class="element">
          <label v-if="it.ResultType === 'element'">以此值运算：</label> <!-- 元素 -->
          <label v-else>所有元素以此值运算：</label> <!-- 元素组 -->
          <el-input size="mini" v-model.trim="it.DefaultValue" ></el-input>
          <span v-if="it.Unit">{{it.Unit}}</span>
        </div>
        <!-- 选项  多选 | 单选 -->
        <div v-if="it.ResultType === 'radio' || it.ResultType === 'multi-select'" class="select">
          <el-checkbox-group v-model="it.checkList" v-if="it.OptionList.length < 4">
            <el-checkbox v-for="it in it.OptionList" :key="it.First" :label="it.First" :title="it.Second">{{it.Second}}</el-checkbox>
          </el-checkbox-group>
          <div class="multiple" v-else>
            <span class="blue-span" @click="onSelectDialogClick">选择</span>
            <span :title="getText(it.checkList, it.OptionList)">{{getText(it.checkList, it.OptionList)}}</span>
            <CheckboxDialogComp :visible.sync='propVisibel' v-model="it.checkList" :list='it.OptionList' width='800px'
            title="选择选项" :defaultProps="{label: 'Second', value: 'First'}" />
          </div>
        </div>
        <!-- 物料弹窗 -->
        <div v-if="it.ResultType === 'material'" class="material">
          <span class="blue-span" @click="onSelectDialogClick('material')">设置</span>
          <div class="show-text" :title="localMaterialSelectedList(it.checkList, it.OptionList)"
          >{{localMaterialSelectedList(it.checkList, it.OptionList)}}</div>
          <MaterialSelectDialog :visible.sync='materialVisible' v-model="it.checkList" :optionList='localMaterialOptionList(it.OptionList)'  />
        </div>
        <!-- 工艺 不显示 -->
      </div>
    </li>
    <li>
      <FormulaPanelElementSelectDialog  :visible.sync='visible' :list='ComparePropertyList' @submit='onElementSelect' :selectedElementIDs='selectedElementIDs'/>
    </li>
  </ul>
</template>

<script>
// eslint-disable-next-line max-len
import PropertyClass, { AllOperatorList, getTempMaterialListObj, getTempMaterialOptionList, getTempMaterialSelectedListShowText } from '@/assets/js/TypeClass/PropertyClass';
import FormulaPanelElementSelectDialog from '@/components/common/FormulaAndConditionComps/FormulaPanelElementSelectDialog.vue';
import CheckboxDialogComp from '@/components/common/NewComps/CheckboxDialogComp.vue';
import MaterialSelectDialog from '@/components/common/FormulaAndConditionComps/MaterialSelectDialog.vue';

export default {
  props: {
    ComparePropertyList: {
      type: Array,
      default: () => [],
    },
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    initData: {
      type: Object,
      default: null,
    },
  },
  components: {
    FormulaPanelElementSelectDialog,
    CheckboxDialogComp,
    MaterialSelectDialog,
  },
  computed: {
    visible: {
      get() {
        return this.visibleDialog;
      },
      set(val) {
        this.$emit('update:visibleDialog', val);
      },
    },
    selectedElementIDs() {
      return this.localList.map(it => it.StoredContent);
    },
  },
  data() {
    return {
      localList: [],
      propVisibel: false,
      materialVisible: false,
    };
  },
  methods: {
    getOperatorOptions(OperatorList) {
      if (!Array.isArray(OperatorList) || OperatorList.length === 0) return [];
      return AllOperatorList.filter(it => OperatorList.includes(it.ID));
    },
    onElementSelect(prop) {
      const item = this.transformOnePropItem(prop);
      if (item) this.localList.push(item);
    },
    transformOnePropItem(prop) { // 把一个普通属性转换为选择条目
      if (!prop) return null;
      const OperatorOptions = this.getOperatorOptions(prop.OperatorList);
      let { DefaultValue, checkList, PanelID, ControlID, Operator } = prop;
      DefaultValue = (DefaultValue || DefaultValue === 0) ? DefaultValue : '';
      checkList = Array.isArray(checkList) ? checkList : [];
      PanelID = PanelID || [];
      ControlID = ControlID || [];
      Operator = (Operator || Operator === 0) ? Operator : OperatorOptions[0].ID;
      return {
        ...prop,
        OperatorOptions,
        ShowName: prop.DisplayContent.replace(/\[|\]/g, ''),
        Operator,
        DefaultValue, // 可为空 不为空则校验
        ResultType: this.judgeIsElementOrNot(prop),
        checkList,
        PanelID,
        ControlID,
      };
    },
    onRemoveClick(i) {
      this.localList.splice(i, 1);
    },
    judgeIsElementOrNot(prop) { // 判断类型， 是否为元素
      if (!prop) return '';
      const { ValueType, Element, Group } = prop;
      if (ValueType === 1) return 'radio'; // 单选选项 ok 同下
      if (ValueType === 2 || ValueType === 3 || ValueType === 4) return 'multi-select'; // 多选选项 ok 缺弹窗选中显示 绑定值修改 目前checklist
      if (ValueType === 5) return 'craft'; // 工艺 ok 不显示
      if (ValueType === 6) return 'material'; // 物料 no
      if (ValueType === 7) {
        if (Group && !Element) return 'group'; // 元素组 ok
        if (Element) return 'element'; // 元素 ok
      }
      if (ValueType === 0) return 'element';
      return '';
    },
    onSelectDialogClick(type) {
      if (type === 'material') this.materialVisible = true;
      else this.propVisibel = true;
    },
    localMaterialListObj(list) { // 仅为物料时且列表数量大于3时使用
      return getTempMaterialListObj(list);
    },
    localMaterialOptionList(list) { // 仅为物料时且列表数量大于3时使用
      return getTempMaterialOptionList(this.localMaterialListObj(list));
    },
    localMaterialSelectedList(checkList, options) { // 已选择物料显示文字
      return getTempMaterialSelectedListShowText(checkList, this.localMaterialOptionList(options));
    },
    getText(checkList, options) {
      if (!checkList || checkList.length === 0) return '尚未选择';
      const list = checkList.map(it => {
        const t = options.find(_it => _it.First === (it.First || it));
        return t ? t.Second : '';
      }).filter(_it => _it);
      return list.join('、');
    },
    getPropertyResultPropType(ResultType) {
      const DefaultValueTypeList = ['element', 'group'];
      const CheckListTypeList = ['radio', 'multi-select', 'material'];
      if (DefaultValueTypeList.includes(ResultType)) return 'DefaultValue';
      if (CheckListTypeList.includes(ResultType)) return 'checkList';
      return '';
    },
    getSubmitInfo() {
      const bool = this.getCheckResult();
      if (bool) {
        const List = this.localList.map(it => {
          const { Operator, PanelID, ControlID } = it;
          const temp = { ID: PanelID, ControlID, Operator, Property: it };
          const prop = this.getPropertyResultPropType(it.ResultType);
          if (prop) {
            if (prop === 'checkList') temp.OptionList = it[prop].map(_it => (_it.First ? _it.First : _it));
            else temp[prop] = it[prop];
          }
          return temp;
        });
        return { List };
      }
      return null;
    },
    getCheckResult() {
      for (let i = 0; i < this.localList.length; i += 1) {
        const it = this.localList[i];
        const prop = this.getPropertyResultPropType(it.ResultType);
        if (prop) { // 进入校验
          if (prop === 'DefaultValue' && it.DefaultValue !== '') { // 元素 或 元素组
            // 必须为数值类型
            const isInteger = !!(it.Element && it.Element.Type === 1 && !it.Element.NumbericAttribute.AllowDecimal);
            const isNum = this.$utils.getValueIsOrNotNumber(it.DefaultValue, isInteger);
            if (!isNum) {
              this.messageBox.failSingleError('保存失败', `第${i + 1}行输入值应为数字类型元素${isInteger ? '（且不允许小数）' : ''}`);
              return false;
            }
            if (it.AvailableValueList) { // 所有关系类型 进入判断
              const checkres = PropertyClass.AvailableValueListChecker(it.DefaultValue, it.AvailableValueList);
              if (!checkres) {
                this.messageBox.failSingleError('保存失败', `第${i + 1}行值不正确，请检查其可取值范围`);
                return false;
              }
            }
          }
          if (prop === 'checkList') {
            if ((!it.checkList || it.checkList.length === 0) && Array.isArray(it.OptionList) && it.OptionList.length > 0) {
              this.messageBox.failSingleError('保存失败', `第${i + 1}行元素没有勾选列表选项`);
              return false;
            }
          }
        }
      }
      return true;
    },
  },
  mounted() {
    if (this.initData && Array.isArray(this.initData.List)) { // 编辑时还原数据
      const list = this.initData.List.map(it => {
        const { Property, OptionList, Operator, ID, DefaultValue, ControlID } = it;
        if (Property) {
          const item = { ...Property, checkList: OptionList, Operator, PanelID: ID, DefaultValue, ControlID };
          return this.transformOnePropItem(item);
        }
        return null;
      }).filter(it => it);
      this.localList = list;
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-product-module-interaction-interaction-panel-container {
  color: #585858;
  > li {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    > .del {
      display: flex;
      align-items: center;
      cursor: pointer;
      width: 70px;
      flex: none;
      user-select: none;
      > span {
        color: #a2a2a2;
        font-size: 12px;
        transition: color 0.1s ease-in-out;
        margin-left: 6px;
      }
      &:hover > span {
        color: #444;
      }
    }
    > .operator {
      width: 120px;
      flex: none;
      margin-right: 10px;
      > span {
        color: #585858;
        font-size: 12px;
        margin-left: 16px;
      }
    }
    > .name {
      font-size: 12px;
      white-space: nowrap;
      width: 160px;
      flex: none;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 15px;
    }
    > .result {
      min-width: 300px;
      > div {
        width: 100%;
        &.element {
          display: flex;
          align-items: center;
          > label {
            width: 10em;
            color: #888E99;
            text-align: right;
            font-size: 13px;
            flex: none;
          }
          > .el-input {
            width: 120px;
          }
          > span {
            color: #A2A2A2;
            font-size: 13px;
            margin-left: 10px;
          }
        }
        &.select {
          .el-checkbox-group {
            display: flex;
            align-items: center;
            position: relative;
            top: 2px;
            > label {
              margin-right: 10px;
              width: 90px;
              display: flex;
              align-items: center;
              .el-checkbox__label {
                font-size: 12px;
                color: #585858;
                max-width: 65px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                height: 28px;
                line-height: 26px;
              }
            }
          }
          .multiple, .material {
            display: flex;
            align-items: center;
            .blue-span {
              font-size: 12px;
              margin-right: 10px;
              & + span {
                font-size: 12px;
                color: #989898;
                width: 260px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
        }
        &.material {
          display: flex;
          align-items: center;
          .blue-span {
            font-size: 12px;
            margin-right: 10px;
            & + div {
              font-size: 12px;
              color: #989898;
              width: 260px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}
</style>
