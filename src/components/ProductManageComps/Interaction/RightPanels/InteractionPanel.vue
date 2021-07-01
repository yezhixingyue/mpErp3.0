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
        <div v-if="it.ResultType === 'element' || it.ResultType === 'group'">
          <label v-if="it.ResultType === 'element'">以此值运算：</label> <!-- 元素 -->
          <label v-else>所有元素以此值运算：</label> <!-- 元素组 -->
          <el-input size="mini" v-model.trim="it.DefaultValue" ></el-input>
          <span v-if="it.Unit">{{it.Unit}}</span>
        </div>
        <!-- 选项  多选 | 单选 -->
        <div v-if="it.ResultType === 'radio' || it.ResultType === 'multi-select'" class="multiple-select">
          <el-checkbox-group v-model="checkList" v-if="it.OptionList.length < 4">
            <el-checkbox v-for="it in it.OptionList" :key="it.First" :label="it.First" :title="it.Second">{{it.Second}}</el-checkbox>
          </el-checkbox-group>
          <!-- <div class="multiple" v-else>
            <span class="blue-span" @click="onSelectDialogClick">选择</span>
            <div class="show-text" :title="localMaterialSelectedList">{{localMaterialSelectedList}}</div>
            <CheckboxDialogComp v-if="ValueType !== 6" :visible.sync='propVisibel' v-model="checkList" :list='localOptionList' width='800px'
            title="选择选项" :defaultProps="{label: 'Second', value: 'First'}" />
            <MaterialSelectDialog v-else :visible.sync='materialVisible' v-model="checkList" :optionList='localMaterialOptionList'  />
          </div> -->
        </div>
      </div>
    </li>
    <li>
      <FormulaPanelElementSelectDialog  :visible.sync='visible' :list='ComparePropertyList' @submit='onElementSelect' :selectedElementIDs='selectedElementIDs'/>
    </li>
  </ul>
</template>

<script>
import { AllOperatorList } from '@/assets/js/TypeClass/PropertyClass';
import FormulaPanelElementSelectDialog from '@/components/common/FormulaAndConditionComps/FormulaPanelElementSelectDialog.vue';

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
  },
  components: {
    FormulaPanelElementSelectDialog,
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
      checkList: [],
    };
  },
  methods: {
    getOperatorOptions(OperatorList) {
      if (!Array.isArray(OperatorList) || OperatorList.length === 0) return [];
      return AllOperatorList.filter(it => OperatorList.includes(it.ID));
    },
    onElementSelect(prop) {
      console.log('onElementSelect', prop);
      const OperatorOptions = this.getOperatorOptions(prop.OperatorList);
      this.localList.push({
        ...prop,
        OperatorOptions,
        ShowName: prop.DisplayContent.replace(/\[|\]/g, ''),
        Operator: OperatorOptions[0].ID,
        DefaultValue: '', // 可为空 不为空则校验
        ResultType: this.judgeIsElementOrNot(prop),
      });
    },
    onRemoveClick(i) {
      this.localList.splice(i, 1);
    },
    judgeIsElementOrNot(prop) { // 判断类型， 是否为元素
      if (!prop) return '';
      const { ValueType, Element, Group } = prop;
      if (ValueType === 1) return 'radio'; // 单选选项
      if (ValueType === 3) return 'multi-select'; // 多选选项
      if (ValueType === 5) return 'craft'; // 工艺
      if (ValueType === 6) return 'material'; // 物料
      if (ValueType === 7) {
        if (Group && !Element) return 'group'; // 元素组
        if (Element) return 'element'; // 元素
      }
      return '';
    },
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
      > div {
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
    }
  }
}
</style>
