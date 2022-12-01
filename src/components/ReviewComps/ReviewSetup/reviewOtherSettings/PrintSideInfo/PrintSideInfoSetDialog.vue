<template>
  <CommonDialogComp
    width="600px"
    :title="title"
    :visible.sync="localVisible"
    class="mp-erp-review-manage-list-page-comps-other-print-side-info-set-dialog-comp-wrap"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    top="16vh"
  >
    <ul v-if="ruleForm">
      <li>
        <label class="label is-bold">文件处理：</label>
        <el-radio-group v-model="ruleForm.SideType">
          <el-radio :label="it.ID" v-for="it in PrintSideTypeEnumList" :key="it.ID">{{it.Name}}</el-radio>
        </el-radio-group>
      </li>
      <li v-show="ruleForm.SideType===PrintSideTypeEnums.propMap.ID">
        <label class="label">单面：</label>
        <TwoLevelSelectComp v-model="SingleSideIDs" size="mini" :level1Options='commonLevel1Options' :level2Options='SingleSideLevel2Options' />
      </li>
      <li v-show="ruleForm.SideType===PrintSideTypeEnums.propMap.ID">
        <label class="label">双面：</label>
        <TwoLevelSelectComp v-model="DoubleSideIDs" size="mini" :level1Options='commonLevel1Options' :level2Options='DoubleSideLevel2Options' />
      </li>
    </ul>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../../../packages/CommonDialogComp';
import { PrintSideTypeEnumList, PrintSideTypeEnums } from '../../../../../store/review/reviewEnums';
import TwoLevelSelectComp from '../../../../common/SelectorComps/TwoLevelSelectComp.vue';
import PrintSideInfoClass from './PrintSideInfoClass';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    Product: {
      type: Object,
      default: null,
    },
    Part: {
      type: Object,
      default: null,
    },
    PrintSideInfo: {
      type: Object,
      default: null,
    },
    elements: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    TwoLevelSelectComp,
    CommonDialogComp,
  },
  data() {
    return {
      PrintSideTypeEnumList,
      PrintSideTypeEnums,
      ruleForm: null,
    };
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
    title() {
      return '单双面设置';
    },
    commonLevel1Options() {
      if (!this.elements || this.elements.length === 0) return [];
      return this.elements.map(it => ({ Name: it.Name, ID: it.ID, item: it }));
    },
    SingleSideLevel2Options() {
      if (!this.elements || this.elements.length === 0 || !this.ruleForm.SingleSide.Element.ID) return [];
      const t = this.elements.find(it => it.ID === this.ruleForm.SingleSide.Element.ID);
      if (t) {
        let list = t.OptionAttribute.OptionList;
        if (this.ruleForm.SingleSide.Element.ID === this.ruleForm.DoubleSide.Element.ID) {
          list = list.filter(it => it.ID !== this.ruleForm.DoubleSide.Option.ID);
        }
        return list.map(it => ({ Name: it.Name, ID: it.ID, item: it }));
      }
      return [];
    },
    SingleSideIDs: {
      get() {
        return {
          level1Val: this.ruleForm.SingleSide.Element.ID,
          level2Val: this.ruleForm.SingleSide.Option.ID,
        };
      },
      set(data) {
        this.setValue(this.ruleForm.SingleSide, data);
      },
    },
    DoubleSideLevel2Options() {
      if (!this.elements || this.elements.length === 0 || !this.ruleForm.DoubleSide.Element.ID) return [];
      const t = this.elements.find(it => it.ID === this.ruleForm.DoubleSide.Element.ID);
      if (t) {
        let list = t.OptionAttribute.OptionList;
        if (this.ruleForm.DoubleSide.Element.ID === this.ruleForm.SingleSide.Element.ID) {
          list = list.filter(it => it.ID !== this.ruleForm.SingleSide.Option.ID);
        }
        return list.map(it => ({ Name: it.Name, ID: it.ID, item: it }));
      }
      return [];
    },
    DoubleSideIDs: {
      get() {
        return {
          level1Val: this.ruleForm.DoubleSide.Element.ID,
          level2Val: this.ruleForm.DoubleSide.Option.ID,
        };
      },
      set(data) {
        this.setValue(this.ruleForm.DoubleSide, data);
      },
    },
  },
  methods: {
    onOpen() {
      this.ruleForm = new PrintSideInfoClass(this.PrintSideInfo);
    },
    submit() {
      const data = this.ruleForm.getInfo();
      if (!data) return;
      this.$emit('submit', data);
    },
    cancel() {
      this.localVisible = false;
    },
    setValue(obj, data) {
      if (!obj || !data) return;
      const { level1Val, level2Val, level1Item, level2Item } = data;
      const temp = obj;
      temp.Part.ID = level1Item?.item?._Part?.ID || '';
      temp.Part.Name = level1Item?.item?._Part?.Name || '';
      temp.Group.ID = level1Item?.item?._Group?.ID || '';
      temp.Group.Name = level1Item?.item?._Group?.Name || '';
      temp.Element.ID = level1Val;
      temp.Element.Name = level1Item ? level1Item.Name.replace(`${temp.Part.Name}`, '').replace(`${temp.Group.Name}`, '').replaceAll(':', '') : '';
      temp.Option.ID = level2Val;
      temp.Option.Name = level2Item ? level2Item.Name : '';
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-manage-list-page-comps-other-print-side-info-set-dialog-comp-wrap {
  .el-dialog__body {
    min-height: 125px;
    .el-radio__label {
      font-size: 12px;
    }
    .label {
      color: #888E99;
      display: inline-block;
      text-align: right;
      width: 148px;
      margin-right: 10px;
      &.is-bold {
        color: #585858;
      }
    }
    .el-input {
      input {
        font-size: 12px;
        width: 130px;
        color: #444;
        border-radius: 3px;
        padding-left: 10px;
      }
    }
    > ul {
      > li {
        margin-bottom: 16px;
        .mp-erp-common-select-comps-two-level-select-comp-wrap {
          display: inline-block;
          > li {
            display: inline-block;
          }
        }
      }
    }
    .first-select-box {
      .el-input {
      input {
        width: 185px;
      }
    }
    }
  }
  .el-dialog__footer {
    padding-bottom: 45px;
  }
}
</style>
