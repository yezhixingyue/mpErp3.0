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
        <PrintSideInfoSetDialogLi v-model="SingleSideValue" :ElementList='commonLevel1Options'
         :ElementOptionList='SingleSideLevel2Options' :disabledOptions="DoubleSideValue.OptionList" />
      </li>
      <li v-show="ruleForm.SideType===PrintSideTypeEnums.propMap.ID" style="margin-bottom: -31px;">
        <label class="label">双面：</label>
        <PrintSideInfoSetDialogLi v-model="DoubleSideValue" :ElementList='commonLevel1Options'
         :ElementOptionList='DoubleSideLevel2Options' :disabledOptions="SingleSideValue.OptionList" />
      </li>
    </ul>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../../../packages/CommonDialogComp';
import { PrintSideTypeEnumList, PrintSideTypeEnums } from '../../../../../store/review/reviewEnums';
import PrintSideInfoSetDialogLi from './PrintSideInfoSetDialogLi.vue';
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
    PrintSideInfoSetDialogLi,
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
        return t.OptionAttribute.OptionList.map(it => ({ Name: it.Name, ID: it.ID }));
      }
      return [];
    },
    SingleSideValue: {
      get() {
        return {
          ElementID: this.ruleForm.SingleSide.Element.ID,
          OptionList: this.ruleForm.SingleSide.OptionList.map(it => it.ID),
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
        return t.OptionAttribute.OptionList.map(it => ({ Name: it.Name, ID: it.ID }));
      }
      return [];
    },
    DoubleSideValue: {
      get() {
        return {
          ElementID: this.ruleForm.DoubleSide.Element.ID,
          OptionList: this.ruleForm.DoubleSide.OptionList.map(it => it.ID),
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

      if (this.ruleForm.SideType === PrintSideTypeEnums.propMap.ID) {
        const lv1OpIds = this.SingleSideLevel2Options.map(it => it.ID);
        const lv2OpIds = this.DoubleSideLevel2Options.map(it => it.ID);

        this.ruleForm.SingleSide.OptionList = this.ruleForm.SingleSide.OptionList.filter(it => lv1OpIds.includes(it.ID)); // 筛选掉不在单面选项中的双面选项
        this.ruleForm.DoubleSide.OptionList = this.ruleForm.DoubleSide.OptionList.filter(it => lv2OpIds.includes(it.ID)); // 同上
      }
    },
    submit() {
      const data = this.ruleForm.getInfo(this.ruleForm.DoubleSide.Element.ID === this.ruleForm.SingleSide.Element.ID ? this.SingleSideLevel2Options : []);
      if (!data) return;
      this.$emit('submit', data);
    },
    cancel() {
      this.localVisible = false;
    },
    setValue(obj, data) {
      if (!obj || !data) return;

      const { ElementID, OptionList } = data;

      const target = this.elements.find(it => it.ID === ElementID);
      if (!target) return;

      const temp = obj;

      temp.Part.ID = target._Part?.ID || '';
      temp.Part.Name = target._Part?.Name || '';
      temp.Group.ID = target._Group?.ID || '';
      temp.Group.Name = target._Group?.Name || '';

      temp.Element.ID = ElementID;
      temp.Element.Name = target.Name.replace(`${temp.Part.Name}`, '').replace(`${temp.Group.Name}`, '').replaceAll(':', '');

      temp.OptionList = OptionList.map(ID => {
        const item = target.OptionAttribute.OptionList.find(it => it.ID === ID);
        return item ? { ID, Name: item.Name } : null;
      }).filter(it => it);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-manage-list-page-comps-other-print-side-info-set-dialog-comp-wrap {
  .el-dialog__body {
    min-height: 136px;
    .el-radio__label {
      font-size: 12px;
    }
    .label {
      color: #888E99;
      display: inline-block;
      text-align: right;
      width: 148px;
      margin-right: 10px;
      line-height: 28px;
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
        margin-bottom: 10px;
        .mp-erp-common-select-comps-two-level-select-comp-wrap {
          display: inline-block;
          vertical-align: top;
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
